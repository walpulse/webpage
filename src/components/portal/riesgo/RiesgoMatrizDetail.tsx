"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { RiesgoMatrizDuplicarForm } from "@/components/portal/riesgo/RiesgoMatrizDuplicarForm";
import { RiesgoReglasEditor } from "@/components/portal/riesgo/RiesgoReglasEditor";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalMetric } from "@/components/portal/ui/PortalMetric";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { motorRiesgosMatrizPath } from "@/lib/paths";
import { portalErrorKey } from "@/lib/portal/errors";
import { RIESGO_PUNTOS_MAX } from "@/lib/portal/riesgoLabels";
import type {
  RiesgoMatriz,
  RiesgoMatrizResult,
  RiesgoMatrizVersion,
  RiesgoRegla,
  Senal,
} from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type RpcResult = { data: unknown; error: { message: string } | null };

type PendingAction = {
  id: string;
  label: string;
  run: () => PromiseLike<RpcResult>;
  /** Inhabilitado con el motivo al lado: falta publicar, faltan puntos, etc. */
  disabled?: boolean;
  hint?: string;
  /** Aviso de qué cambia la acción, dentro de la confirmación inline. */
  aviso?: string;
  /** Cuando la acción termina en otra pantalla, en vez de refrescar. */
  onDone?: (data: unknown) => void;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

/**
 * Botón de acción con su motivo al lado cuando está inhabilitado y, al pedirla,
 * la confirmación inline en el mismo lugar donde estaba el botón.
 */
function AccionBoton({
  accion,
  variant = "ghost",
  busy,
  pendingId,
  confirmando,
  onRequest,
  onConfirm,
  onCancel,
}: {
  accion: PendingAction;
  variant?: "primary" | "ghost";
  busy: boolean;
  pendingId: string | null;
  confirmando: boolean;
  onRequest: (accion: PendingAction) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("portal.riesgo");
  const tAcciones = useTranslations("portal.analisis.detail.actions");
  const hintId = accion.hint ? `hint-${accion.id}` : undefined;

  if (confirmando) {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">
          {accion.aviso ?? t("confirmarAccion", { accion: accion.label })}
        </span>
        <PortalButton type="button" size="sm" onClick={onConfirm}>
          {tAcciones("confirm")}
        </PortalButton>
        <PortalButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          {tAcciones("cancel")}
        </PortalButton>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      {accion.hint ? (
        <span id={hintId} className="text-[11px] text-muted">
          {accion.hint}
        </span>
      ) : null}
      <PortalButton
        type="button"
        variant={variant}
        size="sm"
        disabled={busy || accion.disabled}
        pending={pendingId === accion.id}
        aria-describedby={hintId}
        onClick={() => onRequest(accion)}
      >
        {accion.label}
      </PortalButton>
    </span>
  );
}

export function RiesgoMatrizDetail({
  data,
  matrices,
  senales,
  versionSeleccionada,
  reglas,
  reglasErrorKey,
}: {
  data: RiesgoMatrizResult;
  matrices: RiesgoMatriz[];
  senales: Senal[];
  versionSeleccionada: RiesgoMatrizVersion | null;
  reglas: RiesgoRegla[];
  reglasErrorKey: string | null;
}) {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const tAcciones = useTranslations("portal.analisis.detail.actions");
  const locale = useLocale();
  const router = useRouter();

  const { matriz, sandbox_version_id: sandboxVersionId } = data;
  const versiones = [...matriz.versiones].sort(
    (a, b) => b.version_num - a.version_num,
  );
  const vigente = versiones.find((v) => v.estado === "publicado") ?? null;
  const enProduccion =
    matriz.version_produccion_id != null &&
    versiones.some((v) => v.id === matriz.version_produccion_id);
  const esSandbox =
    sandboxVersionId != null &&
    versiones.some((v) => v.id === sandboxVersionId);
  const otrasMatrices = matrices.filter((m) => m.id !== matriz.id);

  const [confirming, setConfirming] = useState<PendingAction | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [duplicando, setDuplicando] = useState(false);
  /** Versión que se está copiando a otra matriz, con el destino elegido. */
  const [copia, setCopia] = useState<{ versionId: string; destino: string } | null>(
    null,
  );
  // El refresh es asincrónico: sin esto, entre la respuesta de la RPC y las
  // filas nuevas se puede volver a publicar la misma versión y sale error.
  const [refreshing, startTransition] = useTransition();

  const selected = versionSeleccionada;
  const busy = pendingId != null || refreshing;

  function request(action: PendingAction) {
    setErrorKey(null);
    setConfirming(action);
  }

  async function ejecutar(action: PendingAction) {
    // Los botones ya se inhabilitan con `busy`, pero un doble click dentro del
    // mismo frame llega antes de ese render: acá se descarta el segundo.
    if (pendingId != null || refreshing) return;
    setPendingId(action.id);
    setErrorKey(null);
    try {
      const { data: resultado, error } = await action.run();
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      if (action.onDone) {
        startTransition(() => action.onDone?.(resultado));
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPendingId(null);
    }
  }

  async function runConfirmed() {
    if (!confirming) return;
    const action = confirming;
    setConfirming(null);
    await ejecutar(action);
  }

  const rpc = () => createSupabaseBrowserClient();

  const crearVersion: PendingAction = {
    id: "crear-version",
    label: t("crearVersion"),
    run: () =>
      rpc().rpc("portal_create_riesgo_matriz_version", {
        p_matriz_id: matriz.id,
      }),
  };

  // El despliegue es de la matriz: la base resuelve cuál es su vigente.
  const produccion: PendingAction = {
    id: "produccion",
    label: enProduccion ? t("quitarProduccion") : t("usarProduccion"),
    disabled: !enProduccion && vigente == null,
    hint: !enProduccion && vigente == null ? t("matrizSinVigente") : undefined,
    run: () =>
      rpc().rpc("portal_set_riesgo_matriz_produccion", {
        p_matriz_id: matriz.id,
        p_activo: !enProduccion,
      }),
  };

  const sandbox: PendingAction = {
    id: "sandbox",
    label: esSandbox ? t("quitarSandbox") : t("usarSandbox"),
    disabled: !esSandbox && vigente == null,
    hint: !esSandbox && vigente == null ? t("matrizSinVigente") : undefined,
    run: () =>
      rpc().rpc("portal_set_riesgo_sandbox_matriz", {
        p_matriz_id: esSandbox ? null : matriz.id,
      }),
  };

  function publicarVersion(version: RiesgoMatrizVersion): PendingAction {
    const faltan = RIESGO_PUNTOS_MAX - version.puntos_asignados;
    // Publicar una versión más vieja que la vigente devolvería version_obsoleta.
    const obsoleta = vigente != null && vigente.version_num > version.version_num;
    return {
      id: `publicar-${version.id}`,
      label: t("publicar"),
      disabled: obsoleta || faltan !== 0,
      hint: obsoleta
        ? t("publicarObsoleta")
        : faltan > 0
          ? t("publicarFaltanPuntos", { puntos: faltan })
          : undefined,
      aviso: vigente
        ? t("publicarReemplaza", {
            version: version.version_num,
            vigente: vigente.version_num,
          })
        : t("publicarPrimera", { version: version.version_num }),
      run: () =>
        rpc().rpc("portal_publish_riesgo_matriz_version", {
          p_version_id: version.id,
        }),
    };
  }

  function copiarVersion(version: RiesgoMatrizVersion, destino: string) {
    void ejecutar({
      id: `copiar-${version.id}`,
      label: t("copiarAMatriz"),
      run: () =>
        rpc().rpc("portal_create_riesgo_matriz_version", {
          p_matriz_id: destino,
          p_notas: t("copiadaDe", {
            matriz: matriz.nombre,
            version: version.version_num,
          }),
          p_copiar_desde: version.id,
        }),
      onDone: (resultado) => {
        setCopia(null);
        // Sin esto la copia queda en una pantalla que el usuario no ve.
        const creada = resultado as { version_num?: number } | null;
        router.push(motorRiesgosMatrizPath(destino, creada?.version_num));
        router.refresh();
      },
    });
  }

  /** Props comunes de todas las acciones de la pantalla. */
  const accionProps = {
    busy,
    pendingId,
    onRequest: request,
    onConfirm: () => void runConfirmed(),
    onCancel: () => setConfirming(null),
  };

  return (
    <div>
      <PortalPanel className="mt-6" hairline>
        <div className="grid gap-3 sm:grid-cols-3">
          <PortalMetric label={t("fieldSlug")} value={matriz.slug} mono />
          <PortalMetric
            label={t("colVigente")}
            value={vigente ? `v${vigente.version_num}` : t("sinVigente")}
          />
          <PortalMetric
            label={t("colDespliegue")}
            value={
              enProduccion
                ? t("estadoProduccion")
                : esSandbox
                  ? t("estadoSandbox")
                  : t("sinDespliegue")
            }
          />
        </div>
        {matriz.descripcion ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {matriz.descripcion}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <AccionBoton
            accion={produccion}
            confirmando={confirming?.id === produccion.id}
            {...accionProps}
          />
          <AccionBoton
            accion={sandbox}
            confirmando={confirming?.id === sandbox.id}
            {...accionProps}
          />
          <PortalButton
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => setDuplicando((prev) => !prev)}
          >
            {t("duplicarMatriz")}
          </PortalButton>
        </div>

        {duplicando ? (
          <RiesgoMatrizDuplicarForm
            matriz={matriz}
            className="mt-4"
            onCancel={() => setDuplicando(false)}
          />
        ) : null}
      </PortalPanel>

      {errorKey ? (
        <PortalAlert className="mt-4">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <PortalPanel title={t("versiones")} className="mt-4">
        {versiones.length === 0 ? (
          <p className="text-sm text-muted">{t("versionesEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {versiones.map((version) => {
              const activa = version.id === selected?.id;
              const copiandoEsta = copia?.versionId === version.id;
              return (
                <li key={version.id}>
                  <div
                    className={`portal-panel portal-panel--inset flex flex-wrap items-center justify-between gap-3 ${
                      activa ? "border-primary/40" : ""
                    }`}
                  >
                    <Link
                      href={motorRiesgosMatrizPath(
                        matriz.id,
                        version.version_num,
                      )}
                      scroll={false}
                      className="flex min-w-0 flex-wrap items-center gap-2 text-left"
                    >
                      <span className="font-mono text-sm text-pure">
                        v{version.version_num}
                      </span>
                      <span
                        className={`portal-badge portal-badge--sm portal-badge--${
                          version.estado === "publicado" ? "ok" : "neutral"
                        }`}
                      >
                        {t(
                          version.estado === "publicado"
                            ? "estadoVigente"
                            : version.estado === "archivado"
                              ? "estadoHistorico"
                              : "estadoBorrador",
                        )}
                      </span>
                      <span className="font-mono text-[11px] text-muted">
                        {t("versionResumen", {
                          reglas: version.reglas_count,
                          puntos: version.puntos_asignados,
                          max: RIESGO_PUNTOS_MAX,
                        })}
                      </span>
                      <span className="text-xs text-muted">
                        {formatDate(
                          version.publicado_at ?? version.created_at,
                          locale,
                        )}
                      </span>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3">
                      {version.estado === "borrador" ? (
                        <AccionBoton
                          accion={publicarVersion(version)}
                          confirmando={
                            confirming?.id === `publicar-${version.id}`
                          }
                          {...accionProps}
                        />
                      ) : null}

                      {copiandoEsta ? (
                        <span className="flex flex-wrap items-end gap-2">
                          <label className="portal-label">
                            <span className="portal-label__text">
                              {t("elegirMatrizDestino")}
                            </span>
                            <select
                              className="portal-field"
                              value={copia.destino}
                              onChange={(event) =>
                                setCopia({
                                  versionId: version.id,
                                  destino: event.target.value,
                                })
                              }
                            >
                              {otrasMatrices.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.nombre}
                                </option>
                              ))}
                            </select>
                          </label>
                          <PortalButton
                            type="button"
                            size="sm"
                            disabled={busy}
                            pending={pendingId === `copiar-${version.id}`}
                            onClick={() => copiarVersion(version, copia.destino)}
                          >
                            {tAcciones("confirm")}
                          </PortalButton>
                          <PortalButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCopia(null)}
                          >
                            {tAcciones("cancel")}
                          </PortalButton>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {otrasMatrices.length === 0 ? (
                            <span
                              id={`sin-otra-${version.id}`}
                              className="text-[11px] text-muted"
                            >
                              {t("sinOtraMatriz")}
                            </span>
                          ) : null}
                          <PortalButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={busy || otrasMatrices.length === 0}
                            aria-describedby={
                              otrasMatrices.length === 0
                                ? `sin-otra-${version.id}`
                                : undefined
                            }
                            onClick={() =>
                              setCopia({
                                versionId: version.id,
                                destino: otrasMatrices[0].id,
                              })
                            }
                          >
                            {t("copiarAMatriz")}
                          </PortalButton>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4">
          <AccionBoton
            accion={crearVersion}
            variant="primary"
            confirmando={confirming?.id === crearVersion.id}
            {...accionProps}
          />
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted/80">
          {t("crearVersionHint")}
        </p>
      </PortalPanel>

      {selected ? (
        /* La key remonta el editor: cada versión arranca con su propio estado. */
        <RiesgoReglasEditor
          key={selected.id}
          version={selected}
          senales={senales}
          reglas={reglas}
          errorKey={reglasErrorKey}
          className="mt-4"
        />
      ) : null}
    </div>
  );
}
