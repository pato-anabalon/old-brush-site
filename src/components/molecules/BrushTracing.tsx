'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { cn } from '@/lib/cn'

type Intensity = 'subtle' | 'medium' | 'strong'
type PathSet = 'hero' | 'section'

/**
 * BrushTracing · Old Brush · continuous animated line backdrop.
 *
 * Two layered strokes — soft wide ribbons and thin sharp lines — flow
 * through the composition. Each path enters from one edge, traverses
 * across, and exits through the opposite edge (no back-and-forth). The
 * reset happens while the path is invisible (dashoffset off-canvas on
 * both ends), so the loop is imperceptible. Alternate paths flow in
 * opposite directions for visual variety.
 *
 * Purely decorative: `aria-hidden` and `pointer-events-none`. Absolute-
 * positioned; pair with a `relative` (ideally `isolate`) parent.
 * Respects `prefers-reduced-motion`: paths render fully drawn without
 * animation.
 */

type Props = {
  intensity?: Intensity
  pathSet?: PathSet
  ribbonColor?: string
  lineColor?: string
  className?: string
  'data-testid'?: string
}

const intensityMap: Record<
  Intensity,
  { ribbon: number; line: number; ribbonOpacity: number; lineOpacity: number }
> = {
  // Ribbon and line strokes now share the same width — the layers are
  // distinguished by colour + opacity + animation speed, not thickness.
  subtle: { ribbon: 1.2, line: 1.2, ribbonOpacity: 0.35, lineOpacity: 0.12 },
  medium: { ribbon: 1.6, line: 1.6, ribbonOpacity: 0.5, lineOpacity: 0.3 },
  strong: { ribbon: 2.2, line: 2.2, ribbonOpacity: 0.65, lineOpacity: 0.5 },
}

/**
 * Path sets are designed for a 1200 × 1000 viewBox with `xMidYMid slice`
 * so they cover both landscape and portrait containers gracefully.
 */
const pathSets: Record<PathSet, { ribbons: string[]; lines: string[] }> = {
  hero: {
    ribbons: [
      'M -80 260 C 220 60, 520 620, 880 340 S 1180 200, 1300 80',
      'M 240 -80 C 420 320, 100 520, 560 720 S 900 940, 1300 820',
      'M -80 900 C 200 780, 480 640, 780 900 S 1080 1120, 1300 900',
    ],
    lines: [
      'M -80 140 C 320 500, 720 220, 1300 620',
      'M -80 780 C 380 420, 620 1000, 1300 500',
      'M 820 -80 C 500 400, 940 780, 380 1140',
      'M -80 500 C 300 240, 900 720, 1300 320',
    ],
  },
  section: {
    ribbons: [
      'M -80 400 C 260 200, 620 700, 980 420 S 1200 260, 1300 200',
      'M 380 -80 C 500 300, 200 620, 640 820 S 940 1000, 1300 900',
    ],
    lines: [
      'M -80 200 C 280 500, 700 300, 1300 700',
      'M -80 820 C 340 480, 660 940, 1300 560',
      'M 900 -80 C 620 440, 980 820, 460 1140',
    ],
  },
}

export function BrushTracing({
  intensity = 'subtle',
  pathSet = 'hero',
  ribbonColor = 'var(--color-ob-lightgreen)',
  lineColor = 'var(--color-ob-green)',
  className,
  ...rest
}: Props) {
  const rootRef = useRef<SVGSVGElement>(null)
  const s = intensityMap[intensity]
  const set = pathSets[pathSet]

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const ribbons = Array.from(
        root.querySelectorAll<SVGGeometryElement>('.ob-trace-ribbon'),
      )
      const lines = Array.from(
        root.querySelectorAll<SVGGeometryElement>('.ob-trace-line'),
      )
      const allPaths = [...ribbons, ...lines]
      if (allPaths.length === 0) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Prime dash lengths. Reduced motion → render fully drawn (no animation).
      if (reduced) {
        for (const p of allPaths) {
          p.style.strokeDasharray = 'none'
          p.style.strokeDashoffset = '0'
        }
        return
      }

      /**
       * Continuous flow: each path enters one edge, traverses the full
       * path, and exits the opposite edge. Direction alternates per index
       * for visual variety. Reset happens while off-canvas — imperceptible.
       *
       * `slowdown` multiplies the base duration so ribbons can run at a
       * different tempo than lines. `phaseOffset` staggers the flow-
       * direction pattern between layers so ribbons and lines don't lock
       * step even when they share indices.
       */
      const startTweens = (
        paths: SVGGeometryElement[],
        slowdown: number,
        phaseOffset: number,
      ) => {
        paths.forEach((p, i) => {
          const len = p.getTotalLength()
          const duration = (18 + (i % 4) * 3.5) * slowdown
          const forward = (i + phaseOffset) % 2 === 0

          const startOffset = forward ? -len : len
          const endOffset = forward ? len : -len

          p.style.strokeDasharray = `${len}`
          p.style.strokeDashoffset = `${startOffset}`

          const tween = gsap.to(p, {
            strokeDashoffset: endOffset,
            duration,
            repeat: -1,
            ease: 'none',
          })
          tween.progress((i * 0.17 + phaseOffset * 0.11) % 1)
        })
      }

      // Ribbons run 25 % slower than the lines.
      startTweens(ribbons, 1.25, 0)
      startTweens(lines, 1, 1)
    },
    { scope: rootRef, dependencies: [pathSet] },
  )

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
      data-testid={rest['data-testid']}
    >
      <g
        stroke={ribbonColor}
        fill="none"
        strokeLinecap="round"
        opacity={s.ribbonOpacity}
      >
        {set.ribbons.map((d, i) => (
          <path
            key={`ribbon-${i}`}
            className="ob-trace ob-trace-ribbon"
            d={d}
            strokeWidth={s.ribbon}
          />
        ))}
      </g>
      <g stroke={lineColor} fill="none" strokeLinecap="round" opacity={s.lineOpacity}>
        {set.lines.map((d, i) => (
          <path
            key={`line-${i}`}
            className="ob-trace ob-trace-line"
            d={d}
            strokeWidth={s.line}
          />
        ))}
      </g>
    </svg>
  )
}
