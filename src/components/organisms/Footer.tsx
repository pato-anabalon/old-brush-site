import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/atoms/Container'
import { Divider } from '@/components/atoms/Divider'
import { brand, credit, nav } from '@/lib/content'

export function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="surface-green pt-20 pb-10"
    >
      <Container width="wide">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-5">
            <Image
              src="/brand/logo-white-transparent.png"
              alt={`${brand.name} · ${brand.tagline}`}
              width={140}
              height={140}
              className="h-24 w-24 sm:h-28 sm:w-28"
            />
            <Divider tone="sand" />
            <p className="text-[var(--color-ob-paper)]/80 text-[0.95rem] max-w-sm">
              Refined interior plastering and painting across Auckland — carried out with care, for finishes designed to last.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="ob-eyebrow mb-4">Site</p>
            <ul className="flex flex-col gap-3">
              {nav.footer.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-[var(--color-ob-paper)] hover:text-[var(--color-ob-gold)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="ob-eyebrow mb-4">Get in touch</p>
            <ul className="flex flex-col gap-3 text-[0.95rem] text-[var(--color-ob-paper)]">
              <li className="flex items-start gap-2.5">
                <Mail aria-hidden="true" size={16} className="mt-1 opacity-80" />
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-[var(--color-ob-gold)] transition-colors break-all"
                >
                  {brand.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone aria-hidden="true" size={16} className="mt-1 opacity-80" />
                <a
                  href={brand.contact.phoneHref}
                  className="hover:text-[var(--color-ob-gold)] transition-colors"
                >
                  {brand.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" size={16} className="mt-1 opacity-80" />
                <span>{brand.location.region}, {brand.location.country}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-[var(--color-ob-paper)]/15 pt-6 text-[0.8rem] text-[var(--color-ob-paper)]/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={credit.ariaLabel}
            className="transition-colors hover:text-[var(--color-ob-gold)]"
            data-testid="site-footer-credit"
          >
            {credit.prefix}{' '}
            <span aria-hidden="true">{credit.heart}</span>{' '}
            {credit.by}{' '}
            <span className="font-medium">{credit.label}</span>
          </a>
          <p className="ob-eyebrow" style={{ color: 'var(--color-ob-sand)' }}>
            {brand.tagline} · {brand.location.short}
          </p>
        </div>
      </Container>
    </footer>
  )
}
