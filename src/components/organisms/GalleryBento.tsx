import Image from 'next/image'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { gallerySection } from '@/lib/content'

/**
 * GalleryBento · home Gallery section.
 *
 * Green surface (dramatic dark break between the paper Process above
 * and the paper About below). Copy sits at the top, then a masonry
 * composition of eight brand-authentic job-site photos — real Old Brush
 * crew at work (painting, plastering, pressure washing, deck staining).
 * CSS multi-column layout (not CSS grid) is used deliberately: the
 * tallest-column stretch problem that forced `min-w-0 w-full` on every
 * grid child elsewhere in this component never arises here, since
 * multi-column items aren't grid items.
 *
 * Collapses column count with viewport (1 → 2 → 3) rather than a fixed
 * bento template, since every source photo is portrait-oriented.
 *
 * Hover micro-interaction (hoverBrushGlow category): the image scales
 * up inside its own clipped, fixed-size tile — the tile itself never
 * grows, so neighbouring tiles never reflow. Same token-driven CSS
 * hover-zoom as `ServiceCard` (`--duration-slow` / `--ease-brush` /
 * `scale-[1.04]`); the global `prefers-reduced-motion` rule in
 * `globals.css` collapses the transition, so no JS is needed and this
 * stays a server component.
 */
const galleryImages = [
  {
    slug: 'stopping-detail',
    src: '/images/photo-8.jpg',
    alt: 'An Old Brush plasterer smoothing a stopped wall joint with a trowel',
    aspect: 'aspect-[4/5]',
  },
  {
    slug: 'brush-detail',
    src: '/images/photo-6.jpg',
    alt: 'An Old Brush painter cutting in weatherboard cladding with a brush and kettle',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'porch-exterior',
    src: '/images/photo-7.jpg',
    alt: 'An Old Brush painter rolling an entryway soffit on a residential home',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'pressure-wash',
    src: '/images/photo-1.jpg',
    alt: 'An Old Brush team member pressure washing an exterior wall ahead of painting',
    aspect: 'aspect-square',
  },
  {
    slug: 'roller-sheeting',
    src: '/images/photo-13.jpg',
    alt: 'An Old Brush painter rolling a wall behind protective sheeting',
    aspect: 'aspect-[4/5]',
  },
  {
    slug: 'deck-stain',
    src: '/images/photo-10.jpg',
    alt: 'An Old Brush painter pouring deck stain into a tray on site',
    aspect: 'aspect-square',
  },
  {
    slug: 'wall-corner',
    src: '/images/photo-11.jpg',
    alt: 'An Old Brush plasterer stopping an internal wall corner',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'kitchen-roller',
    src: '/images/photo-3.jpg',
    alt: 'An Old Brush painter rolling a kitchen splashback wall',
    aspect: 'aspect-square',
  },
] as const

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
            className="mt-14 columns-1 gap-4 md:columns-2 lg:mt-20 lg:columns-3 lg:gap-6"
            data-testid="home-gallery-grid"
          >
            {galleryImages.map(({ slug, src, alt, aspect }) => (
              <div
                key={slug}
                className={`group relative mb-4 w-full overflow-hidden rounded-[var(--radius-xl)] break-inside-avoid lg:mb-6 ${aspect}`}
                data-testid={`home-gallery-item-${slug}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-brush)] group-hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
