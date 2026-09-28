'use client'

import { useId, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CommonProps = {
  label: string
  /** Rendered next to the label in lower case, e.g. "optional". */
  note?: string
  error?: string
  /** Visually hides the label but keeps it for assistive tech. */
  hideLabel?: boolean
  className?: string
  /** The error paragraph gets `${testId}-error`. */
  testId?: string
}

type InputProps = CommonProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    multiline?: false
    ref?: Ref<HTMLInputElement>
  }

type TextareaProps = CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    multiline: true
    ref?: Ref<HTMLTextAreaElement>
  }

export type TextFieldProps = InputProps | TextareaProps

/**
 * The only text input primitive in the system. Single-line by default;
 * `multiline` renders a textarea against the same `.ob-field` styling.
 *
 * Wires `aria-invalid` and `aria-describedby` so an error is announced,
 * not merely shown.
 */
export function TextField(props: TextFieldProps) {
  const reactId = useId()
  const { label, note, error, hideLabel, className, testId } = props
  const id = props.id ?? `field-${reactId}`
  const errorId = `${id}-error`

  const shared = {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: 'ob-field',
    'data-testid': testId,
  }

  let control
  if (props.multiline) {
    const { label: _l, note: _n, error: _e, hideLabel: _h, className: _c, testId: _t, multiline: _m, ref, ...rest } =
      props
    control = <textarea ref={ref} {...rest} {...shared} />
  } else {
    const { label: _l, note: _n, error: _e, hideLabel: _h, className: _c, testId: _t, multiline: _m, ref, ...rest } =
      props
    control = <input ref={ref} {...rest} {...shared} />
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('ob-eyebrow ob-eyebrow-card', hideLabel && 'sr-only')}>
        {label}
        {note ? (
          <span className="ml-2 normal-case tracking-normal text-[var(--color-ob-ink-soft)]">
            ({note})
          </span>
        ) : null}
      </label>

      {control}

      {error ? (
        <p
          id={errorId}
          className="ob-field-error"
          data-testid={testId ? `${testId}-error` : undefined}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
