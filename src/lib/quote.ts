import { z } from 'zod'
import { brand, services, type ServiceSlug } from '@/lib/content'

/**
 * Old Brush · Quote request model
 *
 * Shared by the conversational quote flow (client) and — once the
 * backend lands — by `POST /api/contact` (server). Keep this file free
 * of React and of anything browser-only so both sides can import it.
 *
 * Fields are the nine approved in Fase 0:
 *   full name · email · phone (optional) · suburb · project type ·
 *   services of interest (multi) · timeframe · message · attachments
 */

export const PROJECT_TYPES = [
  'renovation',
  'new-build',
  'repaint',
  'other',
] as const
export type ProjectType = (typeof PROJECT_TYPES)[number]

export const TIMEFRAMES = ['asap', '1-3-months', '3-plus-months', 'flexible'] as const
export type Timeframe = (typeof TIMEFRAMES)[number]

/** Attachment limits — approved in Fase 0. */
export const MAX_FILES = 5
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024
export const ACCEPTED_MIME = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
  'application/pdf',
] as const
/** `accept` attribute for the file input — MIME list plus the extensions
 *  Safari/iOS needs spelled out for HEIC to be selectable. */
export const ACCEPT_ATTRIBUTE = [...ACCEPTED_MIME, '.heic', '.heif'].join(',')

const serviceSlugs = services.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]]

export type QuoteAnswers = {
  projectType: ProjectType | null
  services: ServiceSlug[]
  suburb: string
  timeframe: Timeframe | null
  message: string
  fullName: string
  email: string
  phone: string
}

export const emptyAnswers: QuoteAnswers = {
  projectType: null,
  services: [],
  suburb: '',
  timeframe: null,
  message: '',
  fullName: '',
  email: '',
  phone: '',
}

/**
 * One schema per step so a step can be validated in isolation as the
 * visitor moves through the flow. `quoteSchema` is the merged shape the
 * API route will validate against.
 */
export const stepSchemas = {
  projectType: z.object({
    projectType: z.enum(PROJECT_TYPES, {
      error: 'Pick the option that fits best.',
    }),
  }),
  services: z.object({
    services: z
      .array(z.enum(serviceSlugs))
      .min(1, 'Choose at least one — you can pick more than one.'),
  }),
  suburb: z.object({
    suburb: z
      .string()
      .trim()
      .min(2, 'Please tell us the suburb.')
      .max(80, 'That is longer than we need — just the suburb is fine.'),
  }),
  timeframe: z.object({
    timeframe: z.enum(TIMEFRAMES, { error: 'Pick the option that fits best.' }),
  }),
  message: z.object({
    message: z.string().trim().max(2000, 'Please keep this under 2000 characters.'),
  }),
  contactDetails: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Please tell us your name.')
      .max(80, 'That name looks a little long.'),
    email: z.email('That email address does not look right.'),
    phone: z
      .string()
      .trim()
      .max(30, 'That phone number looks a little long.')
      .refine((v) => v === '' || /^[0-9+()\-.\s]{6,}$/.test(v), {
        error: 'That phone number does not look right.',
      }),
  }),
} as const

export type StepSchemaKey = keyof typeof stepSchemas

export const quoteSchema = stepSchemas.projectType
  .extend(stepSchemas.services.shape)
  .extend(stepSchemas.suburb.shape)
  .extend(stepSchemas.timeframe.shape)
  .extend(stepSchemas.message.shape)
  .extend(stepSchemas.contactDetails.shape)

export type QuotePayload = z.infer<typeof quoteSchema>

/** Client-side attachment validation. Returns an error key or `null`. */
export type AttachmentError = 'too-many' | 'too-large' | 'wrong-type'

export function validateAttachments(files: readonly File[]): AttachmentError | null {
  if (files.length > MAX_FILES) return 'too-many'
  const total = files.reduce((sum, f) => sum + f.size, 0)
  if (total > MAX_TOTAL_BYTES) return 'too-large'
  const accepted = new Set<string>(ACCEPTED_MIME)
  const ok = files.every(
    (f) => accepted.has(f.type) || /\.(heic|heif)$/i.test(f.name),
  )
  return ok ? null : 'wrong-type'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* -------------------------------------------------------------------------- */
/* Submission                                                                  */
/* -------------------------------------------------------------------------- */

export type QuoteResultStatus = 'sent' | 'not-configured' | 'error'

export type QuoteSubmitResult = {
  status: QuoteResultStatus
  /** Present when `status === 'error'` — already visitor-safe copy. */
  detail?: string
}

/**
 * TODO(fase-3-backend): replace the body with `fetch('/api/contact', …)`.
 * The route handler validates the same `quoteSchema` exported above, then
 * fans out to Resend (+ optional Trello / Telegram) and uploads the
 * attachments to Vercel Blob.
 *
 * Until that endpoint exists this returns `not-configured` on purpose.
 * Per AGENTS.md a missing integration degrades *visibly* — we never
 * pretend an enquiry was delivered when nothing was sent.
 */
export async function submitQuote(
  _answers: QuoteAnswers,
  _files: readonly File[],
): Promise<QuoteSubmitResult> {
  return { status: 'not-configured' }
}

/* -------------------------------------------------------------------------- */
/* mailto fallback                                                             */
/* -------------------------------------------------------------------------- */

function labelForService(slug: ServiceSlug): string {
  return services.find((s) => s.slug === slug)?.name ?? slug
}

/**
 * Builds a `mailto:` link with every answer in the body, so the enquiry
 * still reaches Cristian while the send endpoint is unbuilt. Attachments
 * cannot ride along on a `mailto:` — the result screen says so plainly.
 */
export function buildQuoteMailto(
  answers: QuoteAnswers,
  labels: {
    projectType: Record<ProjectType, string>
    timeframe: Record<Timeframe, string>
    fields: Record<
      'projectType' | 'services' | 'suburb' | 'timeframe' | 'message' | 'fullName' | 'email' | 'phone',
      string
    >
    notProvided: string
  },
): string {
  const rows: string[] = [
    `${labels.fields.fullName}: ${answers.fullName}`,
    `${labels.fields.email}: ${answers.email}`,
    `${labels.fields.phone}: ${answers.phone || labels.notProvided}`,
    `${labels.fields.suburb}: ${answers.suburb}`,
    `${labels.fields.projectType}: ${
      answers.projectType ? labels.projectType[answers.projectType] : labels.notProvided
    }`,
    `${labels.fields.services}: ${
      answers.services.length ? answers.services.map(labelForService).join(', ') : labels.notProvided
    }`,
    `${labels.fields.timeframe}: ${
      answers.timeframe ? labels.timeframe[answers.timeframe] : labels.notProvided
    }`,
    '',
    `${labels.fields.message}:`,
    answers.message || labels.notProvided,
  ]

  const subject = `Quote enquiry — ${answers.fullName || 'Website'}`
  return `mailto:${brand.contact.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(rows.join('\n'))}`
}
