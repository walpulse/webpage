"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  PortalKpisPanels,
  formatKpiDate,
} from "@/components/portal/PortalKpisPanels";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { PortalTabs } from "@/components/portal/ui/PortalTabs";
import { routes } from "@/lib/paths";
import type {
  PortalKpiVentana,
  PortalKpisResult,
  PortalKpisRow,
} from "@/lib/portal/types";

const VENTANAS: readonly PortalKpiVentana[] = ["7d", "30d", "total"];

export function PortalKpis({ data }: { data: PortalKpisResult }) {
  const t = useTranslations("portal.kpis");
  const locale = useLocale();
  const [ventana, setVentana] = useState<PortalKpiVentana>("total");

  const rowsByVentana = useMemo(() => {
    const map = new Map<string, PortalKpisRow>();
    for (const row of data.rows) map.set(row.ventana, row);
    return map;
  }, [data.rows]);

  const row = rowsByVentana.get(ventana) ?? null;

  const tabs = VENTANAS.filter((id) => rowsByVentana.has(id)).map((id) => ({
    id,
    label: t(`ventanas.${id}`),
  }));

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="portal-section-title">{t("title")}</h2>
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
      ) : row.total_analisis === 0 ? (
        <PortalPanel variant="inset" className="mt-4">
          <p className="portal-section-title">{t("emptyTitle")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("emptyBody")}
          </p>
          <Link
            href={`/${locale}${routes.dashboardAnalisisNuevo}`}
            className="portal-btn portal-btn--primary portal-btn--sm mt-4 inline-flex"
          >
            {t("emptyCta")}
          </Link>
        </PortalPanel>
      ) : (
        <PortalKpisPanels row={row} />
      )}

      <p className="mt-3 text-[11px] leading-snug text-muted/80">
        {t("refrescado", { fecha: formatKpiDate(data.refrescado_at, locale) })}{" "}
        {t("refrescadoHint")}
      </p>
    </section>
  );
}
