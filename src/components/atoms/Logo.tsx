import { cn } from '@/lib/cn'
import { brand } from '@/lib/content'

type Variant = 'wordmark' | 'stacked' | 'monogram'
type Tone = 'ink' | 'paper'

type Props = {
  variant?: Variant
  tone?: Tone
  className?: string
  'aria-label'?: string
}

const toneVars: Record<
  Tone,
  { wordmark: string; eyebrow: string; rule: string }
> = {
  ink: {
    wordmark: 'var(--color-ob-green)',
    eyebrow: 'var(--color-ob-gold)',
    rule: 'var(--color-ob-gold)',
  },
  paper: {
    wordmark: 'var(--color-ob-paper)',
    eyebrow: 'var(--color-ob-gold)',
    rule: 'var(--color-ob-gold)',
  },
}

/**
 * Logo · text-based lockup for header/footer.
 * The full illustrated badge lives in Preloader (SVG) and next/image (docs/logo.png).
 * Variants:
 *  - wordmark: "OLD BRUSH" inline (used in nav)
 *  - stacked : OLD / BRUSH + TRADITIONAL FINISHES eyebrow
 *  - monogram: circular O·B mark
 */
export function Logo({
  variant = 'wordmark',
  tone = 'ink',
  className,
  ...rest
}: Props) {
  const colors = toneVars[tone]
  const label = rest['aria-label'] ?? `${brand.name} · ${brand.tagline}`

  if (variant === 'monogram') {
    return (
      <span
        role="img"
        aria-label={label}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full border',
          className,
        )}
        style={{
          borderColor: colors.rule,
          color: colors.wordmark,
          fontFamily: 'var(--font-serif)',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
        }}
      >
        OB
      </span>
    )
  }

  if (variant === 'stacked') {
    return (
      <span role="img" aria-label={label} className={cn('inline-flex flex-col', className)}>
        <span
          className="text-[0.62rem] uppercase tracking-[0.36em]"
          style={{ color: colors.eyebrow, fontFamily: 'var(--font-display)' }}
        >
          {brand.tagline}
        </span>
        <span
          className="text-[1.4rem] font-medium leading-none tracking-tight"
          style={{ color: colors.wordmark, fontFamily: 'var(--font-serif)' }}
        >
          {brand.name.toUpperCase()}
        </span>
      </span>
    )
  }

  // wordmark (default)
  return (
    <span role="img" aria-label={label} className={cn('inline-flex items-baseline gap-3', className)}>
      <span
        className="text-[1.1rem] font-medium tracking-[0.06em]"
        style={{ color: colors.wordmark, fontFamily: 'var(--font-serif)' }}
      >
        {brand.name.toUpperCase()}
      </span>
      <span
        className="hidden text-[0.62rem] uppercase tracking-[0.36em] md:inline"
        style={{ color: colors.eyebrow, fontFamily: 'var(--font-display)' }}
      >
        {brand.tagline}
      </span>
    </span>
  )
}
