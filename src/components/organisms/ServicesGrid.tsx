import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { ServiceCard } from '@/components/molecules/ServiceCard'
import { services, servicesSection } from '@/lib/content'

/**
 * ServicesGrid · home Services section.
 *
 * Paper-soft surface (matches the wave transition from the Hero above).
 * SectionHeading anchors the left, then a responsive grid of the five
 * services from `content.ts`. On lg the grid is 3-across; the last row
 * naturally holds two cards, left-aligned, which reads as an editorial
 * "supporting" row rather than a broken 3-up.
 *
 * The whole area is wrapped in ScrollReveal so the heading and each
 * card fade + rise in staggered order when the section enters view.
 */
export function ServicesGrid() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      data-testid="home-services-section"
      className="pt-24 pb-24 lg:pt-32 lg:pb-28"
      style={{ backgroundColor: 'var(--color-ob-paper-soft)' }}
    >
      <Container width="wide">
        <ScrollReveal>
          <div data-reveal className="max-w-3xl">
            <SectionHeading
              eyebrow={servicesSection.eyebrow}
              headline={servicesSection.headline}
              lead={servicesSection.lead}
              align="left"
              as="h2"
              headingId="services-heading"
            />
          </div>

          <div
            className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8"
            data-testid="home-services-card-grid"
          >
            {services.map((service) => (
              // `min-w-0 w-full`: a grid item defaults to `min-width: auto`,
              // which sizes it from its intrinsic width. iOS WebKit keeps
              // that intrinsic size cached across an orientation change, so
              // the cards stayed at their landscape width when rotating back
              // to portrait, overflowed the viewport, and Safari zoomed the
              // whole page out to compensate.
              <div key={service.slug} data-reveal className="h-full min-w-0 w-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
