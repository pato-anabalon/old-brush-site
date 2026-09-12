'use client'

import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import { brand, quoteFlow } from '@/lib/content'
import { buildQuoteMailto, type QuoteAnswers, type QuoteSubmitResult } from '@/lib/quote'

type Props = {
  headingId: string
  result: QuoteSubmitResult
  answers: QuoteAnswers
  hasFiles: boolean
  onRetry: () => void
  onClose: () => void
}

const mailtoLabels = {
  projectType: quoteFlow.projectTypeLabels,
  timeframe: quoteFlow.timeframeLabels,
  fields: quoteFlow.fieldLabels,
  notProvided: quoteFlow.review.noneProvided,
}

/**
 * Final screen. Automatic delivery is not wired up yet, so the default
 * state says so plainly and hands the visitor a prefilled email rather
 * than claiming an enquiry was sent (AGENTS.md — visible degradation).
 */
export function QuoteResult({
  headingId,
  result,
  answers,
  hasFiles,
  onRetry,
  onClose,
}: Props) {
  const copy =
    result.status === 'sent'
      ? quoteFlow.result.sent
      : result.status === 'error'
        ? quoteFlow.result.error
        : quoteFlow.result.notConfigured

  return (
    <div
      data-quote-screen
      className="flex min-h-0 flex-1 flex-col"
      data-testid="quote-result"
      data-status={result.status}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-12 md:py-10">
        <p className="ob-eyebrow">{copy.eyebrow}</p>
        <h2
          id={headingId}
          className="mt-3 text-[var(--text-h2)] leading-[1.15] text-[var(--color-ob-green)]"
        >
          {copy.headline}
        </h2>
        <p className="mt-4 max-w-prose text-[var(--text-lead)] leading-relaxed text-[var(--color-ob-ink-soft)]">
          {result.detail ?? copy.body}
        </p>

        {result.status === 'not-configured' ? (
          <>
            <div className="mt-7">
              <Button
                href={buildQuoteMailto(answers, mailtoLabels)}
                size="lg"
                data-autofocus
                data-testid="quote-result-mailto"
              >
                <Mail aria-hidden="true" size={16} />
                {quoteFlow.result.notConfigured.mailtoLabel}
              </Button>
            </div>

            {hasFiles ? (
              <p className="mt-4 max-w-prose text-[0.85rem] text-[var(--color-ob-ink-soft)]">
                {quoteFlow.result.notConfigured.attachmentsNote}
              </p>
            ) : null}

            <p className="mt-8 ob-eyebrow">{quoteFlow.result.notConfigured.orCall}</p>
            <ul className="mt-3 flex flex-col gap-2 text-[var(--color-ob-green)]">
              <li className="flex items-center gap-3">
                <Phone aria-hidden="true" size={16} />
                <Link
                  href={brand.contact.phoneHref}
                  className="hover:text-[var(--color-ob-gold)]"
                >
                  {brand.contact.phone}
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden="true" size={16} />
                <Link
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-[var(--color-ob-gold)]"
                >
                  {brand.contact.email}
                </Link>
              </li>
            </ul>
          </>
        ) : null}

        {result.status === 'error' ? (
          <div className="mt-7">
            <Button type="button" size="lg" onClick={onRetry} data-autofocus>
              {quoteFlow.result.error.retry}
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="flex flex-none items-center justify-end border-t px-6 py-4 md:px-12"
        style={{ borderColor: 'var(--color-ob-line)' }}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          {...(result.status === 'sent' ? { 'data-autofocus': '' } : {})}
        >
          {quoteFlow.buttons.close}
        </Button>
      </div>
    </div>
  )
}
