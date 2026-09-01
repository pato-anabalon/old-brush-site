import type { ReactNode } from 'react'
import { Divider } from '@/components/atoms/Divider'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: string
  headline: string
  lead?: string
  align?: 'left' | 'center'
  tone?: 'ink' | 'paper'
  as?: 'h1' | 'h2' | 'h3'
  /**
   * DOM id applied to the rendered heading — used by parents that need
   * a stable target for `aria-labelledby`.
   */
  headingId?: string
  className?: string
  children?: ReactNode
}

const toneMap = {
  ink: { headline: 'text-[var(--color-ob-green)]', lead: 'text-[var(--color-ob-ink-soft)]' },
  paper: { headline: 'text-[var(--color-ob-paper)]', lead: 'text-[color:color-mix(in_oklab,var(--color-ob-paper)_85%,transparent)]' },
} as const

export function SectionHeading({
  eyebrow,
  headline,
  lead,
  align = 'left',
  tone = 'ink',
  as: Heading = 'h2',
  headingId,
  className,
  children,
}: Props) {
  const t = toneMap[tone]
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? <span className="ob-eyebrow">{eyebrow}</span> : null}
      <Divider tone={tone === 'paper' ? 'sand' : 'gold'} className={align === 'center' ? 'mx-auto' : ''} />
      <Heading id={headingId} className={cn('max-w-[42rem]', t.headline)}>
        {headline}
      </Heading>
      {lead ? <p className={cn('max-w-[38rem] text-[var(--text-lead)]', t.lead)}>{lead}</p> : null}
      {children}
    </div>
  )
}
