"use client";

import { useTranslations } from "next-intl";
import { RIESGO_PUNTOS_MAX } from "@/lib/portal/riesgoLabels";

/**
 * Presupuesto de puntos de una versión: lo que ya suman sus reglas habilitadas
 * y, cuando se está cargando una regla, lo que esa regla agrega (`extra`). Si el
 * total pasa de 100 el tramo de la regla se pinta en rojo, porque la base
 * rechaza la escritura.
 */
export function PuntosBar({
  asignados,
  extra = 0,
  leyenda = false,
  paraPublicar = false,
  className = "",
}: {
  asignados: number;
  extra?: number;
  leyenda?: boolean;
  /** En un borrador, el faltante explica el requisito de publicar. */
  paraPublicar?: boolean;
  className?: string;
}) {
  const t = useTranslations("portal.riesgo");

  const total = asignados + extra;
  const libres = RIESGO_PUNTOS_MAX - total;
  const exceso = Math.max(0, -libres);

  const ancho = (valor: number) =>
    `${Math.min(100, Math.max(0, (valor / RIESGO_PUNTOS_MAX) * 100))}%`;
  // El tramo de la regla ocupa como mucho lo que quedaba libre: pasado el 100
  // la barra se llena y el excedente lo cuenta el texto.
  const anchoExtra = ancho(Math.min(extra, Math.max(0, RIESGO_PUNTOS_MAX - asignados)));

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="portal-eyebrow--muted font-mono text-[10px] uppercase tracking-[0.12em]">
          {t("puntosPresupuesto")}
        </span>
        <span className="font-mono text-sm text-pure">
          {total}/{RIESGO_PUNTOS_MAX}
        </span>
      </div>

      <div
        className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-glass/40"
        role="progressbar"
        aria-valuenow={total}
        aria-valuemin={0}
        aria-valuemax={RIESGO_PUNTOS_MAX}
      >
        <div
          className={extra > 0 ? "h-full bg-primary/50" : "h-full bg-primary"}
          style={{ width: ancho(asignados) }}
        />
        {extra > 0 ? (
          <div
            className={exceso > 0 ? "h-full bg-grade-f" : "h-full bg-primary"}
            style={{ width: anchoExtra }}
          />
        ) : null}
      </div>

      {leyenda ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-primary/50" />
            {t("puntosOtrasReglas", { puntos: asignados })}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-3 rounded-full ${exceso > 0 ? "bg-grade-f" : "bg-primary"}`}
            />
            {t("puntosEstaRegla", { puntos: extra })}
          </span>
        </div>
      ) : null}

      <p className="mt-1.5 text-[11px] leading-snug text-muted/80">
        {exceso > 0
          ? t("puntosSobrepasa", { puntos: exceso })
          : libres > 0
            ? paraPublicar
              ? t("puntosFaltanPublicar", { puntos: libres })
              : t("puntosLibres", { puntos: libres })
            : t("puntosCompletos")}
      </p>
    </div>
  );
}
