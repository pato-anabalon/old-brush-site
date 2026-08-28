'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { brand } from '@/lib/content'

const SESSION_KEY = 'ob_seen'

/**
 * Preloader · Old Brush · one-shot logo-construction animation.
 *
 * Storyboard (approved 2026-08-28, ~1100 ms):
 * 1. Gold circle traces clockwise.
 * 2. AKL slides in from the left, NZ from the right.
 * 3. "TRADITIONAL FINISHES" arch reveals letter by letter.
 * 4. The green flourish divider draws out from the centre.
 * 5. "OLD BRUSH" wordmark fades and lifts into place.
 * 6. Brush and spatula icons draw simultaneously and cross.
 * 7. Rope knots on both sides fade in.
 * 8. Green curtain opens vertically, revealing the site.
 *
 * Guards:
 *  - sessionStorage.ob_seen → skip animation, hide instantly on mount.
 *  - prefers-reduced-motion → skip animation entirely.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const seen = window.sessionStorage.getItem(SESSION_KEY)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const skip = Boolean(seen) || reduced

      const setSeen = () => {
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* private mode etc. — non-fatal */
        }
      }
      const releaseScroll = () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        root.style.pointerEvents = 'none'
      }

      // Lock scroll while the preloader is visible.
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      if (skip) {
        gsap.set(root, { autoAlpha: 0 })
        releaseScroll()
        setSeen()
        return () => {
          releaseScroll()
        }
      }

      const circle = root.querySelector<SVGGeometryElement>('.ob-pl-circle')
      const flourish = root.querySelector<SVGGeometryElement>('.ob-pl-flourish')
      const brush = root.querySelector<SVGGeometryElement>('.ob-pl-brush')
      const spatula = root.querySelector<SVGGeometryElement>('.ob-pl-spatula')

      for (const p of [circle, flourish, brush, spatula]) {
        if (!p) continue
        const len = p.getTotalLength()
        p.style.strokeDasharray = `${len}`
        p.style.strokeDashoffset = `${len}`
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          releaseScroll()
          setSeen()
        },
      })

      // 1 · Gold circle traces
      if (circle) {
        tl.to(circle, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.05)
      }

      // 2 · AKL / NZ slide in
      tl.fromTo(
        '.ob-pl-akl',
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.35 },
        0.32,
      ).fromTo(
        '.ob-pl-nz',
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.35 },
        0.32,
      )

      // 3 · Arch letters staggered
      tl.fromTo(
        '.ob-pl-arch tspan',
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.022 },
        0.42,
      )

      // 4 · Flourish draws from centre
      if (flourish) {
        tl.to(flourish, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, 0.6)
      }

      // 5 · OLD BRUSH wordmark
      tl.fromTo(
        '.ob-pl-wordmark',
        { opacity: 0, y: 12, scale: 0.98, transformOrigin: '50% 50%' },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
        0.68,
      )

      // 6 · Brush + spatula draw simultaneously
      if (brush) tl.to(brush, { strokeDashoffset: 0, duration: 0.42 }, 0.78)
      if (spatula) tl.to(spatula, { strokeDashoffset: 0, duration: 0.42 }, 0.78)

      // 7 · Rope knots
      tl.fromTo(
        '.ob-pl-knot',
        { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.35, stagger: 0.06 },
        0.95,
      )

      // 8 · Curtain reveal — collapse the box upward
      tl.to(
        root,
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          duration: 0.6,
          ease: 'power4.inOut',
        },
        1.15,
      ).set(root, { autoAlpha: 0 })

      return () => {
        tl.kill()
        releaseScroll()
      }
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid="preloader"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        backgroundColor: 'var(--color-ob-green)',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width="min(72vw, 380px)"
        height="min(72vw, 380px)"
        fill="none"
        role="img"
        aria-label={`${brand.name} · ${brand.tagline}`}
      >
        <defs>
          <path id="ob-pl-arch-path" d="M 70 195 A 130 130 0 0 1 330 195" />
        </defs>

        <circle
          className="ob-pl-circle"
          cx="200"
          cy="200"
          r="170"
          stroke="var(--color-ob-gold)"
          strokeWidth="1.5"
        />

        <text
          className="ob-pl-akl"
          x="52"
          y="205"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="3"
          fill="var(--color-ob-gold)"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          AKL
        </text>
        <text
          className="ob-pl-nz"
          x="348"
          y="205"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="3"
          fill="var(--color-ob-gold)"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          NZ
        </text>

        <text
          className="ob-pl-arch"
          fontSize="12"
          letterSpacing="4"
          fill="var(--color-ob-paper)"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <textPath href="#ob-pl-arch-path" startOffset="50%" textAnchor="middle">
            {'TRADITIONAL FINISHES'.split('').map((ch, i) => (
              <tspan key={i}>{ch === ' ' ? ' ' : ch}</tspan>
            ))}
          </textPath>
        </text>

        <g stroke="var(--color-ob-lightgreen)" strokeWidth="1" fill="none">
          <path
            className="ob-pl-flourish"
            d="M 155 145 L 190 145 M 210 145 L 245 145 M 195 140 L 200 145 L 195 150 L 200 145 L 205 140 L 200 145 L 205 150"
          />
        </g>

        <g className="ob-pl-wordmark" fill="var(--color-ob-paper)">
          <text
            x="200"
            y="205"
            textAnchor="middle"
            fontSize="42"
            fontWeight="500"
            letterSpacing="2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            OLD
          </text>
          <text
            x="200"
            y="252"
            textAnchor="middle"
            fontSize="42"
            fontWeight="500"
            letterSpacing="2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            BRUSH
          </text>
        </g>

        <g
          stroke="var(--color-ob-paper)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="ob-pl-brush"
            d="M 172 315 L 205 282 L 218 295 L 228 305 L 218 315 L 205 305 L 195 315 L 185 305 L 195 295 Z M 172 315 L 155 332"
          />
          <path
            className="ob-pl-spatula"
            d="M 228 315 L 195 282 L 182 295 L 172 305 L 182 315 L 195 305 L 205 315 L 215 305 L 205 295 Z M 228 315 L 245 332"
            opacity="0.85"
          />
        </g>

        <g stroke="var(--color-ob-gold)" strokeWidth="1" fill="none">
          <g className="ob-pl-knot" transform="translate(78 300)">
            <circle r="6" />
            <path d="M -8 8 Q -2 4 6 8" />
          </g>
          <g className="ob-pl-knot" transform="translate(322 300)">
            <circle r="6" />
            <path d="M -6 8 Q 2 4 8 8" />
          </g>
        </g>
      </svg>
    </div>
  )
}
