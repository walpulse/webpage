"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { PuntosBar } from "@/components/portal/riesgo/PuntosBar";
import { RiesgoReglaForm } from "@/components/portal/riesgo/RiesgoReglaForm";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import {
  PortalTable,
  TableMessageRow,
} from "@/components/portal/ui/PortalTable";
import { portalErrorKey } from "@/lib/portal/errors";
import {
  RIESGO_PUNTOS_MAX,
  isKnownOperador,
  puntosAsignados,
  puntosLibres,
  senalLabel,
  umbralShape,
} from "@/lib/portal/riesgoLabels";
import type {
  RiesgoMatrizVersion,
  RiesgoRegla,
  Senal,
} from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const COLUMNS = 6;

function umbralTexto(regla: RiesgoRegla): string {
  const shape = umbralShape(regla.operador);
  if (shape === "none") return "—";
  if (shape === "range") {
    return `${regla.umbral?.min ?? "?"} – ${regla.umbral?.max ?? "?"}`;
  }
  if (shape === "list") return (regla.umbral?.values ?? []).join(", ") || "—";
  return String(regla.umbral?.value ?? "—");
}

/**
 * Reglas de la versión seleccionada. Cada regla suma puntos al puntaje de
 * riesgo 0-100 de la versión, y la suma de las habilitadas no puede pasar 100.
 * Solo los borradores son editables: una versión publicada está congelada por
 * trigger, así que se muestra en lectura.
 */
export function RiesgoReglasEditor({
  version,
  senales,
  reglas,
  errorKey: errorKeyInicial,
  className = "",
}: {
  version: RiesgoMatrizVersion;
  senales: Senal[];
  reglas: RiesgoRegla[];
  errorKey: string | null;
  className?: string;
}) {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const tAcciones = useTranslations("portal.analisis.detail.actions");
  const locale = useLocale();
  const router = useRouter();

  const [errorKey, setErrorKey] = useState<string | null>(errorKeyInicial);
  const [editing, setEditing] = useState<RiesgoRegla | null>(null);
  const [duplicando, setDuplicando] = useState<RiesgoRegla | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  // El refresh del servidor es asincrónico: hasta que llegan las filas nuevas,
  // la tabla que se ve sigue siendo la vieja y volver a clickearla repite la
  // acción (borrar dos veces la misma regla terminaba en error).
  const [refreshing, startTransition] = useTransition();

  const editable = version.estado === "borrador";
  const asignados = puntosAsignados(reglas);
  const libres = RIESGO_PUNTOS_MAX - asignados;
  // Con el presupuesto completo, una regla nueva o una copia nacerían en cero:
  // el alta y el duplicado quedan inhabilitados y el motivo se dice al lado.
  const sinPuntos = libres <= 0;
  const prefill = editing ?? duplicando;
  // Editar y duplicar la misma regla arrancan de estados distintos, así que la
  // key los distingue para que el formulario se remonte al cambiar de modo.
  const formKey = editing
    ? `edit-${editing.id}`
    : duplicando
      ? `dup-${duplicando.id}`
      : "nueva";

  /**
   * Toda acción del panel comparte el mismo ciclo: un solo pendiente, el error
   * traducido y un refresh del servidor para que las reglas y los contadores de
   * versión bajen juntos.
   */
  async function ejecutar(
    id: string,
    fn: (
      supabase: ReturnType<typeof createSupabaseBrowserClient>,
    ) => PromiseLike<{ error: { message: string } | null }>,
  ) {
    // Los botones ya se inhabilitan con `busy`, pero un doble click dentro del
    // mismo frame llega antes de ese render: acá se descarta el segundo.
    if (pendingId != null || refreshing) return;
    setPendingId(id);
    setErrorKey(null);
    try {
      const { error } = await fn(createSupabaseBrowserClient());
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      // Dentro de la transición, `refreshing` sigue en true hasta que el
      // servidor responde, así que el panel queda inerte mientras tanto.
      startTransition(() => router.refresh());
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPendingId(null);
    }
  }

  function borrar(reglaId: string) {
    setDeleting(null);
    return ejecutar(reglaId, (supabase) =>
      supabase.rpc("portal_delete_riesgo_regla", { p_regla_id: reglaId }),
    );
  }

  /**
   * Se manda la lista completa de la versión en el orden nuevo: la RPC reasigna
   * todas las posiciones de una vez, así que no quedan órdenes duplicados a
   * mitad de camino.
   */
  function mover(index: number, delta: number) {
    const destino = index + delta;
    if (destino < 0 || destino >= reglas.length) return;
    const ids = reglas.map((regla) => regla.id);
    [ids[index], ids[destino]] = [ids[destino], ids[index]];
    return ejecutar(reglas[index].id, (supabase) =>
      supabase.rpc("portal_reorder_riesgo_reglas", {
        p_matriz_version_id: version.id,
        p_reglas: ids,
      }),
    );
  }

  function cerrarFormulario() {
    setCreating(false);
    setEditing(null);
    setDuplicando(null);
  }

  // Publicar vive solo en el panel de *Versiones*: dos botones con el mismo
  // nombre en la misma pantalla confundían sobre qué versión se publicaba.
  const busy = pendingId != null || refreshing;

  return (
    <PortalPanel
      className={className}
      aria-busy={busy || undefined}
      eyebrow={`v${version.version_num}`}
      title={t("reglasTitle")}
      actions={
        editable ? (
          <div className="flex flex-wrap items-center gap-2">
            {sinPuntos ? (
              /* Texto visible y no un `title`, que sobre un botón deshabilitado
                 no dispara. Lo comparten el alta y los duplicar de cada fila. */
              <span id="reglas-sin-puntos" className="text-[11px] text-muted">
                {t("reglasSinPuntos")}
              </span>
            ) : null}
            <PortalButton
              type="button"
              size="sm"
              disabled={busy || (sinPuntos && !editing)}
              aria-describedby={sinPuntos ? "reglas-sin-puntos" : undefined}
              onClick={() => {
                setEditing(null);
                setDuplicando(null);
                setCreating(true);
              }}
            >
              {t("nuevaRegla")}
            </PortalButton>
          </div>
        ) : (
          <span className="portal-badge portal-badge--ok portal-badge--sm">
            {t("soloLectura")}
          </span>
        )
      }
    >
      <PuntosBar
        asignados={asignados}
        paraPublicar={editable}
        className="mb-3"
      />

      {editable ? null : (
        <p className="mb-3 text-[11px] leading-snug text-muted/80">
          {t("versionCongeladaHint")}
        </p>
      )}

      {errorKey ? (
        <PortalAlert className="mb-3">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <PortalTable>
        <thead>
          <tr>
            <th aria-label={t("colOrden")} />
            <th>{t("colRegla")}</th>
            <th>{t("colOperador")}</th>
            <th>{t("colUmbral")}</th>
            <th>{t("colPuntos")}</th>
            <th aria-label={t("colAcciones")} />
          </tr>
        </thead>
        <tbody>
          {reglas.length === 0 ? (
            <TableMessageRow columns={COLUMNS}>
              {editable ? t("reglasEmpty") : t("reglasEmptyPublicada")}
            </TableMessageRow>
          ) : (
            reglas.map((regla, index) => (
              <tr key={regla.id}>
                <td>
                  {editable && reglas.length > 1 ? (
                    <span className="flex items-center gap-1">
                      <PortalButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t("subirRegla")}
                        disabled={busy || index === 0}
                        onClick={() => void mover(index, -1)}
                      >
                        <span aria-hidden="true">↑</span>
                      </PortalButton>
                      <PortalButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t("bajarRegla")}
                        disabled={busy || index === reglas.length - 1}
                        onClick={() => void mover(index, 1)}
                      >
                        <span aria-hidden="true">↓</span>
                      </PortalButton>
                    </span>
                  ) : null}
                </td>
                <td>
                  <span className="text-pure">{regla.nombre}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {regla.senal
                      ? senalLabel(regla.senal, locale)
                      : regla.codigo}
                  </span>
                </td>
                <td>
                  {isKnownOperador(regla.operador)
                    ? t(`operadores.${regla.operador}`)
                    : regla.operador}
                </td>
                <td className="font-mono text-[11px]">{umbralTexto(regla)}</td>
                <td>
                  <span className="font-mono text-sm text-pure">
                    {regla.efecto?.valor ?? 0}
                  </span>
                  {regla.habilitada ? null : (
                    <span className="ml-2 portal-badge portal-badge--neutral portal-badge--sm">
                      {t("reglaDeshabilitada")}
                    </span>
                  )}
                </td>
                <td>
                  {editable ? (
                    deleting === regla.id ? (
                      <span className="flex items-center gap-2">
                        <PortalButton
                          type="button"
                          variant="danger"
                          size="sm"
                          pending={pendingId === regla.id}
                          onClick={() => void borrar(regla.id)}
                        >
                          {tAcciones("confirm")}
                        </PortalButton>
                        <PortalButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleting(null)}
                        >
                          {tAcciones("cancel")}
                        </PortalButton>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PortalButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => {
                            setCreating(false);
                            setDuplicando(null);
                            setEditing(regla);
                          }}
                        >
                          {t("editar")}
                        </PortalButton>
                        <PortalButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          // Duplicar no libera los puntos del original, así que
                          // sin presupuesto la copia nacería en cero.
                          disabled={busy || sinPuntos}
                          aria-describedby={
                            sinPuntos ? "reglas-sin-puntos" : undefined
                          }
                          onClick={() => {
                            setCreating(false);
                            setEditing(null);
                            setDuplicando(regla);
                          }}
                        >
                          {t("duplicar")}
                        </PortalButton>
                        <PortalButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setDeleting(regla.id)}
                        >
                          {t("borrar")}
                        </PortalButton>
                      </span>
                    )
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </PortalTable>

      {editable && (creating || prefill) ? (
        <RiesgoReglaForm
          /* Remonta al cambiar de regla: el prefill vive en el estado inicial. */
          key={formKey}
          versionId={version.id}
          senales={senales}
          regla={prefill}
          /* Al duplicar no viaja el id: la base inserta y le deriva su código. */
          reglaId={editing?.id ?? null}
          puntosLibres={puntosLibres(reglas, editing)}
          onDone={() => {
            cerrarFormulario();
            startTransition(() => router.refresh());
          }}
          onCancel={cerrarFormulario}
        />
      ) : null}
    </PortalPanel>
  );
}
