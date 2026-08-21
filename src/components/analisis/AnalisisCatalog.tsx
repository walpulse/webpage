import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { AnalisisSignalsCarousel } from "@/components/analisis/AnalisisSignalsCarousel";
import { analisisSignalsForLocale } from "@/lib/analisisSignalSlides";
import { routes } from "@/lib/paths";
import {
  catalogForLocale,
  serviceTierIds,
  type ServiceTierId,
} from "@/lib/serviceTiers";
import Image from "next/image";

type Props = {
  locale: string;
};

const COVERS_LABEL_BY_LOCALE: Record<string, string> = {
  es: "Cobertura",
  en: "Coverage",
  pt: "Cobertura",
};

function TierArrow() {
  return (
    <div className="analisis-tier-arrow" aria-hidden>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M12 4v14M6 14l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const TALK_BY_LOCALE: Record<string, string> = {
  es: "Hablar con el equipo",
  en: "Talk to the team",
  pt: "Falar com a equipe",
};

/** Signal names that should stand out at the start of a cover bullet. */
const COVER_SIGNAL_LABELS = [
  "Señal de Actividad Reciente",
  "Señal de Origen de Fondos",
  "Señal de Calidad del Portafolio",
  "Señal de Presencia del Ecosistema",
  "Recent Activity signal",
  "Origin of Funds signal",
  "Portfolio Quality signal",
  "Ecosystem Presence signal",
  "Sinal de Atividade Recente",
  "Sinal de Origem dos Fundos",
  "Sinal de Qualidade do Portfólio",
  "Sinal de Presença do Ecossistema",
] as const;

function formatCoverParagraph(text: string) {
  const label = COVER_SIGNAL_LABELS.find((item) => text.startsWith(item));
  if (!label) return text;
  return (
    <>
      <strong className="analisis-tier-covers__signal">{label}</strong>
      {text.slice(label.length)}
    </>
  );
}

export function AnalisisCatalog({ locale }: Props) {
  const copy = catalogForLocale(locale);
  const signals = analisisSignalsForLocale(locale);
  const talk = TALK_BY_LOCALE[locale] ?? TALK_BY_LOCALE.es;
  const coversLabel =
    COVERS_LABEL_BY_LOCALE[locale] ?? COVERS_LABEL_BY_LOCALE.es;

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__visual" aria-hidden>
          <Image
            src="/brand/analisis/header-rectangular.png"
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
            {copy.eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary/90">
                {copy.eyebrow}
              </p>
            ) : null}
            <h1
              className={`font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]${copy.eyebrow ? " mt-3" : ""}`}
            >
              {copy.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <Section className="section-band-surface border-t border-glass/30">
        <SectionHeading title={copy.cardsTitle} />
        <ul className="analisis-tier-grid">
          {serviceTierIds.map((id: ServiceTierId) => {
            const card = copy.cards[id];
            const { deliverables } = card;
            return (
              <li key={id} className="analisis-tier-column">
                <article
                  className={`analisis-tier-card analisis-tier-card--${id}`}
                >
                  <p className="analisis-tier-card__name">{card.name}</p>
                  <div className="analisis-tier-card__body">
                    {card.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </article>

                <TierArrow />

                <article
                  className={`analisis-tier-covers analisis-tier-covers--${id}`}
                >
                  <p className="analisis-tier-covers__label">{coversLabel}</p>
                  <ul className="analisis-tier-covers__list">
                    {card.covers.map((item) => {
                      const paragraphs = Array.isArray(item) ? item : [item];
                      return (
                        <li key={paragraphs[0]?.slice(0, 64)}>
                          {paragraphs.map((paragraph) => (
                            <p key={paragraph.slice(0, 48)}>
                              {formatCoverParagraph(paragraph)}
                            </p>
                          ))}
                        </li>
                      );
                    })}
                  </ul>
                </article>

                <TierArrow />

                <article
                  className={`analisis-tier-deliverables analisis-tier-deliverables--${id}`}
                >
                  <div className="analisis-tier-deliverables__head">
                    <p className="analisis-tier-deliverables__label">
                      {copy.deliverablesLabel}
                    </p>
                    <span
                      className={`analisis-tier-deliverables__badge analisis-tier-deliverables__badge--${deliverables.mode}`}
                    >
                      {deliverables.modeLabel}
                    </span>
                  </div>
                  <p className="analisis-tier-deliverables__blurb">
                    {deliverables.modeBlurb}
                  </p>

                  <p className="analisis-tier-deliverables__subhead">
                    {copy.packageLabel}
                  </p>
                  <ul className="analisis-tier-deliverables__list">
                    {deliverables.package.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className="analisis-tier-deliverables__subhead">
                    {copy.integrityLabel}
                  </p>
                  <ul className="analisis-tier-deliverables__list analisis-tier-deliverables__list--plain">
                    {copy.integrity.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="analisis-tier-deliverables__chain">
                    <span className="analisis-tier-deliverables__chain-label">
                      {copy.chainLabel}
                    </span>
                    <Image
                      src="/brand/chains/Base_logo.png"
                      alt="Base"
                      width={28}
                      height={28}
                      className="analisis-tier-deliverables__chain-logo"
                    />
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        wide
        className="section-band-void section-atmosphere border-t border-glass/30"
      >
        <SectionHeading title={signals.title} intro={signals.intro} />
        <AnalisisSignalsCarousel copy={signals} />
      </Section>

      <Section className="section-band-surface border-t border-glass/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-pure md:text-3xl">
            {copy.synthesisTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {copy.synthesisBody}
          </p>
        </div>
      </Section>

      <Section className="section-band-cta border-t border-glass/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl md:leading-[1.15]">
            {copy.ctaTitle}
          </h2>
          <div className="mt-8 flex justify-center">
            <Button href={routes.contacto} className="btn-premium">
              {talk}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
