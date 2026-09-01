import { ArrowRight, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ScrollReveal } from '@/components/molecules/ScrollReveal'
import { brand, contact } from '@/lib/content'

/**
 * ContactBanner · final home CTA banner.
 *
 * Green surface (matches the closing rhythm of the page). Centered
 * heading, primary CTA to `/contact`, and inline email + phone so users
 * who prefer to reach us directly can do so without leaving the page.
 */
export function ContactBanner() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-testid="home-contact-section"
      className="surface-green pt-24 pb-24 lg:pt-32 lg:pb-32"
    >
      <Container width="narrow">
        <ScrollReveal>
          <div data-reveal className="flex flex-col items-center">
            <SectionHeading
              eyebrow={contact.eyebrow}
              headline={contact.headline}
              lead={contact.lead}
              align="center"
              as="h2"
              tone="paper"
              headingId="contact-heading"
            />
          </div>

          <div
            data-reveal
            className="mt-10 flex flex-col items-center gap-8"
          >
            <Button
              href={contact.cta.href}
              variant="primary"
              size="lg"
              data-testid="home-contact-cta"
            >
              {contact.cta.label}
              <ArrowRight aria-hidden="true" size={16} />
            </Button>

            <div
              className="flex flex-col items-center gap-3 text-[0.95rem] sm:flex-row sm:gap-8"
              style={{
                color:
                  'color-mix(in oklab, var(--color-ob-paper) 85%, transparent)',
              }}
            >
              <a
                href={`mailto:${brand.contact.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-ob-gold)]"
                data-testid="home-contact-email"
              >
                <Mail aria-hidden="true" size={16} />
                <span className="break-all">{brand.contact.email}</span>
              </a>
              <a
                href={brand.contact.phoneHref}
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-ob-gold)]"
                data-testid="home-contact-phone"
              >
                <Phone aria-hidden="true" size={16} />
                <span>{brand.contact.phone}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
