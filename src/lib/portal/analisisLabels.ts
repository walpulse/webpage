/**
 * Canonical tier / status / grade ids from `walpulse.analisis_requests` and
 * `walpulse.analisis_run_stages` (UI labels only).
 */
export const ANALISIS_TIERS = ["basica", "estandar", "experta"] as const;

export const ANALISIS_STATUSES = [
  "accepted",
  "claimed",
  "running",
  "started",
  "succeeded",
  "succeeded_with_warnings",
  "failed",
  "packaging_failed",
  "cancelled",
] as const;

/** `synthesis.grade` scale (no E). */
export const ANALISIS_GRADES = ["A", "B", "C", "D", "F"] as const;

export type AnalisisTier = (typeof ANALISIS_TIERS)[number];
export type AnalisisStatus = (typeof ANALISIS_STATUSES)[number];
export type AnalisisGrade = (typeof ANALISIS_GRADES)[number];

export function isKnownTier(tier: string): tier is AnalisisTier {
  return (ANALISIS_TIERS as readonly string[]).includes(tier);
}

export function isKnownStatus(status: string): status is AnalisisStatus {
  return (ANALISIS_STATUSES as readonly string[]).includes(status);
}

export function isKnownGrade(grade: string): grade is AnalisisGrade {
  return (ANALISIS_GRADES as readonly string[]).includes(grade);
}
