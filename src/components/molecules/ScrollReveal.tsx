'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type ReactNode } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  stagger?: number
  selector?: string
}

/**
 * ScrollReveal · one-shot entry animation (brushRevealOnce).
 * - Fires once when the wrapper enters the viewport.
 * - Never repeats on re-scroll.
 * - Honours prefers-reduced-motion — served static end state.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 24,
  stagger = 0.08,
  selector = '[data-reveal]',
}: Props) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const nodes = scope.current?.querySelectorAll(selector)
        const targets = nodes && nodes.length > 0 ? Array.from(nodes) : scope.current
        if (!targets) return
        gsap.set(targets, { opacity: 0, y })
        ScrollTrigger.create({
          trigger: scope.current!,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger,
              delay,
            })
          },
        })
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
