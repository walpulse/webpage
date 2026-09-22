import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LatAmRegulationMap } from "@/components/regulacion/LatAmRegulationMap";
import { getGafiLatamCopy } from "@/lib/gafiLatamContent";
import { routes } from "@/lib/paths";

type Props = { locale: string };

export function GafiLatamExchangesPage({ locale }: Props) {
  const copy = getGafiLatamCopy(locale);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__visual" aria-hidden>
          <Image
            src="/brand/exchanges/header-internacional.png"
            alt=""
            fill
            priority
            sizes="(max-width: 899px) 100vw, 48vw"
            className="page-hero__image"
          />
        </div>
        <div className="page-hero__scrim" aria-hidden />
        <div className="page-hero__content">
          <div className="page-hero__copy">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]">
              {copy.title}
            </h1>
            <blockquote className="mt-6 border-l-2 border-primary pl-5 text-base leading-relaxed text-muted md:text-lg">
              {copy.message}
            </blockquote>
          </div>
        </div>
      </section>

      <Section className="section-band-surface border-t border-glass/30">
        <SectionHeading title={copy.contextTitle} />
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted">
          {copy.contextBody.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <article className="context-subcard mt-8 max-w-3xl">
          <h3 className="context-subcard__label">{copy.contextCloseLabel}</h3>
          <p className="context-subcard__body">{copy.contextClose}</p>
        </article>
      </Section>

      <Section className="section-band-void section-atmosphere border-t border-glass/30">
        <SectionHeading title={copy.recsTitle} intro={copy.recsIntro} />
        <ul className="exchanges-map-cards">
          {copy.recs.map((row) => (
            <li key={row.code} className="exchanges-map-card">
              <h3 className="exchanges-map-card__title">
                {row.code} · {row.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {row.crypto}
              </p>
            </li>
          ))}
        </ul>
        <div className="exchanges-map-table">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface/90 text-muted">
              <tr>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.recHeaders.code}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.recHeaders.title}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.recHeaders.crypto}
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.recs.map((row) => (
                <tr
                  key={row.code}
                  className="border-t border-glass/70 transition-colors hover:bg-primary/[0.03]"
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-primary-soft md:px-5">
                    {row.code}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-pure md:px-5">
                    {row.title}
                  </td>
                  <td className="px-4 py-3.5 text-muted md:px-5">{row.crypto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="section-band-surface border-t border-glass/30">
        <SectionHeading title={copy.fitTitle} intro={copy.fitIntro} />
        <ul className="exchanges-map-cards">
          {copy.fitRows.map((row) => (
            <li key={row.requirement} className="exchanges-map-card">
              <h3 className="exchanges-map-card__title">{row.requirement}</h3>
              <dl className="exchanges-map-card__fields">
                <div>
                  <dt>{copy.fitHeaders.covers}</dt>
                  <dd>{row.covers}</dd>
                </div>
                <div>
                  <dt>{copy.fitHeaders.support}</dt>
                  <dd>{row.support}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <div className="exchanges-map-table">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface/90 text-muted">
              <tr>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.fitHeaders.requirement}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.fitHeaders.covers}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {copy.fitHeaders.support}
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.fitRows.map((row) => (
                <tr
                  key={row.requirement}
                  className="border-t border-glass/70 transition-colors hover:bg-primary/[0.03]"
                >
                  <td className="px-4 py-3.5 font-medium text-pure md:px-5">
                    {row.requirement}
                  </td>
                  <td className="px-4 py-3.5 text-muted md:px-5">{row.covers}</td>
                  <td className="px-4 py-3.5 text-muted md:px-5">{row.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <blockquote className="mt-10 max-w-3xl border-l-2 border-primary pl-5 text-base leading-relaxed text-muted md:text-lg">
          {copy.fitMessage}
        </blockquote>
      </Section>

      <Section
        wide
        className="section-band-void section-atmosphere border-t border-glass/30"
      >
        <SectionHeading title={copy.mapTitle} intro={copy.mapIntro} />
        <LatAmRegulationMap copy={copy} />
        <article className="context-subcard mt-12 max-w-3xl">
          <h3 className="context-subcard__label">{copy.greyTitle}</h3>
          <p className="context-subcard__body">{copy.greyBody}</p>
        </article>
      </Section>

      <Section className="section-band-cta border-t border-glass/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl md:leading-[1.15]">
            {copy.ctaTitle}
          </h2>
          <div className="mt-8 flex justify-center">
            <Button href={routes.contacto} className="btn-premium">
              {copy.talkToTeam}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
