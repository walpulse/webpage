"use client";

import Image from "next/image";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const EVENT_SLIDES = [
  { src: "/hackaton_1.jpeg", id: "1" },
  { src: "/hackaton_2.jpeg", id: "2" },
  { src: "/hackaton_3.jpeg", id: "3" },
  { src: "/hackaton_4.jpeg", id: "4" },
] as const;

const LOGOS = [
  {
    src: "/hackaton_eth_2026.jpg",
    kind: "cover" as const,
    key: "hackathon",
  },
  {
    src: "/Logo-horizontal-BSG-4.png",
    kind: "contain" as const,
    key: "summit",
  },
] as const;

type Labels = {
  hackathonAlt: string;
  summitAlt: string;
  expandImage: string;
  viewEventPhotos: string;
  eventGalleryTitle: string;
  prev: string;
  next: string;
  close: string;
};

type Props = {
  labels: Labels;
};

type Lightbox =
  | { type: "single"; src: string; alt: string }
  | { type: "gallery"; index: number };

export function OriginRecognitionMedia({ labels }: Props) {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dialogTitleId = useId();

  useEffect(() => {
    if (!lightbox) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        return;
      }
      if (lightbox.type !== "gallery") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightbox((current) => {
          if (!current || current.type !== "gallery") return current;
          return {
            type: "gallery",
            index:
              (current.index - 1 + EVENT_SLIDES.length) % EVENT_SLIDES.length,
          };
        });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightbox((current) => {
          if (!current || current.type !== "gallery") return current;
          return {
            type: "gallery",
            index: (current.index + 1) % EVENT_SLIDES.length,
          };
        });
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const logoAlt = (key: "hackathon" | "summit") =>
    key === "summit" ? labels.summitAlt : labels.hackathonAlt;

  const galleryIndex = lightbox?.type === "gallery" ? lightbox.index : 0;
  const gallerySlide = EVENT_SLIDES[galleryIndex];

  const goGallery = (nextIndex: number) => {
    setLightbox({
      type: "gallery",
      index: ((nextIndex % EVENT_SLIDES.length) + EVENT_SLIDES.length) %
        EVENT_SLIDES.length,
    });
  };

  const lightboxNode =
    lightbox && mounted
      ? createPortal(
          <div
            className="media-lightbox"
            role="presentation"
            onClick={() => setLightbox(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              className={`media-lightbox__dialog${lightbox.type === "gallery" ? " media-lightbox__dialog--gallery" : ""}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="media-lightbox__header">
                <p id={dialogTitleId} className="media-lightbox__title">
                  {lightbox.type === "single"
                    ? lightbox.alt
                    : labels.eventGalleryTitle}
                </p>
                <button
                  type="button"
                  className="media-lightbox__close"
                  onClick={() => setLightbox(null)}
                >
                  {labels.close}
                </button>
              </div>

              {lightbox.type === "single" ? (
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  width={1600}
                  height={1000}
                  sizes="96vw"
                  className="media-lightbox__image"
                  priority
                />
              ) : (
                <>
                  <div className="media-lightbox__gallery-frame">
                    <Image
                      key={gallerySlide.src}
                      src={gallerySlide.src}
                      alt={`${labels.eventGalleryTitle} ${gallerySlide.id}`}
                      width={1600}
                      height={1000}
                      sizes="96vw"
                      className="media-lightbox__image"
                      priority
                    />
                  </div>
                  <div className="media-lightbox__gallery-controls">
                    <button
                      type="button"
                      className="media-lightbox__nav"
                      aria-label={labels.prev}
                      onClick={() => goGallery(galleryIndex - 1)}
                    >
                      ←
                    </button>
                    <div
                      className="media-lightbox__dots"
                      role="tablist"
                      aria-label={labels.eventGalleryTitle}
                    >
                      {EVENT_SLIDES.map((slide, i) => (
                        <button
                          key={slide.src}
                          type="button"
                          role="tab"
                          aria-selected={i === galleryIndex}
                          aria-label={`${labels.eventGalleryTitle} ${slide.id}`}
                          className={`media-lightbox__dot${i === galleryIndex ? " is-active" : ""}`}
                          onClick={() => goGallery(i)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="media-lightbox__nav"
                      aria-label={labels.next}
                      onClick={() => goGallery(galleryIndex + 1)}
                    >
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="origin-recognition__logos"
        aria-label={labels.eventGalleryTitle}
      >
        {LOGOS.map((item) => (
          <button
            key={item.src}
            type="button"
            className={`origin-recognition__tile origin-recognition__tile--button${item.kind === "contain" ? " origin-recognition__tile--contain" : ""}`}
            onClick={() =>
              setLightbox({
                type: "single",
                src: item.src,
                alt: logoAlt(item.key),
              })
            }
            aria-haspopup="dialog"
            aria-label={`${labels.expandImage}: ${logoAlt(item.key)}`}
          >
            <Image
              src={item.src}
              alt={logoAlt(item.key)}
              width={640}
              height={640}
              sizes="(max-width: 768px) 45vw, 40vw"
              className="origin-recognition__img"
            />
            <span className="origin-recognition__expand-hint">
              {labels.expandImage}
            </span>
          </button>
        ))}
      </div>

      <div className="origin-recognition__event-cta">
        <button
          type="button"
          className="origin-recognition__event-btn"
          onClick={() => setLightbox({ type: "gallery", index: 0 })}
          aria-haspopup="dialog"
        >
          {labels.viewEventPhotos}
        </button>
      </div>

      {lightboxNode}
    </>
  );
}
