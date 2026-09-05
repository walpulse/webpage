/**
 * Hop / counterparty grouping for demo carousel —
 * parity with walpulse/workers analisis_pdf render.py
 * (`_origins_hop_groups`, `_hop_cards_flat`).
 */

type DemoIdioma = "es" | "en" | "pt";

type LocalizedBlob = { eng?: string; esp?: string; por?: string } | string | null;

export type DemoHopCard = {
  tag: string;
  level: number;
  address: string;
  grade: string;
  summary: string | null;
  weight: string;
  via: string;
};

export type DemoHopGroup = {
  level: number;
  titleKey: "hopOrphansTitle" | null;
  cards: DemoHopCard[];
};

export type DemoHopsTitleKey = "originsHopsTitle" | "activityLightsTitle";

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function pickLocalized(
  blob: LocalizedBlob | undefined,
  idioma: DemoIdioma,
): string | null {
  if (!blob) return null;
  if (typeof blob === "string") return blob.trim() || null;
  const key = idioma === "es" ? "esp" : idioma === "pt" ? "por" : "eng";
  const fallback = blob[key] ?? blob.esp ?? blob.eng ?? blob.por ?? null;
  return typeof fallback === "string" && fallback.trim()
    ? fallback.trim()
    : null;
}

function normalizeGrade(value: unknown): string {
  const grade = String(value ?? "")
    .trim()
    .toUpperCase();
  if (["A", "B", "C", "D", "F"].includes(grade)) return grade;
  return "";
}

function hopGrade(raw: Record<string, unknown>): string {
  let grade = normalizeGrade(raw.grade);
  if (grade) return grade;
  const nestedMod = asRecord(raw.module);
  grade = normalizeGrade(nestedMod?.grade);
  if (grade) return grade;
  const analisis = asRecord(raw.analisis);
  const synthesis = asRecord(analisis?.synthesis);
  grade = normalizeGrade(synthesis?.grade);
  return grade || "—";
}

function hopSummary(
  raw: Record<string, unknown>,
  idioma: DemoIdioma,
): string | null {
  let text = pickLocalized(raw.summary as LocalizedBlob, idioma);
  if (text) return text;
  const nestedMod = asRecord(raw.module);
  text = pickLocalized(nestedMod?.summary as LocalizedBlob, idioma);
  if (text) return text;
  const analisis = asRecord(raw.analisis);
  const synthesis = asRecord(analisis?.synthesis);
  text = pickLocalized(synthesis?.summary as LocalizedBlob, idioma);
  if (text) return text;
  return pickLocalized(synthesis?.grade_label as LocalizedBlob, idioma);
}

function parseWeight(value: unknown): number | null {
  if (value === null || value === undefined || typeof value === "boolean") {
    return null;
  }
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function formatWeightDisplay(num: number | null, total: number): string {
  if (num === null || total <= 0) return "";
  const pct = (num / total) * 100;
  if (pct > 0 && pct < 0.1) return "<0.1%";
  return `${pct.toFixed(1).replace(/\.?0+$/, "")}%`;
}

function addrKey(address: string): string {
  return address.trim().toLowerCase();
}

function hopCard(
  raw: Record<string, unknown>,
  idioma: DemoIdioma,
  opts: { weight: string; tag: string; level: number; via?: string },
): DemoHopCard {
  return {
    tag: opts.tag,
    level: opts.level,
    address: String(raw.address ?? "").trim(),
    grade: hopGrade(raw),
    summary: hopSummary(raw, idioma),
    weight: opts.weight,
    via: opts.via ?? "",
  };
}

/** Activity: flat cards with % relative to the whole list. */
export function buildActivityHopGroups(
  items: unknown,
  idioma: DemoIdioma,
): DemoHopGroup[] {
  if (!Array.isArray(items)) return [];

  const parsed: { raw: Record<string, unknown>; weight: number | null }[] = [];
  let total = 0;
  for (const item of items) {
    const raw = asRecord(item);
    if (!raw) continue;
    const address = String(raw.address ?? "").trim();
    if (!address) continue;
    const weightNum = parseWeight(raw.weight);
    if (weightNum !== null && weightNum > 0) total += weightNum;
    parsed.push({ raw, weight: weightNum });
  }

  if (parsed.length === 0) return [];

  const cards = parsed.map(({ raw, weight }) =>
    hopCard(raw, idioma, {
      weight: formatWeightDisplay(weight, total),
      tag: "",
      level: 0,
    }),
  );

  return [{ level: 0, titleKey: null, cards }];
}

/** Origins: Hop 1x then Hop 2x children linked by `via`. */
export function buildOriginsHopGroups(
  items: unknown,
  idioma: DemoIdioma,
): DemoHopGroup[] {
  if (!Array.isArray(items)) return [];

  const hop1: { raw: Record<string, unknown>; weight: number | null }[] = [];
  const hop2: { raw: Record<string, unknown>; weight: number | null }[] = [];

  for (const item of items) {
    const raw = asRecord(item);
    if (!raw) continue;
    const address = String(raw.address ?? "").trim();
    if (!address) continue;
    let level = 1;
    try {
      level = Number.parseInt(String(raw.hop ?? 1), 10) || 1;
    } catch {
      level = 1;
    }
    const weightNum = parseWeight(raw.weight);
    if (level <= 1) hop1.push({ raw, weight: weightNum });
    else hop2.push({ raw, weight: weightNum });
  }

  hop1.sort((a, b) => (b.weight ?? -1) - (a.weight ?? -1));
  const hop1Total = hop1.reduce(
    (sum, row) => sum + (row.weight !== null && row.weight > 0 ? row.weight : 0),
    0,
  );
  const parentKeys = new Set(
    hop1.map(({ raw }) => addrKey(String(raw.address ?? ""))),
  );

  const childrenByParent = new Map<
    string,
    { raw: Record<string, unknown>; weight: number | null }[]
  >();
  const orphans: { raw: Record<string, unknown>; weight: number | null }[] = [];

  for (const row of hop2) {
    const via = String(row.raw.via ?? "").trim();
    const viaKey = via ? addrKey(via) : "";
    if (viaKey && parentKeys.has(viaKey)) {
      const list = childrenByParent.get(viaKey) ?? [];
      list.push(row);
      childrenByParent.set(viaKey, list);
    } else {
      orphans.push(row);
    }
  }

  for (const kids of childrenByParent.values()) {
    kids.sort((a, b) => (b.weight ?? -1) - (a.weight ?? -1));
  }

  const groups: DemoHopGroup[] = [];

  hop1.forEach(({ raw, weight }, idx) => {
    const letter =
      idx < 26 ? String.fromCharCode("a".charCodeAt(0) + idx) : String(idx + 1);
    const parentAddr = String(raw.address ?? "").trim();
    const parentKey = addrKey(parentAddr);
    const kids = childrenByParent.get(parentKey) ?? [];
    const kidsTotal = kids.reduce(
      (sum, row) =>
        sum + (row.weight !== null && row.weight > 0 ? row.weight : 0),
      0,
    );

    const cards: DemoHopCard[] = [
      hopCard(raw, idioma, {
        weight: formatWeightDisplay(weight, hop1Total),
        tag: `Hop 1${letter}`,
        level: 1,
      }),
    ];

    kids.forEach((child, childI) => {
      const childTag =
        kids.length === 1
          ? `Hop 2${letter}`
          : `Hop 2${letter}.${childI + 1}`;
      const via = String(child.raw.via ?? "").trim();
      cards.push(
        hopCard(child.raw, idioma, {
          weight: formatWeightDisplay(child.weight, kidsTotal),
          tag: childTag,
          level: 2,
          via,
        }),
      );
    });

    groups.push({ level: 1, titleKey: null, cards });
  });

  if (orphans.length > 0) {
    const orphanTotal = orphans.reduce(
      (sum, row) =>
        sum + (row.weight !== null && row.weight > 0 ? row.weight : 0),
      0,
    );
    const orphanCards = orphans.map((row, orphanI) => {
      const via = String(row.raw.via ?? "").trim();
      const tag =
        orphans.length === 1 ? "Hop 2" : `Hop 2.${orphanI + 1}`;
      return hopCard(row.raw, idioma, {
        weight: formatWeightDisplay(row.weight, orphanTotal),
        tag,
        level: 2,
        via,
      });
    });
    groups.push({
      level: 2,
      titleKey: "hopOrphansTitle",
      cards: orphanCards,
    });
  }

  return groups;
}

export function extractModuleHops(
  key: string,
  mod: Record<string, unknown>,
  idioma: DemoIdioma,
): { hopsTitleKey: DemoHopsTitleKey | null; hopGroups: DemoHopGroup[] } {
  if (key === "origins") {
    const hopGroups = buildOriginsHopGroups(mod.hops, idioma);
    return {
      hopsTitleKey: hopGroups.length > 0 ? "originsHopsTitle" : null,
      hopGroups,
    };
  }
  if (key === "activity") {
    const hopGroups = buildActivityHopGroups(mod.counterparties_light, idioma);
    return {
      hopsTitleKey: hopGroups.length > 0 ? "activityLightsTitle" : null,
      hopGroups,
    };
  }
  return { hopsTitleKey: null, hopGroups: [] };
}
