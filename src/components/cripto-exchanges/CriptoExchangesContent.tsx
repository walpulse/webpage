"use client";

import Image from "next/image";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { homeSenales, routes } from "@/lib/paths";
import {
  exchangesCopyByLocale,
  type CoverageLevel,
  type RegionContent,
} from "@/components/cripto-exchanges/exchangesCopy";

type Region = "uy" | "row";

const STORAGE_KEY = "walpulse-exchanges-region";

const regionListeners = new Set<() => void>();

function readStoredRegion(): Region {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "uy" || stored === "row") return stored;
  } catch {
    /* ignore */
  }
  return "uy";
}

function subscribeRegion(onStoreChange: () => void) {
  regionListeners.add(onStoreChange);
  return () => {
    regionListeners.delete(onStoreChange);
  };
}

function writeStoredRegion(next: Region) {
  try {
    sessionStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  regionListeners.forEach((listener) => listener());
}

const diagramByRegion: Record<Region, Record<string, string>> = {
  uy: {
    es: "/psav_es.jpg",
    en: "/psav_en.jpg",
    pt: "/psav_pt.jpg",
  },
  row: {
    es: "/exchange_es.jpg",
    en: "/exchange_en.jpg",
    pt: "/exchange_pt.jpg",
  },
};

type Props = {
  locale: string;
};

function coverageClass(level: CoverageLevel): string {
  return `coverage-badge coverage-badge--${level}`;
}

export function CriptoExchangesContent({ locale }: Props) {
  const copy = exchangesCopyByLocale[locale] ?? exchangesCopyByLocale.es;
  // getServerSnapshot keeps SSR/hydration on "uy"; client then reads sessionStorage.
  const region = useSyncExternalStore<Region>(
    subscribeRegion,
    readStoredRegion,
    () => "uy",
  );
  const [diagramOpen, setDiagramOpen] = useState(false);
  const dialogTitleId = useId();

  useEffect(() => {
    if (!diagramOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDiagramOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [diagramOpen]);

  const select = (next: Region) => {
    writeStoredRegion(next);
    setDiagramOpen(false);
  };

  const content: RegionContent = region === "uy" ? copy.uy : copy.row;
  const showCoverage = Boolean(content.mapHeaders.level);
  const diagramSrc =
    diagramByRegion[region][locale] ?? diagramByRegion[region].es;
  const diagramAlt = content.diagramAlt;

  return (
    <>
      <Section className="section-atmosphere relative overflow-hidden pt-20 md:pt-28">
        <div className="region-picker">
          <div className="region-picker__copy">
            <p className="region-picker__label">{copy.regionLabel}</p>
            <p className="region-picker__hint">{copy.regionHint}</p>
          </div>
          <div
            role="tablist"
            aria-label={copy.regionLabel}
            className="region-picker__toggle"
          >
            {(
              [
                { id: "uy" as const, label: copy.uruguayLabel },
                { id: "row" as const, label: copy.worldLabel },
              ] as const
            ).map((opt) => {
              const active = region === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => select(opt.id)}
                  className={`region-picker__option${active ? " is-active" : ""}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <h1 className="mt-10 max-w-3xl font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]">
          {content.title}
        </h1>
        <blockquote className="mt-6 max-w-3xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-pure">
          {content.message}
        </blockquote>
      </Section>

      <Section
        wide
        className="section-atmosphere-alt section-atmosphere border-t border-glass/30"
      >
        <SectionHeading title={content.problemTitle} />
        <div className="context-diagram">
          <div className="context-diagram__copy">
            <article className="context-subcard">
              <h3 className="context-subcard__label">{content.problemLeadLabel}</h3>
              <p className="context-subcard__body">{content.problemBody}</p>
            </article>
            <div className="context-subcard-connector" aria-hidden="true" />
            <article className="context-subcard">
              <h3 className="context-subcard__label">{content.problemCloseLabel}</h3>
              <p className="context-subcard__body">{content.problemClose}</p>
            </article>
          </div>
          {diagramAlt ? (
            <figure className="context-diagram__figure">
              <button
                type="button"
                onClick={() => setDiagramOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-glass/60 bg-void/40 text-left shadow-[0_24px_60px_color-mix(in_oklab,var(--void)_55%,transparent)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_40px_color-mix(in_oklab,var(--primary)_12%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-haspopup="dialog"
                aria-expanded={diagramOpen}
                aria-label={copy.expandDiagram}
              >
                <Image
                  src={diagramSrc}
                  alt={diagramAlt}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 960px) 90vw, 28vw"
                  className="h-auto w-full object-contain"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/85 via-void/35 to-transparent px-4 pb-3.5 pt-10">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-soft">
                    {copy.expandDiagram}
                  </span>
                </span>
              </button>
            </figure>
          ) : null}
        </div>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <SectionHeading title={content.mapTitle} />
        {content.mapIntro ? (
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted">
            {content.mapIntro}
          </p>
        ) : null}

        {/* Mobile: stacked comparison cards */}
        <ul className="exchanges-map-cards">
          {content.map.map((row) => (
            <li key={row.aspect} className="exchanges-map-card">
              <h3 className="exchanges-map-card__title">{row.aspect}</h3>
              <dl className="exchanges-map-card__fields">
                <div>
                  <dt>{content.mapHeaders.contribution}</dt>
                  <dd>{row.contribution}</dd>
                </div>
                <div>
                  <dt>{content.mapHeaders.cert}</dt>
                  <dd className="exchanges-map-card__cert">{row.cert}</dd>
                </div>
                {showCoverage && row.coverage && row.level ? (
                  <div>
                    <dt>{content.mapHeaders.level}</dt>
                    <dd>
                      <span className={coverageClass(row.coverage)}>
                        {row.level}
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </li>
          ))}
        </ul>

        {/* Desktop: table */}
        <div className="exchanges-map-table">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface/90 text-muted">
              <tr>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {content.mapHeaders.aspect}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {content.mapHeaders.contribution}
                </th>
                <th className="px-4 py-3.5 font-medium md:px-5">
                  {content.mapHeaders.cert}
                </th>
                {showCoverage ? (
                  <th className="px-4 py-3.5 font-medium md:px-5">
                    {content.mapHeaders.level}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {content.map.map((row) => (
                <tr
                  key={row.aspect}
                  className="border-t border-glass/70 transition-colors hover:bg-primary/[0.03]"
                >
                  <td className="px-4 py-3.5 font-medium text-pure md:px-5">
                    {row.aspect}
                  </td>
                  <td className="px-4 py-3.5 text-muted md:px-5">
                    {row.contribution}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-primary-soft md:px-5">
                    {row.cert}
                  </td>
                  {showCoverage && row.coverage && row.level ? (
                    <td className="px-4 py-3.5 md:px-5">
                      <span className={coverageClass(row.coverage)}>
                        {row.level}
                      </span>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="section-atmosphere-alt section-atmosphere border-t border-glass/30">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-pure">
              {content.doesTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {content.does.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-grade-a" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-pure">
              {content.doesNotTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {content.doesNot.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-grade-f" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm text-primary">{copy.principle}</p>
      </Section>

      <Section className="section-atmosphere border-t border-glass/30">
        <SectionHeading title={content.benefitsTitle} />
        <ul className="mt-2 grid gap-5 md:grid-cols-2">
          {content.benefits.map((item, index) => (
            <li key={item} className="benefit-card">
              <span className="benefit-card__index font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="benefit-card__body">{item}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={routes.contacto} className="btn-premium">
            {copy.talkToTeam}
          </Button>
          <Button href={homeSenales} variant="secondary">
            {copy.seeSignals}
          </Button>
        </div>
      </Section>

      {diagramOpen && diagramAlt ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm md:p-8"
          role="presentation"
          onClick={() => setDiagramOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="relative max-h-[92vh] w-full max-w-6xl overflow-auto rounded-2xl border border-glass/70 bg-surface p-2 shadow-[0_0_60px_color-mix(in_oklab,var(--primary)_14%,transparent)] md:p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-2 pt-1">
              <p
                id={dialogTitleId}
                className="font-display text-sm font-medium text-pure md:text-base"
              >
                {diagramAlt}
              </p>
              <button
                type="button"
                onClick={() => setDiagramOpen(false)}
                className="shrink-0 rounded-lg border border-glass/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-primary/40 hover:text-pure"
              >
                {copy.closeDiagram}
              </button>
            </div>
            <Image
              src={diagramSrc}
              alt={diagramAlt}
              width={1600}
              height={1000}
              sizes="(max-width: 1152px) 96vw, 72rem"
              className="h-auto w-full rounded-xl object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
