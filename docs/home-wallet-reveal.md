# Home — progressive wallet reveal

Experiencia del Home (ADR dirección `2026-08-13`; implementación viva `2026-08-14 - Website v1.5 Home reveal SVG exchanges split SEO`). Narrativa ilustrativa: no usa datos reales de wallets.

**Copy de producto:** alineado al Catálogo Básica / Estándar / Experta (`src/lib/serviceTiers.ts`, `/analisis`). El Home muestra las capas de **un** análisis; la profundidad (hops, ventana, redes Multichain) depende del tier. Las listas `analyzes` en `src/lib/signalCerts.ts` describen el motor; los teasers no afirman Experta como default.

## Layout split

Sticky `calc(100svh - header)` en grid desktop **~60 / 40** (`1.5fr / 1fr`).

| Panel | Contenido |
|-------|-----------|
| **Izquierda** | Visual SVG por nivel (`pointer-events: none`) + copy corto + dots + CTA `/contacto`. |
| **Derecha** | Panel glass sutil. Nivel 0 = Qué es Walpulse + explicabilidad (imagen con modal) + El proceso (`ProcessFlow`). Niveles 1–4 (Multichain / Portfolio / Origins / Activity) = narrativo Home (sin teaser). |

Mobile: columna (etapas arriba, detalle abajo).

`id="senales"` conserva `/#senales` y el redirect `/senales`.

## Scroll

- Contenedor `500vh` (`src/components/wallet-reveal/`).
- `scrollY` → progress `0–1` → `level` `0 | 1 | 2 | 3 | 4`.
- Dots saltan al tramo.

## Nivel → detalle

| Nivel | Izquierda (corto) | Derecha |
|------:|-------------------|---------|
| 0 | Tómele el pulso a una wallet | Intro + explicabilidad + modal caja negra + El proceso |
| 1 | Señal · Presencia Ecosistema | Lead + bullets + «Alcance» + «Importancia»; sin teaser. Visual: badges de chains en rombo. |
| 2 | Señal · Calidad del Portafolio | Lead + bullets + «Alcance» + «Importancia»; sin teaser. Visual: barras de composición / grade. |
| 3 | Señal · Origen de los fondos | Lead + bullets + «Alcance» + «Importancia»; sin teaser. Visual: grafo 2 hops; wallets secundarias = cuadrados; flechas hop1 recortadas al rectángulo. |
| 4 | Señal · Actividad reciente | Lead + bullets + «Alcance» + «Por qué es importante?»; sin teaser. Visual: contrapartes cuadradas + flujos (sin texto IN/OUT); flechas recortadas al rectángulo. |

Fuente niveles 1–4: mapas inline `multichainCopyByLocale` / `portfolioCopyByLocale` / `originsCopyByLocale` / `activityCopyByLocale` en `WalletRevealDetail.tsx`. Orden: Multichain → Portfolio → Origins → Activity (`SIGNAL_BY_LEVEL`).

Copy corto i18n: `reveal.*` en `src/messages/{es,en,pt}.json`. Acento visual: **Primary Sky**.

## Visual izquierdo (por nivel)

SVG ligero en `WalletRevealVisual.tsx` (sin WebGL en el reveal). Fondo Void siempre visible en el stage (evita flash blanco). Paleta Void / Surface / Primary Sky.

**Convención de formas:** cuadrado = wallet; círculo = tx/flujo (`FlowDot` y nodos de señal del slide 0); rombo = red/chain.

Layout del panel izquierdo: **copy tipográfico ampliado a la izquierda**; composición SVG **anclada a la derecha** del mismo panel.

| Nivel | Composición |
|------:|-------------|
| 0 | Wallet + 4 nodos = señales (Presencia / Portafolio / Origen / Actividad) con pulse |
| 1 | Wallet + badges PNG en rombo (`public/brand/chains/`: ETH, Base, Celo, Arbitrum, Polygon, BNB) |
| 2 | Wallet + barras de composición / grade |
| 3 | Grafo Origins 2 hops; wallets secundarias = cuadrados; flujos entrantes hacia la wallet |
| 4 | Contrapartes = cuadrados + flujos (dirección por flecha/color; sin label IN/OUT) + label 90 días |

`prefers-reduced-motion`: sin SMIL; solo crossfade de capas.

## Nav y exchanges

Header: Inicio · Para quienes · Nosotros · Hablemos · idioma.

Dropdown:

- Cripto-Exchanges - Internacional → `/cripto-exchanges/internacional`
- Cripto-Exchanges - Uruguay → `/cripto-exchanges/uruguay`

Dos páginas aparte (sin selector de región en página). `/cripto-exchanges?region=` y `/para-psav` redirigen.

## SEO / crawl del Home

El reveal es client-side. Complemento SSR en `src/components/seo/HomeCrawlContent.tsx` (`sr-only` + `<noscript>` + JSON-LD `ItemList` de señales). Ver también `/llms.txt` y `docs/README.md` → SEO.
