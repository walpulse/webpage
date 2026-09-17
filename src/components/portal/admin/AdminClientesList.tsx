"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import {
  PortalCheckbox,
  PortalInput,
} from "@/components/portal/ui/PortalField";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import {
  PortalTable,
  TableMessageRow,
  TableSkeletonRows,
} from "@/components/portal/ui/PortalTable";
import { portalErrorKey } from "@/lib/portal/errors";
import type { AdminCliente } from "@/lib/portal/types";
import { adminClientePath, routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function formatDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AdminClientesList() {
  const t = useTranslations("portal.admin");
  const te = useTranslations("portal.errors");
  const locale = useLocale();
  const [rows, setRows] = useState<AdminCliente[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_list_clientes");
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      setRows([]);
      return;
    }
    setRows((data as AdminCliente[] | null) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl">
      <PortalPageHeader
        title={t("clientesTitle")}
        description={t("clientesIntro")}
        actions={
          <Link
            href={routes.adminClienteNuevo}
            className="portal-btn portal-btn--primary"
          >
            {t("nuevoCliente")}
          </Link>
        }
      />

      {errorKey ? (
        <PortalAlert className="mt-4">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <div className="mt-8">
        <PortalTable tableClassName="min-w-[640px]">
          <thead>
            <tr>
              <th>{t("colNombre")}</th>
              <th>{t("colPais")}</th>
              <th>{t("colEmail")}</th>
              <th>{t("colActivado")}</th>
              <th>{t("colCreated")}</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <TableSkeletonRows columns={5} rows={4} />
            ) : rows.length === 0 ? (
              <TableMessageRow columns={5}>
                {t("emptyClientes")}
              </TableMessageRow>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link
                      href={adminClientePath(row.id)}
                      className="font-medium text-pure hover:text-primary"
                    >
                      {row.nombre}
                    </Link>
                    {row.es_operador_sistema ? (
                      <span className="portal-badge portal-badge--info portal-badge--sm ml-2">
                        {t("operadorBadge")}
                      </span>
                    ) : null}
                  </td>
                  <td>{row.pais ?? "—"}</td>
                  <td>{row.email ?? "—"}</td>
                  <td>
                    <span
                      className={`portal-badge portal-badge--sm ${
                        row.activado
                          ? "portal-badge--ok"
                          : "portal-badge--neutral"
                      }`}
                    >
                      {row.activado ? t("si") : t("no")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    {formatDate(row.created_at, locale)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </PortalTable>
      </div>
    </div>
  );
}

export function AdminClienteCreateForm() {
  const t = useTranslations("portal.admin");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [activado, setActivado] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("admin_create_cliente", {
        p_nombre: nombre.trim(),
        p_pais: pais.trim() || null,
        p_email: email.trim() || null,
        p_direccion: direccion.trim() || null,
        p_telefono: telefono.trim() || null,
        p_activado: activado,
      });
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      const created = data as AdminCliente;
      router.replace(adminClientePath(created.id));
      router.refresh();
    } catch (err) {
      setErrorKey(portalErrorKey(err instanceof Error ? err.message : "generic"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href={routes.adminClientes}
        className="text-sm text-muted hover:text-pure"
      >
        ← {t("volverListado")}
      </Link>
      <PortalPageHeader
        className="mt-4"
        title={t("nuevoTitle")}
        description={t("nuevoIntro")}
      />

      <PortalPanel className="mt-8" hairline>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <PortalInput
            label={`${t("fieldNombre")} *`}
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <PortalInput
            label={t("fieldPais")}
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
          <PortalInput
            label={t("fieldEmail")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PortalInput
            label={t("fieldTelefono")}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <PortalInput
            label={t("fieldDireccion")}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <PortalCheckbox
            label={t("fieldActivado")}
            checked={activado}
            onChange={(e) => setActivado(e.target.checked)}
          />

          {errorKey ? (
            <PortalAlert>{te(errorKey as "generic")}</PortalAlert>
          ) : null}

          <PortalButton type="submit" pending={pending} className="mt-1 py-2.5">
            {pending ? tp("submitting") : t("crear")}
          </PortalButton>
        </form>
      </PortalPanel>
    </div>
  );
}
