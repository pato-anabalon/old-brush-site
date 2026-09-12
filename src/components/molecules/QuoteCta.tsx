'use client'

import type { MouseEvent, ReactNode } from 'react'
import { Button, type ButtonProps } from '@/components/atoms/Button'
import { useQuoteModal } from '@/components/providers/QuoteModalProvider'
import { services, type ServiceSlug } from '@/lib/content'

type TriggerProps = {
  /** Pre-ticks this service inside the flow. */
  service?: ServiceSlug
  /** Which CTA this is — reserved for the tracking pass. */
  source: string
  children: ReactNode
  className?: string
  'data-testid'?: string
}

/**
 * Both triggers keep `href="/contact"` and intercept the click. Without
 * JavaScript — or on middle-click / "open in new tab" — the visitor still
 * lands on a real contact page, and the link stays crawlable.
 */
const HREF = '/contact'

function hrefFor(service?: ServiceSlug): string {
  return service ? `${HREF}?service=${service}` : HREF
}

/**
 * Falls back to `?service=` on the current URL when a trigger does not
 * name a service itself. Reading it at click time rather than from
 * `searchParams` keeps `/contact` statically prerendered.
 */
function resolveService(explicit?: ServiceSlug): ServiceSlug | undefined {
  if (explicit) return explicit
  if (typeof window === 'undefined') return undefined
  const raw = new URLSearchParams(window.location.search).get('service')
  return services.find((s) => s.slug === raw)?.slug
}

export type QuoteCtaProps = TriggerProps &
  Pick<ButtonProps, 'variant' | 'size' | 'surface'> & {
    onActivate?: () => void
  }

/** Button-styled "Request a quote" trigger. */
export function QuoteCta({
  service,
  source,
  children,
  className,
  variant,
  size,
  surface,
  onActivate,
  ...rest
}: QuoteCtaProps) {
  const { open } = useQuoteModal()

  return (
    <Button
      href={hrefFor(service)}
      variant={variant}
      size={size}
      surface={surface}
      className={className}
      data-quote-source={source}
      data-testid={rest['data-testid']}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        // Let modified clicks behave like a normal link.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        onActivate?.()
        open({ service: resolveService(service), source })
      }}
    >
      {children}
    </Button>
  )
}

/** Text-link-styled trigger — used by the service cards. */
export function QuoteCtaLink({
  service,
  source,
  children,
  className,
  ...rest
}: TriggerProps) {
  const { open } = useQuoteModal()

  return (
    <a
      href={hrefFor(service)}
      className={className}
      data-quote-source={source}
      data-testid={rest['data-testid']}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        open({ service: resolveService(service), source })
      }}
    >
      {children}
    </a>
  )
}
