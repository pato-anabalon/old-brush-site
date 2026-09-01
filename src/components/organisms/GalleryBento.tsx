import Image from 'next/image'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { gallerySection } from '@/lib/content'

/**
 * GalleryBento · home Gallery section.
 *
 * Green surface (dramatic dark break between the paper Process above
 * and the paper About below). Copy sits at the top, then an asymmetric
 * bento composition of four images:
 *
 *   ┌──────────┬──────────────────────┐
 *   │          │        approach       │
 *   │  feature ├─────────┬─────────────┤
 *   │          │  detail │   facade    │
 *   └──────────┴─────────┴─────────────┘
 *
 * On mobile it collapses to a single-column stack. Image 2 (Old Brush
 * craftsman in branded shirt) is used as the feature — the only
 * brand-authentic shot in the composition, everything else is honestly
 * labelled reference imagery.
 */
export function GalleryBento() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      data-testid="home-gallery-section"
      className="surface-green pt-24 pb-24 lg:pt-32 lg:pb-32"
    >
      <Container width="wide">
        <ScrollReveal>
          <div data-reveal className="max-w-3xl">
            <SectionHeading
              eyebrow={gallerySection.eyebrow}
              headline={gallerySection.headline}
              lead={gallerySection.lead}
              align="left"
              as="h2"
              tone="paper"
              headingId="gallery-heading"
            />
          </div>

          <div
            data-reveal
            className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6"
            data-testid="home-gallery-grid"
          >
            {/* Feature — brand-authentic craftsman shot. Tall on desktop
                (stretched to match the right column via lg:h-full), fixed
                portrait aspect on mobile. */}
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-xl)] lg:aspect-auto lg:h-full"
              data-testid="home-gallery-item-craftsman"
            >
              <Image
                src="/images/2.png"
                alt="An Old Brush craftsman preparing an exterior window in a residential home"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Right column: wide landscape on top, two squares below. */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <div
                className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)]"
                data-testid="home-gallery-item-approach"
              >
                <Image
                  src="/images/house-1.jpg"
                  alt="Residential home approach — reference imagery"
                  fill
                  sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div
                  className="relative aspect-square overflow-hidden rounded-[var(--radius-xl)]"
                  data-testid="home-gallery-item-detail"
                >
                  <Image
                    src="/images/house-2.jpg"
                    alt="Residential home detail — reference imagery"
                    fill
                    sizes="(min-width: 1024px) 27vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="relative aspect-square overflow-hidden rounded-[var(--radius-xl)]"
                  data-testid="home-gallery-item-facade"
                >
                  <Image
                    src="/images/house-3.jpg"
                    alt="Residential home facade — reference imagery"
                    fill
                    sizes="(min-width: 1024px) 27vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
