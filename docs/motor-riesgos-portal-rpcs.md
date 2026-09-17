# Motor de Riesgos — RPCs portal

Contrato entre la UI `/dashboard/motor-riesgos` y `walpulse/database`. **Implementado** el 2026-09-16 en la migración `20260916191630_portal_riesgo_engine_rpcs`: las once RPCs existen en `public` con `EXECUTE` para `authenticated` y `service_role` (las siete de ops siguen siendo solo `service_role`).

**Fuente:** ADR vault `2026-09-15 - Schema motor de riesgo matrices y senales`, `2026-09-16 - Puntaje de riesgo 0-100 con presupuesto de puntos` y `2026-09-17 - Una sola version vigente por matriz` · `walpulse/database` → `docs/schema-walpulse-riesgo-engine.md` · migraciones `20260915034916` / `20260915035416` / `20260915035439` / `20260916191630` / `20260916215500` / `20260917020500` / `20260917025243` / `20260917034431`–`20260917035130`.

## Modelo de puntaje (2026-09-16)

Cada versión de matriz define **un** puntaje de riesgo 0-100 y cada regla **suma** puntos:

- `efecto` es siempre `{ "tipo": "puntos", "valor": 0-100 }`. `peso` y `multiplicador` salieron del check de la tabla y del formulario.
- La suma de los puntos de las reglas **habilitadas** de una versión no puede pasar 100: lo corta el trigger `trg_riesgo_reglas_presupuesto` con `puntos_exceden_100`.
- Publicar exige que esa suma sea **exactamente 100**; si no, `puntos_incompletos`. Como sandbox y producción solo aceptan versiones publicadas, ninguna versión incompleta llega a desplegarse.
- Las dos lecturas de matrices devuelven `reglas_count` y `puntos_asignados` por versión, así la UI muestra `X/100` y bloquea el botón de publicar sin pedir las reglas.

## Criterio común

Mismo patrón que `portal_get_mis_kpis`: `security definer`, `set search_path = walpulse, public, auth`, sin `p_cliente_id` (se deriva de `auth.uid()` con el helper `walpulse.portal_cliente_id()`, que exige usuario y cliente activos), `returns jsonb`.

Los helpers `walpulse.portal_assert_matriz_propia` y `portal_assert_version_propia` devuelven `matriz_not_found` / `version_not_found` en lugar de un error que confirme la existencia de un recurso de otro cliente.

## Lectura

| RPC | Devuelve |
| --- | --- |
| `portal_list_senales(p_modulo text default null)` | `{ rows: [senal] }` — las 133 del catálogo plataforma, `habilitada = true` |
| `portal_list_riesgo_matrices()` | `{ sandbox_version_id, rows: [matriz + versiones[]] }`; cada versión con `reglas_count` y `puntos_asignados` |
| `portal_get_riesgo_matriz(p_matriz_id uuid)` | `{ sandbox_version_id, matriz }` (la matriz trae `versiones[]` con los mismos contadores) |
| `portal_list_riesgo_reglas(p_matriz_version_id uuid)` | `{ rows: [regla + senal embebida] }` |

`sandbox_version_id` viaja en las dos lecturas de matrices porque el puntero vive en `walpulse.clientes`, no en la matriz, y la UI necesita marcar qué versión es la sandbox sin una llamada extra.

Cada regla trae su señal embebida (`codigo`, `modulo`, `labels`, `value_type`, `metadata`): sin eso la tabla de reglas obligaría a cruzar contra el catálogo en el cliente.

`portal_list_senales` devuelve `to_jsonb(s)` de cada fila, así que cada señal incluye también sus textos de negocio trilingües: `descripcion` (qué calcula) y `uso_sugerido` (cómo usarla), ambos con claves `esp` / `eng` / `por`. La columna `uso_sugerido` se agregó en `20260916194827_senales_uso_sugerido` y no requirió tocar la RPC.

## Escritura

| RPC | Notas |
| --- | --- |
| `portal_create_riesgo_matriz(p_nombre text, p_slug text, p_descripcion text default null)` | Slug normalizado a minúsculas y validado contra `^[a-z0-9]+(?:-[a-z0-9]+)*$`; unique por cliente. Crea también la **v1 borrador** y la devuelve en `versiones[]` |
| `portal_create_riesgo_matriz_version(p_matriz_id uuid, p_notas text default null, p_copiar_desde uuid default null)` | `version_num` automático; `created_by` = usuario de la sesión. **Copia las reglas** de `p_copiar_desde` —que puede ser de **otra matriz del mismo cliente**— o, por default, de la última versión de la matriz; devuelve `reglas_copiadas` |
| `portal_upsert_riesgo_regla(p_matriz_version_id uuid, p_senal_id uuid, p_nombre text, p_operador text, p_umbral jsonb, p_efecto jsonb, p_orden int default null, p_habilitada boolean default true, p_params jsonb default '{}', p_regla_id uuid default null)` | Solo en versiones `borrador`. Sin `p_regla_id` inserta y **deriva el código**; con `p_regla_id` actualiza esa regla (`regla_not_found` si no es de esa versión). `p_efecto` tiene que ser `{tipo: puntos, valor: 0-100}` (`invalid_efecto`) y no pasar el presupuesto (`puntos_exceden_100`). Sin `p_orden`, el alta va al final (`max + 1`) y la edición conserva el orden |
| `portal_delete_riesgo_regla(p_regla_id uuid)` | `{ id, matriz_version_id }`. No existe en la capa ops: se creó para el portal |
| `portal_reorder_riesgo_reglas(p_matriz_version_id uuid, p_reglas uuid[])` | Reasigna `orden` por posición en el array. Solo en `borrador` (`version_frozen`) y el array tiene que traer el **conjunto exacto** de la versión (`regla_not_found`) |
| `portal_publish_riesgo_matriz_version(p_version_id uuid)` | Exige 100 puntos exactos (`puntos_incompletos`), **archiva la vigente anterior** de la matriz y arrastra sus punteros. Devuelve la versión nueva más `archivada` y `punteros_movidos` |
| `portal_set_riesgo_sandbox_matriz(p_matriz_id uuid)` | Apunta la sandbox del cliente a la **vigente** de esa matriz; `null` la libera. `matriz_sin_vigente` si todavía no publicó nada |
| `portal_set_riesgo_matriz_produccion(p_matriz_id uuid, p_activo boolean default true)` | Pone la matriz en producción apuntando a su vigente; con `p_activo = false` la libera. Mismo `matriz_sin_vigente` |
| `portal_duplicate_riesgo_matriz(p_matriz_id uuid, p_nombre text, p_slug text)` | Copia la matriz con **todas** sus versiones y reglas, todo en `borrador` y sin despliegue. Devuelve `versiones[]`, `versiones_copiadas` y `reglas_copiadas` |

## Una sola versión vigente (2026-09-17)

Una matriz tiene una única versión `publicado` — la **vigente** — garantizada por el unique index parcial `riesgo_version_publicada_unica`. Al publicar la siguiente, la anterior pasa a `archivado` (histórico, reglas congeladas) y lo hace la misma RPC, antes de publicar, para no chocar con el index.

- El estado admite `borrador`, `publicado` y `archivado`. `publicado → archivado` es la **única** transición que el trigger `tg_riesgo_version_publish` permite sobre una vigente; cualquier otro cambio sobre una publicada o archivada sigue siendo `version_frozen`, así el histórico no se reabre.
- Publicar un borrador con `version_num` menor que la vigente devuelve `version_obsoleta`: para volver a reglas anteriores se crea una versión nueva copiando la vieja.
- El **despliegue es de la matriz**: los punteros (`riesgo_matrices.version_produccion_id` y `clientes.riesgo_sandbox_version_id`) siempre apuntan a la vigente, y publicar los mueve solo. Las dos RPCs de despliegue reciben la matriz, no una versión.
- Como una versión no puede ser sandbox y producción a la vez, probar sin tocar producción exige **otra matriz**: de ahí que `p_copiar_desde` acepte una versión de cualquier matriz del mismo cliente y que exista `portal_duplicate_riesgo_matriz`. `version_cannot_be_sandbox_and_produccion` se lee ahora como "esa matriz ya está en producción, usá otra como sandbox".

## Código de regla (2026-09-17)

El `codigo` de una regla es la clave de upsert `(matriz_version_id, codigo)` y viaja en la copia al versionar, pero no es un dato que el cliente tenga que redactar: desde `20260917020500` lo **deriva la RPC** como `senal.codigo + '.' + operador`, con sufijo `-2`, `-3`… si ya está tomado, y el formulario perdió el campo.

La desambiguación vive en la base y no en el portal porque dos reglas sobre la misma señal y el mismo operador con umbrales distintos son válidas: con el `on conflict do update` anterior la segunda pisaba a la primera en silencio. Ahora el insert atrapa `unique_violation` y prueba el sufijo siguiente, así que también cubre dos altas simultáneas en el mismo borrador.

Editar es `p_regla_id`: actualiza esa fila conservando su código (no se recalcula aunque cambien la señal o el operador) y devuelve `regla_not_found` si el id no pertenece a la versión.

## Orden de las reglas (2026-09-17)

El formulario ya no pide `orden`: desde `20260917025243` el alta sin `p_orden` toma `max(orden) + 1` de la versión y la edición sin `p_orden` conserva el que tenía. Mover una regla es `portal_reorder_riesgo_reglas`, que recibe **toda** la versión en el orden nuevo y reasigna las posiciones de una vez.

Se pide el conjunto completo en lugar de dos updates porque con un subconjunto las reglas que quedan afuera conservan un orden que puede empatar con los nuevos; mandar la lista entera también deja el movimiento atómico. El update salta las filas cuyo orden no cambia, así un swap no dispara el trigger de presupuesto por cada regla de la versión.

## Errores

La UI mapea el mensaje del `P0001` a una clave i18n en `src/lib/portal/errors.ts`:

`version_required` · `version_not_found` · `version_not_publicado` · `version_not_found_or_not_borrador` · `version_cliente_mismatch` · `version_matriz_mismatch` · `version_cannot_be_sandbox_and_produccion` · `version_frozen` · `version_obsoleta` · `matriz_not_found` · `matriz_sin_vigente` · `matriz_slug_exists` · `invalid_slug` · `invalid_nombre` · `regla_not_found` · `senal_not_found` · `invalid_regla` · `invalid_efecto` · `puntos_exceden_100` · `puntos_incompletos`

Más los del portal que ya existían (`not_authenticated`, `no_portal_access`, `usuario_inactive`).

## Verificado en producción

Smoke del 2026-09-16 con rol `authenticated` (`request.jwt.claims` con el `sub` de un usuario real, transacción revertida): el ciclo completo funciona y cada trigger responde con su código. En particular se confirmó que no se puede editar ni borrar una regla de una versión publicada (`version_frozen`), que producción no acepta un borrador (`version_not_publicado`) y que una versión no puede ser sandbox y producción a la vez.

Segundo smoke tras `20260916215500`, mismo método: la matriz nace con `v1 borrador` en 0 puntos, una regla de 60 entra, otra de 50 devuelve `puntos_exceden_100`, un efecto `peso` devuelve `invalid_efecto`, publicar con 60 devuelve `puntos_incompletos`, con 100 pasa, y la versión siguiente llega con `reglas_copiadas = 2` y `puntos_asignados = 100`.

Cuarto smoke tras las migraciones de vigente (`20260917034431`–`20260917035130`, `riesgo_version_vigente_*`), mismo método: con la matriz en producción, publicar v3 archivó la v2 y **dejó el puntero en v3**; apuntar la sandbox a esa misma matriz devolvió `version_cannot_be_sandbox_and_produccion`; una matriz recién creada devolvió `matriz_sin_vigente`; publicar un borrador más viejo que la vigente devolvió `version_obsoleta`; borrar una regla de una archivada devolvió `version_frozen`; copiar una versión de la matriz A a la B dejó un borrador con las mismas 2 reglas sin tocar A; un `p_copiar_desde` ajeno siguió devolviendo `version_not_found`; duplicar la matriz copió 4 versiones y 8 reglas, todas en `borrador` y sin despliegue, y repitió `matriz_slug_exists` con un slug tomado. A nivel datos, insertar una segunda publicada choca con `riesgo_version_publicada_unica` y reabrir una archivada o despublicar la vigente devuelve `version_frozen`.

Tercer smoke tras `20260917020500`: dos reglas sobre la misma señal y operador reciben `activity.airdrop_exposure_pct_value.gt` y `…gt-2` sin pisarse, editar con `p_regla_id` conserva id y código mientras cambia el operador, un `p_regla_id` ajeno devuelve `regla_not_found`, y siguen cortando `invalid_efecto` y `puntos_exceden_100`.

## Lo que sigue faltando

- **No hay evaluador**, así que no hay preview del puntaje de una wallet. La pantalla configura y lo dice explícitamente.
- **Cupo de matrices en producción por tipo de cliente**: diferido en el ADR, no modelado.
