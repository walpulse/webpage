export const signalModuleKeys = [
  "origins",
  "activity",
  "multichain",
  "portfolio",
] as const;

export type SignalModuleKey = (typeof signalModuleKeys)[number];

const moduleLabelsByLocale: Record<string, Record<SignalModuleKey, string>> = {
  es: {
    origins: "Orígenes",
    activity: "Actividad",
    multichain: "Multichain",
    portfolio: "Portafolio",
  },
  en: {
    origins: "Origins",
    activity: "Activity",
    multichain: "Multichain",
    portfolio: "Portfolio",
  },
  pt: {
    origins: "Origens",
    activity: "Atividade",
    multichain: "Multichain",
    portfolio: "Portfólio",
  },
};

/** Normalize report/UI module names (ORIGINS, Origins, origins) to a stable key. */
export function normalizeModuleKey(raw: string): SignalModuleKey | null {
  const key = raw.trim().toLowerCase();
  if ((signalModuleKeys as readonly string[]).includes(key)) {
    return key as SignalModuleKey;
  }
  return null;
}

export function moduleLabel(raw: string, locale: string): string {
  const key = normalizeModuleKey(raw);
  if (!key) return raw;
  const labels = moduleLabelsByLocale[locale] ?? moduleLabelsByLocale.es;
  return labels[key];
}
