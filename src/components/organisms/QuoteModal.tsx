'use client'

import { X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { QuoteFlow } from '@/components/organisms/QuoteFlow'
import { quoteFlow, type ServiceSlug } from '@/lib/content'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** The layout wraps the site in this id so it can be made inert. */
const APP_ROOT_ID = 'ob-app'

type Props = {
  open: boolean
  seedService?: ServiceSlug
  onClose: () => void
}

type Progress = { current: number; total: number } | null

/**
 * Dialog shell for the quote flow.
 *
 * Unlike the Header's navigation drawer this mounts only while open, so
 * its controls never linger in the tab order, and it makes the rest of
 * the page `inert` instead of asserting `aria-modal` over a live page.
 */
export function QuoteModal({ open, seedService, onClose }: Props) {
  const [progress, setProgress] = useState<Progress>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  /* -- scroll lock + inert background + ESC -------------------------------- */

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const appRoot = document.getElementById(APP_ROOT_ID)
    appRoot?.setAttribute('inert', '')

    const onKey = (event: KeyboardEvent) => {
      // A nested control (the suburb suggestions) may have already used
      // this Escape to close itself.
      if (event.defaultPrevented) return
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      appRoot?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (panel && !panel.contains(document.activeElement)) {
      panel.focus({ preventScroll: true })
    }
  }, [open])

  /* -- focus trap ---------------------------------------------------------- */

  const onKeyDownCapture = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return

    const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
    if (nodes.length === 0) {
      event.preventDefault()
      return
    }

    const first = nodes[0]!
    const last = nodes[nodes.length - 1]!
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey && (active === first || !panel.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  // `open` only ever flips to true from a client-side click, so there is
  // no server render to guard against here.
  if (!open) return null

  const percent = progress ? (progress.current / progress.total) * 100 : 0
  const counter = progress
    ? quoteFlow.shell.progress
        .replace('{current}', String(progress.current))
        .replace('{total}', String(progress.total))
    : ''

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-stretch justify-center md:items-center md:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ob-green)_72%,transparent)] backdrop-blur-[2px]"
      />

      {/* Desktop keeps a stable frame (min-h) rather than resizing per
          step: the modal no longer jumps between questions, and short
          steps like the suburb one leave room for their own dropdown. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={headingId}
        onKeyDownCapture={onKeyDownCapture}
        data-testid="quote-modal"
        className="surface-paper relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden shadow-[var(--shadow-float)] md:h-auto md:min-h-[min(40rem,calc(100dvh-3rem))] md:max-h-[min(44rem,calc(100dvh-3rem))] md:max-w-[44rem] md:rounded-[var(--radius-lg)]"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex flex-none items-center gap-4 px-6 pt-5 pb-3 md:px-12">
          <p className="ob-eyebrow ob-eyebrow-card flex-1">{counter || quoteFlow.shell.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={quoteFlow.shell.close}
            data-testid="quote-modal-close"
            className="-mr-2 flex h-11 w-11 flex-none items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ob-ink-soft)] transition-colors hover:text-[var(--color-ob-gold)]"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="ob-progress mx-6 md:mx-12" data-testid="quote-progress">
          <span style={{ width: `${percent}%` }} />
        </div>

        <p aria-live="polite" className="sr-only">
          {counter}
        </p>

        <QuoteFlow
          seedService={seedService}
          onClose={onClose}
          onProgress={setProgress}
          headingId={headingId}
        />
      </div>
    </div>,
    document.body,
  )
}
