import type {
  DemoHopGroup,
  DemoHopsTitleKey,
} from "@/lib/demoHops";
import { extractModuleHops } from "@/lib/demoHops";

/** Demo analysis helpers — public result subset only (no evidencia blob / secrets). */

export const DEMO_TIERS = ["basica", "estandar", "experta"] as const;
export type DemoTier = (typeof DEMO_TIERS)[number];

export const DEMO_IDIOMAS = ["es", "en", "pt"] as const;
export type DemoIdioma = (typeof DEMO_IDIOMAS)[number];

export const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TERMINAL_STATUSES = new Set([
  "succeeded",
  "succeeded_with_warnings",
  "failed",
  "packaging_failed",
]);

export const IN_PROGRESS_STATUSES = new Set([
  "accepted",
  "running",
  "claimed",
]);

/** Signal modules shown in banner + carousel (Portfolio filtered if empty). */
export const MODULE_KEYS = [
  "multichain",
  "portfolio",
  "origins",
  "activity",
] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

type LocalizedBlob = { eng?: string; esp?: string; por?: string } | string | null;

export type DemoSignalRow = {
  id: string;
  label: string;
  display: string;
};

export type DemoModuleSummary = {
  key: ModuleKey;
  grade: string | null;
  summary: string | null;
  signals: DemoSignalRow[];
  chains: string[];
  hopsTitleKey: DemoHopsTitleKey | null;
  hopGroups: DemoHopGroup[];
};

export type DemoCompliance = {
  verdict: string | null;
  sanctioned: boolean | null;
  chain: string | null;
  screened_address: string | null;
  signature_verified: boolean | null;
  screened_at: string | null;
  provider: string | null;
};

export type DemoOnchain = {
  status: string | null;
  attestation_uid: string | null;
  schema_uid: string | null;
  tx_hash: string | null;
};

export type DemoPublicResult = {
  request_id: string;
  status: string;
  tier: string;
  wallet: string;
  idioma: DemoIdioma;
  synthesis_grade: string | null;
  synthesis_label: string | null;
  synthesis_summary: string | null;
  modules: DemoModuleSummary[];
  compliance: DemoCompliance | null;
  onchain: DemoOnchain | null;
  analisis_cid: string | null;
  evidencia_cid: string | null;
  pdf_cid: string | null;
  error: string | null;
};

export function isDemoTier(v: unknown): v is DemoTier {
  return typeof v === "string" && (DEMO_TIERS as readonly string[]).includes(v);
}

export function isDemoIdioma(v: unknown): v is DemoIdioma {
  return typeof v === "string" && (DEMO_IDIOMAS as readonly string[]).includes(v);
}

export function edgeSlugForTier(tier: DemoTier): string {
  if (tier === "basica") return "analisis-basica";
  if (tier === "estandar") return "analisis-estandar";
  return "analisis-experta";
}

export function ipfsGatewayUrl(cid: string | null | undefined): string | null {
  if (!cid || typeof cid !== "string") return null;
  const clean = cid.replace(/^ipfs:\/\//, "").trim();
  if (!clean) return null;
  return `https://gateway.pinata.cloud/ipfs/${clean}`;
}

export function baseScanTxUrl(txHash: string | null | undefined): string | null {
  if (!txHash || typeof txHash !== "string") return null;
  const h = txHash.trim();
  if (!/^0x[a-fA-F0-9]{64}$/.test(h)) return null;
  return `https://basescan.org/tx/${h}`;
}

export function easAttestationUrl(
  attestationUid: string | null | undefined,
): string | null {
  if (!attestationUid || typeof attestationUid !== "string") return null;
  const u = attestationUid.trim();
  if (!/^0x[a-fA-F0-9]{64}$/.test(u)) return null;
  return `https://base.easscan.org/attestation/view/${u}`;
}

export function truncateHash(hash: string, edge = 6): string {
  if (hash.length <= edge * 2 + 2) return hash;
  return `${hash.slice(0, edge + 2)}…${hash.slice(-edge)}`;
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

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function trimFloat(num: number, digits: number): string {
  return num.toFixed(digits).replace(/\.?0+$/, "");
}

function formatMoneyUsd(num: number): string {
  return `$${trimFloat(num, 2)}`;
}

function boolText(value: boolean, idioma: DemoIdioma): string {
  if (idioma === "en") return value ? "Yes" : "No";
  if (idioma === "pt") return value ? "Sim" : "Não";
  return value ? "Sí" : "No";
}

/** Parity with analisis_pdf `_format_signal_value` (pct / HHI / USD / counts / bool). */
function formatSignalValue(
  value: unknown,
  key: string,
  idioma: DemoIdioma,
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return boolText(value, idioma);

  const keyL = key.toLowerCase();
  const isUsdMoney = keyL.includes("_usd") && !keyL.includes("hhi");
  const isCount = keyL.endsWith("_positions") || keyL.endsWith("_count");
  const absoluteMetric = isUsdMoney || isCount;
  const pctLike =
    !absoluteMetric &&
    (keyL.endsWith("_pct") ||
      keyL.endsWith("_pct_value") ||
      keyL.endsWith("_ratio") ||
      keyL.endsWith("_hhi") ||
      keyL === "hhi" ||
      keyL === "hhi_usd" ||
      keyL.includes("hhi"));

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const num = value;
    if (isUsdMoney) return formatMoneyUsd(num);
    if (isCount) {
      return Number.isInteger(num) ? String(num) : String(num);
    }
    if (pctLike && num >= 0 && num <= 1) {
      return `${trimFloat(num * 100, 2)}%`;
    }
    if (Number.isInteger(num)) return String(num);
    if (Math.abs(num) >= 100 || num === 0) return trimFloat(num, 2);
    return trimFloat(num, 4);
  }

  if (typeof value === "string") {
    const s = value.trim();
    return s || null;
  }

  return null;
}

const SKIP_SIGNAL_KEYS = new Set(["grade", "version"]);

function chainItemName(item: Record<string, unknown>): string | null {
  for (const field of ["name", "ankr_slug", "goldrush_name"] as const) {
    const v = item[field];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function uniqueChainNames(items: unknown[]): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const raw of items) {
    const rec = asRecord(raw);
    if (!rec) continue;
    const name = chainItemName(rec);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

/** Chains read for a module — Origins/Activity `per_chain`, Multichain `main_chains`. */
function extractModuleChains(
  key: ModuleKey,
  mod: Record<string, unknown>,
): string[] {
  if (key === "origins" || key === "activity") {
    const perChain = mod.per_chain;
    return Array.isArray(perChain) ? uniqueChainNames(perChain) : [];
  }
  if (key === "multichain") {
    const signals = asRecord(mod.signals);
    const main = signals?.main_chains;
    return Array.isArray(main) ? uniqueChainNames(main) : [];
  }
  return [];
}

/** Flat scalar signals only — same rule as analisis_pdf `_collect_signal_rows`. */
function flattenSignals(
  signals: Record<string, unknown> | null,
  idioma: DemoIdioma,
): DemoSignalRow[] {
  if (!signals) return [];
  const rows: DemoSignalRow[] = [];

  for (const [key, value] of Object.entries(signals)) {
    if (SKIP_SIGNAL_KEYS.has(key)) continue;
    if (value !== null && typeof value === "object") continue;
    const display = formatSignalValue(value, key, idioma);
    if (display === null) continue;
    rows.push({ id: key, label: key, display });
  }

  return rows;
}

function extractAnalisisDoc(
  source: Record<string, unknown>,
): Record<string, unknown> | null {
  const direct = asRecord(source.analisis);
  if (direct) return direct;
  const nested = asRecord(source.analisis_doc);
  if (nested) return nested;
  if (asRecord(source.modules) || asRecord(source.synthesis)) return source;
  return null;
}

function extractCompliance(
  source: Record<string, unknown>,
  analisis: Record<string, unknown> | null,
): DemoCompliance | null {
  const raw =
    asRecord(analisis?.compliance_screen) ??
    asRecord(source.compliance_screen);
  if (!raw) return null;

  const verdict =
    typeof raw.verdict === "string"
      ? raw.verdict
      : typeof raw.status === "string"
        ? raw.status
        : null;

  return {
    verdict,
    sanctioned:
      typeof raw.sanctioned === "boolean" ? raw.sanctioned : null,
    chain: typeof raw.chain === "string" ? raw.chain : null,
    screened_address:
      typeof raw.screened_address === "string" ? raw.screened_address : null,
    signature_verified:
      typeof raw.signature_verified === "boolean"
        ? raw.signature_verified
        : null,
    screened_at:
      typeof raw.screened_at === "string"
        ? raw.screened_at
        : typeof raw.generated_at === "string"
          ? raw.generated_at
          : typeof raw.sdn_snapshot_at === "string"
            ? raw.sdn_snapshot_at
            : null,
    provider: typeof raw.provider === "string" ? raw.provider : null,
  };
}

function extractOnchain(source: Record<string, unknown>): DemoOnchain | null {
  const onchain = asRecord(source.onchain);
  const txHash =
    typeof source.onchain_tx_hash === "string"
      ? source.onchain_tx_hash
      : typeof onchain?.tx_hash === "string"
        ? onchain.tx_hash
        : null;

  if (!onchain && !txHash) return null;

  return {
    status: typeof onchain?.status === "string" ? onchain.status : null,
    attestation_uid:
      typeof onchain?.attestation_uid === "string"
        ? onchain.attestation_uid
        : null,
    schema_uid:
      typeof onchain?.schema_uid === "string" ? onchain.schema_uid : null,
    tx_hash: txHash,
  };
}

/** Build a UI-safe result from EF sync body or get_analisis_request row. */
export function toPublicResult(
  source: Record<string, unknown>,
  opts?: { requestId?: string; idioma?: DemoIdioma },
): DemoPublicResult {
  const analisis = extractAnalisisDoc(source);
  const synthesis = asRecord(analisis?.synthesis);
  const modulesRoot = asRecord(analisis?.modules);
  const synthesisSignals = asRecord(synthesis?.signals);

  const idiomaRaw =
    opts?.idioma ??
    (typeof source.idioma === "string" ? source.idioma : "es");
  const idioma: DemoIdioma = isDemoIdioma(idiomaRaw) ? idiomaRaw : "es";

  const requestId =
    opts?.requestId ??
    (typeof source.request_id === "string"
      ? source.request_id
      : typeof source.id === "string"
        ? source.id
        : "");

  const modules: DemoModuleSummary[] = MODULE_KEYS.map((key) => {
    const mod = asRecord(modulesRoot?.[key]);
    if (!mod) {
      return {
        key,
        grade: null,
        summary: null,
        signals: [],
        chains: [],
        hopsTitleKey: null,
        hopGroups: [],
      };
    }
    const synMod = asRecord(synthesisSignals?.[key]);
    const grade =
      (typeof mod.grade === "string" ? mod.grade : null) ??
      (typeof synMod?.grade === "string" ? synMod.grade : null);
    const summary =
      pickLocalized(mod.summary as LocalizedBlob, idioma) ??
      pickLocalized(synMod?.summary as LocalizedBlob, idioma);
    const signals = flattenSignals(asRecord(mod.signals), idioma);
    const chains = extractModuleChains(key, mod);
    const { hopsTitleKey, hopGroups } = extractModuleHops(key, mod, idioma);
    return {
      key,
      grade,
      summary,
      signals,
      chains,
      hopsTitleKey,
      hopGroups,
    };
  }).filter(
    (m) =>
      m.grade ||
      m.summary ||
      m.signals.length > 0 ||
      m.chains.length > 0 ||
      m.hopGroups.length > 0,
  );

  const error =
    typeof source.error === "string"
      ? source.error
      : typeof source.error_message === "string"
        ? source.error_message
        : null;

  return {
    request_id: requestId,
    status: typeof source.status === "string" ? source.status : "unknown",
    tier: typeof source.tier === "string" ? source.tier : "",
    wallet: typeof source.wallet === "string" ? source.wallet : "",
    idioma,
    synthesis_grade:
      typeof synthesis?.grade === "string" ? synthesis.grade : null,
    synthesis_label: pickLocalized(
      synthesis?.grade_label as LocalizedBlob,
      idioma,
    ),
    synthesis_summary: pickLocalized(
      synthesis?.summary as LocalizedBlob,
      idioma,
    ),
    modules,
    compliance: extractCompliance(source, analisis),
    onchain: extractOnchain(source),
    analisis_cid:
      typeof source.analisis_cid === "string" ? source.analisis_cid : null,
    evidencia_cid:
      typeof source.evidencia_cid === "string" ? source.evidencia_cid : null,
    pdf_cid: typeof source.pdf_cid === "string" ? source.pdf_cid : null,
    error,
  };
}

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}

export function isSuccessStatus(status: string): boolean {
  return status === "succeeded" || status === "succeeded_with_warnings";
}
