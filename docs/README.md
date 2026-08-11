# Walpulse Webpage — docs técnicas

Sitio web de producto de Walpulse. Copy y decisiones de producto viven en la bóveda Obsidian; este repo versiona implementación.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- `next-intl` — idiomas `es` (default), `pt`, `en` (`localePrefix: "always"`)
- Hero: Three.js + `@react-three/fiber` + `@react-three/drei`
- Formulario de contacto → Supabase (`@supabase/supabase-js`, solo server)

## Rutas

Prefijo de locale obligatorio (`/es`, `/pt`, `/en`):

| Ruta | Sección |
|------|---------|
| `/[locale]` | Home (incluye ancla `#senales`) |
| `/[locale]/senales` | Redirect permanente → `/[locale]#senales` |
| `/[locale]/cripto-exchanges` | Cripto Exchanges (UY PSAV / resto del mundo) |
| `/[locale]/nosotros` | Nosotros |
| `/[locale]/como-funciona` | Cómo funciona |
| `/[locale]/contacto` | Contacto |
| `/[locale]/ejemplo` | Ejemplo de reporte (fuera del nav principal) |

Redirect legacy: `/para-psav` → `/cripto-exchanges` (también con locale).

### Nav / shell

- Header: logo + selector de idioma (sin menú de secciones).
- Footer: logo + contacto; sin menú de navegación ni disclaimer PSAV/KYC/UIAF en el pie.

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
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / OG (default `https://walpulse.com`) |

Plantilla: [`.env.local.example`](../.env.local.example). En Vercel setear las tres.

Canales públicos: Telegram, `hello@walpulse.com`, X — ver `src/lib/paths.ts`.

## SEO y discoverability

| Pieza | Ubicación |
|-------|-----------|
| Helper metadata (canonical, hreflang, OG, Twitter) | `src/lib/seo.ts` |
| Sitemap | `/sitemap.xml` ← `src/app/sitemap.ts` |
| Robots | `/robots.txt` ← `src/app/robots.ts` |
| JSON-LD Organization + WebSite | `src/components/seo/JsonLd.tsx` |
| Agentes de IA | `/llms.txt` |
| OG image | `/og.png` |
| Meta copy i18n | `src/messages/{es,en,pt}.json` → `meta.*` |

### Favicon / iconos

Convenciones App Router (reemplazan el favicon default de Next):

- `src/app/favicon.ico`
- `src/app/icon.png`
- `src/app/apple-icon.png`

Fuente de marca: `public/brand/logo/Favicon.png` y `App-Icon.png`.

## UX relevante (v1)

- Carrusel de módulos del reporte (`SignalModulesCarousel`): scroll del tablist sin `scrollIntoView` de página (evita clip horizontal en mobile).
- Cripto-exchanges: cards apiladas en mobile, tabla desde `md`; región UY/ROW en `sessionStorage` vía `useSyncExternalStore`.
- Nombres de módulos localizados: `src/lib/signalModules.ts`.

## Fuente de verdad

- Bóveda: `01 - Producto/Website/`
- Identidad visual: `01 - Producto/Identidad Visual.md`
- ADR v1 multi-page: `08 - Decisiones/2026-08-09 - Website v1 multi-page segun vault.md`
- ADR operativa / SEO / contacto: `08 - Decisiones/2026-08-10 - Website v1 operativa SEO contacto y discoverability.md`
- i18n: `08 - Decisiones/2026-08-09 - Website i18n tres idiomas.md`
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

Brand en `public/brand/` (logo + iconos), sincronizados desde la bóveda `01 - Producto/Assets/`.
