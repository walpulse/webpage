"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { SenalTextos } from "@/components/portal/riesgo/SenalTextos";
import { useModuloLabel } from "@/components/portal/riesgo/useModuloLabel";
import { PortalInput, PortalSelect } from "@/components/portal/ui/PortalField";
import {
  SENAL_MODULOS,
  isKnownValueType,
  senalLabel,
  senalTexto,
} from "@/lib/portal/riesgoLabels";
import type { Senal } from "@/lib/portal/types";

/**
 * Catálogo plataforma de señales, en clave de negocio: qué mide cada señal y
 * cómo conviene usarla en una regla. El `codigo` técnico vive en el selector de
 * señal del editor de reglas, que es donde identifica la fila.
 */
export function SenalesCatalogo({ senales }: { senales: Senal[] }) {
  const t = useTranslations("portal.riesgo");
  const locale = useLocale();
  const moduloLabel = useModuloLabel();

  const [modulo, setModulo] = useState<string>("");
  const [query, setQuery] = useState("");

  const filtradas = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return senales.filter((senal) => {
      if (modulo && senal.modulo !== modulo) return false;
      if (!needle) return true;
      const textos = [
        senalLabel(senal, locale),
        senalTexto(senal, locale, "descripcion"),
        senalTexto(senal, locale, "uso_sugerido"),
      ];
      return textos.some((texto) => texto?.toLowerCase().includes(needle));
    });
  }, [senales, modulo, query, locale]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <PortalSelect
          label={t("filtroModulo")}
          value={modulo}
          onChange={(event) => setModulo(event.target.value)}
        >
          <option value="">{t("todosLosModulos")}</option>
          {SENAL_MODULOS.map((id) => (
            <option key={id} value={id}>
              {moduloLabel(id)}
            </option>
          ))}
        </PortalSelect>
        <PortalInput
          label={t("buscar")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("buscarPlaceholder")}
        />
      </div>

      <p className="mt-3 text-[11px] leading-snug text-muted/80">
        {t("catalogoCount", {
          n: filtradas.length,
          total: senales.length,
        })}
      </p>

      {filtradas.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("catalogoEmpty")}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2.5">
          {filtradas.map((senal) => (
            <li
              key={senal.id}
              className="rounded-xl border border-glass/40 p-3.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-pure">
                  {senalLabel(senal, locale)}
                </span>
                <span className="portal-badge portal-badge--neutral portal-badge--sm">
                  {moduloLabel(senal.modulo)}
                </span>
                <span className="portal-badge portal-badge--neutral portal-badge--sm">
                  {isKnownValueType(senal.value_type)
                    ? t(`valueTypes.${senal.value_type}`)
                    : senal.value_type}
                </span>
              </div>

              <SenalTextos senal={senal} className="mt-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
