"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GradeBadge } from "@/components/ui/GradeBadge";
import reportJson from "@/data/examples/walcert-report-lite-v1.json";
import {
  chainLabel,
  reportLocaleFromApp,
  type LocalizedText,
  type ReportLocale,
  type WalcertReportLiteV1,
} from "@/data/examples/types";
import type { SignalKey } from "@/lib/signalCerts";
import { moduleLabel } from "@/lib/signalModules";

const report = reportJson as WalcertReportLiteV1;
const TEASER_SIGNALS = 6;

const REPORT_TYPE_BY_SIGNAL: Record<SignalKey, string> = {
  origins: "ORIGINS",
  activity: "ACTIVITY",
  multichain: "MULTICHAIN",
  portfolio: "PORTFOLIO",
};

function pick(text: LocalizedText, lang: ReportLocale): string {
  return text[lang];
}

function formatAnalyzedAt(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type ModuleViewProps = {
  title: string;
  grade: string;
  summary: string;
  signals: { id: string; label: string; display: string }[];
  strengths: string[];
  concerns: string[];
  moduleId?: string;
  labels: {
    strengths: string;
    concerns: string;
    moduleId: string;
  };
  teaser?: boolean;
};

function ModuleBody({
  title,
  grade,
  summary,
  signals,
  strengths,
  concerns,
  moduleId,
  labels,
  teaser = false,
}: ModuleViewProps) {
  return (
    <div className="reveal-module-body">
      <div className="reveal-module-body__head">
        <h3 className="reveal-module-body__title">{title}</h3>
        <GradeBadge grade={grade} className="px-3 py-1 text-sm" />
      </div>
      <p
        className={`reveal-module-body__summary${
          teaser ? " reveal-module-body__summary--clamp" : ""
        }`}
      >
        {summary}
      </p>
      <div
        className={`reveal-module-body__grid${
          teaser ? " reveal-module-body__grid--teaser" : ""
        }`}
      >
        {signals.map((sig) => (
          <div key={sig.id} className="reveal-module-body__metric">
            <p className="reveal-module-body__metric-label">{sig.label}</p>
            <p className="reveal-module-body__metric-value">{sig.display}</p>
          </div>
        ))}
      </div>
      {!teaser && (strengths.length > 0 || concerns.length > 0) ? (
        <div className="reveal-module-body__notes">
          {strengths.length > 0 ? (
            <div>
              <p className="reveal-module-body__notes-label is-strength">
                {labels.strengths}
              </p>
              <ul>
                {strengths.map((item) => (
                  <li key={item}>
                    <span className="is-strength" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {concerns.length > 0 ? (
            <div>
              <p className="reveal-module-body__notes-label is-concern">
                {labels.concerns}
              </p>
              <ul>
                {concerns.map((item) => (
                  <li key={item}>
                    <span className="is-concern" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {!teaser && moduleId ? (
        <p className="reveal-module-body__module-id">
          {labels.moduleId}: {moduleId}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  module: SignalKey;
};

export function RevealModuleExample({ module }: Props) {
  const locale = useLocale();
  const t = useTranslations("reveal.moduleExample");
  const dialogTitleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [openForModule, setOpenForModule] = useState(module);

  if (openForModule !== module) {
    setOpenForModule(module);
    setOpen(false);
  }

  const lang = reportLocaleFromApp(locale);
  const reportType = REPORT_TYPE_BY_SIGNAL[module];
  const mod = report.modules.find((m) => m.type === reportType);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mod) return null;

  const title = moduleLabel(mod.type, locale);
  const summary = pick(mod.summary, lang);
  const allSignals = mod.signals.map((sig) => ({
    id: sig.id,
    label: pick(sig.label, lang),
    display: pick(sig.display, lang),
  }));
  const teaserSignals = allSignals.slice(0, TEASER_SIGNALS);
  const strengths = mod.strengths.map((item) => pick(item, lang));
  const concerns = mod.concerns.map((item) => pick(item, lang));
  const noteLabels = {
    strengths: t("strengths"),
    concerns: t("concerns"),
    moduleId: t("moduleId"),
  };

  return (
    <>
      <div
        className="reveal-module-card"
        onDoubleClick={() => setOpen(true)}
        role="group"
        aria-label={title}
      >
        <div className="reveal-module-card__toolbar">
          <p className="reveal-module-card__schema">
            {t(`teaserTitle.${module}`)}
          </p>
          <button
            type="button"
            className="reveal-module-card__expand"
            aria-label={t("expand")}
            onClick={() => setOpen(true)}
          >
            <span aria-hidden>+</span>
          </button>
        </div>
        <p className="reveal-module-card__wallet">
          <span className="reveal-module-card__wallet-label">
            {t("walletLabel")}:
          </span>{" "}
          <span className="reveal-module-card__wallet-address">
            {report.wallet}
          </span>
        </p>
        <dl className="reveal-module-card__meta">
          <div>
            <dt>{t("analyzedAt")}: </dt>
            <dd>{formatAnalyzedAt(report.analyzed_at, locale)}</dd>
          </div>
          <div>
            <dt>{t("chain")}: </dt>
            <dd>
              {chainLabel(report.chain_id)} ({report.chain_id})
            </dd>
          </div>
        </dl>
        <ModuleBody
          title={title}
          grade={mod.grade}
          summary={summary}
          signals={teaserSignals}
          strengths={[]}
          concerns={[]}
          labels={noteLabels}
          teaser
        />
      </div>

      {open ? (
        <div
          className="reveal-module-modal"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="reveal-module-modal__dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="reveal-module-modal__bar">
              <p id={dialogTitleId} className="reveal-module-modal__heading">
                {t(`teaserTitle.${module}`)}
              </p>
              <button
                ref={closeRef}
                type="button"
                className="reveal-module-modal__close"
                onClick={() => setOpen(false)}
              >
                {t("close")}
              </button>
            </div>
            <p className="reveal-module-modal__wallet">{report.wallet}</p>
            <dl className="reveal-module-card__meta reveal-module-modal__meta">
              <div>
                <dt>{t("analyzedAt")}: </dt>
                <dd>{formatAnalyzedAt(report.analyzed_at, locale)}</dd>
              </div>
              <div>
                <dt>{t("chain")}: </dt>
                <dd>
                  {chainLabel(report.chain_id)} ({report.chain_id})
                </dd>
              </div>
              <div>
                <dt>{t("agent")}: </dt>
                <dd>{report.agent_id}</dd>
              </div>
            </dl>
            <ModuleBody
              title={title}
              grade={mod.grade}
              summary={summary}
              signals={allSignals}
              strengths={strengths}
              concerns={concerns}
              moduleId={mod.certificate_id}
              labels={noteLabels}
            />
            <p className="reveal-module-card__hint">{t("footer")}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
