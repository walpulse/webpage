/** Canonical analisis_run stage ids (worker telemetry). */
export const ANALISIS_RUN_STAGES = [
  "ola1",
  "compliance",
  "empty_wallet",
  "portfolio",
  "multichain_module",
  "origins",
  "activity",
  "hops",
  "lights",
  "synthesize",
  "custody",
  "persist",
  "entregables",
] as const;

export type AnalisisRunStageId = (typeof ANALISIS_RUN_STAGES)[number];

export function isKnownStageId(stage: string): stage is AnalisisRunStageId {
  return (ANALISIS_RUN_STAGES as readonly string[]).includes(stage);
}
