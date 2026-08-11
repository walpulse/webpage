"use client";

import { useEffect, useRef, useState } from "react";
import { GradeBadge } from "@/components/ui/GradeBadge";

export type CarouselSignal = {
  id: string;
  label: string;
  display: string;
};

export type CarouselSlide = {
  id: string;
  /** Display title (localized). */
  title: string;
  /** Raw module type from report (ORIGINS, …). */
  type: string;
  grade: string;
  summary: string;
  signals: CarouselSignal[];
  strengths: string[];
  concerns: string[];
  moduleId?: string;
};

type Props = {
  slides: CarouselSlide[];
  variant?: "full" | "teaser";
  labels: {
    prev: string;
    next: string;
    strengths: string;
    concerns: string;
    moduleId: string;
  };
};

function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function SignalModulesCarousel({
  slides,
  variant = "full",
  labels,
}: Props) {
  const [index, setIndex] = useState(0);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = slides.length;
  const safeIndex = count === 0 ? 0 : ((index % count) + count) % count;
  const slide = count === 0 ? null : slides[safeIndex];
  const isTeaser = variant === "teaser";

  const go = (next: number) => {
    if (count === 0) return;
    setIndex(((next % count) + count) % count);
  };

  // Scroll only the tablist — scrollIntoView also shifts ancestor overflow and
  // can clip the report panel on mobile when the last tab is centered.
  useEffect(() => {
    if (count === 0) return;
    const list = tablistRef.current;
    const tab = tabRefs.current[safeIndex];
    if (!list || !tab) return;
    const left =
      tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo({
      left: Math.max(0, left),
      behavior: scrollBehavior(),
    });
  }, [safeIndex, count]);

  if (!slide) return null;

  return (
    <div className="relative mt-5 md:mt-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(safeIndex - 1)}
          aria-label={labels.prev}
          className="shrink-0 rounded-lg border border-glass/50 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-primary/40 hover:text-pure"
        >
          ←
        </button>

        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Modules"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((item, i) => {
            const active = i === safeIndex;
            return (
              <button
                key={item.id}
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
                {item.title}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(safeIndex + 1)}
          aria-label={labels.next}
          className="shrink-0 rounded-lg border border-glass/50 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-primary/40 hover:text-pure"
        >
          →
        </button>
      </div>

      <article
        key={slide.id}
        className="mt-5 animate-[signal-carousel-in_280ms_ease-out]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-pure">
            {slide.title}
          </h3>
          <GradeBadge grade={slide.grade} className="px-3 py-1 text-sm" />
        </div>

        <p
          className={`mt-3 text-sm leading-relaxed text-muted ${
            isTeaser ? "line-clamp-3" : ""
          }`}
        >
          {slide.summary}
        </p>

        <div
          className={`mt-4 grid gap-2 ${
            isTeaser
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {slide.signals.map((sig) => (
            <div
              key={sig.id}
              className="rounded-lg border border-glass/40 bg-void/40 px-3 py-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted/80">
                {sig.label}
              </p>
              <p className="mt-1 font-mono text-sm text-pure">{sig.display}</p>
            </div>
          ))}
        </div>

        {!isTeaser &&
        (slide.strengths.length > 0 || slide.concerns.length > 0) ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {slide.strengths.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-grade-a">
                  {labels.strengths}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  {slide.strengths.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-grade-a" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {slide.concerns.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-grade-c">
                  {labels.concerns}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  {slide.concerns.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-grade-c" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {!isTeaser && slide.moduleId ? (
          <p className="mt-4 font-mono text-[10px] text-muted/60">
            {labels.moduleId}: {slide.moduleId}
          </p>
        ) : null}
      </article>

      <div className="mt-5 flex justify-center gap-1.5">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
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
