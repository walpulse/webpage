import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { engineRiskForLocale } from "@/lib/engineRiskPage";
import { routes } from "@/lib/paths";

type Props = {
  locale: string;
};

export function EngineRiskPage({ locale }: Props) {
  const copy = engineRiskForLocale(locale);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__visual" aria-hidden>
          <Image
            src="/brand/engine-risk/header-engine-risk.png"
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
        <SectionHeading title={copy.principleTitle} intro={copy.principleBody} />
      </Section>

      <Section className="section-band-void border-t border-glass/30">
        <SectionHeading title={copy.whyTitle} intro={copy.whyBody} />
      </Section>

      <Section className="section-band-surface border-t border-glass/30">
        <SectionHeading title={copy.howTitle} />
        <ol className="mx-auto mt-8 max-w-3xl space-y-5">
          {copy.howSteps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="font-mono text-sm text-primary/90">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed text-muted">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-12 max-w-3xl">
          <h3 className="font-display text-xl font-semibold tracking-tight text-pure md:text-2xl">
            {copy.howClarificationsTitle}
          </h3>
          <ul className="mt-6 space-y-4">
            {copy.howClarifications.map((item) => (
              <li
                key={item.slice(0, 48)}
                className="border-l-2 border-primary/40 pl-4 text-base leading-relaxed text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="section-band-void border-t border-glass/30">
        <SectionHeading
          title={copy.examplesTitle}
          intro={copy.examplesIntro}
        />
        <ul className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          {copy.examples.map((item) => (
            <li
              key={item.rule}
              className="rounded-2xl border border-glass/50 bg-void/40 px-5 py-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/80">
                {item.signal}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-pure/90">
                {item.rule}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="section-band-cta border-t border-glass/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl md:leading-[1.15]">
            {copy.accessTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {copy.accessBody}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={routes.contacto} className="btn-premium">
              {copy.talkToTeam}
            </Button>
            <Button
              href={routes.analisis}
              variant="secondary"
              className="btn-premium"
            >
              {copy.seeAnalisis}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
