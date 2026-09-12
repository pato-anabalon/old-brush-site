import type { Metadata } from 'next'
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/atoms/Container'
import { QuoteCta } from '@/components/molecules/QuoteCta'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { brand, contact, contactPage } from '@/lib/content'
import { contactMetadata } from '@/lib/seo'

export const metadata: Metadata = contactMetadata()

/**
 * Contact route.
 *
 * Doubles as the no-JavaScript fallback for the quote modal — every CTA
 * on the site points here with `href` intact and only intercepts the
 * click — so the direct contact details must stay on the page.
 *
 * `?service=<slug>` pre-ticks that service inside the flow — `QuoteCta`
 * reads it from the URL at click time, which keeps this route static.
 */
export default function ContactPage() {
  return (
    <section className="pt-40 pb-24" data-testid="contact-page">
      <Container width="narrow">
        <SectionHeading
          eyebrow={contact.eyebrow}
          headline={contact.headline}
          lead={contact.lead}
          as="h1"
        />

        <div className="mt-10 flex flex-col items-start gap-4">
          <QuoteCta
            source="contact-page"
            size="lg"
            data-testid="contact-page-cta"
          >
            {contactPage.ctaLabel}
            <ArrowRight aria-hidden="true" size={16} />
          </QuoteCta>
          <p className="max-w-prose text-[0.95rem] text-[var(--color-ob-ink-soft)]">
            {contactPage.ctaHelper}
          </p>
        </div>

        <div
          className="mt-14 border-t pt-10"
          style={{ borderColor: 'var(--color-ob-line)' }}
        >
          <p className="ob-eyebrow">{contactPage.detailsEyebrow}</p>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail aria-hidden="true" size={18} className="mt-1 text-[var(--color-ob-sand)]" />
              <div>
                <dt className="ob-eyebrow">{contactPage.emailLabel}</dt>
                <dd className="mt-1">
                  <Link
                    href={`mailto:${brand.contact.email}`}
                    className="text-[var(--color-ob-green)] hover:text-[var(--color-ob-gold)]"
                    data-testid="contact-page-email"
                  >
                    {brand.contact.email}
                  </Link>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone aria-hidden="true" size={18} className="mt-1 text-[var(--color-ob-sand)]" />
              <div>
                <dt className="ob-eyebrow">{contactPage.phoneLabel}</dt>
                <dd className="mt-1">
                  <Link
                    href={brand.contact.phoneHref}
                    className="text-[var(--color-ob-green)] hover:text-[var(--color-ob-gold)]"
                    data-testid="contact-page-phone"
                  >
                    {brand.contact.phone}
                  </Link>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock aria-hidden="true" size={18} className="mt-1 text-[var(--color-ob-sand)]" />
              <div>
                <dt className="ob-eyebrow">{contactPage.hoursLabel}</dt>
                <dd className="mt-1 text-[var(--color-ob-ink-soft)]">{brand.contact.hours}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" size={18} className="mt-1 text-[var(--color-ob-sand)]" />
              <div>
                <dt className="ob-eyebrow">{contactPage.areaLabel}</dt>
                <dd className="mt-1 text-[var(--color-ob-ink-soft)]">{contactPage.area}</dd>
              </div>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  )
}
