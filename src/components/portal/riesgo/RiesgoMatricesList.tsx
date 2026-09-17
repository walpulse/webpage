"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PortalTable } from "@/components/portal/ui/PortalTable";
import { motorRiesgosMatrizPath, routes } from "@/lib/paths";
import { RIESGO_PUNTOS_MAX } from "@/lib/portal/riesgoLabels";
import type { RiesgoMatricesResult, RiesgoMatriz } from "@/lib/portal/types";

function formatDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

/**
 * Una matriz se despliega entera: lo que se aplica es siempre su vigente, así
 * que alcanza con decir si está en producción o si es la sandbox del cliente.
 */
function estadoDespliegue(matriz: RiesgoMatriz, sandboxVersionId: string | null) {
  const enProduccion =
    matriz.version_produccion_id != null &&
    matriz.versiones.some((v) => v.id === matriz.version_produccion_id);
  const esSandbox =
    sandboxVersionId != null &&
    matriz.versiones.some((v) => v.id === sandboxVersionId);
  return { enProduccion, esSandbox };
}

/**
 * La vigente es la única publicada. Si la matriz todavía no publicó nada, el
 * listado muestra la última versión, que es donde se están cargando reglas.
 */
function versionVigente(matriz: RiesgoMatriz) {
  return matriz.versiones.find((v) => v.estado === "publicado") ?? null;
}

function versionUltima(matriz: RiesgoMatriz) {
  return (
    [...matriz.versiones].sort((a, b) => b.version_num - a.version_num)[0] ??
    null
  );
}

export function RiesgoMatricesList({ data }: { data: RiesgoMatricesResult }) {
  const t = useTranslations("portal.riesgo");
  const locale = useLocale();

  if (data.rows.length === 0) {
    return (
      <div className="portal-panel portal-panel--inset">
        <p className="portal-section-title">{t("matricesEmptyTitle")}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t("matricesEmptyBody")}
        </p>
        <Link
          href={routes.dashboardMotorRiesgosNueva}
          className="portal-btn portal-btn--primary portal-btn--sm mt-4 inline-flex"
        >
          {t("nuevaMatriz")}
        </Link>
      </div>
    );
  }

  return (
    <PortalTable>
      <thead>
        <tr>
          <th>{t("colMatriz")}</th>
          <th>{t("colVersiones")}</th>
          <th>{t("colReglas")}</th>
          <th>{t("colVigente")}</th>
          <th>{t("colDespliegue")}</th>
          <th>{t("colCreada")}</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map((matriz) => {
          const { enProduccion, esSandbox } = estadoDespliegue(
            matriz,
            data.sandbox_version_id,
          );
          const vigente = versionVigente(matriz);
          // Sin vigente, las reglas que importan son las del borrador en curso.
          const referencia = vigente ?? versionUltima(matriz);
          return (
            <tr key={matriz.id}>
              <td>
                <Link
                  href={motorRiesgosMatrizPath(matriz.id)}
                  className="font-medium text-pure hover:text-primary"
                >
                  {matriz.nombre}
                </Link>
                <span className="block font-mono text-[11px] text-muted">
                  {matriz.slug}
                </span>
              </td>
              <td>{matriz.versiones.length}</td>
              <td>
                {referencia ? (
                  <>
                    <span className="text-pure">{referencia.reglas_count}</span>
                    <span className="block font-mono text-[11px] text-muted">
                      {referencia.puntos_asignados}/{RIESGO_PUNTOS_MAX}
                    </span>
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td>
                {vigente ? (
                  <span className="portal-badge portal-badge--ok portal-badge--sm">
                    v{vigente.version_num}
                  </span>
                ) : (
                  <span className="text-muted">{t("sinVigente")}</span>
                )}
              </td>
              <td>
                {enProduccion ? (
                  <span className="portal-badge portal-badge--ok portal-badge--sm">
                    {t("estadoProduccion")}
                  </span>
                ) : esSandbox ? (
                  <span className="portal-badge portal-badge--info portal-badge--sm">
                    {t("estadoSandbox")}
                  </span>
                ) : (
                  <span className="text-muted">{t("sinDespliegue")}</span>
                )}
              </td>
              <td>{formatDate(matriz.created_at, locale)}</td>
            </tr>
          );
        })}
      </tbody>
    </PortalTable>
  );
}
