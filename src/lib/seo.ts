import type { Metadata } from 'next'
import { brand, services } from '@/lib/content'

/**
 * Absolute URL base used for canonicals and OG images (sitemap.ts and
 * robots.ts deliberately always use `brand.url` directly instead of this —
 * see below).
 *
 * Resolves to whatever host is actually serving the request, not a
 * hardcoded domain — otherwise `metadataBase` makes Next.js generate
 * absolute URLs (`og:image`, `og:url`, canonicals) pointing at
 * `brand.url` even from a Vercel preview deployment. `oldbrush.co.nz`
 * hasn't been cut over to Vercel yet (DNS still resolves to the old
 * Squarespace site), so a chat app fetching the preview link's og:image
 * from that domain gets Squarespace's HTML back instead of a PNG and
 * silently drops the image — title/description still show because
 * those come from the page actually being shared, not the image fetch.
 *
 * Priority: explicit `SITE_URL` override > the stable production domain
 * Vercel has assigned this project (`VERCEL_PROJECT_PRODUCTION_URL` —
 * becomes `oldbrush.co.nz` automatically once DNS cuts over, no code
 * change needed then) > this specific deployment's own URL
 * (`VERCEL_URL`, e.g. a PR preview) > `brand.url` for local dev / any
 * non-Vercel build.
 */
const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : brand.url)

/**
 * Base metadata shared by every route. Route-level helpers spread
 * this and override title/description/alternates as needed.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: brand.name,
  title: {
    default: `${brand.name} — ${brand.tagline} · Interior Plastering & Painting in Auckland`,
    template: `%s · ${brand.name}`,
  },
  description:
    'Refined interior plastering and painting across Auckland. Level 4 and Level 5 plaster finishes, meticulous surface preparation and premium painting.',
  authors: [{ name: brand.name, url: SITE_URL }],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: SITE_URL,
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description:
      'Refined interior plastering and painting across Auckland. Level 4 and Level 5 plaster finishes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — ${brand.tagline}`,
    description:
      'Refined interior plastering and painting across Auckland. Level 4 and Level 5 plaster finishes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/brand/favicon.png',
    apple: '/brand/favicon.png',
    shortcut: '/brand/favicon.png',
  },
  other: {
    // Belt-and-suspenders with `translate="no"` on <html>: tells Chrome
    // mobile to skip its auto-translate suggestion widget, which would
    // otherwise mutate the DOM after SSR and trigger a hydration error
    // for non-English users.
    google: 'notranslate',
  },
}

export function homeMetadata(): Metadata {
  return {
    title: `${brand.name} — ${brand.tagline} · Interior Plastering & Painting in Auckland`,
    description:
      'Refined interior plastering and painting across Auckland. Level 4 and Level 5 plaster finishes, meticulous surface preparation and premium painting.',
    alternates: { canonical: '/' },
    openGraph: {
      url: SITE_URL,
      title: `${brand.name} — ${brand.tagline}`,
      description:
        'Refined interior plastering and painting across Auckland. Level 4 and Level 5 plaster finishes.',
    },
  }
}

export function contactMetadata(): Metadata {
  return {
    title: 'Contact',
    description:
      'Tell us about your space. We reply within one working day. Interior plastering and painting across Auckland.',
    alternates: { canonical: '/contact' },
  }
}

export function thankYouMetadata(): Metadata {
  return {
    title: 'Thanks',
    description: 'We have received your enquiry.',
    alternates: { canonical: '/thank-you' },
    robots: { index: false, follow: false },
  }
}

export function privacyMetadata(): Metadata {
  return {
    title: 'Privacy',
    description: `How ${brand.name} handles your information under the New Zealand Privacy Act 2020.`,
    alternates: { canonical: '/privacy' },
  }
}

/**
 * LocalBusiness / HomeAndConstructionBusiness JSON-LD.
 * Never populate `aggregateRating`, `review` or `award` unless verifiable.
 */
export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}#business`,
    name: brand.name,
    slogan: brand.tagline,
    url: SITE_URL,
    telephone: brand.contact.phone,
    email: brand.contact.email,
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/opengraph-image`,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: brand.location.region,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: brand.location.city,
      addressRegion: brand.location.region,
      addressCountry: brand.location.countryCode,
    },
    knowsAbout: [
      'Interior plastering',
      'Level 4 plaster finish',
      'Level 5 plaster finish',
      'Interior painting',
      'Residential renovations',
      'New builds',
    ],
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.summary },
    })),
  }
}

export function breadcrumbJsonLd(
  items: readonly { name: string; url: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}
