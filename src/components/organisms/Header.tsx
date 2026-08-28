'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { Logo } from '@/components/atoms/Logo'
import { nav } from '@/lib/content'
import { cn } from '@/lib/cn'

const SCROLLED_AT = 24

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const drawerId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  const solid = scrolled || open

  return (
    <header
      data-testid="site-header"
      data-solid={solid ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-[var(--duration-base)] ease-[var(--ease-brush)]',
        solid
          ? 'bg-[var(--color-ob-paper)]/95 backdrop-blur border-b border-[var(--color-ob-line)] text-[var(--color-ob-green)]'
          : 'bg-transparent text-[var(--color-ob-paper)]',
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
            <Logo variant="wordmark" tone={solid ? 'ink' : 'paper'} />
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
                className={cn(
                  'text-[0.78rem] uppercase tracking-[0.18em] transition-colors',
                  solid ? 'hover:text-[var(--color-ob-gold)]' : 'hover:text-[var(--color-ob-gold)]',
                )}
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

      {/* Mobile drawer */}
      <div
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-testid="site-header-drawer"
        className={cn(
          'fixed inset-0 lg:hidden bg-[var(--color-ob-green)] text-[var(--color-ob-paper)] transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-brush)]',
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
        <Container width="wide">
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
        </Container>
      </div>
    </header>
  )
}
