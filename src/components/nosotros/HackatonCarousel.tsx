"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/hackaton_1.jpeg", altKey: "1" },
  { src: "/hackaton_2.jpeg", altKey: "2" },
  { src: "/hackaton_3.jpeg", altKey: "3" },
  { src: "/hackaton_4.jpeg", altKey: "4" },
] as const;

type Props = {
  labels: {
    prev: string;
    next: string;
    caption: string;
  };
};

export function HackatonCarousel({ labels }: Props) {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5200);
    return () => window.clearInterval(id);
  }, [count]);

  const go = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  const slide = SLIDES[index];

  return (
    <div className="hackaton-carousel">
      <div className="hackaton-carousel__frame">
        <Image
          key={slide.src}
          src={slide.src}
          alt={`${labels.caption} ${slide.altKey}`}
          width={1600}
          height={1000}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="hackaton-carousel__image"
        />
      </div>

      <div className="hackaton-carousel__controls">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={labels.prev}
          className="hackaton-carousel__nav"
        >
          ←
        </button>

        <div className="hackaton-carousel__dots" role="tablist" aria-label={labels.caption}>
          {SLIDES.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.src}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`${labels.caption} ${item.altKey}`}
                onClick={() => go(i)}
                className={`hackaton-carousel__dot${active ? " is-active" : ""}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={labels.next}
          className="hackaton-carousel__nav"
        >
          →
        </button>
      </div>
    </div>
  );
}
