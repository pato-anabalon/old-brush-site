import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { MetaChip } from '@/components/atoms/MetaChip'
import { ShapeFrame } from '@/components/atoms/ShapeFrame'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { brand, hero } from '@/lib/content'

/**
 * HeroBrush · editorial two-column hero.
 *
 * Desktop:
 *  - Left column (≈40 %): circular brush seal, chip + eyebrow, editorial H1
 *    with italic emphasis, lead paragraph, primary + secondary CTAs, and a
 *    quiet three-item strip beneath the CTAs.
 *  - Right column (≈60 %): a large arch-top-right ShapeFrame with the plaster
 *    wall interior (image 1), and a smaller floating polaroid ShapeFrame with
 *    the Old-Brush-branded craftsman shot (image 2) overlapping the bottom-left.
 *
 * Mobile:
 *  - Single column, copy first, image second (rounded only — arch corners on
 *    a full-width image feel too fancy at small sizes). No polaroid overlay.
 */
export function HeroBrush() {
  return (
    <section
      data-testid="home-hero-section"
      aria-labelledby="home-hero-heading"
      className="surface-paper relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32"
    >
      {/* Corner ornament · top-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 320 320"
        className="pointer-events-none absolute -right-24 -top-12 w-[360px] opacity-40 lg:w-[480px]"
      >
        <path
          d="M 20 200 Q 100 40 250 60 T 300 150"
          stroke="var(--color-ob-gold)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="290"
          cy="60"
          r="70"
          stroke="var(--color-ob-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.45"
        />
      </svg>

      {/* Corner ornament · bottom-left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 260 260"
        className="pointer-events-none absolute -left-20 -bottom-24 hidden w-[380px] opacity-30 lg:block"
      >
        <path
          d="M 10 130 Q 90 40 180 90 T 250 170"
          stroke="var(--color-ob-lightgreen)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="30"
          cy="230"
          r="55"
          stroke="var(--color-ob-lightgreen)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <Container width="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          {/* Left column · copy */}
          <ScrollReveal className="flex flex-col gap-6">
            {/* Circular brush seal */}
            <div data-reveal className="flex items-center gap-4">
              <BrushSeal />
              <MetaChip tone="lightgreen">
                <MapPin aria-hidden="true" size={12} />
                {brand.location.city} · {brand.location.countryCode}
              </MetaChip>
            </div>

            <p
              data-reveal
              className="ob-eyebrow"
              style={{ color: 'var(--color-ob-gold)' }}
            >
              {hero.eyebrow}
            </p>

            <h1
              id="home-hero-heading"
              data-reveal
              className="max-w-[22ch] text-[var(--text-h1)] font-medium text-[var(--color-ob-green)]"
              style={{ lineHeight: 1.05, letterSpacing: '-0.01em' }}
            >
              {hero.headline.map((seg, i) =>
                seg.em ? (
                  <em
                    key={i}
                    className="not-italic"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: 'var(--color-ob-gold)',
                    }}
                  >
                    {seg.text}
                  </em>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </h1>

            <p
              data-reveal
              className="max-w-[46ch] text-[var(--text-lead)] text-[var(--color-ob-ink-soft)]"
            >
              {hero.lead}
            </p>

            <div data-reveal className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href={hero.primaryCta.href}
                variant="primary"
                size="lg"
                data-testid="home-hero-primary-cta"
              >
                {hero.primaryCta.label}
                <ArrowRight aria-hidden="true" size={16} />
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="secondary"
                size="lg"
                surface="paper"
                data-testid="home-hero-secondary-cta"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>

            {/* Quiet three-item strip · plain text, not chips */}
            <ul
              data-reveal
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] uppercase tracking-[0.2em] text-[var(--color-ob-ink-soft)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {hero.strip.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="hidden h-1 w-1 rounded-full sm:inline-block"
                      style={{ backgroundColor: 'var(--color-ob-gold)' }}
                    />
                  ) : null}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Right column · image stack */}
          <ScrollReveal delay={0.15} className="relative">
            {/* Main frame — arch top-right on desktop, straight rounded on mobile */}
            <div data-reveal className="relative">
              <ShapeFrame
                shape="rounded"
                aspect="4/5"
                shadow="frame"
                border
                className="lg:hidden"
                data-testid="home-hero-media"
              >
                <ShapeFrame.Media
                  src="/images/1.png"
                  alt="Warm plastered wall in a residential interior — reference imagery"
                  priority
                />
              </ShapeFrame>

              <ShapeFrame
                shape="arch-tr"
                aspect="4/5"
                shadow="frame"
                border
                className="hidden lg:block"
                data-testid="home-hero-media-desktop"
              >
                <ShapeFrame.Media
                  src="/images/1.png"
                  alt="Warm plastered wall in a residential interior — reference imagery"
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </ShapeFrame>

              {/* Polaroid inset · desktop only */}
              <div
                data-reveal
                data-testid="home-hero-inset"
                className="pointer-events-none absolute -bottom-10 -left-10 hidden w-56 rotate-[-3deg] lg:block xl:w-64"
              >
                <ShapeFrame shape="rounded" aspect="3/4" shadow="float" border>
                  <ShapeFrame.Media
                    src="/images/2.png"
                    alt="An Old Brush craftsman preparing an exterior window in a residential home"
                    sizes="(min-width: 1024px) 16rem, 0px"
                  />
                </ShapeFrame>
                <span
                  className="mt-3 block text-center ob-eyebrow"
                  style={{ color: 'var(--color-ob-gold)' }}
                >
                  On site · Auckland
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}

/**
 * BrushSeal · small circular badge above the hero eyebrow.
 * Echoes the logo circle with a miniaturised crossed brush + spatula mark.
 */
function BrushSeal() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-12 w-12 items-center justify-center rounded-full"
      style={{
        border: '1px solid var(--color-ob-gold)',
        backgroundColor:
          'color-mix(in oklab, var(--color-ob-gold) 8%, var(--color-ob-paper))',
      }}
    >
      <svg viewBox="0 0 40 40" width="24" height="24" fill="none">
        <path
          d="M 12 30 L 22 20 L 26 24 L 30 28 L 26 30 L 22 27 L 18 30 L 14 27 L 18 24 Z M 12 30 L 8 34"
          stroke="var(--color-ob-gold)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 30 30 L 20 20 L 16 24 L 12 28 L 16 30 L 20 27 L 24 30 L 28 27 L 24 24 Z M 30 30 L 34 34"
          stroke="var(--color-ob-gold)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      </svg>
    </span>
  )
}
