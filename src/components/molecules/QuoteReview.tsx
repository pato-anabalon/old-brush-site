'use client'

import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { quoteFlow } from '@/lib/content'
import type { QuoteAnswers } from '@/lib/quote'
import { stepsForProjectType, type StepId } from '@/components/organisms/QuoteFlow'

type Props = {
  headingId: string
  answers: QuoteAnswers
  fileCount: number
  submitting: boolean
  onEdit: (id: StepId) => void
  onBack: () => void
  onSubmit: () => void
}

type Row = { id: StepId; key: string; label: string; value: string }

/**
 * Final screen before sending: every answer in one list, each row with an
 * Edit link that jumps back to its own step and returns here afterwards.
 */
export function QuoteReview({
  headingId,
  answers,
  fileCount,
  submitting,
  onEdit,
  onBack,
  onSubmit,
}: Props) {
  const none = quoteFlow.review.noneProvided
  const visibleSteps = stepsForProjectType(answers.projectType)

  const rows: Row[] = [
    {
      id: 'projectType',
      key: 'projectType',
      label: quoteFlow.fieldLabels.projectType,
      value: answers.projectType ? quoteFlow.projectTypeLabels[answers.projectType] : none,
    },
    {
      id: 'services',
      key: 'services',
      label: quoteFlow.fieldLabels.services,
      value:
        answers.services.map((slug) => quoteFlow.serviceOptionLabels[slug]).join(', ') || none,
    },
    { id: 'suburb', key: 'suburb', label: quoteFlow.fieldLabels.suburb, value: answers.suburb || none },
    {
      id: 'timeframe',
      key: 'timeframe',
      label: quoteFlow.fieldLabels.timeframe,
      value: answers.timeframe ? quoteFlow.timeframeLabels[answers.timeframe] : none,
    },
    { id: 'message', key: 'message', label: quoteFlow.fieldLabels.message, value: answers.message || none },
    {
      id: 'attachments',
      key: 'attachments',
      label: quoteFlow.fieldLabels.attachments,
      value:
        fileCount > 0
          ? quoteFlow.review.fileCount.replace('{count}', String(fileCount))
          : quoteFlow.review.noFiles,
    },
    { id: 'contactDetails', key: 'fullName', label: quoteFlow.fieldLabels.fullName, value: answers.fullName || none },
    { id: 'contactDetails', key: 'email', label: quoteFlow.fieldLabels.email, value: answers.email || none },
    { id: 'contactDetails', key: 'phone', label: quoteFlow.fieldLabels.phone, value: answers.phone || none },
  ]

  return (
    <div data-quote-screen className="flex min-h-0 flex-1 flex-col" data-testid="quote-review">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-12 md:py-10">
        <p className="ob-eyebrow ob-eyebrow-card">{quoteFlow.review.eyebrow}</p>
        <h2
          id={headingId}
          className="mt-3 text-[var(--text-h3)] leading-[1.25] text-[var(--color-ob-green)]"
        >
          {quoteFlow.review.headline}
        </h2>
        <p className="mt-2.5 max-w-prose text-[0.95rem] text-[var(--color-ob-ink-soft)]">
          {quoteFlow.review.lead}
        </p>

        <dl className="mt-7 flex flex-col">
          {rows.filter((row) => visibleSteps.includes(row.id)).map((row) => (
            <div
              key={row.key}
              className="flex items-start gap-4 border-t py-3.5 first:border-t-0 first:pt-0"
              style={{ borderColor: 'var(--color-ob-line)' }}
            >
              <dt className="ob-eyebrow ob-eyebrow-card w-32 flex-none pt-1">{row.label}</dt>
              <dd className="flex-1 whitespace-pre-line text-[0.95rem]">{row.value}</dd>
              <button
                type="button"
                onClick={() => onEdit(row.id)}
                className="flex-none text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ob-gold)] underline underline-offset-4"
                data-testid={`quote-review-edit-${row.key}`}
              >
                {quoteFlow.buttons.edit}
              </button>
            </div>
          ))}
        </dl>
      </div>

      <div
        className="flex flex-none items-center gap-3 border-t px-6 py-4 md:px-12"
        style={{ borderColor: 'var(--color-ob-line)' }}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-testid="quote-step-back"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          {quoteFlow.buttons.back}
        </Button>

        <Button
          type="button"
          className="ml-auto"
          onClick={onSubmit}
          disabled={submitting}
          data-autofocus
          data-testid="quote-submit"
        >
          {submitting ? quoteFlow.buttons.submitting : quoteFlow.buttons.submit}
          <Send aria-hidden="true" size={14} />
        </Button>
      </div>
    </div>
  )
}
