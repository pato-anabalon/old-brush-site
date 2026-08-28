<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Old Brush · Agent rules

Concise rules for anyone (human or AI) editing this repository. Read before touching code.

## Architecture

- Next.js 16 App Router. Server Components by default; client islands only when necessary (state, event handlers, browser APIs).
- Atomic Design in `src/components/{atoms,molecules,organisms,templates}`.
- All commercial copy lives in `src/lib/content.ts`. Do not inline copy inside components.
- All metadata/JSON-LD lives in `src/lib/seo.ts`. Route pages export `metadata` from those helpers.
- Environment variables validated via `src/lib/env.ts` (zod). Capabilities exposed as booleans on `capabilities`.
- Aliases: `@/components/*`, `@/lib/*`, `@/app/*`.

## Conventions

- **Package manager: npm.** Not pnpm, not yarn, not bun.
- **Language: en-NZ** for anything user-visible. Comments and docs may be English.
- **File names:** `PascalCase.tsx` for components, `camelCase.ts` for libs.
- **Naming:** Use Old-Brush-flavoured names for organisms (`HeroBrush`, `ProcessTimeline`) and animation helpers (`brushRevealOnce`, `plasterScrub`).
- **No emojis in UI.** Icons via Lucide or inline SVG.
- **No `runtime = 'edge'`.** Stay on Node (Fluid Compute).
- **Never mock external services silently.** Missing credentials → visible degradation.

## Verification commands

Run before every commit:

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run dev` for interactive verification at 375 / 768 / 1024 / 1440 px. Test:

- No horizontal scroll at any breakpoint.
- Header transitions from transparent → solid on scroll.
- Mobile drawer opens, traps focus, closes on ESC and on link click.
- Preloader plays on first visit, skips on second visit (sessionStorage) and under `prefers-reduced-motion: reduce`.
- All `data-testid` selectors remain stable (see `OLD_BRUSH_PROJECT_CONTEXT.md §10`).

## Commercial rules (do NOT break)

- **No invented social proof.** No testimonials, reviews, client logos, awards, metrics or case studies without verifiable evidence.
- **`#clients` stays latent** until real evidence lands.
- **No public pricing / plans.** Quote-based only.
- **Contact info is canonical** (see `content.ts` `brand.contact`). Do not swap in placeholders.

## Content rules

- Imagery `alt` text:
  - Brand-authentic photos of Old Brush people/tools → honest descriptive alt.
  - Stock or AI-generated interiors → alt suffix "*reference imagery*".
- Copy tone: confident, calm, refined, authentic. No exaggerated claims. No emoji.

## SEO rules

- One `<h1>` per route (the hero for `/`, the SectionHeading `as="h1"` on inner pages).
- Canonical set explicitly per route via `alternates.canonical`.
- Never populate `aggregateRating`, `review` or `award` fields.
- `sitemap.ts` must reflect every publicly indexed route.

## Animation rules

- One of the four categories per helper (`brushRevealOnce`, `plasterScrub`, `hoverBrushGlow`, `preloaderTimeline`). Never mix.
- All animations honour `prefers-reduced-motion: reduce` — the static end state is always the source of truth.
- `once` timelines never re-fire on re-scroll. `scrub` timelines never convert to autoplay.
- Client components only when necessary — an entry animation should not force an entire organism to become a client component.

## Scope discipline

For every task:

1. State what will change, what stays, what is out of scope, and how to verify.
2. Do not bundle unrelated refactors into a scoped task. Log them as recommendations instead.
3. Do not modify hovers, animations, copy, routes, selectors or metadata that are out of scope.
4. Prefer editing existing files. Never create files "for future flexibility" that aren't used today.

## Priorities on conflict

In order:

1. Honesty and evidence
2. Client comprehension
3. Commercial strategy
4. Conversion
5. Accessibility
6. Performance
7. Consistency
8. Visual sophistication
9. Animation complexity
