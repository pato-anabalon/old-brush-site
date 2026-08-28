import type { Metadata } from 'next'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { brand, contact } from '@/lib/content'
import { contactMetadata } from '@/lib/seo'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = contactMetadata()

/**
 * Contact page · Fase 1 scaffold.
 * Fase 3 will replace the placeholder card with the full form + upload flow.
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

        <div
          className="mt-12 rounded-[var(--radius-sm)] border p-8 md:p-10"
          style={{ borderColor: 'var(--color-ob-line)' }}
        >
          <p className="text-[var(--color-ob-ink-soft)]">
            The full enquiry form arrives in Fase 3. In the meantime, reach us directly:
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-[var(--color-ob-green)]">
            <li className="flex items-center gap-3">
              <Mail aria-hidden="true" size={18} />
              <Link href={`mailto:${brand.contact.email}`} className="hover:text-[var(--color-ob-gold)]">
                {brand.contact.email}
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Phone aria-hidden="true" size={18} />
              <Link href={brand.contact.phoneHref} className="hover:text-[var(--color-ob-gold)]">
                {brand.contact.phone}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  )
}
