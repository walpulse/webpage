import type { SignalKey } from "@/lib/signalCerts";

export const REVEAL_LEVELS = [0, 1, 2, 3, 4] as const;

export type RevealLevel = (typeof REVEAL_LEVELS)[number];

export const REVEAL_LEVEL_COUNT = REVEAL_LEVELS.length;

/** Slide order after welcome: Multichain → Portfolio → Origins → Activity. */
export const SIGNAL_BY_LEVEL: Record<Exclude<RevealLevel, 0>, SignalKey> = {
  1: "multichain",
  2: "portfolio",
  3: "origins",
  4: "activity",
};

/** Map continuous 0–1 scroll progress to a discrete level. */
export function progressToLevel(progress: number): RevealLevel {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.round(clamped * (REVEAL_LEVEL_COUNT - 1)) as RevealLevel;
}

/** Smooth 0–1 weight of a level around its slot on the progress line. */
export function levelWeight(progress: number, level: RevealLevel): number {
  const center = level / (REVEAL_LEVEL_COUNT - 1);
  const dist = Math.abs(progress - center);
  const span = 1 / (REVEAL_LEVEL_COUNT - 1);
  return Math.min(1, Math.max(0, 1 - dist / span));
}
