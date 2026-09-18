"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
import { JsonTreeViewer } from "@/components/portal/JsonTreeViewer";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalSelect } from "@/components/portal/ui/PortalField";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import {
  StatusBadge,
  TierBadge,
  statusTone,
} from "@/components/portal/ui/StatusBadge";
import {
  isKnownGrade,
  isKnownStatus,
  isKnownTier,
} from "@/lib/portal/analisisLabels";
import { basescanTxUrl, ipfsGatewayUrl } from "@/lib/portal/artifacts";
import { portalErrorKey } from "@/lib/portal/errors";
import { isKnownStageId } from "@/lib/portal/stageCopy";
import type {
  AdminAnalisisDetail as AnalisisDetail,
  AdminAnalisisRunStage,
} from "@/lib/portal/types";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const btnLink =
  "portal-btn portal-btn--ghost w-full text-primary hover:text-primary-soft";

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function isEmptyJson(value: unknown): boolean {
  if (value == null) return true;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  ) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

type ConfirmKey =
  | "confirmSenales"
  | "confirmReporte"
  | "confirmEmail"
  | "confirmIdioma";

type SuccessKey =
  | "queuedSenales"
  | "queuedReporte"
  | "queuedEmail"
  | "queuedIdioma";

type PendingRequest = {
  actionId: string;
  confirmKey: ConfirmKey;
  rpc: () => Promise<{ error: { message: string } | null }>;
  successKey: SuccessKey;
};

type ActionsPanelProps = {
  analisisId: string;
  row: AnalisisDetail;
  idiomaDraft: string;
  setIdiomaDraft: (v: string) => void;
  busy: boolean;
  pendingAction: string | null;
  canRegenReporte: boolean;
  pdfUrl: string | null;
  riesgoPdfUrl: string | null;
  analisisUrl: string | null;
  evidenciaUrl: string | null;
  txUrl: string | null;
  actionMsg: string | null;
  errorKey: string | null;
  confirming: PendingRequest | null;
  requestAction: (request: PendingRequest) => void;
  confirmAction: () => void;
  cancelAction: () => void;
};

function ActionsPanel({
  analisisId,
  row,
  idiomaDraft,
  setIdiomaDraft,
  busy,
  pendingAction,
  canRegenReporte,
  pdfUrl,
  riesgoPdfUrl,
  analisisUrl,
  evidenciaUrl,
  txUrl,
  actionMsg,
  errorKey,
  confirming,
  requestAction,
  confirmAction,
  cancelAction,
}: ActionsPanelProps) {
  const t = useTranslations("portal.analisis");
  const te = useTranslations("portal.errors");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <PortalButton
          variant="ghost"
          className="w-full"
          disabled={busy || confirming != null}
          onClick={() =>
            requestAction({
              actionId: "senales",
              confirmKey: "confirmSenales",
              rpc: async () => {
                const supabase = createSupabaseBrowserClient();
                return supabase.rpc("admin_regen_analisis_senales", {
                  p_id: analisisId,
                });
              },
              successKey: "queuedSenales",
            })
          }
        >
          {pendingAction === "senales"
            ? t("detail.actions.working")
            : t("detail.actions.regenSenales")}
        </PortalButton>
        <PortalButton
          variant="ghost"
          className="w-full"
          disabled={busy || confirming != null || !canRegenReporte}
          onClick={() =>
            requestAction({
              actionId: "reporte",
              confirmKey: "confirmReporte",
              rpc: async () => {
                const supabase = createSupabaseBrowserClient();
                return supabase.rpc("admin_regen_analisis_reporte", {
                  p_id: analisisId,
                });
              },
              successKey: "queuedReporte",
            })
          }
        >
          {pendingAction === "reporte"
            ? t("detail.actions.working")
            : t("detail.actions.regenReporte")}
        </PortalButton>
        <PortalButton
          variant="ghost"
          className="w-full"
          disabled={busy || confirming != null || !row.pdf_cid}
          onClick={() =>
            requestAction({
              actionId: "email",
              confirmKey: "confirmEmail",
              rpc: async () => {
                const supabase = createSupabaseBrowserClient();
                return supabase.rpc("admin_resend_analisis_email", {
                  p_id: analisisId,
                });
              },
              successKey: "queuedEmail",
            })
          }
        >
          {pendingAction === "email"
            ? t("detail.actions.working")
            : t("detail.actions.resendEmail")}
        </PortalButton>
      </div>

      <div className="flex flex-col gap-2 border-t border-glass/40 pt-4">
        <PortalSelect
          label={t("detail.actions.idioma")}
          value={idiomaDraft}
          onChange={(e) => setIdiomaDraft(e.target.value)}
          disabled={busy}
          fieldClassName="portal-field--sm"
        >
          <option value="es">es</option>
          <option value="en">en</option>
          <option value="pt">pt</option>
        </PortalSelect>
        <PortalButton
          className="w-full"
          disabled={busy || confirming != null || !canRegenReporte}
          onClick={() =>
            requestAction({
              actionId: "idioma",
              confirmKey: "confirmIdioma",
              rpc: async () => {
                const supabase = createSupabaseBrowserClient();
                return supabase.rpc("admin_set_analisis_idioma", {
                  p_id: analisisId,
                  p_idioma: idiomaDraft,
                });
              },
              successKey: "queuedIdioma",
            })
          }
        >
          {pendingAction === "idioma"
            ? t("detail.actions.working")
            : t("detail.actions.applyIdioma")}
        </PortalButton>
      </div>

      {confirming ? (
        <div className="portal-panel portal-panel--inset p-3">
          <p className="text-sm leading-relaxed text-pure">
            {t(`detail.actions.${confirming.confirmKey}`)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PortalButton
              variant="danger"
              size="sm"
              onClick={confirmAction}
              disabled={busy}
            >
              {t("detail.actions.confirm")}
            </PortalButton>
            <PortalButton variant="ghost" size="sm" onClick={cancelAction}>
              {t("detail.actions.cancel")}
            </PortalButton>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-glass/40 pt-4">
        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noreferrer" className={btnLink}>
            {t("detail.actions.openPdf")}
          </a>
        ) : (
          <span className={`${btnLink} opacity-40`}>{t("detail.actions.openPdf")}</span>
        )}
        {riesgoPdfUrl ? (
          <a
            href={riesgoPdfUrl}
            target="_blank"
            rel="noreferrer"
            className={btnLink}
          >
            {t("detail.actions.openRiesgoPdf")}
          </a>
        ) : (
          <span className={`${btnLink} opacity-40`}>
            {t("detail.actions.openRiesgoPdf")}
          </span>
        )}
        {analisisUrl ? (
          <a
            href={analisisUrl}
            target="_blank"
            rel="noreferrer"
            className={btnLink}
          >
            {t("detail.actions.openAnalisisIpfs")}
          </a>
        ) : (
          <span className={`${btnLink} opacity-40`}>
            {t("detail.actions.openAnalisisIpfs")}
          </span>
        )}
        {evidenciaUrl ? (
          <a
            href={evidenciaUrl}
            target="_blank"
            rel="noreferrer"
            className={btnLink}
          >
            {t("detail.actions.openEvidenciaIpfs")}
          </a>
        ) : (
          <span className={`${btnLink} opacity-40`}>
            {t("detail.actions.openEvidenciaIpfs")}
          </span>
        )}
        {txUrl ? (
          <a href={txUrl} target="_blank" rel="noreferrer" className={btnLink}>
            {t("detail.actions.openOnchain")}
          </a>
        ) : (
          <span className={`${btnLink} opacity-40`}>
            {t("detail.actions.openOnchain")}
          </span>
        )}
      </div>

      {actionMsg ? (
        <PortalAlert variant="success">{actionMsg}</PortalAlert>
      ) : null}
      {errorKey ? <PortalAlert>{te(errorKey as "generic")}</PortalAlert> : null}
    </div>
  );
}

export function AdminAnalisisDetail({
  analisisId,
  variant = "page",
  onChanged,
}: {
  analisisId: string;
  variant?: "page" | "drawer";
  onChanged?: () => void;
}) {
  const t = useTranslations("portal.analisis");
  const te = useTranslations("portal.errors");
  const locale = useLocale();
  const [row, setRow] = useState<AnalisisDetail | null>(null);
  const [stages, setStages] = useState<AdminAnalisisRunStage[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [idiomaDraft, setIdiomaDraft] = useState("es");
  const [confirming, setConfirming] = useState<PendingRequest | null>(null);

  const load = useCallback(async () => {
    setErrorKey(null);
    const supabase = createSupabaseBrowserClient();
    const [detailRes, stagesRes] = await Promise.all([
      supabase.rpc("admin_get_analisis_request", { p_id: analisisId }),
      supabase.rpc("admin_list_analisis_run_stages", {
        p_request_id: analisisId,
      }),
    ]);

    if (detailRes.error) {
      setErrorKey(portalErrorKey(detailRes.error.message));
      setRow(null);
      setStages([]);
      return;
    }
    const detail = detailRes.data as AnalisisDetail;
    setRow(detail);
    setIdiomaDraft(detail.idioma || "es");

    if (stagesRes.error) {
      setErrorKey(portalErrorKey(stagesRes.error.message));
      setStages([]);
      return;
    }
    setStages((stagesRes.data as AdminAnalisisRunStage[] | null) ?? []);
  }, [analisisId]);

  useEffect(() => {
    void load();
  }, [load]);

  function requestAction(request: PendingRequest) {
    setActionMsg(null);
    setErrorKey(null);
    setConfirming(request);
  }

  async function runConfirmedAction() {
    if (!confirming) return;
    const { actionId, rpc, successKey } = confirming;
    setConfirming(null);
    setPendingAction(actionId);
    setActionMsg(null);
    setErrorKey(null);
    try {
      const { error } = await rpc();
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      setActionMsg(t(`detail.actions.${successKey}`));
      await load();
      onChanged?.();
    } catch (err) {
      setErrorKey(portalErrorKey(err instanceof Error ? err.message : "generic"));
    } finally {
      setPendingAction(null);
    }
  }

  const isDrawer = variant === "drawer";
  const shellClass = isDrawer ? "@container" : "mx-auto max-w-6xl @container";
  const messageShellClass = isDrawer ? "" : "mx-auto max-w-5xl";

  if (errorKey && !row) {
    return (
      <div className={messageShellClass}>
        {isDrawer ? null : (
          <Link
            href={routes.dashboardAnalisis}
            className="text-sm text-muted hover:text-pure"
          >
            ← {t("detail.back")}
          </Link>
        )}
        <PortalAlert className="mt-6">{te(errorKey as "generic")}</PortalAlert>
      </div>
    );
  }

  if (!row) {
    return (
      <div className={`${messageShellClass} flex flex-col gap-3`} aria-busy>
        <span className="portal-skeleton block h-8 w-2/3" />
        <span className="portal-skeleton block h-28 w-full" />
        <span className="portal-skeleton block h-52 w-full" />
      </div>
    );
  }

  const pdfUrl = ipfsGatewayUrl(row.pdf_cid);
  const riesgoPdfUrl = ipfsGatewayUrl(row.riesgo_cid);
  const analisisUrl = ipfsGatewayUrl(row.analisis_cid);
  const evidenciaUrl = ipfsGatewayUrl(row.evidencia_cid);
  const txUrl = basescanTxUrl(row.onchain_tx_hash);
  const canRegenReporte =
    (row.status === "succeeded" || row.status === "succeeded_with_warnings") &&
    row.analisis != null;
  const busy = pendingAction != null;

  const actionsProps: ActionsPanelProps = {
    analisisId,
    row,
    idiomaDraft,
    setIdiomaDraft,
    busy,
    pendingAction,
    canRegenReporte,
    pdfUrl,
    riesgoPdfUrl,
    analisisUrl,
    evidenciaUrl,
    txUrl,
    actionMsg,
    errorKey,
    confirming,
    requestAction,
    confirmAction: () => void runConfirmedAction(),
    cancelAction: () => setConfirming(null),
  };

  const tierLabel = isKnownTier(row.tier)
    ? t(`tierLabels.${row.tier}`)
    : row.tier;
  const statusLabel = isKnownStatus(row.status)
    ? t(`statusLabels.${row.status}`)
    : row.status;
  // `grade_label` se persiste en el idioma del informe; el grado es la clave estable.
  const grade = row.grade?.trim().toUpperCase() ?? "";
  const gradeLabel = isKnownGrade(grade)
    ? t(`gradeLabels.${grade}`)
    : (row.grade_label ?? "—");

  const fieldGroups: {
    title: string;
    fields: { label: string; value: string; mono?: boolean }[];
  }[] = [
    {
      title: t("detail.groupRequest"),
      fields: [
        { label: t("colCliente"), value: row.cliente_nombre },
        { label: t("detail.clienteId"), value: row.cliente_id, mono: true },
        { label: t("detail.id"), value: row.id, mono: true },
        { label: t("colTier"), value: tierLabel },
        { label: t("colStatus"), value: statusLabel },
        { label: t("colIdioma"), value: row.idioma },
        { label: t("detail.functionSlug"), value: row.function_slug ?? "—" },
        {
          label: t("detail.apiKeyId"),
          value: row.api_key_id ?? "—",
          mono: true,
        },
        { label: t("detail.accessChannel"), value: row.access_channel ?? "—" },
        { label: t("detail.marketplace"), value: row.marketplace ?? "—" },
        { label: t("detail.billing"), value: row.billing ?? "—" },
        { label: t("detail.clientIp"), value: row.client_ip ?? "—", mono: true },
      ],
    },
    {
      title: t("detail.groupResult"),
      fields: [
        { label: t("detail.grade"), value: grade || "—" },
        { label: t("detail.gradeLabel"), value: gradeLabel },
        {
          label: t("detail.dataHash"),
          value: row.data_hash ?? "—",
          mono: true,
        },
        { label: t("detail.errorMessage"), value: row.error_message ?? "—" },
      ],
    },
    {
      title: t("detail.groupDeliverables"),
      fields: [
        {
          label: t("detail.analisisCid"),
          value: row.analisis_cid ?? "—",
          mono: true,
        },
        {
          label: t("detail.evidenciaCid"),
          value: row.evidencia_cid ?? "—",
          mono: true,
        },
        { label: t("detail.pdfCid"), value: row.pdf_cid ?? "—", mono: true },
        {
          label: t("detail.riesgoCid"),
          value: row.riesgo_cid ?? "—",
          mono: true,
        },
        { label: t("colEmail"), value: row.email ?? "—" },
        {
          label: t("detail.emailMessageId"),
          value: row.email_message_id ?? "—",
          mono: true,
        },
        {
          label: t("colEmailSent"),
          value: formatDate(row.email_sent_at, locale),
        },
      ],
    },
    {
      title: t("detail.groupOnchain"),
      fields: [
        {
          label: t("detail.onchainTx"),
          value: row.onchain_tx_hash ?? "—",
          mono: true,
        },
        {
          label: t("colOnchain"),
          value: formatDate(row.onchain_updated_at, locale),
        },
        { label: t("colCreated"), value: formatDate(row.created_at, locale) },
        {
          label: t("detail.claimedAt"),
          value: formatDate(row.claimed_at, locale),
        },
        {
          label: t("detail.analyzedAt"),
          value: formatDate(row.analyzed_at, locale),
        },
        {
          label: t("detail.riesgoEvaluadoAt"),
          value: formatDate(row.riesgo_evaluado_at, locale),
        },
      ],
    },
  ];

  const technicalMeta = {
    request_payload: row.request_payload,
    manifiesto: row.manifiesto,
    compliance_screen: row.compliance_screen,
    upstream_errors: row.upstream_errors,
    onchain: row.onchain,
    signature: row.signature,
    receipt: row.receipt,
    run_progress: row.run_progress,
  };
  const technicalMetaEmpty = Object.values(technicalMeta).every(isEmptyJson);
  const viewerLabels: ViewerLabels = {
    copyLabel: t("detail.viewer.copy"),
    copiedLabel: t("detail.viewer.copied"),
    emptyLabel: t("detail.viewer.empty"),
  };

  return (
    <div className={shellClass}>
      {isDrawer ? null : (
        <Link
          href={routes.dashboardAnalisis}
          className="text-sm text-muted hover:text-pure"
        >
          ← {t("detail.back")}
        </Link>
      )}

      <PortalPanel
        variant="accent"
        hairline
        className={isDrawer ? "" : "mt-4"}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-mono text-xl font-semibold tracking-tight text-pure md:text-2xl">
              {t("detail.labelWallet")}
            </h1>
            <p className="mt-1 break-all font-mono text-xl font-semibold tracking-tight text-pure md:text-2xl">
              {row.wallet}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <TierBadge tier={row.tier} />
            <StatusBadge status={row.status} />
          </div>
        </div>
        <div className="mt-4 border-t border-glass/40 pt-3">
          <p className="portal-eyebrow--muted font-mono text-[10px] uppercase tracking-[0.14em]">
            {t("detail.labelCliente")}
          </p>
          <p className="mt-0.5 text-sm text-pure">{row.cliente_nombre}</p>
        </div>
      </PortalPanel>

      <div className="mt-6 @3xl:grid @3xl:grid-cols-[minmax(0,1fr)_17rem] @3xl:items-start @3xl:gap-6">
        <div className="min-w-0 space-y-6">
          <PortalPanel
            className="@3xl:hidden"
            title={t("detail.sectionActions")}
          >
            <ActionsPanel {...actionsProps} />
          </PortalPanel>

          {fieldGroups.map((group) => (
            <PortalPanel key={group.title} title={group.title}>
              <dl className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
                {group.fields.map((field) => (
                  <div key={field.label} className="portal-metric min-w-0">
                    <dt className="portal-metric__label">{field.label}</dt>
                    <dd
                      className={`portal-metric__value${field.mono ? " font-mono text-[0.8rem]" : ""}`}
                    >
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </PortalPanel>
          ))}

          <PortalPanel title={t("detail.sectionStages")}>
            <p className="-mt-2 mb-4 text-sm leading-relaxed text-muted">
              {t("detail.stagesIntro")}
            </p>
            {stages === null ? (
              <div className="flex flex-col gap-2.5" aria-busy>
                <span className="portal-skeleton block h-14 w-full" />
                <span className="portal-skeleton block h-14 w-full" />
                <span className="portal-skeleton block h-14 w-full" />
              </div>
            ) : stages.length === 0 ? (
              <p className="text-sm text-muted">{t("detail.stagesEmpty")}</p>
            ) : (
              <ol className="relative list-none space-y-0 p-0 before:absolute before:bottom-4 before:left-[3px] before:top-4 before:w-px before:bg-glass/50">
                {stages.map((stage) => {
                  const known = isKnownStageId(stage.stage);
                  const title = known
                    ? t(`stages.${stage.stage}.title`)
                    : stage.stage;
                  const blurb = known
                    ? t(`stages.${stage.stage}.blurb`)
                    : t("stages.unknownBlurb");
                  const tone = statusTone(stage.status);
                  return (
                    <li
                      key={stage.id}
                      className="relative border-b border-glass/30 py-4 pl-6 last:border-b-0"
                    >
                      <span
                        className={`portal-stage-dot absolute left-0 top-[1.45rem]${
                          tone === "ok"
                            ? " portal-stage-dot--ok"
                            : tone === "error"
                              ? " portal-stage-dot--error"
                              : tone === "neutral"
                                ? " portal-stage-dot--idle"
                                : ""
                        }`}
                        aria-hidden
                      />
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-pure">
                              {title}
                            </p>
                            <StatusBadge status={stage.status} size="sm" />
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted">
                            {blurb}
                          </p>
                          <p className="mt-1.5 font-mono text-[11px] text-muted/70">
                            {stage.stage}
                          </p>
                          {stage.error_message ? (
                            <PortalAlert className="mt-2.5">
                              {stage.error_message}
                            </PortalAlert>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-mono text-xs text-pure">
                            {stage.duration_ms != null
                              ? `${stage.duration_ms} ms`
                              : "—"}
                          </p>
                          <p className="mt-1 text-[11px] text-muted">
                            {formatDate(stage.started_at, locale)}
                          </p>
                          <p className="text-[11px] text-muted">
                            {formatDate(stage.finished_at, locale)}
                          </p>
                        </div>
                      </div>
                      {!isEmptyJson(stage.meta) ? (
                        <details className="mt-3 border-t border-glass/30 pt-2">
                          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-primary">
                            meta
                          </summary>
                          <div className="mt-2">
                            <JsonTreeViewer
                              value={stage.meta}
                              copyLabel={t("detail.viewer.copy")}
                              copiedLabel={t("detail.viewer.copied")}
                              emptyLabel={t("detail.viewer.empty")}
                            />
                          </div>
                        </details>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            )}
          </PortalPanel>

          <PortalPanel>
            <div className="flex flex-col gap-2">
              <JsonSection
                title={t("detail.jsonAnalisis")}
                emptyLabel={t("detail.jsonEmpty")}
                value={row.analisis}
                viewerLabels={viewerLabels}
              />
              <JsonSection
                title={t("detail.jsonEvidencia")}
                emptyLabel={t("detail.jsonEmpty")}
                value={row.evidencia}
                viewerLabels={viewerLabels}
              />
              <JsonSection
                title={t("detail.jsonRiesgo")}
                emptyLabel={t("detail.jsonEmpty")}
                value={row.riesgo}
                viewerLabels={viewerLabels}
              />
              <JsonSection
                title={t("detail.sectionMeta")}
                emptyLabel={t("detail.jsonEmpty")}
                value={technicalMeta}
                isEmpty={technicalMetaEmpty}
                viewerLabels={viewerLabels}
              />
            </div>
          </PortalPanel>
        </div>

        <aside className="sticky top-6 hidden @3xl:block">
          <PortalPanel title={t("detail.sectionActions")}>
            <ActionsPanel {...actionsProps} />
          </PortalPanel>
        </aside>
      </div>
    </div>
  );
}

type ViewerLabels = {
  copyLabel: string;
  copiedLabel: string;
  emptyLabel: string;
};

function JsonSection({
  title,
  emptyLabel,
  value,
  isEmpty,
  viewerLabels,
}: {
  title: string;
  emptyLabel: string;
  value: unknown;
  isEmpty?: boolean;
  viewerLabels: ViewerLabels;
}) {
  const empty = isEmpty ?? isEmptyJson(value);

  return (
    <details className="portal-panel portal-panel--inset px-3 py-2.5">
      <summary className="cursor-pointer text-sm font-medium text-pure hover:text-primary">
        {title}
        {empty ? (
          <span className="ml-2 text-xs font-normal text-muted">
            ({emptyLabel})
          </span>
        ) : null}
      </summary>
      <div className="mt-2.5">
        <JsonTreeViewer
          value={value}
          copyLabel={viewerLabels.copyLabel}
          copiedLabel={viewerLabels.copiedLabel}
          emptyLabel={viewerLabels.emptyLabel}
        />
      </div>
    </details>
  );
}
