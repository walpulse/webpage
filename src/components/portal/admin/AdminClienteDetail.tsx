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
import { PortalTabs } from "@/components/portal/ui/PortalTabs";
import { portalErrorKey } from "@/lib/portal/errors";
import type {
  AdminApiKey,
  AdminCliente,
  AdminInvitacion,
} from "@/lib/portal/types";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Tab = "datos" | "invites" | "keys";

function formatDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AdminClienteDetail({ clienteId }: { clienteId: string }) {
  const t = useTranslations("portal.admin");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const locale = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("datos");
  const [cliente, setCliente] = useState<AdminCliente | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [activado, setActivado] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [pending, setPending] = useState(false);

  const loadCliente = useCallback(async () => {
    setLoadError(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_get_cliente", {
      p_id: clienteId,
    });
    if (error) {
      setLoadError(portalErrorKey(error.message));
      setCliente(null);
      return;
    }
    const row = data as AdminCliente;
    setCliente(row);
    setNombre(row.nombre);
    setPais(row.pais ?? "");
    setEmail(row.email ?? "");
    setTelefono(row.telefono ?? "");
    setDireccion(row.direccion ?? "");
    setActivado(row.activado);
  }, [clienteId]);

  useEffect(() => {
    void loadCliente();
  }, [loadCliente]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaveError(null);
    setSaveOk(false);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("admin_update_cliente", {
        p_id: clienteId,
        p_patch: {
          nombre: nombre.trim(),
          pais: pais.trim() || null,
          email: email.trim() || null,
          telefono: telefono.trim() || null,
          direccion: direccion.trim() || null,
          activado,
        },
      });
      if (error) {
        setSaveError(portalErrorKey(error.message));
        return;
      }
      const row = data as AdminCliente;
      setCliente(row);
      setSaveOk(true);
      router.refresh();
    } catch (err) {
      setSaveError(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPending(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={routes.adminClientes}
          className="text-sm text-muted hover:text-pure"
        >
          ← {t("volverListado")}
        </Link>
        <PortalAlert className="mt-6">{te(loadError as "generic")}</PortalAlert>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-3" aria-busy>
        <span className="portal-skeleton block h-8 w-1/2" />
        <span className="portal-skeleton block h-10 w-64" />
        <span className="portal-skeleton block h-64 w-full" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "datos", label: t("tabDatos") },
    { id: "invites", label: t("tabInvitaciones") },
    { id: "keys", label: t("tabApiKeys") },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={routes.adminClientes}
        className="text-sm text-muted hover:text-pure"
      >
        ← {t("volverListado")}
      </Link>

      <PortalPageHeader
        className="mt-4"
        title={cliente.nombre}
        actions={
          cliente.es_operador_sistema ? (
            <span className="portal-badge portal-badge--info">
              {t("operadorBadge")}
            </span>
          ) : undefined
        }
      />

      <PortalTabs
        className="mt-6"
        tabs={tabs}
        value={tab}
        onChange={setTab}
        ariaLabel={cliente.nombre}
      />

      {tab === "datos" ? (
        <PortalPanel className="mt-6" hairline>
          <form onSubmit={onSave} className="flex flex-col gap-4">
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

            {saveError ? (
              <PortalAlert>{te(saveError as "generic")}</PortalAlert>
            ) : null}
            {saveOk ? (
              <PortalAlert variant="success">{t("guardar")} ✓</PortalAlert>
            ) : null}

            <PortalButton
              type="submit"
              pending={pending}
              className="mt-1 self-start py-2.5"
            >
              {pending ? tp("submitting") : t("guardar")}
            </PortalButton>

            <p className="border-t border-glass/40 pt-3 text-xs text-muted">
              {t("colCreated")}: {formatDate(cliente.created_at, locale)}
              {" · "}
              {t("colUpdated")}: {formatDate(cliente.updated_at, locale)}
            </p>
          </form>
        </PortalPanel>
      ) : null}

      {tab === "invites" ? (
        <AdminInvitesPanel clienteId={clienteId} locale={locale} />
      ) : null}
      {tab === "keys" ? (
        <AdminApiKeysPanel clienteId={clienteId} locale={locale} />
      ) : null}
    </div>
  );
}

function AdminInvitesPanel({
  clienteId,
  locale,
}: {
  clienteId: string;
  locale: string;
}) {
  const t = useTranslations("portal.admin");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const [rows, setRows] = useState<AdminInvitacion[] | null>(null);
  const [email, setEmail] = useState("");
  const [expiresHours, setExpiresHours] = useState(168);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [oneShot, setOneShot] = useState<{
    token: string;
    link: string;
  } | null>(null);

  const load = useCallback(async () => {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc(
      "admin_list_usuario_invitaciones",
      { p_cliente_id: clienteId },
    );
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      setRows([]);
      return;
    }
    setRows((data as AdminInvitacion[] | null) ?? []);
  }, [clienteId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setOneShot(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc(
        "admin_create_usuario_invitacion",
        {
          p_cliente_id: clienteId,
          p_email: email.trim().toLowerCase(),
          p_expires_hours: expiresHours,
        },
      );
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      const result = data as { token: string };
      const origin = window.location.origin;
      const link = `${origin}/${locale}${routes.registro}?token=${result.token}`;
      setOneShot({ token: result.token, link });
      setEmail("");
      await load();
    } catch (err) {
      setErrorKey(portalErrorKey(err instanceof Error ? err.message : "generic"));
    } finally {
      setPending(false);
    }
  }

  async function onRevoke(id: string) {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_revoke_usuario_invitacion", {
      p_invitacion_id: id,
    });
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      return;
    }
    await load();
  }

  function statusLabel(status: AdminInvitacion["status"]) {
    switch (status) {
      case "pending":
        return t("inviteStatusPending");
      case "accepted":
        return t("inviteStatusAccepted");
      case "revoked":
        return t("inviteStatusRevoked");
      case "expired":
        return t("inviteStatusExpired");
      default:
        return status;
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <PortalPanel hairline>
        <p className="text-sm leading-relaxed text-muted">
          {t("invitesIntro")}
        </p>

        <form
          onSubmit={onCreate}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <PortalInput
              label={t("inviteEmail")}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-32">
            <PortalInput
              label={t("inviteExpiresHours")}
              type="number"
              min={1}
              max={720}
              required
              value={expiresHours}
              onChange={(e) => setExpiresHours(Number(e.target.value) || 168)}
            />
          </div>
          <PortalButton type="submit" pending={pending} className="py-2.5">
            {pending ? tp("submitting") : t("inviteCreate")}
          </PortalButton>
        </form>

        {oneShot ? (
          <PortalAlert variant="success" className="mt-4 space-y-2">
            <p className="font-medium">{t("inviteTokenOnce")}</p>
            <code className="block break-all font-mono text-xs">
              {oneShot.token}
            </code>
            <p className="font-medium">{t("inviteLink")}</p>
            <code className="block break-all font-mono text-xs">
              {oneShot.link}
            </code>
            <p className="text-xs opacity-80">{t("inviteCopyHint")}</p>
          </PortalAlert>
        ) : null}

        {errorKey ? (
          <PortalAlert className="mt-3">{te(errorKey as "generic")}</PortalAlert>
        ) : null}
      </PortalPanel>

      <PortalTable tableClassName="min-w-[520px]">
        <thead>
          <tr>
            <th>{t("inviteColEmail")}</th>
            <th>{t("inviteColStatus")}</th>
            <th>{t("inviteColExpires")}</th>
            <th>{t("inviteColCreated")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows === null ? (
            <TableSkeletonRows columns={5} rows={3} />
          ) : rows.length === 0 ? (
            <TableMessageRow columns={5}>{t("inviteEmpty")}</TableMessageRow>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="text-pure">{row.email}</td>
                <td>
                  <span
                    className={`portal-badge portal-badge--sm ${
                      row.status === "accepted"
                        ? "portal-badge--ok"
                        : row.status === "pending"
                          ? "portal-badge--warn"
                          : "portal-badge--neutral"
                    }`}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  {formatDate(row.expires_at, locale)}
                </td>
                <td className="whitespace-nowrap">
                  {formatDate(row.created_at, locale)}
                </td>
                <td className="text-right">
                  {row.status === "pending" ? (
                    <PortalButton
                      variant="danger"
                      size="sm"
                      onClick={() => void onRevoke(row.id)}
                    >
                      {t("inviteRevoke")}
                    </PortalButton>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </PortalTable>
    </div>
  );
}

function AdminApiKeysPanel({
  clienteId,
  locale,
}: {
  clienteId: string;
  locale: string;
}) {
  const t = useTranslations("portal.admin");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const [rows, setRows] = useState<AdminApiKey[] | null>(null);
  const [label, setLabel] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [oneShotKey, setOneShotKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_list_cliente_api_keys", {
      p_cliente_id: clienteId,
    });
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      setRows([]);
      return;
    }
    setRows((data as AdminApiKey[] | null) ?? []);
  }, [clienteId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setOneShotKey(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("admin_create_cliente_api_key", {
        p_cliente_id: clienteId,
        p_label: label.trim() || null,
      });
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      const result = data as { api_key: string };
      setOneShotKey(result.api_key);
      setLabel("");
      await load();
    } catch (err) {
      setErrorKey(portalErrorKey(err instanceof Error ? err.message : "generic"));
    } finally {
      setPending(false);
    }
  }

  async function onRevoke(id: string) {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_revoke_cliente_api_key", {
      p_api_key_id: id,
    });
    if (error) {
      setErrorKey(portalErrorKey(error.message));
      return;
    }
    await load();
  }

  return (
    <div className="mt-6 space-y-6">
      <PortalPanel hairline>
        <p className="text-sm leading-relaxed text-muted">{t("keysIntro")}</p>

        <form
          onSubmit={onCreate}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <PortalInput
              label={t("keyLabel")}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <PortalButton type="submit" pending={pending} className="py-2.5">
            {pending ? tp("submitting") : t("keyCreate")}
          </PortalButton>
        </form>

        {oneShotKey ? (
          <PortalAlert variant="success" className="mt-4 space-y-2">
            <p className="font-medium">{t("keyOnce")}</p>
            <code className="block break-all font-mono text-xs">
              {oneShotKey}
            </code>
            <p className="text-xs opacity-80">{t("keyCopyHint")}</p>
          </PortalAlert>
        ) : null}

        {errorKey ? (
          <PortalAlert className="mt-3">{te(errorKey as "generic")}</PortalAlert>
        ) : null}
      </PortalPanel>

      <PortalTable tableClassName="min-w-[480px]">
        <thead>
          <tr>
            <th>{t("keyColPrefix")}</th>
            <th>{t("keyColLabel")}</th>
            <th>{t("keyColActivado")}</th>
            <th>{t("keyColCreated")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows === null ? (
            <TableSkeletonRows columns={5} rows={3} />
          ) : rows.length === 0 ? (
            <TableMessageRow columns={5}>{t("keyEmpty")}</TableMessageRow>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="portal-table__mono text-pure">
                  {row.key_prefix}…
                </td>
                <td>{row.label ?? "—"}</td>
                <td>
                  <span
                    className={`portal-badge portal-badge--sm ${
                      row.activado && !row.revoked_at
                        ? "portal-badge--ok"
                        : "portal-badge--neutral"
                    }`}
                  >
                    {row.activado && !row.revoked_at ? t("si") : t("no")}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  {formatDate(row.created_at, locale)}
                </td>
                <td className="text-right">
                  {!row.revoked_at && row.label !== "portal-dashboard" ? (
                    <PortalButton
                      variant="danger"
                      size="sm"
                      onClick={() => void onRevoke(row.id)}
                    >
                      {t("keyRevoke")}
                    </PortalButton>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </PortalTable>
    </div>
  );
}
