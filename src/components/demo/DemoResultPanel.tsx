"use client";

import { useTranslations } from "next-intl";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { DemoSignalsCarousel } from "@/components/demo/DemoSignalsCarousel";
import {
  baseScanTxUrl,
  easAttestationUrl,
  ipfsGatewayUrl,
  truncateHash,
  type DemoModuleSummary,
  type DemoPublicResult,
  type ModuleKey,
} from "@/lib/demoAnalisis";

const MODULE_LABEL_KEYS: Record<
  ModuleKey,
  "moduleOrigins" | "moduleActivity" | "moduleMultichain" | "modulePortfolio"
> = {
  origins: "moduleOrigins",
  activity: "moduleActivity",
  multichain: "moduleMultichain",
  portfolio: "modulePortfolio",
};

function bannerModules(modules: DemoModuleSummary[]): DemoModuleSummary[] {
  return modules.filter((m) => m.key !== "portfolio" || m.grade || m.summary);
}

function OfacVerdictBadge({
  verdict,
  sanctioned,
}: {
  verdict: string | null;
  sanctioned: boolean | null;
}) {
  const t = useTranslations("demo");
  const isClean =
    sanctioned === false ||
    (verdict && ["clean", "ok", "clear"].includes(verdict.toLowerCase()));
  const isHit =
    sanctioned === true ||
    (verdict &&
      ["sanctioned", "hit", "match", "listed"].includes(verdict.toLowerCase()));

  const className = isClean
    ? "text-grade-a border-grade-a/40 bg-grade-a/10"
    : isHit
      ? "text-grade-f border-grade-f/40 bg-grade-f/10"
      : "text-muted border-glass/50 bg-surface/40";

  const label = isClean
    ? t("ofacClean")
    : isHit
      ? t("ofacSanctioned")
      : (verdict ?? t("ofacUnknown"));

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

export function DemoResultPanel({ result }: { result: DemoPublicResult }) {
  const t = useTranslations("demo");
  const modules = bannerModules(result.modules);
  const analisisUrl = ipfsGatewayUrl(result.analisis_cid);
  const evidenciaUrl = ipfsGatewayUrl(result.evidencia_cid);
  const txUrl = baseScanTxUrl(result.onchain?.tx_hash);
  const easUrl = easAttestationUrl(result.onchain?.attestation_uid);

  return (
    <div className="demo-result space-y-8 rounded-xl border border-glass/70 bg-void/50 p-5 md:p-6">
      {/* Synthesis */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
            {t("resultEyebrow")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {result.synthesis_grade ? (
              <GradeBadge
                grade={result.synthesis_grade}
                className="px-3.5 py-1.5 text-base"
              />
            ) : (
              <h2 className="font-display text-2xl font-semibold text-pure">
                {t("resultReady")}
              </h2>
            )}
            {result.synthesis_label ? (
              <span className="font-display text-xl text-muted">
                {result.synthesis_label}
              </span>
            ) : null}
          </div>
        </div>
        <dl className="grid gap-1 text-right text-xs text-muted">
          <div>
            <dt className="inline text-muted/70">{t("fieldTier")}: </dt>
            <dd className="inline text-pure">{result.tier}</dd>
          </div>
          <div className="max-w-[16rem] truncate font-mono text-[11px] text-pure/80">
            {result.wallet}
          </div>
        </dl>
      </div>

      {result.synthesis_summary ? (
        <p className="text-sm leading-relaxed text-muted">
          {result.synthesis_summary}
        </p>
      ) : null}

      {/* Banner: module grades */}
      {modules.length > 0 ? (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
            {t("bannerEyebrow")}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => (
              <li
                key={mod.key}
                className="flex items-center justify-between gap-2 rounded-lg border border-glass/50 bg-surface/40 px-3 py-3"
              >
                <span className="text-sm font-medium text-pure">
                  {t(MODULE_LABEL_KEYS[mod.key])}
                </span>
                {mod.grade ? (
                  <GradeBadge grade={mod.grade} className="text-sm" />
                ) : (
                  <span className="font-mono text-xs text-muted">—</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Detail carousel */}
      {modules.length > 0 ? <DemoSignalsCarousel modules={modules} /> : null}

      {/* OFAC — aparte, debajo del carrete */}
      {result.compliance ? (
        <section
          className="rounded-xl border border-glass/60 bg-surface/30 p-4 md:p-5"
          aria-labelledby="demo-ofac-title"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
                {t("ofacEyebrow")}
              </p>
              <h3
                id="demo-ofac-title"
                className="mt-1 font-display text-lg font-semibold text-pure"
              >
                {t("ofacTitle")}
              </h3>
            </div>
            <OfacVerdictBadge
              verdict={result.compliance.verdict}
              sanctioned={result.compliance.sanctioned}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {t("ofacDisclaimer")}
          </p>
          <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
            {result.compliance.screened_address ? (
              <div>
                <dt className="text-muted/70">{t("ofacAddress")}</dt>
                <dd className="mt-0.5 font-mono text-pure/90 break-all">
                  {result.compliance.screened_address}
                </dd>
              </div>
            ) : null}
            {result.compliance.chain ? (
              <div>
                <dt className="text-muted/70">{t("ofacChain")}</dt>
                <dd className="mt-0.5 text-pure/90">{result.compliance.chain}</dd>
              </div>
            ) : null}
            {result.compliance.screened_at ? (
              <div>
                <dt className="text-muted/70">{t("ofacScreenedAt")}</dt>
                <dd className="mt-0.5 font-mono text-pure/90">
                  {result.compliance.screened_at}
                </dd>
              </div>
            ) : null}
            {result.compliance.signature_verified !== null ? (
              <div>
                <dt className="text-muted/70">{t("ofacSignature")}</dt>
                <dd className="mt-0.5 text-pure/90">
                  {result.compliance.signature_verified
                    ? t("ofacSignatureOk")
                    : t("ofacSignatureFail")}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {/* Links: análisis / evidencia / on-chain */}
      <div className="space-y-3 border-t border-glass/40 pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
          {t("linksEyebrow")}
        </p>
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {analisisUrl ? (
            <li>
              <a
                href={analisisUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary hover:text-primary-soft underline-offset-2 hover:underline"
              >
                {t("linkAnalisisDetallado")}
              </a>
            </li>
          ) : null}
          {evidenciaUrl ? (
            <li>
              <a
                href={evidenciaUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary hover:text-primary-soft underline-offset-2 hover:underline"
              >
                {t("linkEvidencia")}
              </a>
            </li>
          ) : null}
        </ul>

        {result.onchain && (txUrl || easUrl || result.onchain.status) ? (
          <div className="mt-2 rounded-lg border border-glass/40 bg-void/40 px-3 py-3 text-xs">
            <p className="font-medium text-pure">{t("onchainTitle")}</p>
            <dl className="mt-2 space-y-1.5 text-muted">
              {result.onchain.status ? (
                <div className="flex flex-wrap gap-x-2">
                  <dt>{t("onchainStatus")}:</dt>
                  <dd className="text-pure/90">{result.onchain.status}</dd>
                </div>
              ) : null}
              {txUrl && result.onchain.tx_hash ? (
                <div>
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary-soft underline-offset-2 hover:underline"
                  >
                    {t("onchainTx")}: {truncateHash(result.onchain.tx_hash)}
                  </a>
                </div>
              ) : null}
              {easUrl && result.onchain.attestation_uid ? (
                <div>
                  <a
                    href={easUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary-soft underline-offset-2 hover:underline"
                  >
                    {t("onchainAttestation")}:{" "}
                    {truncateHash(result.onchain.attestation_uid)}
                  </a>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}
      </div>

      {result.status === "succeeded_with_warnings" ? (
        <p className="text-xs text-muted">{t("warningsNote")}</p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted/80">{t("disclaimer")}</p>
    </div>
  );
}
