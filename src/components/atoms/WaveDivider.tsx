import { cn } from '@/lib/cn'

type Tone = 'paper' | 'paper-soft' | 'sand' | 'lightgreen' | 'green' | 'gold'

const toneVar: Record<Tone, string> = {
  paper: 'var(--color-ob-paper)',
  'paper-soft': 'var(--color-ob-paper-soft)',
  sand: 'var(--color-ob-sand)',
  lightgreen: 'var(--color-ob-lightgreen)',
  green: 'var(--color-ob-green)',
  gold: 'var(--color-ob-gold)',
}

type Variant = 'wave' | 'arc' | 'swell'

const paths: Record<Variant, string> = {
  wave:
    'M0,64 C240,120 480,10 720,60 C960,110 1200,20 1440,72 L1440,120 L0,120 Z',
  arc: 'M0,120 C360,0 1080,0 1440,120 L1440,120 L0,120 Z',
  swell:
    'M0,80 C300,140 540,20 720,60 C900,100 1140,140 1440,60 L1440,120 L0,120 Z',
}

type Props = {
  from: Tone
  to: Tone
  variant?: Variant
  flip?: boolean
  className?: string
  height?: number
}

/**
 * WaveDivider · SVG shape that transitions one surface colour into another.
 *
 * - `from` = the section ABOVE the divider (background of the div itself).
 * - `to`   = the section BELOW (drawn as the wave path fill).
 * - `flip` = mirror horizontally when you want alternating rhythm.
 *
 * The divider sits between two sections and does not push layout beyond its
 * height (default 96 px), so it never fights the surrounding rhythm.
 */
export function WaveDivider({
  from,
  to,
  variant = 'wave',
  flip = false,
  className,
  height = 96,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative w-full overflow-hidden leading-[0]', className)}
      style={{ backgroundColor: toneVar[from], height }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-full w-full"
        style={flip ? { transform: 'scaleX(-1)' } : undefined}
      >
        <path d={paths[variant]} fill={toneVar[to]} />
      </svg>
    </div>
  )
}
