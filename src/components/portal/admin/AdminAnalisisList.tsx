"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminAnalisisDrawer } from "@/components/portal/admin/AdminAnalisisDrawer";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput, PortalSelect } from "@/components/portal/ui/PortalField";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import {
  PortalPagination,
  PortalTable,
  TableMessageRow,
  TableSkeletonRows,
} from "@/components/portal/ui/PortalTable";
import { StatusBadge, TierBadge } from "@/components/portal/ui/StatusBadge";
import { portalErrorKey } from "@/lib/portal/errors";
import type {
  AdminAnalisisListResult,
  AdminAnalisisRequest,
} from "@/lib/portal/types";
import { adminAnalisisPath } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const PAGE_SIZE = 50;

type OrderBy = "created_at" | "email_sent_at" | "onchain_updated_at";
type OrderDir = "asc" | "desc";

type Filters = {
  tier: string;
  wallet: string;
  status: string;
  idioma: string;
  email: string;
};

const emptyFilters: Filters = {
  tier: "",
  wallet: "",
  status: "",
  idioma: "",
  email: "",
};

const TIERS = ["basica", "estandar", "experta"] as const;
const STATUSES = [
  "accepted",
  "running",
  "succeeded",
  "succeeded_with_warnings",
  "failed",
  "packaging_failed",
  "cancelled",
] as const;
const IDIOMAS = ["es", "en", "pt"] as const;

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function shortWallet(wallet: string) {
  if (wallet.length <= 14) return wallet;
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
}

export function AdminAnalisisList() {
  const t = useTranslations("portal.analisis");
  const te = useTranslations("portal.errors");
  const locale = useLocale();

  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [orderBy, setOrderBy] = useState<OrderBy>("created_at");
  const [orderDir, setOrderDir] = useState<OrderDir>("desc");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<AdminAnalisisRequest[] | null>(null);
  const [total, setTotal] = useState(0);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const searchParams = useSearchParams();
  const openId = searchParams.get("detalle");

  const load = useCallback(async () => {
    setPending(true);
    setErrorKey(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("admin_list_analisis_requests", {
        p_tier: applied.tier || null,
        p_wallet: applied.wallet || null,
        p_status: applied.status || null,
        p_idioma: applied.idioma || null,
        p_email: applied.email || null,
        p_order_by: orderBy,
        p_order_dir: orderDir,
        p_limit: PAGE_SIZE,
        p_offset: offset,
      });
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        setRows([]);
        setTotal(0);
        return;
      }
      const result = data as AdminAnalisisListResult;
      setRows(result.rows ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      setErrorKey(portalErrorKey(err instanceof Error ? err.message : "generic"));
      setRows([]);
      setTotal(0);
    } finally {
      setPending(false);
    }
  }, [applied, orderBy, orderDir, offset]);

  useEffect(() => {
    void load();
  }, [load]);

  // `?detalle=` drives the drawer; shallow history updates keep the server component untouched.
  const openDetail = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const swapping = params.has("detalle");
      params.set("detalle", id);
      const url = `?${params.toString()}`;
      if (swapping) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [searchParams],
  );

  const closeDetail = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("detalle");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    );
  }, [searchParams]);

  function onRowClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openDetail(id);
  }

  function onApply(event: FormEvent) {
    event.preventDefault();
    setOffset(0);
    setApplied({ ...draft });
  }

  function onClear() {
    setDraft(emptyFilters);
    setOffset(0);
    setApplied(emptyFilters);
  }

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);
  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="mx-auto max-w-6xl">
      <PortalPageHeader title={t("title")} description={t("intro")} />

      <PortalPanel className="mt-6" hairline>
        <form
          onSubmit={onApply}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <PortalSelect
            label={t("filterTier")}
            value={draft.tier}
            onChange={(e) => setDraft((f) => ({ ...f, tier: e.target.value }))}
            fieldClassName="portal-field--sm"
          >
            <option value="">{t("filterAny")}</option>
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {t(`tierLabels.${tier}`)}
              </option>
            ))}
          </PortalSelect>
          <PortalInput
            label={t("filterWallet")}
            value={draft.wallet}
            onChange={(e) => setDraft((f) => ({ ...f, wallet: e.target.value }))}
            placeholder="0x…"
            fieldClassName="portal-field--sm portal-field--mono"
          />
          <PortalSelect
            label={t("filterStatus")}
            value={draft.status}
            onChange={(e) => setDraft((f) => ({ ...f, status: e.target.value }))}
            fieldClassName="portal-field--sm"
          >
            <option value="">{t("filterAny")}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`statusLabels.${status}`)}
              </option>
            ))}
          </PortalSelect>
          <PortalSelect
            label={t("filterIdioma")}
            value={draft.idioma}
            onChange={(e) => setDraft((f) => ({ ...f, idioma: e.target.value }))}
            fieldClassName="portal-field--sm"
          >
            <option value="">{t("filterAny")}</option>
            {IDIOMAS.map((idioma) => (
              <option key={idioma} value={idioma}>
                {idioma}
              </option>
            ))}
          </PortalSelect>
          <PortalInput
            label={t("filterEmail")}
            type="text"
            value={draft.email}
            onChange={(e) => setDraft((f) => ({ ...f, email: e.target.value }))}
            fieldClassName="portal-field--sm"
          />
          <PortalSelect
            label={t("orderBy")}
            value={orderBy}
            onChange={(e) => {
              setOffset(0);
              setOrderBy(e.target.value as OrderBy);
            }}
            fieldClassName="portal-field--sm"
          >
            <option value="created_at">{t("colCreated")}</option>
            <option value="email_sent_at">{t("colEmailSent")}</option>
            <option value="onchain_updated_at">{t("colOnchain")}</option>
          </PortalSelect>
          <PortalSelect
            label={t("orderDir")}
            value={orderDir}
            onChange={(e) => {
              setOffset(0);
              setOrderDir(e.target.value as OrderDir);
            }}
            fieldClassName="portal-field--sm"
          >
            <option value="desc">{t("orderDesc")}</option>
            <option value="asc">{t("orderAsc")}</option>
          </PortalSelect>
          <div className="flex items-end gap-2">
            <PortalButton type="submit" size="sm">
              {t("applyFilters")}
            </PortalButton>
            <PortalButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
            >
              {t("clearFilters")}
            </PortalButton>
          </div>
        </form>
      </PortalPanel>

      {errorKey ? (
        <PortalAlert className="mt-4">{te(errorKey as "generic")}</PortalAlert>
      ) : null}

      <div className="mt-6">
        <PortalTable tableClassName="min-w-[960px]">
          <thead>
            <tr>
              <th>{t("colCliente")}</th>
              <th>{t("colTier")}</th>
              <th>{t("colWallet")}</th>
              <th>{t("colStatus")}</th>
              <th>{t("colIdioma")}</th>
              <th>{t("colEmail")}</th>
              <th>{t("colEmailSent")}</th>
              <th>{t("colOnchain")}</th>
              <th>{t("colCreated")}</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <TableSkeletonRows columns={9} />
            ) : rows.length === 0 ? (
              <TableMessageRow columns={9}>{t("empty")}</TableMessageRow>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={openId === row.id ? "is-active" : undefined}
                >
                  <td>
                    <Link
                      href={adminAnalisisPath(row.id)}
                      onClick={(event) => onRowClick(event, row.id)}
                      className="font-medium text-pure hover:text-primary"
                    >
                      {row.cliente_nombre}
                    </Link>
                  </td>
                  <td>
                    <TierBadge tier={row.tier} size="sm" />
                  </td>
                  <td className="portal-table__mono">
                    <Link
                      href={adminAnalisisPath(row.id)}
                      onClick={(event) => onRowClick(event, row.id)}
                      className="hover:text-primary"
                      title={row.wallet}
                    >
                      {shortWallet(row.wallet)}
                    </Link>
                  </td>
                  <td>
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="portal-table__mono uppercase">{row.idioma}</td>
                  <td className="max-w-[160px] truncate">{row.email ?? "—"}</td>
                  <td className="whitespace-nowrap">
                    {formatDate(row.email_sent_at, locale)}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatDate(row.onchain_updated_at, locale)}
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

      <PortalPagination
        info={pending ? t("loading") : t("showing", { from, to, total })}
        prevLabel={t("prev")}
        nextLabel={t("next")}
        onPrev={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
        onNext={() => setOffset((o) => o + PAGE_SIZE)}
        canPrev={canPrev && !pending}
        canNext={canNext && !pending}
      />

      {openId ? (
        <AdminAnalisisDrawer
          analisisId={openId}
          onClose={closeDetail}
          onChanged={load}
        />
      ) : null}
    </div>
  );
}
