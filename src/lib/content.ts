/**
 * Old Brush · Commercial content model
 *
 * Single source of truth for all copy shown on the site.
 * Written in New Zealand English. Never fabricate — leave `null`
 * or hide the section instead.
 *
 * All exports are `readonly` / `as const` so component props
 * infer literal types (used by services, routing helpers, tracking).
 */

export const brand = {
  name: 'Old Brush',
  legalName: 'Old Brush',
  tagline: 'Traditional Finishes',
  location: {
    city: 'Auckland',
    region: 'Auckland Region',
    country: 'New Zealand',
    countryCode: 'NZ',
    short: 'AKL · NZ',
  },
  contact: {
    email: 'cristian@oldbrush.co.nz',
    phone: '+64 22 370 7127',
    phoneHref: 'tel:+64223707127',
    hours: 'By appointment · Monday–Friday',
  },
  domain: 'www.oldbrush.co.nz',
  url: 'https://www.oldbrush.co.nz',
  social: [] as const,
} as const

export type ServiceSlug =
  | 'surface-preparation'
  | 'plaster-level-4'
  | 'plaster-level-5'
  | 'interior-painting'
  | 'renovations-new-builds'

export type Service = {
  slug: ServiceSlug
  name: string
  eyebrow: string
  summary: string
  bullets: readonly string[]
  imageSrc: string
  imageAlt: string
  indexable: boolean
}

export const services: readonly Service[] = [
  {
    slug: 'surface-preparation',
    name: 'Surface Preparation',
    eyebrow: 'The foundation',
    summary:
      'Every refined finish begins with meticulous preparation. We clean, sand, patch and prime so the coats that follow last for years, not months.',
    bullets: [
      'Full assessment of walls, ceilings and trim',
      'Patching, filling and dust-controlled sanding',
      'Priming matched to substrate and topcoat',
    ],
    imageSrc: '/images/3.png',
    imageAlt: 'Old Brush brushes resting beside a paint tin on a linen cloth',
    indexable: true,
  },
  {
    slug: 'plaster-level-4',
    name: 'Plaster · Level 4 Finish',
    eyebrow: 'Refined standard',
    summary:
      'A smooth, uniform finish suited to most interior spaces. Ideal for satin and matte paint schemes where consistency matters.',
    bullets: [
      'Three-coat jointing with careful sanding',
      'Even texture across walls and ceilings',
      'Ready for most residential paint systems',
    ],
    imageSrc: '/images/1.png',
    imageAlt: 'Warm plastered wall in a residential interior — reference imagery',
    indexable: true,
  },
  {
    slug: 'plaster-level-5',
    name: 'Plaster · Level 5 Finish',
    eyebrow: 'The highest standard',
    summary:
      'A skim-coated finish that removes texture variance entirely. Reserved for feature walls, low-angle lighting and gloss paint schemes.',
    bullets: [
      'Full skim coat over Level 4 base',
      'Flawless surface under raking light',
      'The finish of choice for gloss and semi-gloss',
    ],
    imageSrc: '/images/5.png',
    imageAlt: 'Dark painted interior door in a hallway — reference imagery',
    indexable: true,
  },
  {
    slug: 'interior-painting',
    name: 'Interior Painting',
    eyebrow: 'Premium interior',
    summary:
      'Careful, unhurried painting on walls, ceilings and joinery. We match colour, sheen and technique to each surface — no shortcuts.',
    bullets: [
      'Premium paint systems from trusted brands',
      'Clean cuts to trim, cornice and skirting',
      'Protected floors, protected furniture, clean site',
    ],
    imageSrc: '/images/6.png',
    imageAlt: 'A craftsman cutting in with a brush on a green-painted window frame',
    indexable: true,
  },
  {
    slug: 'renovations-new-builds',
    name: 'Renovations & New Builds',
    eyebrow: 'From bare frame to final coat',
    summary:
      'We work alongside builders, designers and homeowners on renovations and new builds across Auckland — end-to-end plastering and painting.',
    bullets: [
      'Coordinated with your programme and trades',
      'Attention to character detail in older homes',
      'Consistent finish across every room',
    ],
    imageSrc: '/images/4.png',
    imageAlt: 'A weatherboard villa with a green roof and picket fence in Auckland',
    indexable: true,
  },
] as const

export type ProcessStep = {
  n: number
  title: string
  body: string
}

export const processSteps: readonly ProcessStep[] = [
  {
    n: 1,
    title: 'Walk-through',
    body: 'We visit your space, listen to the brief and note the details that will shape the work.',
  },
  {
    n: 2,
    title: 'Written quote',
    body: 'A clear, itemised quote — surface preparation, plaster grade, paint system, timeline.',
  },
  {
    n: 3,
    title: 'Preparation',
    body: 'Protection down, surfaces assessed, patched and primed. The invisible work that makes the finish last.',
  },
  {
    n: 4,
    title: 'Application',
    body: 'Plaster and paint applied with patience and the right technique for each surface.',
  },
  {
    n: 5,
    title: 'Walk-off',
    body: 'A joint walk-through, snag list resolved, the site left clean. No loose ends.',
  },
] as const

export type CoreValue = {
  slug: string
  name: string
  body: string
}

/**
 * Canonical core values for the Old Brush site.
 * Deduplicated union of Company Profile and Brand Guidelines,
 * approved in Fase 0 alignment (2026-08-28).
 */
export const coreValues: readonly CoreValue[] = [
  {
    slug: 'craftsmanship',
    name: 'Craftsmanship',
    body: 'Every finish reflects the skill, care and pride behind our work.',
  },
  {
    slug: 'integrity',
    name: 'Integrity',
    body: 'Honouring traditional techniques through precision, patience and attention to every detail.',
  },
  {
    slug: 'trust',
    name: 'Trust',
    body: 'Built through honest communication, reliable service and consistent results.',
  },
  {
    slug: 'timeless-quality',
    name: 'Timeless Quality',
    body: 'Finishes designed to endure — results homeowners can rely on for years to come.',
  },
] as const

export type NavItem = {
  label: string
  href: string
}

export const nav = {
  primary: [
    { label: 'Services', href: '/#services' },
    { label: 'Our approach', href: '/#process' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: [
    { label: 'Services', href: '/#services' },
    { label: 'Our approach', href: '/#process' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
  ],
} as const satisfies { primary: readonly NavItem[]; footer: readonly NavItem[] }

/**
 * Hero copy is separated so the brand voice lives in one place
 * and the organism stays layout-focused.
 *
 * `headline` is a segmented array so the Hero can render editorial italics
 * on emphasised words without hardcoding the copy inside the component.
 * `headlinePlain` mirrors the same text as a single string, used anywhere
 * a flat title is needed (aria labels, structured data, tests).
 */
export type HeadlineSegment = { text: string; em?: boolean }

export const hero = {
  eyebrow: 'Traditional Finishes',
  headline: [
    { text: 'Refined interior ' },
    { text: 'plastering', em: true },
    { text: ' & ' },
    { text: 'painting', em: true },
    { text: '.' },
  ] satisfies readonly HeadlineSegment[],
  headlinePlain: 'Refined interior plastering & painting.',
  lead: 'Level 4 & 5 finishes across Auckland — carried out with care.',
  strip: ['Level 4 & 5 plaster', 'Interior painting', 'Auckland only'],
  primaryCta: { label: 'Request a quote', href: '/contact' },
  secondaryCta: { label: 'See our services', href: '/#services' },
  bottomLabel: 'Auckland · New Zealand',
} as const

/**
 * Process section header copy.
 */
export const processSection = {
  eyebrow: 'Our approach',
  headline: 'Five steps, no surprises.',
  lead: 'The same disciplined arc on every project — so you always know what happens next.',
} as const

/**
 * Services section header copy.
 */
export const servicesSection = {
  eyebrow: 'What we do',
  headline: 'Preparation, plaster and paint — carried out with care.',
  lead: 'Five services covering the full arc of refined interior work in Auckland — from meticulous preparation through to the last coat.',
  cardCta: 'Discuss this service',
} as const

/**
 * Gallery section header copy.
 */
export const gallerySection = {
  eyebrow: 'The look',
  headline: "Interiors, at Old Brush's standard.",
  lead: 'Reference imagery for the atmosphere and craft we chase across Auckland — real project photography lands here as consent and material are confirmed.',
  valuesEyebrow: 'Core values',
} as const

/**
 * About copy — kept honest. No founder bio yet; add when confirmed by owner.
 */
export const about = {
  eyebrow: 'About Old Brush',
  headline: 'Built on craftsmanship. Based in Auckland.',
  paragraphs: [
    'Old Brush is a premium plastering and painting brand built on the belief that exceptional workmanship never goes out of style. We combine traditional technique with modern standards to deliver finishes that protect, restore and elevate the homes we work on.',
    'From meticulous surface preparation to Level 4 and Level 5 plaster finishes and premium interior painting, every stage is carried out with precision, care and respect for the craft.',
  ],
} as const

/**
 * Builder credit — rendered in the Footer and at the bottom of the
 * mobile navigation drawer. Third-party (Nodo, not Old Brush) so the
 * emoji is intentional; if the "no emojis in UI" rule needs to hold
 * strictly, swap the 💜 for a Lucide `Heart` icon here.
 */
export const credit = {
  prefix: 'Built with',
  heart: '💜',
  by: 'by',
  label: 'Nodo.co.nz',
  href: 'https://www.nodo.co.nz',
  ariaLabel: 'Built by Nodo — visit nodo.co.nz (opens in a new tab)',
} as const

/**
 * Contact block copy — used by both the home banner and the /contact page.
 */
export const contact = {
  eyebrow: 'Start your project',
  headline: 'Tell us about your space.',
  lead: 'Share the details and we will come back within one working day.',
  cta: { label: 'Request a quote', href: '/contact' },
} as const
