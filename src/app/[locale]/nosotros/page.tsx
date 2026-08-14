import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OriginRecognitionMedia } from "@/components/nosotros/OriginRecognitionMedia";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ORIGIN_LINKS, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const projectKeys = ["gsa", "walcert"] as const;

const projectLinks: Record<(typeof projectKeys)[number], string> = {
  gsa: "https://www.globalscoreagent.com",
  walcert: "https://walcert.globalscoreagent.com",
};

const projectLogos: Record<(typeof projectKeys)[number], string> = {
  gsa: "/logo-gsa.png",
  walcert: "/walcert_agent.PNG",
};

type NosotrosExtras = {
  brandName: string;
  hackathonLabel: string;
  summitLabel: string;
  recognitionYear: string;
  recognitionTitle: string;
  observadorCta: string;
  summitCta: string;
  dorahacksCta: string;
  viewEventPhotos: string;
  expandImage: string;
  eventGalleryTitle: string;
  carouselPrev: string;
  carouselNext: string;
  closeMedia: string;
  linkedinCta: string;
  xCta: string;
  principlesTitle: string;
  principles: string[];
  projects: {
    gsa: { name: string; focus: string };
    walcert: { name: string; focus: string };
  };
};

const extrasByLocale: Record<string, NosotrosExtras> = {
  es: {
    brandName: "Walpulse",
    hackathonLabel: "Ethereum Uruguay Hackathon 2026",
    summitLabel: "Blockchain Summit Global 2026",
    recognitionYear: "2026",
    recognitionTitle:
      "1er lugar Startup · ORIGO — ETH Uruguay Hackathon + pitch BSG",
    observadorCta: "El Observador",
    summitCta: "Blockchain Summit Global",
    dorahacksCta: "DoraHacks · Urugwei 2026",
    viewEventPhotos: "Ver imágenes del evento",
    expandImage: "Ampliar imagen",
    eventGalleryTitle: "Imágenes del evento",
    carouselPrev: "Imagen anterior",
    carouselNext: "Imagen siguiente",
    closeMedia: "Cerrar",
    linkedinCta: "LinkedIn",
    xCta: "X",
    principlesTitle: "Principios Walpulse",
    principles: [
      "Creamos y analizamos señales on-chain de reputación.",
      "El receptor interpreta las señales y toma las determinaciones.",
      "No realizamos KYC, Travel Rule, reportes a la UIAF ni decisiones de compliance.",
      "Las señales son verificables y explicables.",
    ],
    projects: {
      gsa: {
        name: "Global Score Agent",
        focus:
          "Plataforma especializada en medir reputación de agentes autónomos desplegados bajo el contrato ERC-8004 de Ethereum",
      },
      walcert: {
        name: "Walcert",
        focus:
          "Agente autónomo especializado en emitir certificados de madurez de wallet, diseñado para el consumo agent to agent aceptando pagos x402",
      },
    },
  },
  en: {
    brandName: "Walpulse",
    hackathonLabel: "Ethereum Uruguay Hackathon 2026",
    summitLabel: "Blockchain Summit Global 2026",
    recognitionYear: "2026",
    recognitionTitle:
      "1st place Startup · ORIGO — ETH Uruguay Hackathon + BSG pitch",
    observadorCta: "El Observador",
    summitCta: "Blockchain Summit Global",
    dorahacksCta: "DoraHacks · Urugwei 2026",
    viewEventPhotos: "View event photos",
    expandImage: "Expand image",
    eventGalleryTitle: "Event photos",
    carouselPrev: "Previous image",
    carouselNext: "Next image",
    closeMedia: "Close",
    linkedinCta: "LinkedIn",
    xCta: "X",
    principlesTitle: "Walpulse Principles",
    principles: [
      "We create and analyze on-chain reputation signals.",
      "The recipient interprets the signals and makes determinations.",
      "We do not perform KYC, Travel Rule, UIAF reporting, or compliance decisions.",
      "Signals are verifiable and explainable.",
    ],
    projects: {
      gsa: {
        name: "Global Score Agent",
        focus:
          "Platform specialized in measuring reputation of autonomous agents deployed under Ethereum’s ERC-8004 contract",
      },
      walcert: {
        name: "Walcert",
        focus:
          "Autonomous agent specialized in issuing wallet maturity certificates, designed for agent-to-agent consumption with x402 payments",
      },
    },
  },
  pt: {
    brandName: "Walpulse",
    hackathonLabel: "Ethereum Uruguay Hackathon 2026",
    summitLabel: "Blockchain Summit Global 2026",
    recognitionYear: "2026",
    recognitionTitle:
      "1º lugar Startup · ORIGO — ETH Uruguay Hackathon + pitch BSG",
    observadorCta: "El Observador",
    summitCta: "Blockchain Summit Global",
    dorahacksCta: "DoraHacks · Urugwei 2026",
    viewEventPhotos: "Ver imagens do evento",
    expandImage: "Ampliar imagem",
    eventGalleryTitle: "Imagens do evento",
    carouselPrev: "Imagem anterior",
    carouselNext: "Imagem seguinte",
    closeMedia: "Fechar",
    linkedinCta: "LinkedIn",
    xCta: "X",
    principlesTitle: "Princípios Walpulse",
    principles: [
      "Criamos e analisamos sinais on-chain de reputação.",
      "O receptor interpreta os sinais e toma as determinações.",
      "Não realizamos KYC, Travel Rule, reportes à UIAF nem decisões de compliance.",
      "Os sinais são verificáveis e explicáveis.",
    ],
    projects: {
      gsa: {
        name: "Global Score Agent",
        focus:
          "Plataforma especializada em medir reputação de agentes autônomos implantados sob o contrato ERC-8004 da Ethereum",
      },
      walcert: {
        name: "Walcert",
        focus:
          "Agente autônomo especializado em emitir certificados de maturidade de wallet, projetado para consumo agent to agent aceitando pagamentos x402",
      },
    },
  },
};

const pillBtn =
  "inline-flex items-center justify-center rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary-soft transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const socialBtn =
  "inline-flex items-center justify-center rounded-lg border border-primary/35 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary-soft shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_12%,transparent)] transition-[color,background-color,border-color,box-shadow,transform] duration-300 hover:border-primary/55 hover:bg-primary/18 hover:text-pure focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.nosotros,
    title: t("nosotrosTitle"),
    description: t("nosotrosDescription"),
    siteName: t("siteName"),
  });
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nosotros");
  const tc = await getTranslations("common");
  const extras = extrasByLocale[locale] ?? extrasByLocale.es;

  return (
    <>
      <Section className="section-atmosphere relative overflow-hidden pt-20 md:pt-28">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
          <div className="relative shrink-0">
            <div
              className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_68%)]"
              aria-hidden
            />
            <Image
              src="/brand/logo/Favicon.png"
              alt={extras.brandName}
              width={220}
              height={220}
              priority
              className="relative h-36 w-36 object-contain md:h-44 md:w-44"
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]">
              {t("title")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl md:leading-[1.65]">
              {t("intro")}
            </p>
          </div>
        </div>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30">
        <SectionHeading title={t("originTitle")} />

        <article className="origin-recognition">
          <div className="origin-recognition__body">
            <p className="origin-recognition__year">{extras.recognitionYear}</p>
            <h3 className="origin-recognition__title">{extras.recognitionTitle}</h3>
            <p className="origin-recognition__text">{t("originBody")}</p>
            <p className="origin-recognition__text">{t("originBody2")}</p>
            <p className="origin-recognition__meta">{t("originTeam")}</p>
            <div className="origin-recognition__actions">
              <a
                href={ORIGIN_LINKS.observador}
                target="_blank"
                rel="noreferrer"
                className={pillBtn}
              >
                {extras.observadorCta}
              </a>
              <a
                href={ORIGIN_LINKS.observador}
                target="_blank"
                rel="noreferrer"
                className={pillBtn}
              >
                {extras.summitCta}
              </a>
              <a
                href={ORIGIN_LINKS.dorahacks}
                target="_blank"
                rel="noreferrer"
                className={pillBtn}
              >
                {extras.dorahacksCta}
              </a>
            </div>
          </div>

          <OriginRecognitionMedia
            labels={{
              hackathonAlt: extras.hackathonLabel,
              summitAlt: extras.summitLabel,
              expandImage: extras.expandImage,
              viewEventPhotos: extras.viewEventPhotos,
              eventGalleryTitle: extras.eventGalleryTitle,
              prev: extras.carouselPrev,
              next: extras.carouselNext,
              close: extras.closeMedia,
            }}
          />
        </article>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <SectionHeading title={t("founderTitle")} />
        <div className="founder-layout">
          <article className="founder-card">
            <h3 className="founder-card__name">{t("founderName")}</h3>
            <p className="founder-card__role">{t("founderRole")}</p>
            <p className="founder-card__bio">{t("founderBio")}</p>
            <div className="founder-card__actions">
              <a
                href={ORIGIN_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className={socialBtn}
              >
                {extras.linkedinCta}
              </a>
              <a
                href={ORIGIN_LINKS.x}
                target="_blank"
                rel="noreferrer"
                className={`${socialBtn} border-glass/70 bg-surface/60 text-pure hover:border-primary/40`}
              >
                {extras.xCta}
              </a>
            </div>
          </article>
          <figure className="founder-photo">
            <Image
              src="/jair.jpeg"
              alt={t("founderName")}
              width={900}
              height={1100}
              sizes="(max-width: 768px) 90vw, 40vw"
              className="founder-photo__img"
            />
          </figure>
        </div>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30">
        <SectionHeading title={t("projectsTitle")} intro={t("projectsIntro")} />
        <div className="grid gap-5 md:grid-cols-2">
          {projectKeys.map((key) => {
            const project = extras.projects[key];
            return (
              <a
                key={key}
                href={projectLinks[key]}
                target="_blank"
                rel="noreferrer"
                className="block transition-transform duration-300 hover:-translate-y-0.5"
              >
                <article className="project-assoc-card h-full">
                  <div className="project-assoc-card__logo">
                    <Image
                      src={projectLogos[key]}
                      alt={project.name}
                      width={280}
                      height={120}
                      sizes="180px"
                      className="project-assoc-card__logo-img"
                    />
                  </div>
                  <h3 className="project-assoc-card__name">{project.name}</h3>
                  <p className="project-assoc-card__focus">{project.focus}</p>
                </article>
              </a>
            );
          })}
        </div>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <SectionHeading title={extras.principlesTitle} />
        <ul className="principles-grid">
          {extras.principles.map((item, index) => (
            <li key={item} className="principle-card">
              <span className="principle-card__index font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="principle-card__body">{item}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href={routes.contacto} className="btn-premium">
            {tc("talkToTeam")}
          </Button>
        </div>
      </Section>
    </>
  );
}
