'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { Logo } from '@/components/atoms/Logo'
import { credit, nav } from '@/lib/content'
import { cn } from '@/lib/cn'

// Header stays hidden while the hero is on screen and reveals once the
// hero has scrolled past. The 0.9 factor gives a small buffer so the
// header doesn't pop in the moment the wave curve leaves the viewport.
const HERO_PASS_FACTOR = 0.9

export function Header() {
  const [pastHero, setPastHero] = useState(false)
  const [open, setOpen] = useState(false)
  const drawerId = useId()

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * HERO_PASS_FACTOR
      setPastHero(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const visible = pastHero || open

  return (
    <>
      {/* Floating menu button — mobile only, appears when the full
          header is hidden (i.e. while the hero is on screen). Without
          it, the in-header hamburger would sit inside a
          pointer-events-none container and be untappable. Tapping opens
          the shared drawer via `setOpen`, which in turn flips `visible`
          → the floating button fades out and the full header slides
          down behind the drawer. */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={drawerId}
        onClick={() => setOpen(true)}
        data-testid="site-floating-menu-toggle"
        className={cn(
          'fixed right-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition-opacity duration-[420ms] ease-[var(--ease-brush)] lg:hidden',
          'border-[var(--color-ob-green)]/30 bg-[var(--color-ob-paper)]/75 text-[var(--color-ob-green)]',
          visible
            ? 'pointer-events-none opacity-0'
            : 'pointer-events-auto opacity-100',
        )}
      >
        <Menu aria-hidden="true" size={20} />
      </button>

    <header
      data-testid="site-header"
      data-visible={visible ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-[420ms] ease-[var(--ease-brush)]',
        'bg-[var(--color-ob-paper)]/95 backdrop-blur border-b border-[var(--color-ob-line)] text-[var(--color-ob-green)]',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none',
      )}
    >
      <Container width="wide">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            aria-label={`Home · ${nav.primary[0]?.label ?? 'Old Brush'}`}
            className="focus-visible:outline-none"
            data-testid="site-header-logo"
          >
            <Logo variant="wordmark" tone="ink" />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-8"
            data-testid="site-header-nav"
          >
            {nav.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.78rem] uppercase tracking-[0.18em] transition-colors hover:text-[var(--color-ob-gold)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button
              href="/contact"
              size="sm"
              variant="primary"
              data-testid="site-header-cta"
            >
              Request a quote
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-current/30"
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((s) => !s)}
            data-testid="site-header-menu-toggle"
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </Container>

    </header>

    {/* Mobile drawer — sibling of <header>, NOT a descendant. The
        header applies `backdrop-blur`, which creates a containing
        block for its fixed descendants; a drawer nested inside would
        have its `fixed inset-0` collapse to the header's ~64 px box
        instead of the viewport. As a sibling with no such ancestor,
        `fixed inset-0` correctly fills the viewport. z-[60] keeps it
        above the header (z-50) and the floating toggle (z-40). */}
    <div
      id={drawerId}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-testid="site-header-drawer"
      className={cn(
        'fixed inset-0 z-[60] lg:hidden bg-[var(--color-ob-green)] text-[var(--color-ob-paper)] transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-brush)]',
        'flex flex-col',
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Container width="wide">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" onClick={() => setOpen(false)} aria-label="Home">
            <Logo variant="wordmark" tone="paper" />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-ob-paper)]/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
      </Container>
      <Container
        width="wide"
        className="flex flex-1 flex-col overflow-y-auto"
      >
        <nav aria-label="Primary mobile" className="flex flex-col gap-6 pt-10">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-serif)] text-3xl tracking-tight hover:text-[var(--color-ob-gold)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6">
            <Button
              href="/contact"
              onClick={() => setOpen(false)}
              size="lg"
              variant="primary"
              className="w-full"
            >
              Request a quote
            </Button>
          </div>
        </nav>

        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={credit.ariaLabel}
          onClick={() => setOpen(false)}
          className="mt-auto py-8 text-center text-[0.8rem] text-[var(--color-ob-paper)]/70 transition-colors hover:text-[var(--color-ob-gold)]"
          data-testid="site-header-drawer-credit"
        >
          {credit.prefix}{' '}
          <span aria-hidden="true">{credit.heart}</span>{' '}
          {credit.by}{' '}
          <span className="font-medium">{credit.label}</span>
        </a>
      </Container>
    </div>
    </>
  )
}
