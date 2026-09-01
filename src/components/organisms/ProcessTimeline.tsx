import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { processSection, processSteps } from '@/lib/content'

/**
 * ProcessTimeline · home Process section.
 *
 * Paper surface (between the paper-soft Services above and the green
 * Gallery below). Five numbered circles connected by a thin gold rail.
 *
 * Layout:
 *  - Mobile: vertical stack — circle on the left, copy on the right,
 *    rail runs down through the circle centres. Reads top-to-bottom.
 *  - lg+: horizontal — circles distributed with `justify-between`, rail
 *    runs horizontally through their centres, title + body centred
 *    beneath each. Reads left-to-right.
 *
 * The visual numbers are `aria-hidden` because `<ol>` already conveys
 * ordering to assistive tech, so keeping them announced would double-
 * up ("1. 1. Walk-through").
 */
export function ProcessTimeline() {
  const railColor =
    'color-mix(in oklab, var(--color-ob-gold) 45%, transparent)'

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      data-testid="home-process-section"
      className="surface-paper pt-24 pb-24 lg:pt-32 lg:pb-32"
    >
      <Container width="wide">
        <ScrollReveal>
          <div data-reveal className="max-w-3xl">
            <SectionHeading
              eyebrow={processSection.eyebrow}
              headline={processSection.headline}
              lead={processSection.lead}
              align="left"
              as="h2"
              headingId="process-heading"
            />
          </div>

          <ol
            className="relative mt-14 flex flex-col gap-10 lg:mt-24 lg:flex-row lg:justify-between lg:gap-8"
            data-testid="home-process-timeline"
          >
            {/* Desktop rail — spans between first and last circle centres. */}
            <span
              aria-hidden="true"
              className="absolute hidden h-px lg:block"
              style={{
                top: '1.5rem',
                left: '9%',
                right: '9%',
                backgroundColor: railColor,
              }}
            />
            {/* Mobile rail — vertical, behind circles' left column. */}
            <span
              aria-hidden="true"
              className="absolute w-px lg:hidden"
              style={{
                top: '1.5rem',
                bottom: '1.5rem',
                left: '1.5rem',
                backgroundColor: railColor,
              }}
            />

            {processSteps.map((step) => (
              <li
                key={step.n}
                data-reveal
                data-testid={`home-process-step-${step.n}`}
                className="relative flex flex-row items-start gap-5 lg:w-[18%] lg:flex-col lg:items-center lg:gap-5 lg:text-center"
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border"
                  style={{
                    backgroundColor: 'var(--color-ob-paper)',
                    borderColor: 'var(--color-ob-gold)',
                    color: 'var(--color-ob-gold)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                  }}
                >
                  {step.n}
                </span>
                <div className="flex flex-col gap-2 pt-1 lg:pt-0">
                  <h3 className="text-[1.15rem] font-medium text-[var(--color-ob-green)]">
                    {step.title}
                  </h3>
                  <p className="text-[0.92rem] text-[var(--color-ob-ink-soft)] lg:max-w-[22ch]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </Container>
    </section>
  )
}
