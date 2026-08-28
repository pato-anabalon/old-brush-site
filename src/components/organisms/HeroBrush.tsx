import { ArrowRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { Divider } from '@/components/atoms/Divider'
import { MetaChip } from '@/components/atoms/MetaChip'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { brand, hero } from '@/lib/content'

/**
 * HeroBrush · home hero organism.
 * - Full-bleed plastered wall backdrop with a green/gold overlay.
 * - Editorial split on desktop: copy left, brand-authentic craftsman insert right.
 * - Mobile: stacked, backdrop with denser overlay for legibility.
 */
export function HeroBrush() {
  return (
    <section
      data-testid="home-hero-section"
      aria-labelledby="home-hero-heading"
      className="relative isolate min-h-[92svh] overflow-hidden pt-32 pb-24 text-[var(--color-ob-paper)] lg:pt-40 lg:pb-32"
    >
      {/* Backdrop image */}
      <Image
        src="/images/1.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Overlay — deep green with a gold radial glow */}
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 20% 30%, color-mix(in oklab, var(--color-ob-green) 60%, transparent) 0%, color-mix(in oklab, var(--color-ob-green) 92%, transparent) 55%, var(--color-ob-green) 100%)',
        }}
      />
      {/* Bottom fade to next section */}
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-ob-green) 70%, transparent) 60%, var(--color-ob-paper) 100%)',
        }}
      />

      <Container width="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <ScrollReveal className="flex flex-col gap-6">
            <div data-reveal className="flex items-center gap-3">
              <MetaChip tone="lightgreen">
                <MapPin aria-hidden="true" size={12} />
                {brand.location.city} · {brand.location.countryCode}
              </MetaChip>
              <span className="ob-eyebrow" style={{ color: 'var(--color-ob-sand)' }}>
                {hero.eyebrow}
              </span>
            </div>

            <Divider tone="gold" data-reveal />

            <h1
              id="home-hero-heading"
              data-reveal
              className="max-w-[22ch] text-[var(--text-h1)] font-[family-name:var(--font-serif)] font-medium text-[var(--color-ob-paper)]"
              style={{ lineHeight: 1.08 }}
            >
              {hero.headline}
            </h1>

            <p
              data-reveal
              className="max-w-[46ch] text-[var(--text-lead)] text-[color:color-mix(in_oklab,var(--color-ob-paper)_88%,transparent)]"
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
                surface="green"
                data-testid="home-hero-secondary-cta"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </ScrollReveal>

          {/* Editorial insert — desktop only, using brand-authentic image 2 */}
          <ScrollReveal delay={0.15} className="hidden lg:block">
            <div
              data-reveal
              className="relative ml-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[var(--radius-sm)] border"
              style={{
                borderColor: 'color-mix(in oklab, var(--color-ob-gold) 45%, transparent)',
                boxShadow:
                  '0 30px 60px -30px color-mix(in oklab, var(--color-ob-green) 90%, transparent)',
              }}
            >
              <Image
                src="/images/2.png"
                alt="An Old Brush craftsman preparing an exterior window in a residential home"
                fill
                sizes="(min-width: 1024px) 24rem, 0px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 p-5"
                style={{
                  background:
                    'linear-gradient(to top, color-mix(in oklab, var(--color-ob-green) 92%, transparent), transparent)',
                }}
              >
                <span className="ob-eyebrow" style={{ color: 'var(--color-ob-sand)' }}>
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
