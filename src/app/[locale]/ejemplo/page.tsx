import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignalReportExample } from "@/components/signals/SignalReportExample";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const headerByLocale: Record<
  string,
  {
    eyebrow: string;
    title: string;
    intro: string;
    backHome: string;
  }
> = {
  es: {
    eyebrow: "Ejemplo",
    title: "Así se ve un análisis Walpulse",
    intro:
      "Informe ilustrativo completo: las cuatro partes (Orígenes, Actividad, Multichain y Portafolio) con grades A–F y el detalle que permite auditar cada resultado. Es cercano a Estándar / Experta, no a Básica. La interpretación queda en el receptor.",
    backHome: "Volver al inicio",
  },
  en: {
    eyebrow: "Example",
    title: "This is what a Walpulse analysis looks like",
    intro:
      "A full illustrative report: all four parts (Origins, Activity, Multichain, and Portfolio) with A–F grades and the detail that lets you audit each result. Closer to Standard / Expert than to Basic. Interpretation belongs to the recipient.",
    backHome: "Back to home",
  },
  pt: {
    eyebrow: "Exemplo",
    title: "Assim se vê uma análise Walpulse",
    intro:
      "Relatório ilustrativo completo: as quatro partes (Origins, Activity, Multichain e Portfolio) com grades A–F e o detalhe que permite auditar cada resultado. Mais próximo de Standard / Expert do que de Básica. A interpretação fica com o receptor.",
    backHome: "Voltar ao início",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.ejemplo,
    title: t("ejemploTitle"),
    description: t("ejemploDescription"),
    siteName: t("siteName"),
  });
}

export default async function EjemploPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = headerByLocale[locale] ?? headerByLocale.es;

  return (
    <>
      <Section className="section-atmosphere relative overflow-hidden pt-20 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary/90">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-pure md:text-6xl md:leading-[1.05]">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {copy.intro}
        </p>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30 pt-0 md:pt-8">
        <SignalReportExample locale={locale} variant="full" />
        <div className="mt-10">
          <Button href={routes.home} className="btn-premium">
            {copy.backHome}
            <span aria-hidden="true" className="ml-1.5">
              →
            </span>
          </Button>
        </div>
      </Section>
    </>
  );
}
