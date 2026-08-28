import { cn } from '@/lib/cn'

type Props = {
  className?: string
  tone?: 'gold' | 'green' | 'sand' | 'lightgreen'
  variant?: 'flourish' | 'hairline'
}

/**
 * Divider · editorial line + diamond flourish.
 * Inspired by the ornament under "TRADITIONAL FINISHES" in the logo.
 */
export function Divider({ className, tone = 'gold', variant = 'flourish' }: Props) {
  const stroke =
    tone === 'gold'
      ? 'var(--color-ob-gold)'
      : tone === 'green'
        ? 'var(--color-ob-green)'
        : tone === 'sand'
          ? 'var(--color-ob-sand)'
          : 'var(--color-ob-lightgreen)'

  if (variant === 'hairline') {
    return <hr className={cn('ob-hairline', className)} style={{ backgroundColor: stroke }} />
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 12"
      className={cn('h-3 w-40', className)}
      fill="none"
    >
      <line x1="0" y1="6" x2="80" y2="6" stroke={stroke} strokeWidth="1" />
      <line x1="120" y1="6" x2="200" y2="6" stroke={stroke} strokeWidth="1" />
      <path
        d="M100 1 L107 6 L100 11 L93 6 Z"
        stroke={stroke}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="100" cy="6" r="1.2" fill={stroke} />
    </svg>
  )
}
