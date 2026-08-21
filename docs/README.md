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
| `/[locale]/cripto-exchanges` | Redirect → uruguay (o internacional si `?region=row`) |
| `/[locale]/cripto-exchanges/internacional` | Cripto Exchanges — Internacional |
| `/[locale]/cripto-exchanges/uruguay` | Cripto Exchanges — Uruguay |
| `/[locale]/nosotros` | Nosotros |
| `/[locale]/como-funciona` | Cómo funciona |
| `/[locale]/contacto` | Contacto |
| `/[locale]/ejemplo` | Ejemplo de reporte (fuera del nav principal) |

Redirect legacy: `/para-psav` → `/cripto-exchanges/uruguay` (también con locale).

### Nav / shell

- Header: logo + menú (Inicio, Análisis, Para quienes, Nosotros, Hablemos) + selector de idioma.
- Para quienes (dropdown): `/cripto-exchanges/internacional` y `/cripto-exchanges/uruguay`.
- Footer: logo + link a contacto; sin menú completo ni disclaimer PSAV/KYC/UIAF en el pie.

## Catálogo (tiers)

Fuente en código: `src/lib/serviceTiers.ts` + página `/analisis`. Copy comercial alineado a la bóveda (`Catálogo de servicios` / ADR `2026-08-18`).

- SKU = análisis **Básica / Estándar / Experta** (EN: Basic / Standard / Expert; PT: Básica / Standard / Expert). IDs internos `lite` / `standard` / `expert`.
- Origins / Activity / Multichain / Portfolio = **partes** del informe (no SKUs sueltos).
- Las **cuatro partes entran en las tres profundidades**; lo que escala es la cobertura (redes, ventana de Activity, hops / tope de txs en Origins).
- Redes / Activity / Origins (orden de magnitud comercial): Top 2·5·10; ventanas 15 / 45 / 90; hops 0 / 1 / 2; tope txs Origins 100 / 250 / 500.
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
| `SUPABASE_URL` | Proyecto Supabase Walpulse |
| `SUPABASE_SERVICE_ROLE_KEY` | Insert vía RPC (nunca en cliente) |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / OG (default `https://www.walpulse.com`) |

Plantilla: [`.env.local.example`](../.env.local.example). En Vercel setear las tres.

Canales públicos: Telegram, `hello@walpulse.com`, X — ver `src/lib/paths.ts`.

## SEO y discoverability

| Pieza | Ubicación |
|-------|-----------|
| Helper metadata (canonical, hreflang, OG, Twitter) | `src/lib/seo.ts` — canónico default `https://www.walpulse.com` |
| Paths indexables | `INDEXABLE_PATHS` en `seo.ts` (home, analisis, exchanges split, nosotros, como-funciona, contacto, ejemplo) |
| Sitemap | `/sitemap.xml` ← `src/app/sitemap.ts` |
| Robots | `/robots.txt` ← `src/app/robots.ts` |
| JSON-LD Organization + WebSite | `src/components/seo/JsonLd.tsx` (`sameAs`: X, Telegram, LinkedIn fundador) |
| Home crawlable (SSR + ItemList señales) | `src/components/seo/HomeCrawlContent.tsx` (copy de motores vía `signalCerts.ts`) |
| Agentes de IA | `public/llms.txt` → `/llms.txt` |
| OG image | `/og.png` |
| Meta copy i18n | `src/messages/{es,en,pt}.json` → `meta.*` |

`NEXT_PUBLIC_SITE_URL` en Vercel debe ser `https://www.walpulse.com`.

Tras deploy: verificar que prod sirva sitemap con `/analisis` y un `llms.txt` alineado al catálogo (prod puede ir atrás del repo).

### Favicon / iconos

Convenciones App Router (reemplazan el favicon default de Next):

- `src/app/favicon.ico`
- `src/app/icon.png`
- `src/app/apple-icon.png`

Fuente de marca: `public/brand/logo/Favicon.png` y `App-Icon.png`.

## UX relevante

- Home: experiencia sticky 5 niveles (`src/components/wallet-reveal/`); dots sin `scrollIntoView` de página (usa `window.scrollTo` sobre el contenedor).
- Carrusel de módulos del reporte (`SignalModulesCarousel`): scroll del tablist sin `scrollIntoView` de página (evita clip horizontal en mobile).
- Análisis / Exchanges / Nosotros: `page-hero` + ritmo Void / Surface / CTA (ver arriba).
- Cripto-exchanges: páginas `/internacional` y `/uruguay` (sin picker); mapa en mobile = cards, desktop = tabla.
- Nombres de módulos localizados: `src/lib/signalModules.ts`.
- Motores de señal (listas «qué analiza»): `src/lib/signalCerts.ts` (fuente live; no depender solo de `messages` para catálogos grandes).

## Fuente de verdad

- Bóveda: `01 - Producto/Website/`
- Identidad visual: `01 - Producto/Identidad Visual.md`
- ADR v1 multi-page: `08 - Decisiones/2026-08-09 - Website v1 multi-page segun vault.md`
- ADR operativa / SEO / contacto: `08 - Decisiones/2026-08-10 - Website v1 operativa SEO contacto y discoverability.md`
- ADR Home reveal (dirección): `08 - Decisiones/2026-08-13 - Home experiencia progressive wallet reveal.md`
- ADR v1.5 implementación: `08 - Decisiones/2026-08-14 - Website v1.5 Home reveal SVG exchanges split SEO.md`
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
- `exchanges/` — heroes Uruguay / Internacional
- `nosotros/` — hero Nosotros

Sincronizados desde la bóveda `01 - Producto/Assets/` cuando aplica.
