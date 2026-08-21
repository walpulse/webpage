"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProcessFlow } from "@/components/como-funciona/ProcessFlow";
import { type RevealLevel } from "@/lib/walletReveal";

type Props = {
  level: RevealLevel;
};

const explainImageByLocale: Record<string, string> = {
  es: "/caja_negra_es.jpg",
  en: "/caja_negra_en.jpg",
  pt: "/caja_negra_pt.jpg",
};

const processStepKeys = ["input", "analysis", "signals", "use"] as const;

type NarrativeCopy = {
  lead: string;
  bullets: string[];
  depthNote: string;
  whyTitle: string;
  whyBody: string;
  /** When set, depthNote is shown under a titled «Alcance»-style section. */
  scopeTitle?: string;
};

/** Inline copy — next-intl can serve stale `reveal.origins` keys under Turbopack. */
const originsCopyByLocale: Record<string, NarrativeCopy> = {
  es: {
    lead: "Consultamos las transacciones de origen; se analiza la procedencia, validez y confianza de los fondos de la wallet. Permitiéndonos crear algunas de las siguientes señales:",
    bullets: [
      "Categorías de origen (CEX, bridge, mixer, OFAC, airdrop, orgánico…)",
      "Remitentes únicos",
      "Exposición a wallets catalogadas como mixer o wallets marcadas por sanciones",
      "Calidad de los fondos (orgánico vs sintético)",
      "Entre otros…",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "La cantidad de redes y cantidad de transacciones de origen varía dependiendo del tipo de análisis solicitado, partiendo en la versión básica en 2 redes y 100 transacciones de origen y llegando hasta más de +10 redes y 500 transacciones en la versión experto. También en los análisis más sofisticados se aplica un análisis de orígenes a los fondeadores directos.",
    whyTitle: "Importancia",
    whyBody:
      "El origen de los fondos es una de las primeras preguntas al evaluar una wallet. Entender de dónde vinieron los primeros fondos permite definir un contexto claro sobre el comportamiento de una wallet y al receptor de la señal evaluar dentro de su propio marco decisorio el nivel de confianza que tendrá al interactuar con dicha wallet.",
  },
  en: {
    lead: "We look up origin transactions and analyze the provenance, validity, and trustworthiness of the wallet’s funds. That lets us create some of the following signals:",
    bullets: [
      "Origin categories (CEX, bridge, mixer, OFAC, airdrop, organic…)",
      "Unique senders",
      "Exposure to wallets labeled as mixers or wallets flagged by sanctions",
      "Fund quality (organic vs synthetic)",
      "Among others…",
    ],
    scopeTitle: "Scope",
    depthNote:
      "The number of networks and origin transactions varies depending on the type of analysis requested, starting in the basic version at 2 networks and 100 origin transactions and reaching more than +10 networks and 500 transactions in the expert version. In more sophisticated analyses, an origins analysis is also applied to direct funders.",
    whyTitle: "Why it matters",
    whyBody:
      "The origin of funds is one of the first questions when evaluating a wallet. Understanding where the first funds came from helps define a clear context for a wallet’s behavior and lets the signal recipient assess, within their own decision framework, the level of trust they will have when interacting with that wallet.",
  },
  pt: {
    lead: "Consultamos as transações de origem; analisa-se a procedência, validade e confiança dos fundos da wallet. Isso nos permite criar alguns dos seguintes sinais:",
    bullets: [
      "Categorias de origem (CEX, bridge, mixer, OFAC, airdrop, orgânico…)",
      "Remetentes únicos",
      "Exposição a wallets catalogadas como mixer ou wallets marcadas por sanções",
      "Qualidade dos fundos (orgânico vs sintético)",
      "Entre outros…",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "A quantidade de redes e quantidade de transações de origem varia conforme o tipo de análise solicitada, partindo na versão básica em 2 redes e 100 transações de origem e chegando a mais de +10 redes e 500 transações na versão expert. Também nas análises mais sofisticadas aplica-se uma análise de origens aos financiadores diretos.",
    whyTitle: "Importância",
    whyBody:
      "A origem dos fundos é uma das primeiras perguntas ao avaliar uma wallet. Entender de onde vieram os primeiros fundos permite definir um contexto claro sobre o comportamento de uma wallet e ao receptor do sinal avaliar, dentro do seu próprio marco decisório, o nível de confiança que terá ao interagir com essa wallet.",
  },
};

const activityCopyByLocale: Record<string, NarrativeCopy> = {
  es: {
    lead: "Analizamos una ventana de días recientes y con base a las transacciones on-chain de entrada y salida de fondos, creamos la siguientes señales:",
    bullets: [
      "Contrapartes únicas y concentración de movimientos",
      "Interacción con CEX",
      "Posibles interacciones catalogadas como wash / circulares / bot-like",
      "Diversidad de tokens en las transacciones",
      "Entre otras",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "La cantidad de redes y la cantidad de transacciones varía dependiendo del tipo de análisis solicitado, partiendo en la versión básica en 2 redes y los últimos 15 días y llegando hasta más de +10 redes y últimos 90 días en la versión experto. También en los análisis más sofisticados se hace un análisis en las 5 billeteras con más interacción.",
    whyTitle: "Por qué es importante?",
    whyBody:
      "La actividad de una wallet permite al receptor entender el comportamiento de la wallet en las transacciones diarias, permitiendo evaluar el perfil de reputación y confianza que se puede llegar a tener sobre una wallet e incluso detectar alertas tempranas ante riesgos que podrían permanecer ocultos.",
  },
  en: {
    lead: "We analyze a recent day window and, based on on-chain inflow and outflow transactions, create the following signals:",
    bullets: [
      "Unique counterparties and concentration of movements",
      "Interaction with CEXs",
      "Possible interactions labeled as wash / circular / bot-like",
      "Token diversity in transactions",
      "Among others",
    ],
    scopeTitle: "Scope",
    depthNote:
      "The number of networks and transactions varies depending on the type of analysis requested, starting in the basic version at 2 networks and the last 15 days and reaching more than +10 networks and the last 90 days in the expert version. In more sophisticated analyses, an analysis is also run on the 5 wallets with the most interaction.",
    whyTitle: "Why does it matter?",
    whyBody:
      "A wallet’s activity lets the recipient understand the wallet’s behavior in daily transactions, helping assess the reputation and trust profile that can be formed about a wallet and even detect early warnings of risks that could otherwise remain hidden.",
  },
  pt: {
    lead: "Analisamos uma janela de dias recentes e, com base nas transações on-chain de entrada e saída de fundos, criamos as seguintes sinais:",
    bullets: [
      "Contrapartes únicas e concentração de movimentos",
      "Interação com CEX",
      "Possíveis interações catalogadas como wash / circulares / bot-like",
      "Diversidade de tokens nas transações",
      "Entre outras",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "A quantidade de redes e a quantidade de transações varia conforme o tipo de análise solicitada, partindo na versão básica em 2 redes e os últimos 15 dias e chegando a mais de +10 redes e últimos 90 dias na versão expert. Também nas análises mais sofisticadas faz-se uma análise nas 5 carteiras com mais interação.",
    whyTitle: "Por que é importante?",
    whyBody:
      "A atividade de uma wallet permite ao receptor entender o comportamento da wallet nas transações diárias, permitindo avaliar o perfil de reputação e confiança que se pode chegar a ter sobre uma wallet e até detectar alertas precoces perante riscos que poderiam permanecer ocultos.",
  },
};

const multichainCopyByLocale: Record<string, NarrativeCopy> = {
  es: {
    lead: "Usando herramientas profesionales ejecutamos un proceso de descubrimiento sobre las redes en las cuales la billetera se encuentra activa, permitiendo crear algunas de las siguientes señales:",
    bullets: [
      "Número de redes con actividad",
      "Redes activas en los últimos 30 o 90 días",
      "Concentración de fondos",
      "Actividad global",
      "Entre otras....",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "La cantidad de redes sobre la cual se ejecuta el proceso de descubrimiento varía dependiendo del tipo de análisis solicitado, partiendo en la versión básica en 15 redes y llegando hasta más de 100 redes en la versión experto.",
    whyTitle: "Importancia",
    whyBody:
      "Esta primera señal permite identificar correctamente el universo de redes que debe ser analizado en las siguientes señales. Además permite al receptor de la señal tener un mapa completo de toda la actividad ejecutada por una wallet.",
  },
  en: {
    lead: "Using professional tools, we run a discovery process across the networks where the wallet is active, enabling some of the following signals:",
    bullets: [
      "Number of networks with activity",
      "Networks active in the last 30 or 90 days",
      "Concentration of funds",
      "Global activity",
      "Among others....",
    ],
    scopeTitle: "Scope",
    depthNote:
      "The number of networks covered by the discovery process varies depending on the type of analysis requested, starting at 15 networks in the basic version and reaching more than 100 networks in the expert version.",
    whyTitle: "Why it matters",
    whyBody:
      "This first signal correctly identifies the universe of networks that should be analyzed in the following signals. It also gives the signal recipient a complete map of all activity executed by a wallet.",
  },
  pt: {
    lead: "Usando ferramentas profissionais executamos um processo de descoberta sobre as redes nas quais a carteira se encontra ativa, permitindo criar alguns dos seguintes sinais:",
    bullets: [
      "Número de redes com atividade",
      "Redes ativas nos últimos 30 ou 90 dias",
      "Concentração de fundos",
      "Atividade global",
      "Entre outras....",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "A quantidade de redes sobre as quais o processo de descoberta é executado varia conforme o tipo de análise solicitada, partindo na versão básica em 15 redes e chegando a mais de 100 redes na versão expert.",
    whyTitle: "Importância",
    whyBody:
      "Este primeiro sinal permite identificar corretamente o universo de redes que deve ser analisado nos sinais seguintes. Além disso, permite ao receptor do sinal ter um mapa completo de toda a atividade executada por uma wallet.",
  },
};

const portfolioCopyByLocale: Record<string, NarrativeCopy> = {
  es: {
    lead: "Se realiza un análisis multi-cadena de la wallet, evaluando no solo la composición económica, sino la calidad de los fondos. Permitiendo ofrecer algunas de las siguientes señales:",
    bullets: [
      "Valor total líquido y fijado",
      "Distribución económica (stablecoins / bluechip / memecoins)",
      "Valor total usable vs credible",
      "Entre otras…",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "Ejecutamos un análisis usando herramientas profesionales que permiten medir el portafolio de una billetera en más de 38 cadenas (incluido Solana) en cualquiera de los tipos de análisis.",
    whyTitle: "Importancia",
    whyBody:
      "Permite crear una visión completa del portafolio de la wallet, conocer el valor total económico y la sanidad de los fondos. Una foto general que ayuda a que el receptor entienda el tipo de billetera con la cual va a interactuar.",
  },
  en: {
    lead: "A multi-chain analysis of the wallet is performed, assessing not only economic composition but also fund quality. That lets us offer some of the following signals:",
    bullets: [
      "Total liquid and locked value",
      "Economic distribution (stablecoins / bluechip / memecoins)",
      "Total usable vs credible value",
      "Among others…",
    ],
    scopeTitle: "Scope",
    depthNote:
      "We run an analysis using professional tools that measure a wallet’s portfolio across more than 38 chains (including Solana) in any of the analysis types.",
    whyTitle: "Why it matters",
    whyBody:
      "It creates a complete view of the wallet’s portfolio, the total economic value, and the health of the holdings — a general snapshot that helps the recipient understand the type of wallet they will interact with.",
  },
  pt: {
    lead: "Realiza-se uma análise multi-cadeia da wallet, avaliando não só a composição econômica, mas também a qualidade dos fundos. Isso permite oferecer alguns dos seguintes sinais:",
    bullets: [
      "Valor total líquido e fixado",
      "Distribuição econômica (stablecoins / bluechip / memecoins)",
      "Valor total usable vs credible",
      "Entre outras…",
    ],
    scopeTitle: "Alcance",
    depthNote:
      "Executamos uma análise usando ferramentas profissionais que permitem medir o portfólio de uma carteira em mais de 38 cadeias (incluindo Solana) em qualquer um dos tipos de análise.",
    whyTitle: "Importância",
    whyBody:
      "Permite criar uma visão completa do portfólio da wallet, conhecer o valor total econômico e a sanidade dos fundos. Uma foto geral que ajuda o receptor a entender o tipo de carteira com a qual vai interagir.",
  },
};

function WhatIsPanel() {
  const t = useTranslations("reveal.intro");
  const process = useTranslations("comoFunciona");
  const locale = useLocale();
  const explainImage = explainImageByLocale[locale] ?? explainImageByLocale.es;
  const dialogTitleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [imageOpen, setImageOpen] = useState(false);

  const points = [t("explainPoints.variables"), t("explainPoints.factors")];

  const steps = processStepKeys.map((key) => ({
    title: process(`steps.${key}.title`),
    body: process(`steps.${key}.body`),
  }));

  useEffect(() => {
    if (!imageOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setImageOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [imageOpen]);

  return (
    <div className="reveal-detail__what">
      <h2 className="reveal-detail__title">{t("title")}</h2>
      <p className="reveal-detail__lead">{t("body")}</p>

      <div className="reveal-explain">
        <div className="reveal-explain__copy">
          <p className="reveal-explain__lead">{t("explainLead")}</p>
          <p className="reveal-explain__goal">{t("explainGoal")}</p>
          <ul className="reveal-explain__list">
            {points.map((point) => (
              <li key={point}>
                <span aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="reveal-explain__media"
          aria-label={t("expandImage")}
          onClick={() => setImageOpen(true)}
        >
          <Image
            src={explainImage}
            alt={t("explainImageAlt")}
            width={1600}
            height={1000}
            sizes="(max-width: 768px) 90vw, 22vw"
            className="reveal-explain__image"
          />
        </button>
      </div>

      <section className="reveal-process">
        <h3 className="reveal-process__title">{process("stepsTitle")}</h3>
        <ProcessFlow steps={steps} />
      </section>

      {imageOpen ? (
        <div
          className="reveal-explain-modal"
          role="presentation"
          onClick={() => setImageOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="reveal-explain-modal__dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="reveal-explain-modal__bar">
              <p id={dialogTitleId} className="reveal-explain-modal__heading">
                {t("explainImageAlt")}
              </p>
              <button
                ref={closeRef}
                type="button"
                className="reveal-explain-modal__close"
                onClick={() => setImageOpen(false)}
              >
                {t("closeImage")}
              </button>
            </div>
            <Image
              src={explainImage}
              alt={t("explainImageAlt")}
              width={1600}
              height={1000}
              sizes="92vw"
              className="reveal-explain-modal__image"
              priority
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NarrativeDetailPanel({
  copyByLocale,
}: {
  copyByLocale: Record<string, NarrativeCopy>;
}) {
  const t = useTranslations("reveal");
  const locale = useLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.es;

  return (
    <article className="reveal-signal reveal-signal--detail reveal-signal--narrative">
      <h2 className="reveal-signal__analyzes-heading">{t("analyzesHeading")}</h2>
      <p className="reveal-signal__lead">{copy.lead}</p>
      <ul className="reveal-signal__list">
        {copy.bullets.map((item) => (
          <li key={item}>
            <span />
            {item}
          </li>
        ))}
      </ul>
      {copy.scopeTitle ? (
        <section className="reveal-signal__scope">
          <h3 className="reveal-signal__scope-title">{copy.scopeTitle}</h3>
          <p className="reveal-signal__scope-body">{copy.depthNote}</p>
        </section>
      ) : (
        <p className="reveal-signal__depth-note">{copy.depthNote}</p>
      )}
      <section className="reveal-signal__why">
        <h3 className="reveal-signal__why-title">{copy.whyTitle}</h3>
        <p className="reveal-signal__why-body">{copy.whyBody}</p>
      </section>
    </article>
  );
}

export function WalletRevealDetail({ level }: Props) {
  if (level === 0) return <WhatIsPanel />;
  if (level === 1) return <NarrativeDetailPanel copyByLocale={multichainCopyByLocale} />;
  if (level === 2) return <NarrativeDetailPanel copyByLocale={portfolioCopyByLocale} />;
  if (level === 3) return <NarrativeDetailPanel copyByLocale={originsCopyByLocale} />;
  return <NarrativeDetailPanel copyByLocale={activityCopyByLocale} />;
}
