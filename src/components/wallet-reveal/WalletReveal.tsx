"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  progressToLevel,
  REVEAL_LEVEL_COUNT,
  type RevealLevel,
} from "@/lib/walletReveal";
import { WalletRevealCopy } from "./WalletRevealCopy";
import { WalletRevealDetail } from "./WalletRevealDetail";
import { WalletRevealProgress } from "./WalletRevealProgress";
import { WalletRevealVisual } from "./WalletRevealVisual";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const travel = el.offsetHeight - window.innerHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / travel));
}

export function WalletReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState<RevealLevel>(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const update = () => {
      const next = progressToLevel(readProgress(el));
      setLevel((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToLevel = useCallback((next: RevealLevel) => {
    const el = rootRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY +
      (next / (REVEAL_LEVEL_COUNT - 1)) * travel;
    window.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  return (
    <div id="senales" ref={rootRef} className="wallet-reveal">
      <div className="wallet-reveal__sticky">
        <div className="wallet-reveal__left">
          <div className="wallet-reveal__stage" aria-hidden>
            <div className="wallet-reveal__stage-bg" />
            <WalletRevealVisual level={level} reducedMotion={reducedMotion} />
            <div className="wallet-reveal__vignette" />
          </div>
          <div className="wallet-reveal__ui">
            <WalletRevealCopy level={level} />
            <WalletRevealProgress level={level} onSelect={scrollToLevel} />
          </div>
        </div>
        <div className="wallet-reveal__right">
          <div
            key={level}
            className="wallet-reveal__detail"
            aria-live="polite"
          >
            <WalletRevealDetail level={level} />
          </div>
        </div>
      </div>
    </div>
  );
}
