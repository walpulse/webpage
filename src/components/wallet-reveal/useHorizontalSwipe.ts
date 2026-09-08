"use client";

import { useEffect, useRef, type RefObject } from "react";

const DEFAULT_THRESHOLD_PX = 56;

type Options = {
  enabled?: boolean;
  thresholdPx?: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

/**
 * Detect a horizontal-dominant swipe on `targetRef`.
 * Ignores vertical pans so page scroll keeps working (`touch-action: pan-y` recommended).
 */
export function useHorizontalSwipe(
  targetRef: RefObject<HTMLElement | null>,
  { enabled = true, thresholdPx = DEFAULT_THRESHOLD_PX, onSwipeLeft, onSwipeRight }: Options,
) {
  const onLeftRef = useRef(onSwipeLeft);
  const onRightRef = useRef(onSwipeRight);
  onLeftRef.current = onSwipeLeft;
  onRightRef.current = onSwipeRight;

  useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let fired = false;
    let pointerId: number | null = null;

    const reset = () => {
      tracking = false;
      fired = false;
      pointerId = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      // Prefer touch / pen; ignore fine mouse so desktop drag doesn't steal clicks.
      if (event.pointerType === "mouse") {
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        if (!coarse) return;
      }
      tracking = true;
      fired = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!tracking || fired || event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < thresholdPx) return;
      if (Math.abs(dx) <= Math.abs(dy)) return;
      fired = true;
      if (dx < 0) onLeftRef.current();
      else onRightRef.current();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      reset();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [enabled, targetRef, thresholdPx]);
}
