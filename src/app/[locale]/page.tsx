import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  IconExchanges,
  IconFunds,
  IconInsurance,
  IconInvestigations,
} from "@/components/home/AudienceIcons";
import { Hero } from "@/components/hero/Hero";
import { HeroContent } from "@/components/hero/HeroContent";
import { SignalFeatureCards } from "@/components/signals/SignalFeatureCards";
import { SignalReportExample } from "@/components/signals/SignalReportExample";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { homeSenales, routes } from "@/lib/paths";

type Props = { params: Promise<{ locale: string }> };

const useCaseKeys = [
  "cryptoExchanges",
  "funds",
  "insurance",
  "investigations",
] as const;

type UseCaseCopy = { title: string; body: string };

const useCaseIcons = {
  cryptoExchanges: IconExchanges,
  funds: IconFunds,
  insurance: IconInsurance,
  investigations: IconInvestigations,
} as const;

const learnMoreByLocale: Record<string, string> = {
  es: "Conocer más",
  en: "Learn more",
  pt: "Conhecer mais",
};

const whatCtaByLocale: Record<string, string> = {
  es: "Cómo funcionamos",
  en: "How we work",
  pt: "Como funcionamos",
};

const mockHintByLocale: Record<string, string> = {
  es: "Ejemplo ilustrativo",
  en: "Illustrative example",
  pt: "Exemplo ilustrativo",
};

const mockCtaByLocale: Record<string, string> = {
  es: "Ver ejemplo completo",
  en: "View full example",
  pt: "Ver exemplo completo",
};

const originImageByLocale: Record<string, string> = {
  es: "/origen_es.jpg",
  en: "/origen_en.jpg",
  pt: "/origen_pt.jpg",
};

const strategyImageByLocale: Record<string, string> = {
  es: "/estrategia_es.jpg",
  en: "/estrategia_en.jpg",
  pt: "/estrategia_pt.jpg",
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const messages = await getMessages();
  const useCases = (
    messages as {
      home: {
        useCases: Record<(typeof useCaseKeys)[number], UseCaseCopy>;
      };
    }
  ).home.useCases;
  const learnMore = learnMoreByLocale[locale] ?? learnMoreByLocale.es;
  const whatCta = whatCtaByLocale[locale] ?? whatCtaByLocale.es;
  const mockHint = mockHintByLocale[locale] ?? mockHintByLocale.es;
  const mockCta = mockCtaByLocale[locale] ?? mockCtaByLocale.es;
  const originImage =
    originImageByLocale[locale] ?? originImageByLocale.es;
  const strategyImage =
    strategyImageByLocale[locale] ?? strategyImageByLocale.es;

  return (
    <>
      <Hero>
        <HeroContent />
      </Hero>

      <Section className="section-atmosphere border-t border-glass/30">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-semibold tracking-tight text-pure md:text-[2.75rem] md:leading-[1.1]">
                {t("home.whatTitle")}
              </h2>
              <p className="mt-4 font-display text-xl leading-[1.5] tracking-tight text-pure md:text-2xl md:leading-[1.45]">
                {t("home.whatBody")}
              </p>
              <p className="mt-4 text-lg leading-[1.65] text-muted md:text-xl md:leading-[1.65]">
                {t("home.whatClose")}
              </p>
              <p className="what-limits-note mt-5">{t("home.whatLimits")}</p>
              <div className="mt-6">
                <Button href={routes.comoFunciona} className="btn-premium">
                  {whatCta}
                  <span aria-hidden="true" className="ml-1.5">
                    →
                  </span>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-glass/50 bg-void/40 shadow-[0_24px_60px_color-mix(in_oklab,var(--void)_55%,transparent)] lg:mx-0 lg:max-w-none">
              <Image
                src={strategyImage}
                alt={t("home.whatTitle")}
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full object-contain"
                priority={false}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        id="senales"
        className="section-atmosphere-alt section-atmosphere scroll-mt-24"
      >
        <Reveal>
          <SectionHeading
            title={t("home.signalsTitle")}
            intro={t("home.signalsIntro")}
          />
        </Reveal>
        <Reveal delayMs={80}>
          <SignalFeatureCards />
        </Reveal>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <Reveal>
          <SectionHeading
            title={t("home.mockTitle")}
            intro={mockHint}
          />
        </Reveal>
        <Reveal delayMs={80}>
          <div className="mx-auto max-w-3xl space-y-5">
            <SignalReportExample locale={locale} variant="teaser" />
            <div className="mt-2">
              <Button href={routes.ejemplo} className="btn-premium">
                {mockCta}
                <span aria-hidden="true" className="ml-1.5">
                  →
                </span>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30">
        <Reveal>
          <SectionHeading
            title={t("home.useCasesTitle")}
            intro={t("home.useCasesIntro")}
          />
        </Reveal>
        <Reveal delayMs={80}>
          <div className="usecase-grid">
            {useCaseKeys.map((key) => {
              const Icon = useCaseIcons[key];
              const item = useCases[key];
              const isExchange = key === "cryptoExchanges";
              const inner = (
                <>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-void/50 text-primary">
                    <Icon />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-pure md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted md:text-[0.95rem]">
                    {item.body}
                  </p>
                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium ${
                      isExchange ? "text-primary" : "text-muted/40"
                    }`}
                  >
                    {learnMore}
                    <span aria-hidden="true">→</span>
                  </span>
                </>
              );

              if (isExchange) {
                return (
                  <Link
                    key={key}
                    href={routes.criptoExchanges}
                    className="usecase-item usecase-item--priority flex h-full flex-col transition-[border-color,transform] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {inner}
                  </Link>
                );
              }

              return (
                <div key={key} className="usecase-item flex h-full flex-col">
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-semibold tracking-tight text-pure md:text-[2.75rem] md:leading-[1.1]">
                {t("home.storyTitle")}
              </h2>
              <p className="mt-4 text-lg leading-[1.65] text-muted md:text-xl md:leading-[1.65]">
                {t("home.storyBody")}
              </p>
              <div className="mt-6">
                <Button href={routes.nosotros} className="btn-premium">
                  {t("home.storyCta")}
                  <span aria-hidden="true" className="ml-1.5">
                    →
                  </span>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-glass/50 bg-void/40 shadow-[0_24px_60px_color-mix(in_oklab,var(--void)_55%,transparent)] lg:mx-0 lg:max-w-none">
              <Image
                src={originImage}
                alt={t("home.storyTitle")}
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full object-contain"
                priority={false}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <section className="cta-band relative px-6 py-20 md:py-28">
        <Reveal>
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {t("home.ctaBody")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href={homeSenales} className="btn-premium">
                {t("common.exploreSignals")}
              </Button>
              <Button href={routes.contacto} className="btn-premium">
                {t("common.requestAccess")}
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
