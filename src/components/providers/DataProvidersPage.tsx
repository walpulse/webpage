import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DataProvidersGrid } from "@/components/providers/DataProvidersGrid";
import { Section } from "@/components/ui/Section";
import { providersPageForLocale } from "@/lib/dataProviders";
import { routes } from "@/lib/paths";

type Props = {
  locale: string;
};

export function DataProvidersPage({ locale }: Props) {
  const copy = providersPageForLocale(locale);
  const talk =
    locale === "en"
      ? "Talk to the team"
      : locale === "pt"
        ? "Falar com a equipe"
        : "Hablar con el equipo";
  const seeAnalisis =
    locale === "en"
      ? "See analysis depths"
      : locale === "pt"
        ? "Ver profundidades de análise"
        : "Ver profundidades de análisis";

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__visual" aria-hidden>
          <Image
            src="/brand/providers/header-proveedores.png"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 899px) 100vw, 48vw"
            className="page-hero__image"
          />
        </div>
        <div className="page-hero__scrim" aria-hidden />
        <div className="page-hero__content">
          <div className="page-hero__copy">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary/90">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]">
              {copy.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <Section className="section-band-surface border-t border-glass/30">
        <DataProvidersGrid locale={locale} />
        <p className="mx-auto mt-10 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
          {copy.disclaimer}
        </p>
      </Section>

      <Section className="section-band-cta border-t border-glass/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl md:leading-[1.15]">
            {copy.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={routes.analisis} className="btn-premium">
              {seeAnalisis}
            </Button>
            <Button href={routes.contacto} variant="secondary" className="btn-premium">
              {talk}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
