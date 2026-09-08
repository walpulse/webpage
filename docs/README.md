# Walpulse Webpage — docs técnicas

Sitio web de producto de Walpulse. Copy y decisiones de producto viven en la bóveda Obsidian; este repo versiona implementación.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- `next-intl` — idiomas `es` (default), `pt`, `en` (`localePrefix: "always"`)
- Home reveal: visual SVG por nivel en el panel izquierdo (ver [home-wallet-reveal.md](./home-wallet-reveal.md)); el hero sigue con Three.js / R3F
- Formulario de contacto → Supabase (`@supabase/supabase-js`, solo server)

## Rutas

Prefijo de locale obligatorio (`/es`, `/pt`, `/en`):

| Ruta | Sección |
|------|---------|
| `/[locale]` | Home — experiencia progressive wallet reveal (`#senales`) |
| `/[locale]/senales` | Redirect permanente → `/[locale]#senales` |
| `/[locale]/analisis` | Catálogo comercial Básica / Estándar / Experta |
| `/[locale]/walpulse-engine-risk` | Motor de Riesgos — puntuación parametrizable por el cliente (próximamente; marketing) |
| `/[locale]/demo` | Demo live de análisis (Básica sync; Estándar/Experta async + poll) |
| `/[locale]/proveedores-de-datos` | Proveedores de datos (logos + links + roles) |
| `/[locale]/cripto-exchanges` | Redirect → uruguay (o internacional si `?region=row`) |
| `/[locale]/cripto-exchanges/internacional` | Cripto Exchanges — Internacional |
| `/[locale]/cripto-exchanges/uruguay` | Cripto Exchanges — Uruguay |
| `/[locale]/nosotros` | Nosotros |
| `/[locale]/como-funciona` | Cómo funciona |
| `/[locale]/contacto` | Contacto |
| `/[locale]/ejemplo` | Ejemplo de reporte (fuera del nav principal) |

Redirect legacy: `/para-psav` → `/cripto-exchanges/uruguay` (también con locale).

### Nav / shell

- Header: logo + menú (Inicio, Análisis, **Motor de Riesgos** / Risk Engine / Motor de Riscos, **Demo**, **Proveedores**, Para quienes, Nosotros, Hablemos) + selector de idioma.
- Para quienes (dropdown): `/cripto-exchanges/uruguay` y `/cripto-exchanges/internacional` (orden: Uruguay primero).
- Footer: logo + link a contacto; sin menú completo ni disclaimer PSAV/KYC/UIAF en el pie.

## Catálogo (tiers)

Fuente en código: `src/lib/serviceTiers.ts` + página `/analisis`. Copy comercial alineado a la bóveda (`Catálogo de servicios` / ADR `2026-08-18`).

- SKU = análisis **Básica / Estándar / Experta** (EN: Basic / Standard / Expert; PT: Básica / Standard / Expert). IDs internos `lite` / `standard` / `expert`.
- Origins / Activity / Multichain / Portfolio = **partes** del informe (no SKUs sueltos).
- Orígenes / Activity / Multichain entran en las tres profundidades; **Portfolio solo en Estándar y Experta**. Lo que escala es la cobertura (redes, ventana de Activity, screening de fondeadores / tope de txs en Origins).
- Redes / Activity / Origins (orden de magnitud comercial): Top 2·5·10; ventanas 15 / 45 / 90; tope txs Origins 100 / 250 / 500.
- Hops = screening **`funder_risk`** (no un segundo Origins): Básica sin hops; Estándar hop-1 top 2 fondeadores; Experta top 5 + hop-2 solo si hop-1 es wallet normal. Copy: `serviceTiers.ts`, `analisisSignalSlides.ts`, `signalCerts.ts`, Home reveal.
- Síntesis A–F secundaria, atada al tier.
- Copy público: uso + partes + cobertura. Sin precios, SLA, providers ni pesos de síntesis.
- Naming en UI / meta / `llms.txt`: no usar «Lite» en copy público (reservado a IDs internos).

## Shell de páginas interiores (hero + bandas)

Patrón compartido (CSS en `src/app/globals.css`):

| Pieza | Clase | Uso |
|-------|--------|-----|
| Hero | `.page-hero` (+ `__visual` / `__scrim` / `__content` / `__copy`) | Imagen 16:9 a la derecha, h1 + blockquote a la izquierda |
| Fondo Void | `.section-band-void` | Alternancia de secciones |
| Fondo Surface | `.section-band-surface` | Alternancia de secciones |
| Cierre CTA | `.section-band-cta` | Título centrado + `Hablar con el equipo` → `/contacto` |

Páginas con el patrón:

| Página | Hero image | Componente / ruta |
|--------|------------|-------------------|
| `/analisis` | `/brand/analisis/header-rectangular.png` | `AnalisisCatalog` |
| `/walpulse-engine-risk` | `/brand/engine-risk/header-engine-risk.png` | `EngineRiskPage` |
| `/demo` | `/brand/demo/header-demo.png` | `src/app/[locale]/demo/page.tsx` |
| `/proveedores-de-datos` | `/brand/providers/header-proveedores.png` | `DataProvidersPage` |
| `/cripto-exchanges/uruguay` | `/brand/exchanges/header-uruguay.png` | `CriptoExchangesContent` (`region=uy`) |
| `/cripto-exchanges/internacional` | `/brand/exchanges/header-internacional.png` | `CriptoExchangesContent` (`region=row`) |
| `/nosotros` | `/brand/nosotros/header-nosotros.png` | `src/app/[locale]/nosotros/page.tsx` |

Imágenes de hero: 16:9, **sin texto** embebido (el copy va en HTML).

## Home (wallet reveal)

Ver [home-wallet-reveal.md](./home-wallet-reveal.md). Split sticky: copy + visual SVG a la izquierda, detalle HTML a la derecha. Cinco niveles scroll-driven (producto → Multichain → Portfolio → Origins → Activity) como capas de **un** análisis. Footer izquierdo: principio rector + CTAs `/contacto` y `/analisis`. Crawl/SEO: `HomeCrawlContent` SSR + `/llms.txt`.

## Contacto (API)

- UI: `src/components/contact/ContactForm.tsx`
- Endpoint: `POST /api/contacto` (`src/app/api/contacto/route.ts`)
- El proxy `next-intl` **excluye** `api` (`src/proxy.ts`) para no reescribir a `/es/api/...`
- Persistencia: RPC `public.submit_pagina_web_contacto` → tabla `internal.pagina_web_contactos` (schema no expuesto a PostgREST; RLS sin policies públicas)
- Cliente admin: `src/lib/supabase/admin.ts` (solo `service_role`)

Env (server-only + public):

| Variable | Uso |
|----------|-----|
| `SUPABASE_URL` | Proyecto Supabase Walpulse (`https://api.walpulse.com`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Insert vía RPC (nunca en cliente) |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / OG (default `https://www.walpulse.com`) |
| `WALPULSE_DEMO_API_KEY` | API key del cliente **Demo User** (label `website-demo`; nunca `NEXT_PUBLIC_`) |
| `WALPULSE_DEMO_CLIENTE_ID` | UUID de `walpulse.clientes` Demo User — scope del poll |
| `UPSTASH_REDIS_REST_URL` | Rate limit demo (Upstash Redis REST) |
| `UPSTASH_REDIS_REST_TOKEN` | Token Upstash (server-only) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (widget) |
| `TURNSTILE_SECRET_KEY` | Turnstile secret (server-only verify) |

Plantilla: [`.env.local.example`](../.env.local.example). En Vercel setear demo keys + Upstash + Turnstile.

Canales públicos: Telegram, `hello@walpulse.com`, X — ver `src/lib/paths.ts`.

## Demo de análisis (API)

- UI: `src/components/demo/DemoAnalisisForm.tsx` · ruta `/[locale]/demo`
- Submit: `POST /api/demo-analisis` → Edge Functions `analisis-basica` (sync) / `analisis-estandar` / `analisis-experta` (202 + `request_id`); reenvía IP del visitante a la Edge (guard in-flight wallet+tier+IP; 409 `analisis_in_progress`)
- Poll: `GET /api/demo-analisis?request_id=` → RPC `get_analisis_request`, **filtrado** a `WALPULSE_DEMO_CLIENTE_ID`
- Helpers: `src/lib/demoAnalisis.ts` (subset público: grades + summaries + CIDs; sin evidencia)
- Abuse: rate limit por IP (Upstash: 5 POST / 15 min, 60 GET / min) + Cloudflare Turnstile en submit (`src/lib/demoRateLimit.ts`, `src/lib/turnstile.ts`, `DemoTurnstile`)
- `maxDuration` 120s en el route (Básica puede tardar ~1 min)
- Estándar/Experta: email + idioma obligatorios en UI; correo post-PDF vía worker (prioridad `request.email`)

## SEO y discoverability

| Pieza | Ubicación |
|-------|-----------|
| Helper metadata (canonical, hreflang, OG, Twitter) | `src/lib/seo.ts` — canónico default `https://www.walpulse.com` |
| Paths indexables | `INDEXABLE_PATHS` en `seo.ts` (home, analisis, **walpulse-engine-risk**, **demo**, **proveedores-de-datos**, exchanges split, nosotros, como-funciona, contacto, ejemplo) |
| Sitemap | `/sitemap.xml` ← `src/app/sitemap.ts` (prioridad 0.85 para analisis / **walpulse-engine-risk** / demo / proveedores) |
| Robots | `/robots.txt` ← `src/app/robots.ts` |
| JSON-LD Organization + WebSite | `src/components/seo/JsonLd.tsx` (`sameAs`: X, Telegram, LinkedIn fundador) |
| Home crawlable (SSR + ItemList señales) | `src/components/seo/HomeCrawlContent.tsx` (copy de motores vía `signalCerts.ts`) |
| Agentes de IA | `public/llms.txt` → `/llms.txt` (catálogo + key pages incl. **Motor de Riesgos**, demo y proveedores) |
| OG image | `/og.png` |
| Meta copy i18n | `src/messages/{es,en,pt}.json` → `meta.*` (incl. `engineRiskTitle` / `demoTitle` / `proveedoresTitle`) |

`NEXT_PUBLIC_SITE_URL` en Vercel debe ser `https://www.walpulse.com`.

Tras deploy: verificar que prod sirva sitemap con `/analisis`, `/walpulse-engine-risk`, `/demo`, `/proveedores-de-datos` y un `llms.txt` alineado al catálogo + Motor de Riesgos (prod puede ir atrás del repo).

### Favicon / iconos

Convenciones App Router (reemplazan el favicon default de Next):

- `src/app/favicon.ico`
- `src/app/icon.png`
- `src/app/apple-icon.png`

Fuente de marca: `public/brand/logo/Favicon.png` y `App-Icon.png`.

## UX relevante

- Home: experiencia sticky 5 niveles (`src/components/wallet-reveal/`); dots sin `scrollIntoView` de página (usa `window.scrollTo` sobre el contenedor); **swipe horizontal** mobile (`useHorizontalSwipe.ts`, `touch-action: pan-y`).
- «El proceso» (Home + `/como-funciona`): copy inline en `src/lib/processFlowSteps.ts` (evita catálogos stale de next-intl/Turbopack).
- Carrusel de módulos del reporte (`SignalModulesCarousel`): scroll del tablist sin `scrollIntoView` de página (evita clip horizontal en mobile).
- Análisis / Motor de Riesgos / Demo / Proveedores / Exchanges / Nosotros: `page-hero` + ritmo Void / Surface / CTA (ver arriba).
- Nosotros → **Equipo**: Jair + Carolina (`/jair.jpeg`, `/carolina.jpeg`); links en `TEAM_LINKS` (`paths.ts`).
- Cripto-exchanges: páginas `/internacional` y `/uruguay` (sin picker); mapa en mobile = cards, desktop = tabla.
- Nombres de módulos localizados: `src/lib/signalModules.ts`.
- Motores de señal (listas «qué analiza»): `src/lib/signalCerts.ts` (fuente live; no depender solo de `messages` para catálogos grandes).
- Motor de Riesgos (marketing): `src/lib/engineRiskPage.ts` + `EngineRiskPage.tsx`.

## Fuente de verdad

- Bóveda: `01 - Producto/Website/`
- Identidad visual: `01 - Producto/Identidad Visual.md`
- ADR v1 multi-page: `08 - Decisiones/2026-08-09 - Website v1 multi-page segun vault.md`
- ADR operativa / SEO / contacto: `08 - Decisiones/2026-08-10 - Website v1 operativa SEO contacto y discoverability.md`
- ADR Home reveal (dirección): `08 - Decisiones/2026-08-13 - Home experiencia progressive wallet reveal.md`
- ADR v1.5 implementación: `08 - Decisiones/2026-08-14 - Website v1.5 Home reveal SVG exchanges split SEO.md`
- ADR Proveedores + Demo abuse + SEO: `08 - Decisiones/2026-09-05 - Website Proveedores Demo abuse SEO.md`
- ADR Motor de Riesgos: `08 - Decisiones/2026-09-08 - Walpulse Engine Risk rules engine cliente.md`
- ADR hops funder_risk: `08 - Decisiones/2026-09-08 - Hops funder_risk screening.md`
- Home reveal (repo): [home-wallet-reveal.md](./home-wallet-reveal.md)
- Schema contactos: `01 - Producto/Base de Datos/Schema internal - pagina_web_contactos.md`

Copy fuente en español en la bóveda; traducciones PT/EN en `src/messages/`.

## Desarrollo

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Assets

Brand en `public/brand/`:

- `logo/` — marca e iconos
- `analisis/` — hero `/analisis`
- `engine-risk/` — hero `/walpulse-engine-risk` (`header-engine-risk.png`)
- `demo/` — hero `/demo`
- `providers/` — hero `/proveedores-de-datos` + logos de data providers
- `exchanges/` — heroes Uruguay / Internacional
- `nosotros/` — hero Nosotros

Fotos equipo en `public/`: `jair.jpeg`, `carolina.jpeg`.

Sincronizados desde la bóveda `01 - Producto/Assets/` cuando aplica.
