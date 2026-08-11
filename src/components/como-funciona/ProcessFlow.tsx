"use client";

import { useEffect, useState } from "react";

export type ProcessStep = {
  title: string;
  body: string;
};

type Props = {
  steps: ProcessStep[];
};

const CYCLE_MS = 2600;

export function ProcessFlow({ steps }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || steps.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % steps.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, steps.length]);

  if (steps.length === 0) return null;

  return (
    <ol className="process-flow" aria-label="Process">
      {steps.map((step, index) => {
        const isActive = !reducedMotion && index === activeIndex;
        const connectorLit =
          !reducedMotion && index < steps.length - 1 && index === activeIndex;

        return (
          <li key={step.title} className="contents">
            <article
              className={`process-flow__card${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="process-flow__index font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="process-flow__title font-display">{step.title}</h3>
              <p className="process-flow__body">{step.body}</p>
            </article>

            {index < steps.length - 1 ? (
              <div
                className={`process-flow__connector${connectorLit ? " is-lit" : ""}`}
                aria-hidden
              >
                <svg
                  className="process-flow__svg process-flow__svg--desktop"
                  viewBox="0 0 48 8"
                  preserveAspectRatio="none"
                >
                  <line
                    className="process-flow__line"
                    x1="0"
                    y1="4"
                    x2="48"
                    y2="4"
                  />
                </svg>
                <svg
                  className="process-flow__svg process-flow__svg--mobile"
                  viewBox="0 0 8 40"
                  preserveAspectRatio="none"
                >
                  <line
                    className="process-flow__line"
                    x1="4"
                    y1="0"
                    x2="4"
                    y2="40"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
