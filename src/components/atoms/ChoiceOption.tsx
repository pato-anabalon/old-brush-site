'use client'

import type { Ref } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const LETTERS = 'ABCDEFGHIJ'

/** Keyboard letter for a given option index — A, B, C ... */
export function optionKey(index: number): string {
  return LETTERS[index] ?? ''
}

export type ChoiceOptionProps = {
  /** `radio` auto-advances the flow; `checkbox` toggles and waits. */
  role: 'radio' | 'checkbox'
  index: number
  label: string
  selected: boolean
  onSelect: () => void
  className?: string
  'data-testid'?: string
  ref?: Ref<HTMLButtonElement>
}

/**
 * One selectable answer in the quote flow, carrying the letter badge the
 * keyboard shortcut refers to. Rendered as a button with an explicit ARIA
 * role so a radiogroup/group parent can own the arrow-key semantics.
 */
export function ChoiceOption({
  role,
  index,
  label,
  selected,
  onSelect,
  className,
  ref,
  ...rest
}: ChoiceOptionProps) {
  return (
    <button
      ref={ref}
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      className={cn('ob-choice', className)}
      data-testid={rest['data-testid']}
    >
      <span className="ob-choice-key" aria-hidden="true">
        {optionKey(index)}
      </span>
      <span className="flex-1">{label}</span>
      {selected ? (
        <Check aria-hidden="true" size={16} className="flex-none text-[var(--color-ob-gold)]" />
      ) : null}
    </button>
  )
}
