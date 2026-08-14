# Home — progressive wallet reveal

Experiencia del Home (ADR dirección `2026-08-13`; implementación viva `2026-08-14 - Website v1.5 Home reveal SVG exchanges split SEO`). Narrativa ilustrativa: no usa datos reales de wallets.

**Copy de producto:** el del sitio live (`src/lib/signalCerts.ts` / cards originales), no el del ADR. Origins = profundidad a **2 niveles** + orígenes de top contrapartes. Activity = ventana **90 días** (+ historial de contrapartes / exposición a sanciones como *señal*, no screening oficial).

## Layout split

Sticky `calc(100svh - header)` en grid desktop **~60 / 40** (`1.5fr / 1fr`).

| Panel | Contenido |
|-------|-----------|
| **Izquierda** | Visual SVG por nivel (`pointer-events: none`) + copy corto (sin kicker en niveles 0–4) + dots + CTA `/contacto`. |
| **Derecha** | Panel glass sutil. Nivel 0 = Qué es Walpulse + explicabilidad (imagen con modal) + El proceso (`ProcessFlow`). Niveles 1–4 = «Qué analizamos» + lista + teaser del módulo Walcert con modal. |

Mobile: columna (etapas arriba, detalle abajo).

`id="senales"` conserva `/#senales` y el redirect `/senales`.

## Scroll

- Contenedor `500vh` (`src/components/wallet-reveal/`).
- `scrollY` → progress `0–1` → `level` `0 | 1 | 2 | 3 | 4`.
- Dots saltan al tramo.

## Nivel → detalle

| Nivel | Izquierda (corto) | Derecha |
|------:|-------------------|---------|
| 0 | Señales on-chain para wallets | Intro + explicabilidad + modal caja negra + El proceso |
| 1 | Origen de los fondos | Lista `analyzes` + teaser/modal Origins |
| 2 | Actividad reciente (90 días) | Lista + teaser/modal Activity |
| 3 | Presencia multi-cadena | Lista + teaser/modal Multichain |
| 4 | Calidad del portafolio | Lista + teaser/modal Portfolio |

Fuente de listas: `certsByLocale` en `src/lib/signalCerts.ts`. Fuente de teasers/modales: módulos del JSON de ejemplo vía `RevealModuleExample`.

Copy corto i18n: `reveal.*` en `src/messages/{es,en,pt}.json`. Acento visual: **Primary Sky**.

## Visual izquierdo (por nivel)

SVG ligero en `WalletRevealVisual.tsx` (sin WebGL en el reveal). Fondo Void siempre visible en el stage (evita flash blanco). Paleta Void / Surface / Primary Sky.

Layout del panel izquierdo: **copy tipográfico ampliado a la izquierda**; composición SVG **anclada a la derecha** del mismo panel.

| Nivel | Composición |
|------:|-------------|
| 0 | Wallet + 4 nodos = señales (Origen / Actividad / Presencia / Portafolio) con pulse |
| 1 | Grafo Origins 2 hops con **flujos entrantes** hacia la wallet |
| 2 | Contrapartes + flujos IN/OUT + label 90 días |
| 3 | Wallet + badges PNG de `public/brand/chains/` (ETH, Base, Celo, Arbitrum, Polygon, BNB) |
| 4 | Wallet + barras de composición / grade |

`prefers-reduced-motion`: sin SMIL; solo crossfade de capas.

## Nav y exchanges

Header: Inicio · Para quienes · Nosotros · Hablemos · idioma.

Dropdown:

- Cripto-Exchanges - Internacional → `/cripto-exchanges/internacional`
- Cripto-Exchanges - Uruguay → `/cripto-exchanges/uruguay`

Dos páginas aparte (sin selector de región en página). `/cripto-exchanges?region=` y `/para-psav` redirigen.

## SEO / crawl del Home

El reveal es client-side. Complemento SSR en `src/components/seo/HomeCrawlContent.tsx` (`sr-only` + `<noscript>` + JSON-LD `ItemList` de señales). Ver también `/llms.txt` y `docs/README.md` → SEO.
