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
| `/[locale]/cripto-exchanges` | Redirect → uruguay (o regulación-latinoamericana si `?region=row`) |
| `/[locale]/cripto-exchanges/uruguay` | Cripto Exchanges — Uruguay |
| `/[locale]/regulacion-latinoamericana` | Regulación Latinoamericana (GAFI LatAm + mapa interactivo) |
| `/[locale]/nosotros` | Nosotros |
| `/[locale]/terminos` | Términos y condiciones |
| `/[locale]/como-funciona` | Cómo funciona |
| `/[locale]/contacto` | Contacto |
| `/[locale]/ejemplo` | Ejemplo de reporte (fuera del nav principal) |
| `/[locale]/login` | Portal — login (noindex) |
| `/[locale]/registro` | Portal — registro invite-only `?token=` (noindex) |
| `/[locale]/recuperar` | Portal — solicitar reset de contraseña (noindex) |
| `/[locale]/nueva-contrasena` | Portal — nueva contraseña tras link Auth (noindex) |
| `/[locale]/dashboard` | Portal — inicio (auth + perfil `get_mi_usuario` + KPIs de cliente u operador) |
| `/[locale]/dashboard/analisis` | Portal — listado ops de análisis (`es_operador_sistema`); stub para otros clientes |
| `/[locale]/dashboard/analisis/[id]` | Portal — detalle ops + etapas + JSON/CIDs (`analisis` / `evidencia` / `riesgo`) + PDF Motor (`riesgo_cid`) |
| `/[locale]/dashboard/motor-riesgos` | Portal — Motor de Riesgos: matrices del cliente |
| `/[locale]/dashboard/motor-riesgos/catalogo` | Portal — catálogo de señales (qué mide cada una y cómo usarla) |
| `/[locale]/dashboard/motor-riesgos/nueva` | Portal — alta de matriz (nombre, slug, descripción) |
| `/[locale]/dashboard/motor-riesgos/[id]` | Portal — versiones (`?v=`), despliegue de la matriz a sandbox/producción, copia y duplicado, y editor de reglas con presupuesto de 100 puntos |
| `/[locale]/dashboard/admin/clientes` | Admin — listado/alta clientes (solo `es_operador_sistema`) |
| `/[locale]/dashboard/admin/clientes/nuevo` | Admin — crear cliente |
| `/[locale]/dashboard/admin/clientes/[id]` | Admin — detalle, invitaciones, API keys |

Redirect legacy: `/para-psav` → `/cripto-exchanges/uruguay` (también con locale).

### Nav / shell

- Header: logo + menú (Inicio, Producto dropdown, **Acerca de** dropdown con Nosotros + Términos, Hablemos) + **Dashboard clientes** + selector de idioma.
- Producto (dropdown): Análisis, Motor de Riesgos, Demo, Proveedores, Para quienes.
- Para quienes (dropdown): `/cripto-exchanges/uruguay` y `/regulacion-latinoamericana` (orden: Uruguay primero).
- Acerca de (dropdown): `/nosotros` y `/terminos`.
- Footer: logo + links a contacto y términos; sin menú completo ni disclaimer PSAV/KYC/UIAF en el pie.
- Portal (`/login`, `/registro`, `/dashboard/*`): sin Header/Footer de marketing; layout propio; **noindex**.
- Consola admin (`/dashboard/admin/*`): visible solo si `get_mi_usuario().es_operador_sistema`; layout server llama `requireOperadorSistema` → redirect a `/dashboard` si no.

### Portal clientes (auth invite-only)

Alineado al ADR vault `2026-09-14 - Usuarios Auth invite-only` y RPCs en `walpulse/database`.

1. Ops crea invitación (`create_usuario_invitacion`) → link `/[locale]/registro?token=…`
2. Usuario registra email (mismo de la invite) + password → Supabase Auth `signUp` → `accept_usuario_invitacion(token)`
3. Login → `signInWithPassword` → `get_mi_usuario()`; sin perfil = sin acceso
4. Dashboard shell: Inicio / **Nuevo análisis** / Análisis / Motor de Riesgos (grupo con **Matrices** y **Catálogo de señales** anidados) / Cerrar sesión; si el cliente tiene `es_operador_sistema`, también **Admin → Clientes**. En **Análisis**, operadores ven el listado global; otros clientes ven stub. **Nuevo análisis** (`/dashboard/analisis/nuevo`) crea peticiones vía `POST /api/portal-analisis` usando la API key `portal-dashboard` del cliente de la sesión (secreto en Vault).
5. Recovery: `/recuperar` → `resetPasswordForEmail` (redirectTo `/nueva-contrasena`) → `updateUser({ password })` → login

#### KPIs del inicio (dos scopes por rol)

El inicio del dashboard bifurca por `es_operador_sistema` sobre las dos MVs de KPIs (ADR vault `2026-09-16 - MV de KPIs por cliente sobre columnas denormalizadas`), refrescadas juntas cada hora por `refresh_analisis_kpis()` (job `pg_cron` `kpis-analisis-refresh`):

| Rol | Fetch (`src/lib/portal/kpis.ts`) | RPC | Componente |
| --- | --- | --- | --- |
| Cliente | `getMisKpis()` | `portal_get_mis_kpis` | `PortalKpis` |
| Operador | `getKpisGlobales()` + `getKpisPorCliente()` | `admin_get_kpis_globales` + `admin_list_cliente_kpis` | `PortalKpisOperador` |

Todo el fetch es **server-side** en `dashboard/page.tsx`. `portal_get_mis_kpis` y `admin_get_kpis_globales` devuelven sin `p_ventana` las tres ventanas (`7d` / `30d` / `total`) en una sola llamada; `admin_list_cliente_kpis` solo devuelve una, así que las tres se piden en paralelo de entrada. En los dos casos el selector de ventana es estado local: no hay refetch ni spinner, y totales y desglose muestran siempre el mismo snapshot.

Las dos MVs comparten nombres de columna, así que las seis familias las renderiza un único `PortalKpisPanels`: volumen (tier, canal, idioma), fiabilidad, latencia p50/p95, riesgo (grade predominante, histograma A–F, grades por módulo, clases de custodia), compliance y recencia. La fila global agrega tres métricas de cobertura de clientes al hero, y el operador ve además el desglose por cliente con link a su ficha y un botón que fuerza `admin_refresh_analisis_kpis()` (confirmación inline + `router.refresh()`).

El riesgo se presenta como barra proporcional A–F con leyenda (grado, etiqueta, cantidad y porcentaje) y **denominador explícito**, porque el denominador cambia entre bloques: la síntesis se calcula sobre los análisis que terminaron con grado, y cada parte del análisis sobre los que la incluyen (Portafolio solo existe en Estándar y Experta, así que en Básica cuenta como sin grado). Sin ese dato las cuatro partes parecen comparables y no lo son. Custodia va en una línea al pie y no en tarjetas: hoy no discrimina.

Dos semánticas de las MVs se muestran explícitamente para no mentir: `refrescado_at` y que las ventanas relativas se cuentan desde ese refresh, con hasta 60 minutos de desfase. Los KPIs que las MVs dejan en NULL sin datos terminados (`tasa_exito_pct`, latencias, `dias_desde_ultimo_analisis`) salen como `—`, no como 0, y un cliente con `total_analisis = 0` ve un estado vacío con CTA a `/dashboard/analisis/nuevo`. Los totales de plataforma **no** se derivan sumando el desglose: `wallets_unicas` se contaría doble y los percentiles de latencia no son aditivos.

#### Motor de Riesgos (`/dashboard/motor-riesgos`)

Cierra el pendiente de UI del ADR vault `2026-09-15 - Schema motor de riesgo matrices y senales`. El cliente opera **sus** matrices: nada de scope por operador.

**Modelo de puntaje (2026-09-16, ajuste 2026-09-17):** cada versión define un puntaje de riesgo 0-100 y cada regla suma puntos. La suma de las reglas habilitadas no puede pasar 100; **publicar ya no exige 100 exactos** (el faltante es informativo en UI). El panel de reglas muestra el presupuesto `X/100`. Si el botón de publicar está inhabilitado (p. ej. versión obsoleta), el motivo va en un texto visible al lado enlazado con `aria-describedby` y no en un `title`. `efecto` es siempre `{tipo: "puntos", valor}`: `peso` y `multiplicador` salieron del modelo. Detalle en [motor-riesgos-portal-rpcs.md](motor-riesgos-portal-rpcs.md) y ADR vault `2026-09-16 - Puntaje de riesgo 0-100 con presupuesto de puntos`.

Ciclo que la UI hace explícito, porque son triggers de la base y no convenciones de la pantalla:

```
matriz nueva --------------------> v1 borrador (nace con la matriz)
version borrador (reglas editables) --publicar (100 pts)--> vigente (congelada)
vigente <--reemplazada por la siguiente-- archivado (historico)
matriz --puntero en clientes--> sandbox (una por cliente, a su vigente)
matriz --puntero en la matriz--> produccion (a su vigente)
version nueva <--copia de reglas-- cualquier version del cliente
matriz duplicada <--todas las versiones en borrador-- matriz
```

**Una sola versión vigente (2026-09-17):** por matriz hay una única versión `publicado` (la vigente) y publicar la siguiente deja la anterior en `archivado`, con las reglas igual de congeladas. Lo garantiza un unique index parcial, no la pantalla. El detalle refleja eso en tres lugares: los badges por versión son *Vigente* / *Histórico* / *Borrador*, la confirmación de publicar dice qué versión queda como histórico, y un borrador más viejo que la vigente tiene el botón inhabilitado con el motivo al lado (la base devolvería `version_obsoleta`).

**Nombre y notas (2026-09-17):** cada versión admite `nombre` (etiqueta) y `notas` (usuario), editables también en vigente/histórico. La procedencia al copiar entre matrices vive en `origen_copia`, no en `notas`. La fila seleccionada se destaca en el listado (`portal-version-row.is-selected` + badge *Seleccionada*) y el panel de reglas muestra `vN · nombre` en el eyebrow.

El **despliegue es de la matriz**, así que *Usar en producción* y *Usar como sandbox* viven en la cabecera del detalle —no por versión— y la base resuelve cuál es la vigente; sin versión publicada quedan inhabilitados con el motivo al lado. Publicar arrastra los punteros: si la matriz estaba desplegada, sigue desplegada apuntando a la versión nueva. Como una versión no puede ser sandbox y producción a la vez, probar sin tocar producción es una **segunda matriz**: de ahí los dos botones nuevos, *Copiar a otra matriz* por versión (abre el selector de destino y al terminar navega a la copia) y *Duplicar matriz* en la cabecera, que pide nombre e identificador precargados y trae todas las versiones en borrador y sin despliegue.

Publicar congela las reglas (`version_frozen`), así que una versión vigente o histórica se muestra en lectura con el CTA de crear una versión nueva en lugar de inputs deshabilitados.

La versión seleccionada viaja en la URL (`?v=<version_num>`) y sus reglas se traen en el servidor, así que el detalle es enlazable y la tabla llega renderizada; las mutaciones del editor terminan en `router.refresh()`, que actualiza reglas y contadores juntos.

El panel de reglas suma **duplicar** una regla y mover cada una con flechas; **publicar vive solo en el panel de *Versiones***, porque dos botones con el mismo nombre en la misma pantalla no dejaban claro qué versión se publicaba. Cuando el presupuesto inhabilita un botón, el motivo va en un texto visible al lado enlazado con `aria-describedby` (con los 100 asignados, por qué no se puede agregar ni duplicar; en *Versiones*, cuántos puntos faltan para publicar), y el detalle largo queda en la barra de presupuesto.

Las mutaciones corren `router.refresh()` dentro de `startTransition`, y el `isPending` de la transición entra en el `busy` que inhabilita los botones: entre la respuesta de la RPC y las filas nuevas la tabla que se ve sigue siendo la vieja, así que sin eso un segundo click repetía la acción (borrar dos veces la misma regla terminaba en error). Además cada handler descarta la llamada si ya hay una en curso, porque un doble click dentro del mismo frame llega antes del render que inhabilita el botón. Duplicar abre el formulario con la regla como prefill pero sin id, así la base inserta una regla nueva y le deriva su código; el nombre lleva el sufijo de copia y los puntos entran acotados al presupuesto, porque los del original no se liberan. Las flechas mandan **toda** la versión reordenada a `portal_reorder_riesgo_reglas` en lugar de dos updates: así no quedan órdenes duplicados y el movimiento es atómico. El orden salió del formulario (`p_orden` viaja en null: el alta va al final y la edición conserva el suyo).

| Pieza | Path |
|-------|------|
| Fetch server-side | `src/lib/portal/riesgo.ts` (`getSenales`, `getMisMatrices`, `getMatriz`, `getReglas`) |
| Ids canónicos y helpers | `src/lib/portal/riesgoLabels.ts` |
| Componentes | `src/components/portal/riesgo/` |
| Contrato de RPCs | [motor-riesgos-portal-rpcs.md](motor-riesgos-portal-rpcs.md) |

El formulario de regla se ordenó alrededor de lo que el cliente necesita decidir: las señales se eligen por nombre, agrupadas en `optgroup` por parte del análisis (el `codigo` técnico se fue del selector, y el grupo desambigua las tres etiquetas que se repiten entre Origen y Actividad); debajo aparece el texto de negocio de la señal elegida, el mismo del catálogo, vía el componente compartido `SenalTextos`; y al lado del campo de puntos va la barra `PuntosBar`, que dibuja lo que suman las otras reglas y lo que suma esta mientras se tipea, en rojo si se pasa de 100. El campo de código desapareció: lo deriva la base (ver [motor-riesgos-portal-rpcs.md](motor-riesgos-portal-rpcs.md)). El formulario abre con encabezado propio (*Nueva regla* / *Editar regla* / *Duplicar regla*) porque sin él la etiqueta del primer campo ("Señal *") se leía como título de la sección, y al montarse lleva el foco al selector de señal y hace scroll hasta el formulario: aparece al final del panel, así que sin eso el botón que lo abre parece no hacer nada.

Dos detalles del esquema que la UI respeta en lugar de improvisar:

- **Operadores filtrados por `value_type` de la señal**: `number` / `percent` admiten comparaciones y `between`; `boolean` solo `is_true` / `is_false`; `enum` y `grade` usan `in` / `not_in` con los valores de `metadata.enum`; `object` solo `is_null` / `not_null`. El editor de umbral cambia de forma con el operador (un valor, dos para `between`, multi-select para listas, ninguno para los unarios).
- **`senales.labels`, `senales.descripcion` y `senales.uso_sugerido` usan claves `esp` / `eng` / `por`** (no `es` / `en` / `pt`); el helper `senalTexto` mapea el locale activo y cae a `esp`.

Las once RPCs `portal_*` están en la base desde la migración `20260916191630_portal_riesgo_engine_rpcs` (las siete de ops siguen siendo solo `service_role`), `20260916215500_riesgo_puntaje_100_y_ciclo` agregó el presupuesto de puntos, la v1 automática y el copiado de reglas al versionar, `20260917020500_riesgo_regla_codigo_interno` pasó el código de la regla a la base, `20260917025243_riesgo_reglas_orden` agregó `portal_reorder_riesgo_reglas` y el orden derivado, y las cinco `20260917034431`–`20260917035130` (`riesgo_version_vigente_*`) trajeron el estado `archivado`, la vigente única, el despliegue por matriz, la copia entre matrices y `portal_duplicate_riesgo_matriz`. Límite que se dice en pantalla: **no hay evaluador**, así que la pantalla configura y no simula el puntaje de una wallet.

##### Catálogo de señales (`/dashboard/motor-riesgos/catalogo`)

Matrices y catálogo son dos rutas con su propio item de menú anidado bajo *Motor de Riesgos* (antes eran pestañas de una sola página). El padre es un **toggle desplegable** (`NavCollapsible` en `DashboardShell.tsx`: chevron + `aria-expanded`, auto-abierto en rutas hijas) con rail en `.portal-nav-sublist` / `.portal-nav-item--sub`. En mobile el nav se aplana a tabs y muestra los hijos, no el padre.

El catálogo es una lista de tarjetas por señal con **Qué calcula** y **Cómo usarla**, no una tabla: con dos párrafos por fila una tabla queda ilegible. Se fueron el `codigo` bajo el nombre y la columna de ruta JSON, que no le decían nada al cliente; el `codigo` sigue visible en el selector de señal del editor de reglas, que es donde identifica la fila. El buscador mira nombre y los dos textos.

Los textos viven en la base (`walpulse.senales.descripcion` y `uso_sugerido`, jsonb trilingüe), no en `messages/*.json`: son 133 señales × 2 textos × 3 idiomas y el catálogo lo define el producto de análisis, no el frontend. `portal_list_senales` devuelve `to_jsonb(s)`, así que las columnas viajan sin tocar la RPC. Cobertura actual: **133 de 133** con los dos textos en los tres idiomas (migraciones `20260916194827_senales_uso_sugerido` y `20260916200500`–`20260916201000_senales_texto_*`). Si una señal quedara sin redacción, la tarjeta muestra el faltante en lugar de un espacio vacío.

Las sugerencias de uso se apoyan en umbrales que ya usan las reglas de negocio del análisis (por ejemplo `mixer_exposure_pct_value > 0.15` fuerza F en Actividad), no en números nuevos.

#### Capa visual del portal (`.portal-*`)

El portal no usa las clases del marketing directamente: tiene su propia capa al final de `src/app/globals.css` con la misma gramática (gradientes diagonales, bordes `glass` teñidos de `primary`, glow radial, hairline superior) pero con radios y paddings más chicos para densidad de datos. Las primitivas React que la envuelven viven en `src/components/portal/ui/` y no tienen lógica de datos.

| Clase | Uso | Primitiva |
|-------|-----|-----------|
| `.portal-panel` (+ `--flush` / `--inset` / `--accent`) y `.portal-panel__hairline` | Superficie base de tarjetas y secciones | `PortalPanel` |
| `.portal-page-title`, `.portal-section-title`, `.portal-eyebrow` (+ `--muted`), `.portal-data` | Escala tipográfica del portal (pantalla / sección / label / dato) | `PortalPageHeader` |
| `.portal-atmosphere`, `.portal-sidebar`, `.portal-topbar`, `.portal-nav-item`, `.portal-drawer` | Estructura del shell y del panel lateral | `DashboardShell`, `AdminAnalisisDrawer` |
| `.portal-table-wrap`, `.portal-table` (`th` mono/uppercase, fila `is-active`), `.portal-table__mono` | Tablas de datos | `PortalTable`, `TableSkeletonRows`, `TableMessageRow`, `PortalPagination` |
| `.portal-label`, `.portal-field` (+ `--sm` / `--mono`) | Único dialecto de input/select del portal | `PortalInput`, `PortalSelect`, `PortalCheckbox` |
| `.portal-btn` + `--primary` / `--ghost` / `--danger` / `--link` / `--sm` | Botones y acciones | `PortalButton` |
| `.portal-badge` + `--ok` / `--warn` / `--error` / `--info` / `--neutral` / `--sm` | Estados y tiers (etiquetas i18n de `lib/portal/analisisLabels`) | `StatusBadge`, `TierBadge` |
| `.portal-alert--error` / `--success` / `--info` | Mensajes de error, éxito y one-shot (token / API key) | `PortalAlert` |
| `.portal-tabs` / `.portal-tab` (`is-active`) | Tabs y nav móvil | `PortalTabs` |
| `.portal-metric` | KPI y campos escalares del detalle | `PortalMetric` |
| `.portal-stage-dot` (+ `--ok` / `--error` / `--idle`) | Timeline de `analisis_run_stages` | — |
| `.portal-skeleton`, `.portal-progress` | Carga y progreso del polling (ambos respetan `prefers-reduced-motion`) | `PortalSkeleton` |

### Consola admin (operadores Walpulse)

Gate: `clientes.es_operador_sistema` (único `true` = cliente Walpulse). `get_mi_usuario()` incluye el flag. RPCs `admin_*` en BD (migraciones `20260915030000` + `20260915040000`).

| Ruta | Función |
|------|---------|
| `/dashboard/admin/clientes` | Listado + alta |
| `/dashboard/admin/clientes/nuevo` | Form create |
| `/dashboard/admin/clientes/[id]` | Update + tabs invitaciones / API keys |
| `/dashboard/analisis` | Listado global `analisis_requests` (filtros tier/wallet/status/idioma/email; orden `created_at` / `email_sent_at` / `onchain_updated_at`) vía `admin_list_analisis_requests`. Click en una fila abre el detalle en panel lateral (`?detalle=<id>`, shallow routing); ctrl/cmd+click navega a la página completa |
| `/dashboard/analisis/nuevo` | Crear análisis (Básica sync · Estándar/Experta async+poll); API key `portal-dashboard` del cliente logueado |
| `/dashboard/analisis/[id]` | Detalle completo (campos escalares en 4 paneles: petición e identidad / resultado / entregables / on-chain y tiempos) + etapas + acciones ops (regen señales/reporte, resend email, idioma, con confirmación inline) + links PDF/IPFS/Basescan + visor JSON (`analisis` / `evidencia` / `riesgo`) + entregables Motor (`riesgo_cid`, `riesgo_evaluado_at`) |

Grado: `analisis_requests.grade_label` se persiste en el idioma del informe (`idioma`), así que el detalle **no** lo muestra tal cual: deriva la etiqueta de `grade` (A/B/C/D/F) con `portal.analisis.gradeLabels.*` en el locale activo y usa el texto guardado solo como fallback si el grado no es canónico.

Invitaciones: al crear se muestra token + link `/[locale]/registro?token=` **una sola vez**. API keys: plaintext `api_key` **una sola vez** (excepto `portal-dashboard`, auto-provisionada en Vault; no revocable desde UI). Llamadas con sesión browser (`supabase.rpc('admin_…')`).

Al crear un cliente (`admin_create_cliente`) se llama `ensure_portal_dashboard_api_key` (label `portal-dashboard` + secreto Vault `portal_dashboard_api_key_<cliente_id>`). Poll autenticado: `portal_get_analisis_request`.

Clientes:

| Pieza | Path |
|-------|------|
| Browser | `src/lib/supabase/browser.ts` (`@supabase/ssr`) |
| Server | `src/lib/supabase/server.ts` |
| Admin (contacto/demo) | `src/lib/supabase/admin.ts` (`service_role`) |
| Proxy session refresh | `src/proxy.ts` |

Env portal (además de las de contacto/demo):

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Mismo proyecto que `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth browser/SSR (nunca `service_role`) |

Supuesto ops: confirmación de email Auth deshabilitada (o auto-confirm) para el flujo invite.

**Auth Redirect URLs (Supabase Dashboard):** exactas (sin query):

- `http://localhost:3000/auth/callback`
- `https://www.walpulse.com/auth/callback`

El recovery setea cookie `walpulse_recovery_next` con `/{locale}/nueva-contrasena` y usa `redirectTo` = `{origin}/auth/callback` (sin `?next=`). Pedí un enlace **nuevo** tras cambios; esperá ~60s si hay rate limit de email.

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

### Señales internas en `/analisis` (cobertura por tier)

Tablas del carrusel «Qué miramos dentro de cada señal» y del bloque Clasificación de custodia:

| Pieza | Ubicación |
|-------|-----------|
| Copy + `id` estable por fila (es/en/pt) | `src/lib/analisisSignalSlides.ts` |
| Mapa locale-agnóstico de cobertura | `analisisSignalRowTiers` / `signalRowCoversTier` |
| UI columnas Básica / Estándar / Experta (✓ / —) | `AnalisisTierCoverageCells.tsx` |
| Carrusel / custodia | `AnalisisSignalsCarousel.tsx` · `AnalisisCustodyBlock.tsx` |

Cobertura alineada al catálogo v1.0 (p. ej. Portfolio y filas Kleros/hops/intensidad sin Básica). Vault: `Website - Análisis`.

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
| `/regulacion-latinoamericana` | `/brand/exchanges/header-internacional.png` | `GafiLatamExchangesPage` + `LatAmRegulationMap` |
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
| `NEXT_PUBLIC_SUPABASE_URL` | Auth portal (browser/SSR); mismo host |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth portal anon key |
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
- Abuse: rate limit por IP (Upstash: **15 POST / 15 min** tras Turnstile OK, 60 GET / min) + Cloudflare Turnstile en submit (`src/lib/demoRateLimit.ts`, `src/lib/turnstile.ts`, `DemoTurnstile`). Bypass temporal de prueba: `NEXT_PUBLIC_DEMO_SKIP_TURNSTILE=1`.
- `maxDuration` 120s en el route (Básica puede tardar ~1 min)
- Estándar/Experta: email + idioma obligatorios en UI; correo post-PDF vía worker (prioridad `request.email`)

## SEO y discoverability

| Pieza | Ubicación |
|-------|-----------|
| Helper metadata (canonical, hreflang, OG, Twitter) | `src/lib/seo.ts` — canónico default `https://www.walpulse.com` |
| Paths indexables | `INDEXABLE_PATHS` en `seo.ts` (home, analisis, **walpulse-engine-risk**, **demo**, **proveedores-de-datos**, exchanges uruguay, **regulacion-latinoamericana**, nosotros, **terminos**, como-funciona, contacto, ejemplo) |
| Sitemap | `/sitemap.xml` ← `src/app/sitemap.ts` (prioridad 0.85 para analisis / **walpulse-engine-risk** / demo / proveedores) |
| Robots | `/robots.txt` ← `src/app/robots.ts` |
| JSON-LD Organization + WebSite | `src/components/seo/JsonLd.tsx` (`sameAs`: X, Telegram, LinkedIn fundador) |
| Home crawlable (SSR + ItemList señales) | `src/components/seo/HomeCrawlContent.tsx` (copy de motores vía `signalCerts.ts`) |
| Agentes de IA | `public/llms.txt` → `/llms.txt` (catálogo, Motor de Riesgos, **Regulación Latinoamericana / GAFI**, **Términos**, demo y proveedores; nombres canónicos Origen / Actividad / Presencia / Portafolio) |
| OG image | `/og.png` |
| Meta copy i18n | `src/messages/{es,en,pt}.json` → `meta.*` (incl. `engineRiskTitle` / `demoTitle` / `proveedoresTitle`) |

`NEXT_PUBLIC_SITE_URL` en Vercel debe ser `https://www.walpulse.com`.

Tras deploy: verificar que prod sirva sitemap con `/analisis`, `/walpulse-engine-risk`, `/demo`, `/proveedores-de-datos`, `/regulacion-latinoamericana`, `/terminos` y un `llms.txt` alineado (GAFI LatAm + términos + catálogo).

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
- Tablas de señales internas en `/analisis` (`AnalisisSignalsCarousel`, `AnalisisCustodyBlock`): columnas de cobertura por tier (Básica / Estándar / Experta) vía `analisisSignalRowTiers` en `analisisSignalSlides.ts`.
- Nosotros → **Equipo**: Jair + Carolina (`/jair.jpeg`, `/carolina.jpeg`); links en `TEAM_LINKS` (`paths.ts`).
- Cripto-exchanges Uruguay: `/cripto-exchanges/uruguay`. Regulación Latinoamericana: `/regulacion-latinoamericana` (mapa SVG geográfico Natural Earth + lista a11y; redirect 301 desde `/cripto-exchanges/internacional`). Regenerar paths: `node scripts/build-latam-map.mjs`.
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
