"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProcessFlow } from "@/components/como-funciona/ProcessFlow";
import { certsForLocale, type SignalKey } from "@/lib/signalCerts";
import { SIGNAL_BY_LEVEL, type RevealLevel } from "@/lib/walletReveal";
import { RevealModuleExample } from "./RevealModuleExample";

type Props = {
  level: RevealLevel;
};

const explainImageByLocale: Record<string, string> = {
  es: "/caja_negra_es.jpg",
  en: "/caja_negra_en.jpg",
  pt: "/caja_negra_pt.jpg",
};

const processStepKeys = ["input", "analysis", "signals", "use"] as const;

function WhatIsPanel() {
  const t = useTranslations("reveal.intro");
  const process = useTranslations("comoFunciona");
  const locale = useLocale();
  const explainImage = explainImageByLocale[locale] ?? explainImageByLocale.es;
  const dialogTitleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [imageOpen, setImageOpen] = useState(false);

  const points = [
    t("explainPoints.variables"),
    t("explainPoints.factors"),
    t("explainPoints.why"),
  ];

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

function SignalDetailPanel({ signalKey }: { signalKey: SignalKey }) {
  const locale = useLocale();
  const t = useTranslations("reveal");
  const copy = certsForLocale(locale);
  const cert = copy.certs[signalKey];

  return (
    <article className="reveal-signal reveal-signal--detail">
      <h2 className="reveal-signal__analyzes-heading">{t("analyzesHeading")}</h2>
      <ul className="reveal-signal__list">
        {cert.analyzes.map((item) => (
          <li key={item}>
            <span />
            {item}
          </li>
        ))}
      </ul>
      <div className="reveal-signal__example">
        <RevealModuleExample module={signalKey} />
      </div>
    </article>
  );
}

export function WalletRevealDetail({ level }: Props) {
  if (level === 0) return <WhatIsPanel />;
  return <SignalDetailPanel signalKey={SIGNAL_BY_LEVEL[level]} />;
}
