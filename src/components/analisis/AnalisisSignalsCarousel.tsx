"use client";

import { useState } from "react";
import type { AnalisisSignalsCopy } from "@/lib/analisisSignalSlides";

type Props = {
  copy: AnalisisSignalsCopy;
};

export function AnalisisSignalsCarousel({ copy }: Props) {
  const [index, setIndex] = useState(0);
  const count = copy.slides.length;
  const safeIndex = count === 0 ? 0 : ((index % count) + count) % count;
  const slide = copy.slides[safeIndex];

  if (!slide) return null;

  const go = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  return (
    <div className="analisis-signals-carousel">
      <div className="analisis-signals-carousel__rail">
        <div
          className="analisis-signals-carousel__tabs"
          role="tablist"
          aria-label={copy.tabsLabel}
        >
          {copy.slides.map((item, i) => {
            const active = i === safeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`analisis-signals-carousel__tab${active ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
              >
                <span className="analisis-signals-carousel__tab-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="analisis-signals-carousel__tab-label">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={slide.id}
        className="analisis-signals-carousel__panel"
        role="tabpanel"
      >
        <div className="analisis-signals-carousel__panel-glow" aria-hidden />
        <div className="analisis-signals-carousel__panel-head">
          <p className="analisis-signals-carousel__kicker">
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <h3 className="analisis-signals-carousel__title">{slide.title}</h3>
          <p className="analisis-signals-carousel__lead">{slide.lead}</p>
        </div>

        <div className="analisis-signals-carousel__table-wrap">
          <table className="analisis-signals-carousel__table">
            <thead>
              <tr>
                <th scope="col">{copy.nameCol}</th>
                <th scope="col">{copy.meaningCol}</th>
              </tr>
            </thead>
            <tbody>
              {slide.rows.map((row, rowIndex) => (
                <tr key={row.name}>
                  <td>
                    <span className="analisis-signals-carousel__row-index">
                      {String(rowIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="analisis-signals-carousel__row-name">
                      {row.name}
                    </span>
                  </td>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analisis-signals-carousel__nav">
        <button
          type="button"
          className="analisis-signals-carousel__nav-btn"
          onClick={() => go(safeIndex - 1)}
          aria-label={copy.prev}
        >
          ←
        </button>
        <div className="analisis-signals-carousel__dots" aria-hidden>
          {copy.slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`analisis-signals-carousel__dot${i === safeIndex ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
              tabIndex={-1}
              aria-hidden
            />
          ))}
        </div>
        <button
          type="button"
          className="analisis-signals-carousel__nav-btn"
          onClick={() => go(safeIndex + 1)}
          aria-label={copy.next}
        >
          →
        </button>
      </div>
    </div>
  );
}
