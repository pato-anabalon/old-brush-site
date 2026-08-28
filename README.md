# Old Brush · Traditional Finishes

Marketing site for **Old Brush** — premium interior plastering and painting in Auckland, New Zealand.

Production domain: **[www.oldbrush.co.nz](https://www.oldbrush.co.nz)**

> Traditional Finishes · Refined interior plastering and painting, carried out with care.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 · App Router · React 19 · TypeScript strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `globals.css`) |
| Fonts | Lora (primary) · Cormorant Garamond (secondary) via `next/font` |
| Animation | GSAP + `@gsap/react` (`useGSAP`) |
| Icons | Lucide (utility) + inline SVG (brand ornaments) |
| Analytics | Vercel Analytics + Speed Insights |
| Validation | Zod |
| Hosting | Vercel · Fluid Compute (Node.js runtime) |
| Package manager | **npm** |

## Install & run

```bash
npm install
npm run dev       # → http://localhost:3000
```

## Scripts

```bash
npm run dev         # Next dev with Turbopack
npm run build       # Production build
npm run start       # Serve the production build
npm run lint        # ESLint (flat config)
npm run typecheck   # tsc --noEmit
```

## Routes (Fase 1 scaffold)

| Route | Purpose | Indexed |
|---|---|---|
| `/` | Home — hero (Fase 1) + section anchors (Fase 2) | ✅ |
| `/contact` | Contact page — full form arrives in Fase 3 | ✅ |
| `/privacy` | Privacy notice (NZ Privacy Act 2020) | ✅ |
| `/thank-you` | Enquiry-received confirmation | ❌ `noindex` |
| `/sitemap.xml` | Auto-generated sitemap | — |
| `/robots.txt` | Robots policy | — |
| `/opengraph-image` | Dynamic OG image (Old Brush wordmark) | — |

## Project structure

```
src/
├─ app/                    # Next.js App Router routes
│  ├─ layout.tsx           # <html lang="en-NZ">, fonts, Preloader, Header, Footer, JSON-LD
│  ├─ page.tsx             # Home
│  ├─ contact/             # /contact
│  ├─ privacy/             # /privacy
│  ├─ thank-you/           # /thank-you
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ opengraph-image.tsx
│  └─ globals.css          # @theme tokens + reset + surface utilities
├─ components/
│  ├─ atoms/               # Button, Container, Logo, MetaChip, Divider
│  ├─ molecules/           # SectionHeading, ScrollReveal, Preloader
│  ├─ organisms/           # Header, Footer, HeroBrush
│  └─ templates/           # (reserved for shared page shells)
└─ lib/
   ├─ content.ts           # brand · nav · services · process · values (en-NZ)
   ├─ seo.ts               # metadata helpers · LocalBusiness JSON-LD
   ├─ env.ts               # zod-validated env + capability flags
   ├─ fonts.ts             # next/font declarations
   └─ cn.ts                # classnames helper
```

## Environment variables

All integrations are optional in v1. See [`.env.example`](./.env.example) for the full list. Missing credentials → the site degrades **visibly** (never silent simulation).

| Var | Purpose | Required for |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — attachments | Contact form uploads |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Rate limiting + idempotency | Contact form protection |
| `RESEND_API_KEY` / `RESEND_FROM` / `RESEND_TO_INTERNAL` | Transactional email | Contact form notifications |
| `TRELLO_KEY` / `TRELLO_TOKEN` / `TRELLO_LIST_ID` | Optional lead card | Internal workflow |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Optional internal alerts | Internal workflow |

## Deploy (Vercel)

```bash
vercel                    # first-time link
vercel --prod             # deploy production
```

The `vercel.json` file is intentionally omitted — configuration lives in `next.config.ts` and the environment variables above. When integrations are provisioned via the Vercel Marketplace, env vars are injected automatically.

## Related docs

- [`OLD_BRUSH_PROJECT_CONTEXT.md`](./OLD_BRUSH_PROJECT_CONTEXT.md) — positioning, architecture, `data-testid` map, decisions that must not be changed accidentally.
- [`SEO_WORKLOG.md`](./SEO_WORKLOG.md) — SEO state, structured data, pending items.
- [`AGENTS.md`](./AGENTS.md) — conventions and rules for collaborators.
- [`INITIAL_PROJECT_PROMPT.md`](./INITIAL_PROJECT_PROMPT.md) — canonical Fase 0 brief.
