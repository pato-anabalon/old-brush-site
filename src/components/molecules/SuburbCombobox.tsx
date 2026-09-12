'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { matchSuburbs, type Suburb } from '@/lib/suburbs'

type Props = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  error?: string
}

/**
 * Suburb field with Auckland suggestions.
 *
 * Deliberately a free-text combobox, never a select: the list in
 * `@/lib/suburbs` is a convenience, not a gazetteer, so a locality that
 * is missing from it must never stop someone sending an enquiry.
 *
 * Follows the ARIA combobox pattern (`aria-expanded`, `aria-controls`,
 * `aria-activedescendant`) and swallows Enter/Escape only when it is
 * actually using them, so the quote flow keeps its own keyboard model.
 */
export function SuburbCombobox({
  value,
  onChange,
  label,
  placeholder,
  error,
}: Props) {
  const reactId = useId()
  const inputId = `suburb-${reactId}`
  const listId = `suburb-list-${reactId}`
  const errorId = `${inputId}-error`

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches: readonly Suburb[] = open ? matchSuburbs(value) : []
  const expanded = open && matches.length > 0

  useEffect(() => {
    if (active < 0) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function select(suburb: Suburb) {
    onChange(suburb.name)
    setOpen(false)
    setActive(-1)
    inputRef.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (matches.length === 0) return
      event.preventDefault()
      setOpen(true)
      setActive((current) => {
        const step = event.key === 'ArrowDown' ? 1 : -1
        const next = current + step
        if (next < 0) return matches.length - 1
        if (next >= matches.length) return 0
        return next
      })
      return
    }

    if (event.key === 'Enter') {
      const suburb = expanded && active >= 0 ? matches[active] : undefined
      if (!suburb) return // let the flow handle Enter and continue
      // We are consuming this Enter to pick a suggestion, so the flow
      // must not also advance a step on the same keystroke.
      event.preventDefault()
      event.stopPropagation()
      select(suburb)
      return
    }

    if (event.key === 'Escape') {
      if (!expanded) return // let it bubble and close the modal
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        className="ob-field"
        placeholder={placeholder}
        value={value}
        data-field="suburb"
        data-autofocus
        data-testid="quote-field-suburb"
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false)
          setActive(-1)
        }}
        onKeyDown={onKeyDown}
      />

      {expanded ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          data-testid="quote-field-suburb-options"
          // Keep the input focused so the click lands before the blur.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full left-0 z-10 mt-1 max-h-[13.5rem] w-full overflow-y-auto overscroll-contain rounded-[var(--radius-sm)] border bg-[var(--color-ob-paper)] shadow-[var(--shadow-float)]"
          style={{ borderColor: 'var(--color-ob-line)' }}
        >
          {matches.map((suburb, index) => (
            <li
              key={suburb.name}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              data-active={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(suburb)}
              className="ob-suggestion"
            >
              <span>{suburb.name}</span>
              {suburb.area ? (
                <span className="text-[0.78rem] text-[var(--color-ob-ink-soft)]">
                  {suburb.area}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p id={errorId} className="ob-field-error" data-testid="quote-field-suburb-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
