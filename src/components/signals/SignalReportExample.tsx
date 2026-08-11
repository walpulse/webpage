import { getTranslations } from "next-intl/server";
import {
  SignalModulesCarousel,
  type CarouselSlide,
} from "@/components/signals/SignalModulesCarousel";
import reportJson from "@/data/examples/walcert-report-lite-v1.json";
import {
  chainLabel,
  reportLocaleFromApp,
  truncateWallet,
  type LocalizedText,
  type ReportLocale,
  type WalcertReportLiteV1,
} from "@/data/examples/types";
import { moduleLabel } from "@/lib/signalModules";

const report = reportJson as WalcertReportLiteV1;

type Props = {
  locale: string;
  variant?: "full" | "teaser";
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

export async function SignalReportExample({
  locale,
  variant = "full",
}: Props) {
  const t = await getTranslations("ejemplo");
  const lang = reportLocaleFromApp(locale);
  const isTeaser = variant === "teaser";

  const slides: CarouselSlide[] = report.modules.map((mod) => ({
    id: mod.certificate_id,
    type: mod.type,
    title: moduleLabel(mod.type, locale),
    grade: mod.grade,
    summary: pick(mod.summary, lang),
    signals: (isTeaser ? mod.signals.slice(0, 6) : mod.signals).map((sig) => ({
      id: sig.id,
      label: pick(sig.label, lang),
      display: pick(sig.display, lang),
    })),
    strengths: isTeaser ? [] : mod.strengths.map((item) => pick(item, lang)),
    concerns: isTeaser ? [] : mod.concerns.map((item) => pick(item, lang)),
    moduleId: isTeaser ? undefined : mod.certificate_id,
  }));

  return (
    <div
      className={`signal-panel relative ${isTeaser ? "p-5 md:p-6" : "p-6 md:p-8"}`}
    >
      <header className="relative space-y-3 border-b border-glass/50 pb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary/90">
          {report.schema.replace(/_/g, " ")}
        </p>
        <p className="font-mono text-sm text-pure md:text-base">
          {isTeaser ? truncateWallet(report.wallet) : report.wallet}
        </p>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
          <div>
            <dt className="inline text-muted/70">{t("analyzedAt")}: </dt>
            <dd className="inline">
              {formatAnalyzedAt(report.analyzed_at, locale)}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted/70">{t("chain")}: </dt>
            <dd className="inline">
              {chainLabel(report.chain_id)} ({report.chain_id})
            </dd>
          </div>
          {!isTeaser ? (
            <div>
              <dt className="inline text-muted/70">{t("agent")}: </dt>
              <dd className="inline">{report.agent_id}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <SignalModulesCarousel
        slides={slides}
        variant={variant}
        labels={{
          prev: t("prevModule"),
          next: t("nextModule"),
          strengths: t("strengths"),
          concerns: t("concerns"),
          moduleId: t("moduleId"),
        }}
      />

      {!isTeaser ? (
        <p className="relative mt-8 text-xs leading-relaxed text-muted/75">
          {t("footer")}
        </p>
      ) : null}
    </div>
  );
}
