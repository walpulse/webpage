"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MAP_COUNTRY_ORDER,
  type CountryIso,
  type GafiLatamCopy,
} from "@/lib/gafiLatamContent";
import { LATAM_MAP_PATHS, LATAM_MAP_VIEWBOX } from "@/lib/latAmMapPaths";

type Props = {
  copy: GafiLatamCopy;
};

export function LatAmRegulationMap({ copy }: Props) {
  const [active, setActive] = useState<CountryIso | null>(null);
  const [hover, setHover] = useState<CountryIso | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipId = useId();
  const selected = active ?? hover;
  const info = selected ? copy.countries[selected] : null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [active]);

  return (
    <div ref={wrapRef} className="latam-map">
      <p className="latam-map__hint font-mono text-[11px] uppercase tracking-[0.14em] text-primary-soft">
        {copy.mapHint}
      </p>

      <div className="latam-map__stage">
        <div className="latam-map__visual">
          <svg
            className="latam-map__svg"
            viewBox={LATAM_MAP_VIEWBOX}
            role="img"
            aria-label={copy.mapTitle}
          >
            {MAP_COUNTRY_ORDER.map((iso) => {
              const country = copy.countries[iso];
              const isOn = selected === iso;
              return (
                <path
                  key={iso}
                  d={LATAM_MAP_PATHS[iso]}
                  data-iso={iso}
                  tabIndex={0}
                  role="button"
                  aria-pressed={active === iso}
                  aria-describedby={isOn ? tipId : undefined}
                  aria-label={country.name}
                  className={`latam-map__country latam-map__country--${country.tier}${isOn ? " is-active" : ""}`}
                  onMouseEnter={() => setHover(iso)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(iso)}
                  onBlur={() => setHover(null)}
                  onClick={() =>
                    setActive((current) => (current === iso ? null : iso))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActive((current) => (current === iso ? null : iso));
                    }
                  }}
                />
              );
            })}
          </svg>

          <div className="latam-map__legend" aria-label={copy.mapLegendTitle}>
            <p className="latam-map__legend-title">{copy.mapLegendTitle}</p>
            <ul className="latam-map__legend-list">
              {copy.mapLegend.map((item) => (
                <li key={item.tier} className="latam-map__legend-item">
                  <span
                    className={`latam-map__swatch latam-map__swatch--${item.tier}`}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside
          id={tipId}
          className={`latam-map__panel${info ? " is-open" : ""}`}
          aria-live="polite"
        >
          {info ? (
            <>
              <div className="latam-map__panel-head">
                <h3 className="latam-map__panel-title">{info.name}</h3>
                <button
                  type="button"
                  className="latam-map__panel-close"
                  onClick={() => setActive(null)}
                >
                  {copy.mapClose}
                </button>
              </div>
              <dl className="latam-map__fields">
                <div>
                  <dt>{copy.mapHeaders.adheres}</dt>
                  <dd>{info.adheres}</dd>
                </div>
                <div>
                  <dt>{copy.mapHeaders.regime}</dt>
                  <dd>{info.regime}</dd>
                </div>
                <div>
                  <dt>{copy.mapHeaders.travelRule}</dt>
                  <dd>{info.travelRule}</dd>
                </div>
                <div>
                  <dt>{copy.mapHeaders.notes}</dt>
                  <dd>{info.notes}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="latam-map__panel-empty">{copy.mapSelectPrompt}</p>
          )}
        </aside>
      </div>

      <details className="latam-map__details">
        <summary>{copy.mapTitle}</summary>
        <ul className="latam-map__list">
          {MAP_COUNTRY_ORDER.map((iso) => {
            const country = copy.countries[iso];
            return (
              <li key={iso}>
                <strong>{country.name}</strong>
                <span>
                  {copy.mapHeaders.adheres}: {country.adheres}
                </span>
                <span>
                  {copy.mapHeaders.regime}: {country.regime}
                </span>
                <span>
                  {copy.mapHeaders.travelRule}: {country.travelRule}
                </span>
                <span>
                  {copy.mapHeaders.notes}: {country.notes}
                </span>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
