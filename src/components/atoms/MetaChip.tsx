import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipTone = 'lightgreen' | 'sand' | 'gold' | 'green'

const toneMap: Record<ChipTone, string> = {
  lightgreen: 'bg-[color:color-mix(in_oklab,var(--color-ob-lightgreen)_22%,transparent)] text-[var(--color-ob-green)]',
  sand: 'bg-[color:color-mix(in_oklab,var(--color-ob-sand)_22%,transparent)] text-[var(--color-ob-green)]',
  gold: 'bg-[color:color-mix(in_oklab,var(--color-ob-gold)_18%,transparent)] text-[var(--color-ob-green)]',
  green: 'bg-[color:color-mix(in_oklab,var(--color-ob-green)_10%,transparent)] text-[var(--color-ob-green)]',
}

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: ChipTone
  children: ReactNode
}

/**
 * MetaChip · passive informational label.
 * Purposefully NOT interactive — never confuse this with a Button.
 * No hover, no cursor pointer, no border.
 */
export function MetaChip({ tone = 'lightgreen', className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em]',
        'font-[family-name:var(--font-display)]',
        toneMap[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
