"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import {
  PortalKpisPanels,
  formatKpiDate,
} from "@/components/portal/PortalKpisPanels";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import {
  PortalTable,
  TableMessageRow,
} from "@/components/portal/ui/PortalTable";
import { PortalTabs } from "@/components/portal/ui/PortalTabs";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { adminClientePath } from "@/lib/paths";
import { portalErrorKey } from "@/lib/portal/errors";
import type { PortalKpisPorCliente } from "@/lib/portal/kpis";
import type {
  PortalKpiVentana,
  PortalKpisGlobalResult,
  PortalKpisGlobalRow,
} from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const VENTANAS: readonly PortalKpiVentana[] = ["7d", "30d", "total"];
const BREAKDOWN_COLUMNS = 7;

/**
 * Vista del operador del sistema: totales de plataforma
 * (`mv_analisis_kpis_globales`) más el desglose por cliente. Las dos MVs se
 * refrescan con el mismo job, así que comparten snapshot y una sola ventana.
 */
export function PortalKpisOperador({
  globales,
  porCliente,
}: {
  globales: PortalKpisGlobalResult;
  porCliente: PortalKpisPorCliente | null;
}) {
  const t = useTranslations("portal.kpis");
  const tOps = useTranslations("portal.kpis.ops");
  const tAcciones = useTranslations("portal.analisis.detail.actions");
  const te = useTranslations("portal.errors");
  const locale = useLocale();
  const router = useRouter();

  const [ventana, setVentana] = useState<PortalKpiVentana>("total");
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [refreshedMsg, setRefreshedMsg] = useState<string | null>(null);

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const rowsByVentana = useMemo(() => {
    const map = new Map<string, PortalKpisGlobalRow>();
    for (const row of globales.rows) map.set(row.ventana, row);
    return map;
  }, [globales.rows]);

  const row = rowsByVentana.get(ventana) ?? null;
  const breakdown = porCliente?.porVentana[ventana] ?? [];

  const tabs = VENTANAS.filter((id) => rowsByVentana.has(id)).map((id) => ({
    id,
    label: t(`ventanas.${id}`),
  }));

  async function refresh() {
    setConfirming(false);
    setPending(true);
    setErrorKey(null);
    setRefreshedMsg(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_refresh_analisis_kpis");
    setPending(false);
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      return;
    }
    setRefreshedMsg(tOps("refreshDone"));
    router.refresh();
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="portal-section-title">{tOps("title")}</h2>
        {tabs.length > 1 ? (
          <PortalTabs
            tabs={tabs}
            value={ventana}
            onChange={setVentana}
            ariaLabel={t("ventanaLabel")}
          />
        ) : null}
      </div>

      {row == null ? (
        <PortalPanel variant="inset" className="mt-4">
          <p className="text-sm text-muted">{t("noData")}</p>
        </PortalPanel>
      ) : (
        <PortalKpisPanels
          row={row}
          heroExtra={[
            {
              label: tOps("clientesConAnalisis"),
              value: numberFormat.format(row.clientes_con_analisis),
            },
            {
              label: tOps("clientesActivos"),
              value: numberFormat.format(row.clientes_activos),
            },
            {
              label: tOps("clientesTotal"),
              value: numberFormat.format(row.clientes_total),
            },
          ]}
        />
      )}

      <PortalPanel title={tOps("breakdownTitle")} className="mt-4" hairline>
        {porCliente == null ? (
          <p className="text-sm text-muted">{tOps("breakdownUnavailable")}</p>
        ) : (
          <PortalTable>
            <thead>
              <tr>
                <th>{tOps("colCliente")}</th>
                <th>{tOps("colTotal")}</th>
                <th>{tOps("colWallets")}</th>
                <th>{tOps("colExito")}</th>
                <th>{tOps("colGrade")}</th>
                <th>{tOps("colUltimo")}</th>
                <th>{tOps("colEstado")}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.length === 0 ? (
                <TableMessageRow columns={BREAKDOWN_COLUMNS}>
                  {tOps("breakdownEmpty")}
                </TableMessageRow>
              ) : (
                breakdown.map((cliente) => (
                  <tr key={cliente.cliente_id}>
                    <td>
                      <Link
                        href={adminClientePath(cliente.cliente_id)}
                        className="font-medium text-pure hover:text-primary"
                      >
                        {cliente.cliente_nombre}
                      </Link>
                    </td>
                    <td>{numberFormat.format(cliente.total_analisis)}</td>
                    <td>{numberFormat.format(cliente.wallets_unicas)}</td>
                    <td>
                      {cliente.tasa_exito_pct == null
                        ? "—"
                        : `${numberFormat.format(cliente.tasa_exito_pct)}%`}
                    </td>
                    <td>
                      {cliente.grade_predominante ? (
                        <GradeBadge grade={cliente.grade_predominante} />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{formatKpiDate(cliente.ultimo_analisis_at, locale)}</td>
                    <td>
                      <span
                        className={`portal-badge portal-badge--${cliente.cliente_activado ? "ok" : "neutral"} portal-badge--sm`}
                      >
                        {tOps(
                          cliente.cliente_activado
                            ? "estadoActivo"
                            : "estadoInactivo",
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </PortalTable>
        )}
      </PortalPanel>

      {errorKey ? (
        <PortalAlert className="mt-4">{te(errorKey)}</PortalAlert>
      ) : null}
      {refreshedMsg ? (
        <PortalAlert variant="success" className="mt-4">
          {refreshedMsg}
        </PortalAlert>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] leading-snug text-muted/80">
          {t("refrescado", {
            fecha: formatKpiDate(globales.refrescado_at, locale),
          })}{" "}
          {t("refrescadoHint")}
        </p>

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{tOps("refreshConfirm")}</span>
            <PortalButton size="sm" pending={pending} onClick={refresh}>
              {tAcciones("confirm")}
            </PortalButton>
            <PortalButton
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
            >
              {tAcciones("cancel")}
            </PortalButton>
          </div>
        ) : (
          <PortalButton
            variant="ghost"
            size="sm"
            pending={pending}
            onClick={() => {
              setErrorKey(null);
              setRefreshedMsg(null);
              setConfirming(true);
            }}
          >
            {tOps("refreshCta")}
          </PortalButton>
        )}
      </div>
    </section>
  );
}
