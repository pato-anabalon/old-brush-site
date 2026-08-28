import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import { Container } from '@/components/atoms/Container'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { thankYouMetadata } from '@/lib/seo'

export const metadata: Metadata = thankYouMetadata()

export default function ThankYouPage() {
  return (
    <section className="pt-40 pb-24" data-testid="thank-you-page">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Enquiry received"
          headline="Thank you."
          lead="We have received your enquiry and will come back to you within one working day."
          as="h1"
        />
        <div className="mt-10">
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
        <p className="mt-6 text-sm text-[var(--color-ob-ink-soft)]">
          Prefer to reach us directly? See our{' '}
          <Link href="/contact" className="text-[var(--color-ob-gold)] underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </Container>
    </section>
  )
}
