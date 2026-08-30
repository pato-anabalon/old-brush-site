import type { Metadata } from 'next'
import { Container } from '@/components/atoms/Container'
import { WaveDivider } from '@/components/atoms/WaveDivider'
import { HeroBrush } from '@/components/organisms/HeroBrush'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { cn } from '@/lib/cn'
import { homeMetadata } from '@/lib/seo'

export const metadata: Metadata = homeMetadata()

/**
 * Home · Fase 1 scope + Hero redesign.
 * Renders the Hero and stubbed anchors for #services, #process, #gallery,
 * #about, #contact. Surfaces alternate between `paper` and `paper-soft`,
 * with curved WaveDividers between sections so the visual rhythm is
 * established before section internals are authored in Fase 2.
 */
export default function HomePage() {
  return (
    <>
      <HeroBrush />

      <WaveDivider from="paper" to="paper-soft" variant="wave" />

      <SectionPlaceholder
        id="services"
        surface="paper-soft"
        eyebrow="What we do"
        headline="Services · coming in Fase 2"
      />

      <WaveDivider from="paper-soft" to="paper" variant="wave" flip />

      <SectionPlaceholder
        id="process"
        surface="paper"
        eyebrow="Our approach"
        headline="Process · coming in Fase 2"
      />

      <WaveDivider from="paper" to="green" variant="swell" />

      <SectionPlaceholder
        id="gallery"
        surface="green"
        eyebrow="Selected imagery"
        headline="Gallery · coming in Fase 2"
      />

      <WaveDivider from="green" to="paper" variant="swell" flip />

      <SectionPlaceholder
        id="about"
        surface="paper"
        eyebrow="About Old Brush"
        headline="About · coming in Fase 2"
      />

      <WaveDivider from="paper" to="green" variant="arc" />

      <SectionPlaceholder
        id="contact"
        surface="green"
        eyebrow="Start your project"
        headline="Contact banner · coming in Fase 2"
      />
    </>
  )
}

const surfaceMap = {
  paper: 'surface-paper',
  'paper-soft': 'bg-[var(--color-ob-paper-soft)] text-[var(--color-ob-ink)]',
  green: 'surface-green',
} as const

function SectionPlaceholder({
  id,
  surface,
  eyebrow,
  headline,
}: {
  id: string
  surface: keyof typeof surfaceMap
  eyebrow: string
  headline: string
}) {
  const isPaper = surface !== 'green'
  return (
    <section
      id={id}
      aria-labelledby={`${id}-placeholder-heading`}
      data-testid={`home-${id}-placeholder`}
      className={cn('py-24', surfaceMap[surface])}
    >
      <Container width="base">
        <SectionHeading
          eyebrow={eyebrow}
          headline={headline}
          lead="This section is scaffolded in Fase 1 and will be authored in Fase 2. The anchor is live so navigation works today."
          align="left"
          as="h2"
          tone={isPaper ? 'ink' : 'paper'}
        />
      </Container>
    </section>
  )
}
