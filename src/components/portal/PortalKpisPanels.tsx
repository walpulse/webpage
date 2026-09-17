"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { PortalMetric } from "@/components/portal/ui/PortalMetric";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { GradeBadge } from "@/components/ui/GradeBadge";
import {
  ANALISIS_GRADES,
  isKnownGrade,
  isKnownTier,
} from "@/lib/portal/analisisLabels";
import type { PortalKpisMetrics } from "@/lib/portal/types";

const MODULOS = ["origins", "activity", "multichain", "portfolio"] as const;
const CUSTODY_CLASSES = [
  "hosted_known",
  "hosted_deposit_inferred",
  "likely_unhosted",
  "unknown",
] as const;
const IDIOMAS = ["es", "en", "pt"] as const;
const TIERS = ["basica", "estandar", "experta"] as const;

/** Misma familia de color que `GradeBadge`; la opacidad separa el segundo grado. */
const GRADE_SEGMENT: Record<string, string> = {
  A: "bg-grade-a",
  B: "bg-grade-a/55",
  C: "bg-grade-c",
  D: "bg-grade-c/55",
  F: "bg-grade-f",
};

const EMPTY_HISTO: Record<string, number> = {};

export function formatKpiDate(value: string | null, locale: string) {
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
 * Las seis familias de KPI de una fila, sin estado ni fetch. Sirve igual para
 * `mv_cliente_analisis_kpis` y `mv_analisis_kpis_globales` porque comparten
 * nombres de columna; `heroExtra` es lo único que cambia entre scopes.
 */
export function PortalKpisPanels({
  row,
  heroExtra = [],
}: {
  row: PortalKpisMetrics;
  heroExtra?: { label: string; value: React.ReactNode }[];
}) {
  const t = useTranslations("portal.kpis");
  const tAnalisis = useTranslations("portal.analisis");
  const locale = useLocale();

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const num = (value: number | null | undefined) =>
    value == null ? "—" : numberFormat.format(value);

  /** Latencia de extremo a extremo: segundos crudos, en minutos a partir de 90 s. */
  const seconds = (value: number | null) => {
    if (value == null) return "—";
    if (value < 90) return t("unitSeconds", { n: numberFormat.format(value) });
    return t("unitMinutes", {
      n: numberFormat.format(Math.round(value / 60)),
    });
  };

  const tierLabel = (tier: string) =>
    isKnownTier(tier) ? tAnalisis(`tierLabels.${tier}`) : tier;

  /** Custodia en una línea: solo las clases con dato, más "sin dato". */
  const custodia = [
    ...CUSTODY_CLASSES.map((clase) => ({
      clase: clase as string,
      label: t(`custody.${clase}`),
      value: row.custody_classes?.[clase] ?? 0,
    })),
    {
      clase: "sin_dato",
      label: t("sinDato"),
      value: row.custody_classes?.sin_dato ?? 0,
    },
  ].filter((entry) => entry.value > 0);

  const hero: { label: string; value: React.ReactNode }[] = [
    { label: t("heroTotal"), value: num(row.total_analisis) },
    { label: t("heroWallets"), value: num(row.wallets_unicas) },
    {
      label: t("heroExito"),
      value:
        row.tasa_exito_pct == null
          ? "—"
          : `${numberFormat.format(row.tasa_exito_pct)}%`,
    },
    { label: t("heroDias"), value: num(row.dias_desde_ultimo_analisis) },
    ...heroExtra,
  ];

  return (
    <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {hero.map((metric) => (
          <PortalPanel key={metric.label} variant="accent" hairline>
            <PortalMetric label={metric.label} value={metric.value} />
          </PortalPanel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <PortalPanel title={t("groupVolumen")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {TIERS.map((tier) => (
              <PortalMetric
                key={tier}
                label={tierLabel(tier)}
                value={num(
                  tier === "basica"
                    ? row.analisis_basica
                    : tier === "estandar"
                      ? row.analisis_estandar
                      : row.analisis_experta,
                )}
              />
            ))}
            <PortalMetric
              label={t("canalDirect")}
              value={num(row.canal_direct)}
            />
            <PortalMetric label={t("canalApi")} value={num(row.canal_api)} />
            {IDIOMAS.map((idioma) => (
              <PortalMetric
                key={idioma}
                label={t(`idiomas.${idioma}`)}
                value={num(row.analisis_por_idioma?.[idioma] ?? 0)}
              />
            ))}
          </div>
        </PortalPanel>

        <PortalPanel title={t("groupFiabilidad")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <PortalMetric label={t("ok")} value={num(row.ok)} />
            <PortalMetric
              label={t("okConWarnings")}
              value={num(row.ok_con_warnings)}
            />
            <PortalMetric label={t("fallidos")} value={num(row.fallidos)} />
            <PortalMetric label={t("enCurso")} value={num(row.en_curso)} />
            <PortalMetric
              label={t("cancelados")}
              value={num(row.cancelados)}
            />
            <PortalMetric label={t("conPdf")} value={num(row.con_pdf)} />
            <PortalMetric
              label={t("conOnchain")}
              value={num(row.con_onchain)}
            />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted/80">
            {t("fiabilidadHint")}
          </p>
        </PortalPanel>

        <PortalPanel title={t("groupRiesgo")} className="lg:col-span-2">
          <div className="grid gap-4 lg:grid-cols-4">
            <PortalMetric
              label={t("gradePredominante")}
              value={
                row.grade_predominante ? (
                  <span className="flex items-center gap-2">
                    <GradeBadge grade={row.grade_predominante} />
                    <span className="text-base">
                      {isKnownGrade(row.grade_predominante)
                        ? tAnalisis(`gradeLabels.${row.grade_predominante}`)
                        : row.grade_predominante}
                    </span>
                  </span>
                ) : (
                  "—"
                )
              }
            />
            <div className="lg:col-span-3">
              <p className="portal-metric__label">{t("gradesSintesis")}</p>
              <GradeBar counts={row.grades_sintesis ?? EMPTY_HISTO} />
            </div>
          </div>

          <div className="my-4 h-px bg-glass" aria-hidden />

          <p className="portal-metric__label">{t("custodyClasses")}</p>
          {custodia.length === 0 ? (
            <p className="mt-2 text-sm text-muted">—</p>
          ) : (
            <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              {custodia.map((entry) => (
                <li key={entry.clase} className="flex items-center gap-1.5">
                  <span className="text-sm text-muted">{entry.label}</span>
                  <span className="font-mono text-sm text-foreground">
                    {num(entry.value)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] leading-snug text-muted/80">
            {t("custodyHint")}
          </p>
        </PortalPanel>

        <PortalPanel title={t("gradesModulos")} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULOS.map((modulo) => (
              <div key={modulo}>
                <p className="portal-metric__label">{t(`modulos.${modulo}`)}</p>
                <GradeBar
                  counts={row.grades_modulos?.[modulo] ?? EMPTY_HISTO}
                  dense
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted/80">
            {t("modulosHint")}
          </p>
        </PortalPanel>

        <PortalPanel title={t("groupLatencia")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <PortalMetric
              label={t("latenciaP50")}
              value={seconds(row.latencia_p50_seg)}
            />
            <PortalMetric
              label={t("latenciaP95")}
              value={seconds(row.latencia_p95_seg)}
            />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted/80">
            {t("latenciaHint")}
          </p>
        </PortalPanel>

        <PortalPanel title={t("groupCompliance")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <PortalMetric label={t("screensOk")} value={num(row.screens_ok)} />
            <PortalMetric
              label={t("screensError")}
              value={num(row.screens_error)}
            />
            <PortalMetric
              label={t("sancionadas")}
              value={num(row.sancionadas)}
            />
            <PortalMetric
              label={t("conListMatch")}
              value={num(row.con_list_match)}
            />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted/80">
            {t("complianceHint")}
          </p>
        </PortalPanel>

        <PortalPanel title={t("groupRecencia")} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <PortalMetric
              label={t("primerAnalisis")}
              value={formatKpiDate(row.primer_analisis_at, locale)}
            />
            <PortalMetric
              label={t("ultimoAnalisis")}
              value={formatKpiDate(row.ultimo_analisis_at, locale)}
            />
          </div>
        </PortalPanel>
      </div>
    </>
  );
}

/**
 * Distribución de grados como barra proporcional más leyenda. El denominador
 * va explícito porque cambia entre la síntesis y cada parte del análisis: un
 * módulo que no aplica al tier cuenta como sin grado.
 */
function GradeBar({
  counts,
  dense = false,
}: {
  counts: Record<string, number>;
  dense?: boolean;
}) {
  const t = useTranslations("portal.kpis");
  const tAnalisis = useTranslations("portal.analisis");
  const locale = useLocale();

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const percentFormat = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const entries = ANALISIS_GRADES.map((grade) => ({
    grade,
    value: counts[grade] ?? 0,
  })).filter((entry) => entry.value > 0);

  const conGrade = entries.reduce((acc, entry) => acc + entry.value, 0);
  const sinGrade = counts.sin_grade ?? 0;

  if (conGrade === 0) {
    // En un módulo, "sin grado" suele ser "el tier no lo incluye", así que ahí
    // el motivo lo explica la nota del panel y no se afirma que falló.
    if (sinGrade === 0) return <p className="mt-2 text-sm text-muted">—</p>;
    return (
      <p className="mt-2 text-sm text-muted">
        {dense
          ? `${t("sinGrade")}: ${numberFormat.format(sinGrade)}`
          : t("sinGradeHint", { n: numberFormat.format(sinGrade) })}
      </p>
    );
  }

  const gradeLabel = (grade: string) =>
    isKnownGrade(grade) ? tAnalisis(`gradeLabels.${grade}`) : grade;

  const composicion = entries
    .map(
      (entry) =>
        `${entry.grade} ${gradeLabel(entry.grade)}: ${numberFormat.format(entry.value)} (${percentFormat.format(entry.value / conGrade)})`,
    )
    .join(", ");

  return (
    <div className="mt-2">
      <div
        className="flex h-2 overflow-hidden rounded-full bg-glass"
        role="img"
        aria-label={composicion}
      >
        {entries.map((entry) => (
          <div
            key={entry.grade}
            className={GRADE_SEGMENT[entry.grade] ?? "bg-glass"}
            style={{ width: `${(entry.value / conGrade) * 100}%` }}
          />
        ))}
      </div>

      <ul
        className={`mt-2 flex flex-wrap items-center ${dense ? "gap-x-3 gap-y-1.5" : "gap-x-4 gap-y-2"}`}
        aria-hidden
      >
        {entries.map((entry) => (
          <li key={entry.grade} className="flex items-center gap-1.5">
            <GradeBadge grade={entry.grade} />
            {dense ? null : (
              <span className="text-sm text-foreground">
                {gradeLabel(entry.grade)}
              </span>
            )}
            <span className="font-mono text-sm text-foreground">
              {numberFormat.format(entry.value)}
            </span>
            <span className="font-mono text-xs text-muted">
              {percentFormat.format(entry.value / conGrade)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[11px] leading-snug text-muted/80">
        {t("gradeScope", { n: numberFormat.format(conGrade) })}
        {!dense && sinGrade > 0
          ? ` ${t("sinGradeHint", { n: numberFormat.format(sinGrade) })}`
          : ""}
      </p>
    </div>
  );
}
