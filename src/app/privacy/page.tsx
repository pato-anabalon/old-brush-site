import type { Metadata } from 'next'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { brand } from '@/lib/content'
import { privacyMetadata } from '@/lib/seo'

export const metadata: Metadata = privacyMetadata()

export default function PrivacyPage() {
  return (
    <section className="pt-40 pb-24" data-testid="privacy-page">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Legal"
          headline="Privacy Notice"
          lead={`How ${brand.name} handles your information under the New Zealand Privacy Act 2020.`}
          as="h1"
        />

        <div className="prose mt-10 max-w-none text-[var(--color-ob-ink)]">
          <p>
            {brand.name} collects only the information you provide when you contact us
            — typically your name, email, phone number, and project details. We use it
            only to reply to your enquiry and quote your project.
          </p>
          <p className="mt-4">
            We do not sell your information. We use Vercel Analytics and Speed Insights
            in an aggregate, cookie-free mode to understand traffic patterns.
          </p>
          <p className="mt-4">
            To request access, correction or deletion of your information, contact us at{' '}
            <a
              href={`mailto:${brand.contact.email}`}
              className="text-[var(--color-ob-gold)] underline underline-offset-4"
            >
              {brand.contact.email}
            </a>
            .
          </p>
          <p className="mt-6 text-[var(--color-ob-ink-soft)] text-sm">
            This notice will be expanded in Fase 3 alongside the full enquiry form.
          </p>
        </div>
      </Container>
    </section>
  )
}
