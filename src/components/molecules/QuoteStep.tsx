'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'
import { quoteFlow } from '@/lib/content'

type Props = {
  headingId: string
  stepId: string
  question: string
  helper: string
  hint: string
  optional: boolean
  nextLabel: string
  onBack: () => void
  onNext: () => void
  onSkip?: () => void
  children: ReactNode
}

/**
 * Shell for a single question screen: counter, question, helper text,
 * the field itself, and the Back / Continue pair pinned to the bottom so
 * a mobile keyboard never buries it.
 */
export function QuoteStep({
  headingId,
  stepId,
  question,
  helper,
  hint,
  optional,
  nextLabel,
  onBack,
  onNext,
  onSkip,
  children,
}: Props) {
  return (
    <div
      data-quote-screen
      className="flex min-h-0 flex-1 flex-col"
      data-testid={`quote-step-${stepId}`}
    >
      <div
        data-quote-focus
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 outline-none md:px-12 md:py-10"
      >
        {/* No counter here — the modal header owns that slot. */}
        <h2
          id={headingId}
          className="text-[var(--text-h3)] leading-[1.25] text-[var(--color-ob-green)]"
        >
          {question}
        </h2>

        <p className="mt-2.5 max-w-prose text-[0.95rem] leading-relaxed text-[var(--color-ob-ink-soft)]">
          {helper}
        </p>

        <div className="mt-7" data-quote-field>
          {children}
        </div>
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

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[0.72rem] text-[var(--color-ob-ink-soft)] sm:inline">
            {hint}
          </span>
          {optional && onSkip ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSkip}
              data-testid="quote-step-skip"
            >
              {quoteFlow.buttons.skip}
            </Button>
          ) : null}
          <Button type="button" onClick={onNext} data-testid="quote-step-next">
            {nextLabel}
            <ArrowRight aria-hidden="true" size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
