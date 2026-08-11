"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const SignalGraph = dynamic(
  () => import("./SignalGraph").then((m) => m.SignalGraph),
  { ssr: false, loading: () => null },
);

type Props = {
  children: ReactNode;
};

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getWebglOk() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function Hero({ children }: Props) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const webglOk = useSyncExternalStore(
    () => () => {},
    getWebglOk,
    () => true,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const showGraph = !reducedMotion && webglOk;

  return (
    <section className="hero relative isolate min-h-[100svh] overflow-hidden bg-void">
      {/* Atmosphere only — full bleed */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {!showGraph ? <div className="hero-fallback h-full w-full" /> : null}
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div
        className={`relative z-20 mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-6 py-24 transition-opacity duration-700 ease-out md:px-6 lg:px-8 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:gap-8 lg:gap-12">
          <div className="relative z-10 min-w-0">{children}</div>

          <div className="relative z-0 w-full min-w-0">
            <div className="h-[min(58vh,480px)] w-full md:h-[min(82vh,720px)]">
              {showGraph ? (
                <SignalGraph />
              ) : (
                <div className="hero-fallback h-full w-full opacity-80" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
