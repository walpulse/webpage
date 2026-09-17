"use client";

import { useLocale, useTranslations } from "next-intl";
import { senalTexto } from "@/lib/portal/riesgoLabels";
import type { Senal } from "@/lib/portal/types";

/**
 * Texto de negocio de una señal: qué calcula y cómo usarla. Lo comparten el
 * catálogo y el formulario de reglas, que muestran lo mismo y no deberían
 * despegarse.
 */
export function SenalTextos({
  senal,
  className = "",
}: {
  senal: Senal;
  className?: string;
}) {
  const t = useTranslations("portal.riesgo");
  const locale = useLocale();

  const queCalcula = senalTexto(senal, locale, "descripcion");
  const comoUsarla = senalTexto(senal, locale, "uso_sugerido");

  return (
    <div className={className}>
      {queCalcula ? (
        <p className="text-[13px] leading-relaxed text-pure/80">
          <span className="portal-eyebrow--muted mr-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
            {t("senalQueCalcula")}
          </span>
          {queCalcula}
        </p>
      ) : (
        <p className="text-[13px] text-muted">{t("senalSinTexto")}</p>
      )}

      {comoUsarla ? (
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          <span className="portal-eyebrow--muted mr-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
            {t("senalComoUsarla")}
          </span>
          {comoUsarla}
        </p>
      ) : null}
    </div>
  );
}
