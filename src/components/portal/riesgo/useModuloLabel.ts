"use client";

import { useTranslations } from "next-intl";
import { isKnownModulo } from "@/lib/portal/riesgoLabels";

/**
 * Etiqueta de un módulo del catálogo de señales. Las cuatro partes del análisis
 * ya estaban traducidas en `portal.kpis`; `custody` y `compliance` solo existen
 * en el Motor de Riesgos, así que viven en `portal.riesgo`.
 */
export function useModuloLabel() {
  const t = useTranslations("portal.riesgo");
  const tKpis = useTranslations("portal.kpis");

  return (modulo: string) => {
    if (!isKnownModulo(modulo)) return modulo;
    return modulo === "custody" || modulo === "compliance"
      ? t(`modulos.${modulo}`)
      : tKpis(`modulos.${modulo}`);
  };
}
