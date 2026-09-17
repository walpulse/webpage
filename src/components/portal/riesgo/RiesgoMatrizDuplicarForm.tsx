"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useState } from "react";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { motorRiesgosMatrizPath } from "@/lib/paths";
import { portalErrorKey } from "@/lib/portal/errors";
import type { RiesgoMatriz } from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/** Mismo formato que el check `riesgo_matrices_slug_format` de la base. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function RiesgoMatrizDuplicarForm({
  matriz,
  className = "",
  onCancel,
}: {
  matriz: RiesgoMatriz;
  className?: string;
  onCancel: () => void;
}) {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const tAcciones = useTranslations("portal.analisis.detail.actions");
  const router = useRouter();

  const [nombre, setNombre] = useState(
    t("nombreCopia", { nombre: matriz.nombre }),
  );
  const [slug, setSlug] = useState(`${matriz.slug}-copia`);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);

    const slugFinal = slug.trim();
    if (!SLUG_RE.test(slugFinal)) {
      setErrorKey("invalid_slug");
      return;
    }

    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc(
        "portal_duplicate_riesgo_matriz",
        {
          p_matriz_id: matriz.id,
          p_nombre: nombre.trim(),
          p_slug: slugFinal,
        },
      );
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      const creada = data as RiesgoMatriz;
      router.push(motorRiesgosMatrizPath(creada.id));
      router.refresh();
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-xl border border-glass/40 p-4 ${className}`}
    >
      <h3 className="portal-section-title">{t("duplicarMatriz")}</h3>
      <p className="mt-1 text-[11px] leading-snug text-muted/80">
        {t("duplicarMatrizIntro")}
      </p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <PortalInput
          label={`${t("fieldNombre")} *`}
          required
          value={nombre}
          fieldClassName="sm:w-64"
          onChange={(event) => setNombre(event.target.value)}
        />
        <PortalInput
          label={`${t("fieldSlug")} *`}
          required
          value={slug}
          hint={t("slugHint")}
          fieldClassName="sm:w-64"
          onChange={(event) => setSlug(event.target.value)}
        />
      </div>

      {errorKey ? (
        <PortalAlert className="mt-3">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PortalButton type="submit" size="sm" pending={pending}>
          {pending ? tp("submitting") : t("duplicarMatriz")}
        </PortalButton>
        <PortalButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          {tAcciones("cancel")}
        </PortalButton>
      </div>
    </form>
  );
}
