"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { DemoModuleSummary, ModuleKey } from "@/lib/demoAnalisis";
import { signalLabel } from "@/lib/demoSignalLabels";

const MODULE_TITLE_KEYS: Record<
  ModuleKey,
  "moduleOrigins" | "moduleActivity" | "moduleMultichain" | "modulePortfolio"
> = {
  origins: "moduleOrigins",
  activity: "moduleActivity",
  multichain: "moduleMultichain",
  portfolio: "modulePortfolio",
};

type Props = {
  modules: DemoModuleSummary[];
};

function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function DemoSignalsCarousel({ modules }: Props) {
  const t = useTranslations("demo");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = modules.length;
  const safeIndex = count === 0 ? 0 : ((index % count) + count) % count;
  const slide = count === 0 ? null : modules[safeIndex];

  const go = (next: number) => {
    if (count === 0) return;
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    if (count === 0) return;
    const list = tablistRef.current;
    const tab = tabRefs.current[safeIndex];
    if (!list || !tab) return;
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo({
      left: Math.max(0, left),
      behavior: scrollBehavior(),
    });
  }, [safeIndex, count]);

  if (!slide) return null;

  const title = t(MODULE_TITLE_KEYS[slide.key]);

  return (
    <div className="demo-signals-carousel">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
        {t("carouselEyebrow")}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(safeIndex - 1)}
          aria-label={t("carouselPrev")}
          className="shrink-0 rounded-lg border border-glass/50 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-primary/40 hover:text-pure"
        >
          ←
        </button>

        <div
          ref={tablistRef}
          role="tablist"
          aria-label={t("carouselEyebrow")}
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {modules.map((item, i) => {
            const active = i === safeIndex;
            return (
              <button
                key={item.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => go(i)}
                className={`shrink-0 rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted hover:text-pure"
                }`}
              >
                {t(MODULE_TITLE_KEYS[item.key])}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(safeIndex + 1)}
          aria-label={t("carouselNext")}
          className="shrink-0 rounded-lg border border-glass/50 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-primary/40 hover:text-pure"
        >
          →
        </button>
      </div>

      <article
        key={slide.key}
        className="mt-5 rounded-xl border border-glass/50 bg-void/40 p-4 md:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-pure">
            {title}
          </h3>
          {slide.grade ? (
            <GradeBadge grade={slide.grade} className="px-3 py-1 text-sm" />
          ) : null}
        </div>

        {slide.summary ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {slide.summary}
          </p>
        ) : null}

        {slide.chains.length > 0 ? (
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
              {t("chainsRead")}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {slide.chains.map((chain) => (
                <li
                  key={chain}
                  className="rounded-md border border-glass/40 bg-surface/30 px-2.5 py-1 font-mono text-xs text-pure/90"
                >
                  {chain}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {slide.signals.length > 0 ? (
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
              {t("internalSignals")}
            </p>
            <div className="mt-2 grid gap-2 grid-cols-2 sm:grid-cols-3">
              {slide.signals.map((sig) => (
                <div
                  key={sig.id}
                  className="rounded-lg border border-glass/40 bg-surface/30 px-3 py-2"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted/80 break-all">
                    {signalLabel(sig.id, locale)}
                  </p>
                  <p className="mt-1 font-mono text-sm text-pure break-all">
                    {sig.display}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {slide.hopGroups.length > 0 && slide.hopsTitleKey ? (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
              {t(slide.hopsTitleKey)}
            </p>
            <div className="mt-3 space-y-4">
              {slide.hopGroups.map((group, gi) => (
                <div key={`hop-group-${gi}`} className="space-y-2">
                  {group.titleKey ? (
                    <p className="font-display text-sm font-medium text-pure/90">
                      {t(group.titleKey)}
                    </p>
                  ) : null}
                  {group.cards.map((hop, hi) => (
                    <div
                      key={`${hop.address}-${hop.tag || hi}`}
                      className={`rounded-lg border border-glass/40 bg-surface/30 px-3 py-3 ${
                        hop.level === 2 ? "ml-3 border-l-2 border-l-primary/40" : ""
                      }`}
                    >
                      {hop.via ? (
                        <p className="mb-2 font-mono text-[10px] text-muted">
                          {t("hopViaLabel")}:{" "}
                          <span className="break-all text-pure/80">{hop.via}</span>
                        </p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2">
                        {hop.tag ? (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-primary/90">
                            {hop.tag}
                          </span>
                        ) : null}
                        {hop.grade && hop.grade !== "—" ? (
                          <GradeBadge grade={hop.grade} className="text-xs" />
                        ) : (
                          <span className="font-mono text-xs text-muted">—</span>
                        )}
                        {hop.weight ? (
                          <span className="font-mono text-[10px] text-muted">
                            {t("hopWeightLabel")}: {hop.weight}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 font-mono text-xs text-pure/90 break-all">
                        {hop.address}
                      </p>
                      {hop.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted">
                          {hop.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>

      <div className="mt-4 flex justify-center gap-1.5">
        {modules.map((item, i) => (
          <button
            key={item.key}
            type="button"
            aria-label={t(MODULE_TITLE_KEYS[item.key])}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === safeIndex
                ? "w-5 bg-primary"
                : "w-1.5 bg-glass hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
