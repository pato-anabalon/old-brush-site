import type { Metadata } from 'next'
import { Container } from '@/components/atoms/Container'
import { HeroBrush } from '@/components/organisms/HeroBrush'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { homeMetadata } from '@/lib/seo'

export const metadata: Metadata = homeMetadata()

/**
 * Home · Fase 1 scope
 * Renders the Hero only. Anchors for #services, #process, #gallery, #about
 * and #contact are stubbed as SectionPlaceholder blocks so navigation works
 * end-to-end while the sections are built out in Fase 2.
 */
export default function HomePage() {
  return (
    <>
      <HeroBrush />
      <SectionPlaceholder
        id="services"
        eyebrow="What we do"
        headline="Services · coming in Fase 2"
      />
      <SectionPlaceholder
        id="process"
        eyebrow="Our approach"
        headline="Process · coming in Fase 2"
      />
      <SectionPlaceholder
        id="gallery"
        eyebrow="Selected imagery"
        headline="Gallery · coming in Fase 2"
      />
      <SectionPlaceholder
        id="about"
        eyebrow="About Old Brush"
        headline="About · coming in Fase 2"
      />
      <SectionPlaceholder
        id="contact"
        eyebrow="Start your project"
        headline="Contact banner · coming in Fase 2"
      />
    </>
  )
}

function SectionPlaceholder({
  id,
  eyebrow,
  headline,
}: {
  id: string
  eyebrow: string
  headline: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-placeholder-heading`}
      data-testid={`home-${id}-placeholder`}
      className="py-24"
    >
      <Container width="base">
        <SectionHeading
          eyebrow={eyebrow}
          headline={headline}
          lead="This section is scaffolded in Fase 1 and will be authored in Fase 2. The anchor is live so navigation works today."
          align="left"
          as="h2"
        />
      </Container>
    </section>
  )
}
