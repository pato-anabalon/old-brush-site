import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { env } from '@/lib/env'
import { brand, quoteEmail, quoteFlow } from '@/lib/content'
import {
  buildQuoteSummaryRows,
  MAX_FILES,
  quoteSchema,
  type QuoteAnswers,
  type QuoteSubmitResult,
} from '@/lib/quote'

export const dynamic = 'force-dynamic'

const attachmentSchema = z.object({
  url: z.url(),
  name: z.string(),
  size: z.number(),
})

const requestSchema = z.object({
  answers: quoteSchema,
  attachments: z.array(attachmentSchema).max(MAX_FILES),
})

const labels = {
  projectType: quoteFlow.projectTypeLabels,
  timeframe: quoteFlow.timeframeLabels,
  fields: quoteFlow.fieldLabels,
  notProvided: quoteFlow.review.noneProvided,
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 5 enquiries / 10 minutes / IP. Fails open — a rate-limiter outage must
 *  never block a real enquiry from reaching Cristian. */
async function withinRateLimit(ip: string): Promise<boolean> {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return true

  try {
    const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    const key = `contact:ratelimit:${ip}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 600)
    return count <= 5
  } catch (error) {
    console.error('[contact] rate limiter unreachable, failing open', error)
    return true
  }
}

type SummaryRow = { label: string; value: string }

function buildInternalEmailHtml(
  answers: QuoteAnswers,
  rows: SummaryRow[],
  attachments: { url: string; name: string }[],
): string {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b6b63;white-space:nowrap"><strong>${escapeHtml(
          r.label,
        )}</strong></td><td style="padding:4px 0">${escapeHtml(r.value)}</td></tr>`,
    )
    .join('')

  const attachmentsHtml = attachments.length
    ? `<p><strong>${escapeHtml(labels.fields.attachments)}:</strong></p><ul>${attachments
        .map((a) => `<li><a href="${a.url}">${escapeHtml(a.name)}</a></li>`)
        .join('')}</ul>`
    : ''

  return `
    <table cellspacing="0" cellpadding="0">${rowsHtml}</table>
    <p><strong>${escapeHtml(labels.fields.message)}:</strong></p>
    <p>${escapeHtml(answers.message || labels.notProvided).replace(/\n/g, '<br/>')}</p>
    ${attachmentsHtml}
  `
}

async function notifyTrello(answers: QuoteAnswers, rows: SummaryRow[]): Promise<void> {
  const { TRELLO_KEY, TRELLO_TOKEN, TRELLO_LIST_ID } = env
  if (!TRELLO_KEY || !TRELLO_TOKEN || !TRELLO_LIST_ID) return

  try {
    const desc = [
      ...rows.map((r) => `**${r.label}:** ${r.value}`),
      '',
      `**${labels.fields.message}:**`,
      answers.message || labels.notProvided,
    ].join('\n')

    const params = new URLSearchParams({
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
      idList: TRELLO_LIST_ID,
      name: `Quote enquiry — ${answers.fullName}`,
      desc,
    })
    const res = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, { method: 'POST' })
    if (!res.ok) console.error('[contact] Trello card creation failed', res.status)
  } catch (error) {
    console.error('[contact] Trello card creation failed', error)
  }
}

async function notifyTelegram(answers: QuoteAnswers): Promise<void> {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

  try {
    const text = `New quote enquiry — ${answers.fullName}\n${answers.email}\n${brand.url}`
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    })
    if (!res.ok) console.error('[contact] Telegram notification failed', res.status)
  } catch (error) {
    console.error('[contact] Telegram notification failed', error)
  }
}

/**
 * Validates, rate-limits, then fans the enquiry out to Resend (required)
 * plus Trello / Telegram (best-effort). Per AGENTS.md, a missing
 * integration degrades *visibly* — see `not-configured` below — we never
 * pretend an enquiry was delivered when nothing was sent.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { RESEND_API_KEY, RESEND_FROM, RESEND_TO_INTERNAL } = env
  if (!RESEND_API_KEY || !RESEND_FROM || !RESEND_TO_INTERNAL) {
    return NextResponse.json({ status: 'not-configured' } satisfies QuoteSubmitResult)
  }

  let payload: z.infer<typeof requestSchema>
  try {
    const json: unknown = await request.json()
    const parsed = requestSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ status: 'error' } satisfies QuoteSubmitResult, { status: 400 })
    }
    payload = parsed.data
  } catch {
    return NextResponse.json({ status: 'error' } satisfies QuoteSubmitResult, { status: 400 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!(await withinRateLimit(ip))) {
    return NextResponse.json(
      {
        status: 'error',
        detail:
          'Too many enquiries from this connection — please try again in a few minutes, or call us directly.',
      } satisfies QuoteSubmitResult,
      { status: 429 },
    )
  }

  const { answers, attachments } = payload
  const rows = buildQuoteSummaryRows(answers, labels)
  const resend = new Resend(RESEND_API_KEY)

  try {
    const sendResult = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO_INTERNAL,
      replyTo: answers.email,
      subject: quoteEmail.internal.subject(answers.fullName),
      html: buildInternalEmailHtml(answers, rows, attachments),
    })
    if (sendResult.error) throw new Error(sendResult.error.message)
  } catch (error) {
    console.error('[contact] Resend internal notification failed', error)
    return NextResponse.json({ status: 'error' } satisfies QuoteSubmitResult, { status: 502 })
  }

  // Best-effort from here — the enquiry already reached Cristian, so none
  // of these failing should tell the visitor their enquiry did not go through.
  await Promise.allSettled([
    resend.emails.send({
      from: RESEND_FROM,
      to: answers.email,
      subject: quoteEmail.autoReply.subject,
      html: `<p>${escapeHtml(quoteEmail.autoReply.greeting(answers.fullName))}</p><p>${escapeHtml(
        quoteEmail.autoReply.body,
      )}</p><p>${escapeHtml(quoteEmail.autoReply.signature)}</p>`,
    }),
    notifyTrello(answers, rows),
    notifyTelegram(answers),
  ])

  return NextResponse.json({ status: 'sent' } satisfies QuoteSubmitResult)
}
