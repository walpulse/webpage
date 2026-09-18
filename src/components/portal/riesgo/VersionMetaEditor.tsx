"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { portalErrorKey } from "@/lib/portal/errors";
import type { RiesgoMatrizVersion } from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Nombre y notas de una versión: metadata editable en cualquier estado.
 * origen_copia es de solo lectura (procedencia de copia entre matrices).
 */
export function VersionMetaEditor({
  version,
}: {
  version: RiesgoMatrizVersion;
}) {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const router = useRouter();
  const [nombre, setNombre] = useState(version.nombre ?? "");
  const [notas, setNotas] = useState(version.notas ?? "");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [refreshing, startTransition] = useTransition();

  useEffect(() => {
    setNombre(version.nombre ?? "");
    setNotas(version.notas ?? "");
    setErrorKey(null);
  }, [version.id, version.nombre, version.notas]);

  const dirty =
    (nombre.trim() || null) !== (version.nombre?.trim() || null) ||
    (notas.trim() || null) !== (version.notas?.trim() || null);
  const busy = pending || refreshing;

  async function guardar() {
    if (pending || refreshing || !dirty) return;
    setPending(true);
    setErrorKey(null);
    try {
      const { error } = await createSupabaseBrowserClient().rpc(
        "portal_update_riesgo_matriz_version",
        {
          p_version_id: version.id,
          p_nombre: nombre,
          p_notas: notas,
        },
      );
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3 w-full border-t border-glass/40 pt-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <PortalInput
          label={t("versionNombre")}
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder={t("versionNombrePlaceholder")}
          maxLength={120}
          disabled={busy}
        />
        <label className="portal-label">
          <span className="portal-label__text">{t("versionNotas")}</span>
          <textarea
            className="portal-field min-h-[2.5rem] resize-y"
            value={notas}
            onChange={(event) => setNotas(event.target.value)}
            placeholder={t("versionNotasPlaceholder")}
            rows={2}
            maxLength={2000}
            disabled={busy}
          />
        </label>
      </div>

      {version.origen_copia ? (
        <p className="mt-2 text-[11px] leading-snug text-muted/80">
          {t("versionOrigenCopia", { origen: version.origen_copia })}
        </p>
      ) : null}

      {errorKey ? (
        <PortalAlert className="mt-2">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <div className="mt-2 flex items-center gap-2">
        <PortalButton
          type="button"
          size="sm"
          disabled={busy || !dirty}
          pending={pending}
          onClick={() => void guardar()}
        >
          {t("guardarVersionMeta")}
        </PortalButton>
        {dirty ? (
          <button
            type="button"
            className="text-[11px] text-muted underline-offset-2 hover:text-pure hover:underline"
            disabled={busy}
            onClick={() => {
              setNombre(version.nombre ?? "");
              setNotas(version.notas ?? "");
              setErrorKey(null);
            }}
          >
            {t("descartarVersionMeta")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
