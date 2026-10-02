import Image from 'next/image'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { about, coreValues } from '@/lib/content'

/**
 * AboutSection · home About section.
 *
 * Paper surface (between the green Gallery above and the green Contact
 * banner below). Two zones:
 *
 *  1. Split top — copy on the left (7fr) with heading + paragraphs;
 *     brand-authentic image on the right (5fr), stretched to match copy
 *     height on desktop.
 *  2. Values bar — the four canonical core values below a hairline, laid
 *     out `md:grid-cols-2 lg:grid-cols-4` so they read as an editorial
 *     supporting strip rather than a card grid.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      data-testid="home-about-section"
      className="surface-paper pt-24 pb-24 lg:pt-32 lg:pb-32"
    >
      <Container width="wide">
        <ScrollReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
            <div data-reveal className="flex max-w-[52ch] flex-col gap-6">
              <SectionHeading
                eyebrow={about.eyebrow}
                headline={about.headline}
                align="left"
                as="h2"
                headingId="about-heading"
              />
              {about.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[var(--text-lead)] text-[var(--color-ob-ink-soft)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              data-reveal
              className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] border lg:h-full"
              style={{ borderColor: 'var(--color-ob-line)' }}
              data-testid="home-about-image"
            >
              <Image
                src="/images/photo-9.jpg"
                alt="An Old Brush crew member, Auckland"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div
            data-reveal
            className="mt-16 border-t pt-12 lg:mt-24"
            style={{ borderColor: 'var(--color-ob-line)' }}
            data-testid="home-about-values"
          >
            <p
              className="ob-eyebrow mb-8"
              style={{ color: 'var(--color-ob-gold)' }}
            >
              Core values
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              {coreValues.map((value) => (
                <div
                  key={value.slug}
                  className="flex flex-col gap-3"
                  data-testid={`home-about-value-${value.slug}`}
                >
                  <h3
                    className="text-[1.15rem] font-medium text-[var(--color-ob-green)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {value.name}
                  </h3>
                  <p className="text-[0.92rem] text-[var(--color-ob-ink-soft)]">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
