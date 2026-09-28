'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { nav } from '@/lib/content'

// The footer is the trigger: the control only appears once the footer
// has entered the viewport, so it never competes with the content while
// the visitor is still reading down the page.
const FOOTER_SELECTOR = '[data-testid="site-footer"]'

// Second condition — the page must actually be scrolled away from the
// top. On short routes (e.g. /thank-you) the footer can be on screen
// from the first paint, where a "back to top" would be a no-op.
const MIN_SCROLL_FACTOR = 0.5

/**
 * BackToTop · floating return-to-hero control.
 *
 * Visible only while the footer is in view and the page is scrolled
 * past half a viewport. Mirrors the Header's floating menu button
 * (44 px circle, paper on green) so the two fixed affordances read as
 * one family; sits at z-40, below the mobile drawer (z-60) and the
 * quote modal (z-120), and inherits `inert` from #ob-app while the
 * modal is open.
 *
 * Honours prefers-reduced-motion: the jump is instant instead of
 * smooth. Keyboard focus is moved to <main> after the jump so the next
 * Tab continues from the top of the page, not from inside the footer.
 */
export function BackToTop() {
  const [footerInView, setFooterInView] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const footer = document.querySelector(FOOTER_SELECTOR)
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(Boolean(entry?.isIntersecting)),
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  // Only measured while the footer is on screen — no scroll work is
  // done during the rest of the page.
  useEffect(() => {
    if (!footerInView) return
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * MIN_SCROLL_FACTOR)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [footerInView])

  const visible = footerInView && scrolled

  const onClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    const main = document.getElementById('main')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={nav.backToTop.label}
      data-testid="site-back-to-top"
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      className={cn(
        'fixed right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border transition-[opacity,transform,background-color,color] duration-[420ms] ease-[var(--ease-brush)]',
        'border-[var(--color-ob-green)]/30 bg-[var(--color-ob-paper)]/92 text-[var(--color-ob-green)]',
        'hover:bg-[var(--color-ob-paper)] hover:text-[var(--color-ob-gold)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ob-gold)] focus-visible:ring-offset-2',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ArrowUp aria-hidden="true" size={20} />
    </button>
  )
}
