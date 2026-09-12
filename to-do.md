# Old Brush · TO-DO

_Última actualización: 2026-09-12_

## Estado actual

| Fase | Estado |
|---|---|
| **Fase 0** · Alineación | ✅ Cerrada 2026-08-28 · 12 preguntas resueltas |
| **Fase 1** · Fundación | ✅ Cerrada 2026-08-28 · Scaffolding + tokens + layout + Header/Footer/Preloader + docs |
| **Fase 2** · Secciones | ✅ Cerrada 2026-08-31 · Hero + Services + Process + Gallery + About + Contact banner |
| **Fase 3** · Integrations | 🚧 En curso · Quote flow (UI) cerrado 2026-09-12 · falta backend |
| **Fase 4** · QA & Docs | ⏳ Pendiente |

Últimos fixes tras Fase 2 (todos aplicados):
- Preloader con logo real + barra de carga real (assets críticos preloadeados)
- Coordinación Preloader↔Hero por `CustomEvent 'ob:hero-reveal'` (hero espera el evento en vez de usar delay fijo)
- H2s en secciones green corregidas (envolví `h1-h4` en `@layer base` para que utilities de Tailwind ganen)
- Footer sin `mt-24` (ya no queda gap paper entre Contact banner y Footer)
- Logo transparente en Hero + Footer usando `/brand/logo-transparent.png` y `/brand/logo-white-transparent.png`
- Ciclo de imágenes en Hero cada 5s con crossfade real (dos capas overlaidas)
- Favicon en `/brand/favicon.png` cableado en `seo.ts`
- Hamburger flotante mobile fuera del header (backdrop-blur creaba containing block)
- `translate="no"` en `<html>` + meta google notranslate (fix hydration mismatch mobile por Chrome auto-translate)
- `credit` de Nodo en Footer + drawer mobile (link a nodo.co.nz con 💜)

---

## 🎨 Afinamiento visual sección por sección

Antes de arrancar Fase 3. Retomar en el orden que quieras. Cada sección quedó funcional pero con ajustes por pulir:

- [ ] **Hero** — revisar composición diamonds a distintos viewports, spacing texto/imagen, animación de entrada
- [ ] **Services** — grid de 5 cards, hover, jerarquía tipográfica
- [ ] **Process** — timeline horizontal / vertical, rail, círculos numerados
- [ ] **Gallery** — bento asimétrico, aspect ratios, mobile stacking
- [ ] **About** — split copy+image + banda de core values
- [ ] **Contact banner** — CTA centrado, contactos inline

---

## 🔌 Fase 3 · Integrations

### Formulario y API

- [x] **Quote flow conversacional (UI)** — modal tipo Typeform, cerrado 2026-09-12. Los 5 CTA la levantan; los 9 campos de Fase 0 repartidos en 7 pasos + intro + review + result. Draft en `sessionStorage.ob_quote_draft`. Detalle en `OLD_BRUSH_PROJECT_CONTEXT.md §12`.
- [x] **`/contact` real** — email, teléfono, horario y área de servicio, más el CTA que abre la modal. Es el fallback sin JS.
#### 🎯 Próximo: conectar el quote flow con Resend

Es lo único que falta para que la modal capture leads de verdad. Hoy termina en un `mailto:` prellenado y dice explícitamente que no envió nada.

**Bloqueante:** provisionar Resend y cargar `RESEND_API_KEY` + `RESEND_FROM` + `RESEND_TO_INTERNAL`. Preferir el Marketplace de Vercel (`vercel integration`) antes que la cuenta suelta, para que las env vars queden sincronizadas en los tres entornos. `RESEND_FROM` necesita un dominio verificado en Resend — con `oldbrush.co.nz` todavía sin apuntar a Vercel, arrancar con el dominio de prueba de Resend o verificar el DNS primero.

Pasos:

- [ ] `npm i resend`
- [ ] `POST /api/contact` (`src/app/api/contact/route.ts`, runtime Node — **nunca** `edge`):
  - [ ] Validar el body con `quoteSchema` de `src/lib/quote.ts` — ya está escrito para reusarse tal cual, no duplicar el schema
  - [ ] Si `capabilities.emailNotifications` es `false` → responder `{ status: 'not-configured' }` y loguear el lead en el servidor. **Nunca** devolver éxito sin haber enviado (regla de `AGENTS.md`)
  - [ ] Email interno a `RESEND_TO_INTERNAL` con las 9 respuestas; `replyTo` al email del cliente, así responder es un solo clic
  - [ ] Auto-reply al cliente confirmando recepción dentro de un día hábil (mismo compromiso que ya promete la copy en `content.ts`)
  - [ ] Honeypot o verificación mínima antes de gastar cuota de Resend
- [ ] Reemplazar el cuerpo de `submitQuote()` en `src/lib/quote.ts` por el `fetch('/api/contact')`. **Es el único cambio del lado cliente** — `QuoteResult` ya sabe renderizar `sent` / `not-configured` / `error`, y la copy de los tres estados ya existe en `quoteFlow.result`
- [ ] Al obtener `sent`, limpiar `sessionStorage.ob_quote_draft` (el handler ya lo hace; verificar de punta a punta)
- [ ] Probar los tres caminos: con credenciales, sin credenciales (borrar la env var → tiene que aparecer el fallback honesto), y con Resend devolviendo error
- [ ] Decidir si al enviar bien se redirige a `/thank-you` o se muestra el resultado dentro de la modal. La ruta ya existe, está `noindex` y `robots.ts` la excluye

Queda para después de esto, no bloquea el envío por email:

- [ ] `POST /api/upload` — Vercel Blob, valida tipos (`image/jpeg`, `image/png`, `image/heic`, `image/webp`, `application/pdf`). Hasta que exista, los adjuntos viven sólo en memoria del cliente y el result screen avisa que hay que adjuntarlos a mano
- [ ] Rate-limit + idempotencia con Upstash antes de exponer el endpoint en producción
- [ ] Trello / Telegram opcionales

### Integraciones (con degradación visible cuando falte credencial)
- [ ] **Vercel Blob** para adjuntos (`BLOB_READ_WRITE_TOKEN`) — el paso 6 de la modal ya recoge y valida los archivos en el cliente (≤5, ≤20 MB, MIME de Fase 0); quedan en memoria hasta que exista `POST /api/upload`
- [ ] **Upstash Redis** para rate-limit + idempotencia (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
- [ ] **Resend** para email interno + auto-reply (`RESEND_API_KEY` + `RESEND_FROM` + `RESEND_TO_INTERNAL`)
- [ ] **Trello** para lead card opcional (`TRELLO_KEY` + `TRELLO_TOKEN` + `TRELLO_LIST_ID`)
- [ ] **Telegram** para alerta interna opcional (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`)

Ya están validadas por zod en `src/lib/env.ts` con `capabilities` exportadas — el código de v1 debe respetar el patrón.

### Tracking analítico custom
- [ ] Wrapper `<TrackedCTA>` reutilizable (Vercel Analytics `track()`)
- [ ] Eventos: `cta_hero_quote`, `cta_service_card` (con `service`), `cta_process_start`, `cta_contact_banner`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`
  - `QuoteCta` / `QuoteCtaLink` ya emiten `data-quote-source` (`hero`, `header`, `header-drawer`, `contact-banner`, `service-card`, `contact-page`) y reciben la prop `source` — el wrapper de tracking sólo tiene que consumirla
- [ ] Sin GA4 ni Meta pixel en v1 (Fase 0 decisión 12). Sin banner de consentimiento — solo aviso pasivo en Footer + `/privacy`

### Structured data · ampliación
- [ ] `BreadcrumbList` en rutas hijas cuando existan (helper ya está en `seo.ts`)
- [ ] `Service` schema promovido a entradas individuales (hoy solo es `makesOffer` dentro de `HomeAndConstructionBusiness`)

---

### Pendiente de verificar en navegador (quote flow)

Compilan `typecheck` / `lint` / `build`, pero el flujo interactivo todavía no se probó a mano:

- [ ] Los 5 CTA abren la modal; desde una ServiceCard el paso 2 llega con ese servicio tildado
- [ ] Teclado: Enter avanza · Cmd/Ctrl+Enter en el textarea · A–E seleccionan · single choice auto-avanza
- [ ] Paso 3: el autocompletar de suburbs filtra, ↑/↓ + Enter elige, Escape cierra la lista sin cerrar la modal, y un suburb fuera de lista se acepta igual
- [ ] Focus trap, foco devuelto al CTA al cerrar, `#ob-app` inerte con la modal abierta
- [ ] ESC cierra y al reabrir retoma el borrador; refrescar también
- [ ] Paso 6: skip, >5 archivos y >20 MB muestran error
- [ ] `prefers-reduced-motion: reduce` — los pasos cambian sin deslizamiento
- [ ] 375 / 768 / 1024 / 1440 px sin scroll horizontal; en mobile la botonera no queda tapada por el teclado

---

## 🔍 Fase 4 · QA & Documentation

- [ ] Audit visual en **375 / 768 / 1024 / 1440 px** — verificar sin horizontal overflow, jerarquías coherentes
- [ ] Audit **keyboard navigation** — tab order, focus rings, drawer focus-trap, skip-to-content
- [ ] Audit **prefers-reduced-motion** — Hero, BrushTracing, Preloader, ScrollReveal, cycle de imágenes
- [ ] Lighthouse / Core Web Vitals
- [ ] SEO audit end-to-end (metadata por ruta, canonical, OG image real, sitemap, robots, JSON-LD)
- [ ] Sync final de docs:
  - `README.md`
  - `SEO_WORKLOG.md`
  - `OLD_BRUSH_PROJECT_CONTEXT.md`
  - `AGENTS.md`
- [ ] Verificación completa per checklist de AGENTS.md antes de commit final

---

## 🔑 Bloqueado por vos (credenciales / assets externos)

- [ ] Provisionar **Vercel Blob** en el dashboard/Marketplace → agregar `BLOB_READ_WRITE_TOKEN`
- [ ] Provisionar **Upstash Redis** vía Vercel Marketplace → agregar URL + token
- [ ] Provisionar **Resend** vía Vercel Marketplace → agregar API key + FROM + TO_INTERNAL. **Es lo que destraba el próximo paso** (ver "conectar el quote flow con Resend" en Fase 3). `RESEND_FROM` pide dominio verificado.
- [ ] Opcional: **Trello** key/token/list-id
- [ ] Opcional: **Telegram** bot token/chat-id
- [ ] **Google Business Profile** — crear/reclamar, verificar dominio, subir 3–5 fotos reales
- [ ] **Verificar dominio en Google Search Console** una vez que el DNS apunte a Vercel
- [ ] **Fotografías reales de proyectos** con consentimiento escrito de clientes → destraba:
  - Reemplazar "reference imagery" en Services/About/Gallery
  - Activar sección `#clients` (hoy latente por regla estricta de "no invented evidence")
- [ ] **DNS de `oldbrush.co.nz`** apuntando a Vercel
- [ ] **Primera deploy** a Vercel (production)

---

## 📋 Backlog SEO (post-Fase 4)

- [ ] Landing pages por servicio + suburb (SEO push):
  - `/services/interior-painting` · `/services/plaster-level-5` · `/services/plaster-level-4` · `/services/surface-preparation` · `/services/renovations-new-builds`
  - Combinar con suburbios: Ponsonby · Grey Lynn · Remuera · Herne Bay · Mount Eden · Devonport
- [ ] Bio del owner (Cristian) en About cuando esté confirmado
- [ ] Contenido de FAQ real → destraba `FAQPage` schema
- [ ] `sameAs` en JSON-LD cuando existan handles sociales (Instagram, Facebook, Google Business Profile URL)
- [ ] Preload hints de fuentes si LCP se degrada tras real photography

---

## 🚀 Cómo retomar tras el restart

```bash
cd /Users/patricioanabalon/Workspace/nodo/old-brush-site
npm run dev
```

- Dev server en `http://localhost:3000`
- Para simular primera visita del preloader: DevTools → Application → Session Storage → borrar `ob_seen`
- Para probar mobile: DevTools → Toggle device toolbar (Cmd+Shift+M)
- Comandos de verificación antes de cualquier commit:
  ```
  npm run typecheck
  npm run lint
  npm run build
  ```

## Estado git

- Branch: `main`
- Última confirmación de estructura mayor: **Fase 2 completa** (Services, Process, Gallery, About, Contact banner)
- Muchos ajustes posteriores sin commit (revisar `git status`) — dejo la política tuya intacta: **vos commiteás**.

## Contexto útil

- **Contact canónico:** `cristian@oldbrush.co.nz` · `+64 22 370 7127`
- **Dominio productivo:** `https://www.oldbrush.co.nz`
- **Stack:** Next.js 16 App Router + React 19 + TS strict + Tailwind v4 + GSAP + Lucide + Vercel Analytics
- **Package manager:** npm (nunca pnpm/yarn/bun para este proyecto)
- **Core values canónicos:** Craftsmanship · Integrity · Trust · Timeless Quality
- **5 servicios:** Surface Preparation · Plaster L4 · Plaster L5 · Interior Painting · Renovations & New Builds
- **Regla dura:** nunca inventar social proof (testimonios, reviews, logos, métricas, casos de estudio)

## Cuando volvamos, recomiendo este orden

1. **Afinamiento visual** sección por sección (mientras el look-and-feel está fresco).
2. **Fase 3** — el quote flow (UI) ya está. Lo que sigue es **conectarlo con Resend** para que los leads lleguen de verdad; Blob y Upstash pueden esperar.
3. **Fase 4** — deploy a Vercel + validación end-to-end en el dominio real.
