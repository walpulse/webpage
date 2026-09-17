"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useState } from "react";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { motorRiesgosMatrizPath } from "@/lib/paths";
import { portalErrorKey } from "@/lib/portal/errors";
import type { RiesgoMatriz } from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/** Mismo formato que el check `riesgo_matrices_slug_format` de la base. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RiesgoMatrizCreateForm() {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTocado, setSlugTocado] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onNombreChange(value: string) {
    setNombre(value);
    if (!slugTocado) setSlug(slugify(value));
  }

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
      const { data, error } = await supabase.rpc("portal_create_riesgo_matriz", {
        p_nombre: nombre.trim(),
        p_slug: slugFinal,
        p_descripcion: descripcion.trim() || null,
      });
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      const created = data as RiesgoMatriz;
      router.replace(motorRiesgosMatrizPath(created.id));
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
    <PortalPanel className="mt-8" hairline>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PortalInput
          label={`${t("fieldNombre")} *`}
          required
          value={nombre}
          onChange={(event) => onNombreChange(event.target.value)}
        />
        <PortalInput
          label={`${t("fieldSlug")} *`}
          required
          value={slug}
          hint={t("slugHint")}
          onChange={(event) => {
            setSlugTocado(true);
            setSlug(event.target.value);
          }}
        />
        <PortalInput
          label={t("fieldDescripcion")}
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
        />

        {errorKey ? (
          <PortalAlert>{te(errorKey as "generic")}</PortalAlert>
        ) : null}

        <PortalButton type="submit" pending={pending} className="mt-1 py-2.5">
          {pending ? tp("submitting") : t("crearMatriz")}
        </PortalButton>
      </form>
    </PortalPanel>
  );
}
