import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Service } from '@/lib/content'
import { servicesSection } from '@/lib/content'

type Props = {
  service: Service
}

/**
 * ServiceCard · one card in the ServicesGrid.
 *
 * Structure (top to bottom): imagery, eyebrow, title, summary paragraph,
 * bulleted highlights with gold dots, hairline, and a text-link CTA that
 * pre-fills the contact form (query param wired in Fase 3). Hover is
 * kept quiet — the image nudges its zoom, the arrow slides. The card
 * itself does not lift so the grid stays visually anchored.
 */
export function ServiceCard({ service }: Props) {
  return (
    <article
      data-testid={`home-services-card-${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border transition-shadow duration-[var(--duration-base)] ease-[var(--ease-brush)]"
      style={{
        backgroundColor: 'var(--color-ob-paper)',
        borderColor: 'var(--color-ob-line)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.imageSrc}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-brush)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 lg:p-7">
        <span className="ob-eyebrow" style={{ color: 'var(--color-ob-gold)' }}>
          {service.eyebrow}
        </span>

        <h3 className="text-[var(--text-h3)] text-[var(--color-ob-green)]">
          {service.name}
        </h3>

        <p className="text-[0.98rem] text-[var(--color-ob-ink-soft)]">
          {service.summary}
        </p>

        <ul className="mt-1 flex flex-col gap-2.5">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-[0.9rem] text-[var(--color-ob-ink)]"
            >
              <span
                aria-hidden="true"
                className="mt-[0.55rem] h-1 w-1 flex-shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--color-ob-gold)' }}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div
          className="mt-auto flex items-center gap-2 border-t pt-5 text-[0.75rem] uppercase tracking-[0.2em]"
          style={{ borderColor: 'var(--color-ob-line)' }}
        >
          <Link
            href={`/contact?service=${service.slug}`}
            className="inline-flex items-center gap-2 text-[var(--color-ob-green)] transition-colors hover:text-[var(--color-ob-gold)]"
            data-testid={`home-services-card-${service.slug}-cta`}
          >
            {servicesSection.cardCta}
            <ArrowRight
              aria-hidden="true"
              size={14}
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-brush)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}
