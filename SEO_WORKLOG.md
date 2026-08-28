# Old Brush · SEO Worklog

Living document. Update as SEO state changes.

## Snapshot · 2026-08-28

- **Domain:** `https://www.oldbrush.co.nz` (production, not yet pointed).
- **Language:** `en-NZ` set on `<html>` in root layout.
- **`metadataBase`:** wired in `src/lib/seo.ts` to the production URL.
- **Analytics:** Vercel Analytics + Speed Insights only. No GA4/Meta pixel in v1.

## Route inventory

| Route | Title | Description | Canonical | Indexed |
|---|---|---|---|---|
| `/` | *Old Brush — Traditional Finishes · Interior Plastering & Painting in Auckland* | Level 4 & 5 plaster + premium painting across Auckland. | `/` | ✅ |
| `/contact` | *Contact · Old Brush* | Enquiries with one working-day reply. | `/contact` | ✅ |
| `/privacy` | *Privacy · Old Brush* | NZ Privacy Act 2020 notice. | `/privacy` | ✅ |
| `/thank-you` | *Thanks · Old Brush* | Enquiry received. | `/thank-you` | ❌ `noindex` |

## Structured data

- `HomeAndConstructionBusiness` JSON-LD in root layout: name, tagline, url, telephone, email, image, `areaServed` = *Auckland Region*, `address` (city + region + country), `knowsAbout`, `makesOffer` (from services list).
- `BreadcrumbList` helper available in `seo.ts` — not yet used in Fase 1 (no sub-routes with breadcrumbs).
- `FAQPage` **not** emitted — no verifiable FAQ content yet.
- `Service` schema — currently expressed as `Offer.itemOffered` inside the LocalBusiness object; consider promoting to individual `Service` entries if we build `/services/[slug]` landings.

## Open Graph

- Dynamic OG image at `/opengraph-image` (1200×630, PNG). Green backdrop, gold border, wordmark + tagline + AKL·NZ.
- Twitter card = `summary_large_image` using the same OG image.

## Pending — technical

- **`sameAs`** entries in JSON-LD once social handles exist (Instagram, Facebook, Google Business Profile URL).
- **`vercel.json` / `vercel.ts`** not present; add if we introduce custom headers, rewrites, or crons.
- **Web font preload hints** — evaluate after real photography lands and LCP shifts.
- **Fluid Compute / streaming** — no dynamic routes yet; revisit when the contact route lands (Fase 3).

## Pending — content

- **Founder / owner bio for About** — currently generic company statement. Waiting on client-approved copy or hide the personal block.
- **Real gallery imagery** with client permission → unlocks `#clients` section revival + `Service`-level images.
- **FAQ content** → unlock `FAQPage` schema.
- **Suburb-level landings** (`/services/interior-painting/[suburb]`) → tracked in Fase 2+ backlog.

## Landing pages · future (backlog)

Prioritised for post-Fase-4 SEO push:

1. `/services/interior-painting`
2. `/services/plaster-level-5`
3. `/services/plaster-level-4`
4. `/services/surface-preparation`
5. `/services/renovations-new-builds`
6. Suburb combinations for the top three: *Ponsonby · Grey Lynn · Remuera · Herne Bay · Mount Eden · Devonport*.

## External actions (owner)

- Claim / create **Google Business Profile**. Add address, hours, service area, category *Painting contractor* + *Plasterer*, upload 3–5 real portfolio photos.
- Verify domain in **Google Search Console**.
- Submit `sitemap.xml` to Search Console once DNS lands on Vercel.
- Reserve social handles (`@oldbrush.nz` or similar) so `sameAs` can eventually populate.

## Decisions log

- **2026-08-28** · No FAQ schema until content exists — refusal to fabricate for schema.
- **2026-08-28** · `HomeAndConstructionBusiness` chosen over `LocalBusiness` — Google recommends the most specific type.
- **2026-08-28** · No cookie consent banner in v1 (Vercel Analytics runs cookie-free; passive privacy notice in Footer + `/privacy`).
