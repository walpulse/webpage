"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type ChipDef = {
  key:
    | "originsB"
    | "activityA"
    | "multichainC"
    | "portfolioB"
    | "psav"
    | "exchange"
    | "fondo"
    | "insurance"
    | "investigacion";
  grade?: "A" | "B" | "C";
};

const ALL_CHIPS: ChipDef[] = [
  { key: "originsB", grade: "B" },
  { key: "activityA", grade: "A" },
  { key: "multichainC", grade: "C" },
  { key: "portfolioB", grade: "B" },
  { key: "psav" },
  { key: "exchange" },
  { key: "fondo" },
  { key: "insurance" },
  { key: "investigacion" },
];

/** Anchors only on the right / perimeter — keep clear of left copy. */
const ANCHORS = [
  { top: "16%", left: "58%" },
  { top: "28%", left: "78%" },
  { top: "48%", left: "68%" },
  { top: "66%", left: "82%" },
  { top: "74%", left: "56%" },
  { top: "22%", left: "88%" },
];

function gradeClass(grade?: string) {
  if (grade === "A" || grade === "B") return "border-grade-a/30 text-grade-a";
  if (grade === "C") return "border-grade-c/30 text-grade-c";
  return "border-glass/80 text-pure/85";
}

export function FloatingChips() {
  const t = useTranslations("hero.chips");
  const [offset, setOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setVisibleCount(mq.matches ? 2 : 4);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setOffset((v) => (v + 1) % ALL_CHIPS.length);
        setVisible(true);
      }, 700);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const chips = Array.from({ length: visibleCount }, (_, i) => {
    const chip = ALL_CHIPS[(offset + i * 2) % ALL_CHIPS.length];
    const anchor = ANCHORS[i % ANCHORS.length];
    return { chip, anchor, i };
  });

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {chips.map(({ chip, anchor, i }) => (
        <div
          key={`${chip.key}-${offset}-${i}`}
          className={`absolute rounded-full border bg-surface/45 px-3.5 py-1.5 font-mono text-[11px] tracking-wide backdrop-blur-md transition-[opacity,transform] duration-700 ease-out ${gradeClass(chip.grade)} ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-1.5 opacity-0"
          }`}
          style={{
            top: anchor.top,
            left: anchor.left,
            transitionDelay: `${i * 80}ms`,
          }}
        >
          {t(chip.key)}
        </div>
      ))}
    </div>
  );
}
