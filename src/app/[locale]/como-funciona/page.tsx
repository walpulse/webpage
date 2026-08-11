import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProcessFlow } from "@/components/como-funciona/ProcessFlow";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const stepKeys = ["input", "analysis", "signals", "use"] as const;

const eyebrowByLocale: Record<string, string> = {
  es: "Flujo",
  en: "Flow",
  pt: "Fluxo",
};

const explainImageByLocale: Record<string, string> = {
  es: "/caja_negra_es.jpg",
  en: "/caja_negra_en.jpg",
  pt: "/caja_negra_pt.jpg",
};

/** Locale maps avoid stale next-intl key resolution for newly added strings. */
const explainByLocale: Record<
  string,
  {
    title: string;
    lead: string;
    points: string[];
    close: string;
  }
> = {
  es: {
    title: "Explicabilidad",
    lead:
      "Cada grade no es una caja negra. Walpulse prioriza que el receptor pueda entender cómo se construyó el resultado.",
    points: [
      "Qué variables se consideraron en el análisis.",
      "Cómo se distribuyen los factores de riesgo o madurez.",
      "Por qué se llegó a ese grade — no solo un rótulo opaco.",
    ],
    close:
      "Eso importa cuando las señales se usan como input de análisis de riesgo, due diligence o investigación.",
  },
  en: {
    title: "Explainability",
    lead:
      "Each grade is not a black box. Walpulse prioritizes that the recipient can understand how the result was built.",
    points: [
      "Which variables were considered in the analysis.",
      "How risk or maturity factors are distributed.",
      "Why that grade was reached — not just an opaque label.",
    ],
    close:
      "That matters when signals are used as input for risk analysis, due diligence, or investigation.",
  },
  pt: {
    title: "Explicabilidade",
    lead:
      "Cada grade não é uma caixa-preta. A Walpulse prioriza que o receptor possa entender como o resultado foi construído.",
    points: [
      "Quais variáveis foram consideradas na análise.",
      "Como se distribuem os fatores de risco ou maturidade.",
      "Por que se chegou àquele grade — não apenas um rótulo opaco.",
    ],
    close:
      "Isso importa quando os sinais são usados como input de análise de risco, due diligence ou investigação.",
  },
};

const b2bByLocale: Record<
  string,
  {
    title: string;
    body: string;
    soonLabel: string;
    soon: string[];
  }
> = {
  es: {
    title: "Enfoque B2B / API",
    body:
      "Walpulse está pensado como fuente de inteligencia on-chain para equipos que monitorean wallets, evalúan riesgo, hacen due diligence o investigan. Hoy el valor está en las señales mismas: consulta por wallet e interpretación por el receptor. La siguiente capa es integrar esa inteligencia en sus propios procesos.",
    soonLabel: "Próximamente",
    soon: [
      "Dashboard para hacer consultas de señales por wallet a petición del usuario.",
      "API pública para integrar a sus procesos de evaluación internos de forma automatizada.",
    ],
  },
  en: {
    title: "B2B / API approach",
    body:
      "Walpulse is designed as an on-chain intelligence source for teams that monitor wallets, assess risk, run due diligence, or investigate. Today the value is in the signals themselves: lookup by wallet and interpretation by the recipient. The next layer is integrating that intelligence into their own processes.",
    soonLabel: "Coming soon",
    soon: [
      "Dashboard for on-demand signal lookups by wallet at the user’s request.",
      "Public API to plug into internal evaluation processes in an automated way.",
    ],
  },
  pt: {
    title: "Abordagem B2B / API",
    body:
      "A Walpulse é pensada como fonte de inteligência on-chain para equipes que monitoram wallets, avaliam risco, fazem due diligence ou investigam. Hoje o valor está nos próprios sinais: consulta por wallet e interpretação pelo receptor. A próxima camada é integrar essa inteligência aos seus processos.",
    soonLabel: "Em breve",
    soon: [
      "Dashboard para consultas de sinais por wallet a pedido do usuário.",
      "API pública para integrar aos processos internos de avaliação de forma automatizada.",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.comoFunciona,
    title: t("comoFuncionaTitle"),
    description: t("comoFuncionaDescription"),
    siteName: t("siteName"),
  });
}

export default async function ComoFuncionaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("comoFunciona");
  const tc = await getTranslations("common");

  const eyebrow = eyebrowByLocale[locale] ?? eyebrowByLocale.es;
  const explain = explainByLocale[locale] ?? explainByLocale.es;
  const explainImage =
    explainImageByLocale[locale] ?? explainImageByLocale.es;
  const b2b = b2bByLocale[locale] ?? b2bByLocale.es;

  const steps = stepKeys.map((key) => ({
    title: t(`steps.${key}.title`),
    body: t(`steps.${key}.body`),
  }));

  return (
    <>
      <Section className="section-atmosphere relative overflow-hidden pt-20 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary/90">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-pure md:text-6xl md:leading-[1.05]">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {t("intro")}
        </p>
        <p className="mt-6 font-mono text-sm text-primary/90">{tc("principle")}</p>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30">
        <h2 className="mb-10 font-display text-2xl font-semibold text-pure md:text-3xl">
          {t("stepsTitle")}
        </h2>
        <ProcessFlow steps={steps} />
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-pure md:text-3xl">
              {explain.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {explain.lead}
            </p>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-muted">
              {explain.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                    aria-hidden
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-muted">
              {explain.close}
            </p>
          </div>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-glass/50 bg-void/40 shadow-[0_24px_60px_color-mix(in_oklab,var(--void)_55%,transparent)] lg:mx-0 lg:max-w-none">
            <Image
              src={explainImage}
              alt={explain.title}
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30" narrow>
        <h2 className="font-display text-2xl font-semibold text-pure md:text-3xl">
          {b2b.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{b2b.body}</p>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-primary/90">
          {b2b.soonLabel}
        </p>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted">
          {b2b.soon.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
