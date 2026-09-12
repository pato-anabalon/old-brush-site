'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { QuoteModal } from '@/components/organisms/QuoteModal'
import type { ServiceSlug } from '@/lib/content'

export type QuoteSeed = {
  /** Pre-ticks a service on the "which parts" step. */
  service?: ServiceSlug
  /** Which CTA opened the flow — reserved for the tracking pass. */
  source?: string
}

type QuoteModalContextValue = {
  isOpen: boolean
  open: (seed?: QuoteSeed) => void
  close: () => void
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null)

export function useQuoteModal(): QuoteModalContextValue {
  const value = useContext(QuoteModalContext)
  if (!value) throw new Error('useQuoteModal must be used inside <QuoteModalProvider>')
  return value
}

/**
 * Owns the single quote modal instance so any CTA anywhere on the site
 * can raise it. Mounted once in the root layout, around `#ob-app`.
 */
export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [seed, setSeed] = useState<QuoteSeed>({})
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = useCallback((next: QuoteSeed = {}) => {
    triggerRef.current = document.activeElement as HTMLElement | null
    setSeed(next)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Restore focus to whatever opened the flow, once the modal and the
    // `inert` attribute on #ob-app have been torn down.
    requestAnimationFrame(() => triggerRef.current?.focus?.())
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <QuoteModalContext.Provider value={value}>
      {children}
      <QuoteModal open={isOpen} seedService={seed.service} onClose={close} />
    </QuoteModalContext.Provider>
  )
}
