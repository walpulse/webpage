/** Storage privado `analisis-artifacts` — downloads server-only (service_role). */

import type { SupabaseClient } from "@supabase/supabase-js";

export const ARTIFACT_BUCKET = "analisis-artifacts";

export const ARTIFACT_KINDS = [
  "request_payload",
  "analisis",
  "evidencia",
  "manifiesto",
  "signature",
  "onchain",
  "compliance_screen",
  "upstream_errors",
  "run_progress",
  "riesgo",
  "receipt",
] as const;

export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export function isArtifactKind(value: string): value is ArtifactKind {
  return (ARTIFACT_KINDS as readonly string[]).includes(value);
}

export type AnalisisArtifactMeta = {
  kind: string;
  storage_path: string;
  byte_size: number | null;
  sha256: string | null;
  updated_at: string | null;
};

type CatalogRow = {
  kind?: string;
  storage_path?: string;
  byte_size?: number | null;
  sha256?: string | null;
  updated_at?: string | null;
};

/** Resolve path from catalog + download JSON from Storage. */
export async function loadAnalisisArtifactJson(
  sb: SupabaseClient,
  requestId: string,
  kind: ArtifactKind,
  artifactsHint?: AnalisisArtifactMeta[] | null,
): Promise<unknown | null> {
  let path: string | null = null;

  if (artifactsHint?.length) {
    const hit = artifactsHint.find(
      (a) => String(a.kind || "").toLowerCase() === kind,
    );
    path = hit?.storage_path ?? null;
  }

  if (!path) {
    const { data, error } = await sb.rpc("list_analisis_artifacts", {
      p_request_id: requestId,
    });
    if (error) {
      console.error("list_analisis_artifacts_failed", error.message);
      return null;
    }
    const rows = (Array.isArray(data) ? data : []) as CatalogRow[];
    const hit = rows.find(
      (r) => String(r?.kind || "").toLowerCase() === kind,
    );
    path = hit?.storage_path ? String(hit.storage_path) : null;
  }

  if (!path) return null;

  const { data, error } = await sb.storage.from(ARTIFACT_BUCKET).download(path);
  if (error || !data) {
    console.error("analisis_artifact_download_failed", path, error?.message);
    return null;
  }

  try {
    return JSON.parse(await data.text());
  } catch {
    return null;
  }
}

/**
 * Enrich a slim control-plane row with `analisis` (+ optional siblings)
 * so `toPublicResult` keeps working without jsonb columns.
 */
export async function enrichRowWithAnalisisArtifact(
  sb: SupabaseClient,
  row: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const requestId = typeof row.id === "string" ? row.id : "";
  if (!requestId) return row;

  const artifacts = Array.isArray(row.artifacts)
    ? (row.artifacts as AnalisisArtifactMeta[])
    : null;

  const analisis = await loadAnalisisArtifactJson(
    sb,
    requestId,
    "analisis",
    artifacts,
  );
  if (!analisis) return row;

  const out: Record<string, unknown> = { ...row, analisis };

  // Prefer nested compliance/onchain inside analisis; fill top-level if UI extractors need them
  if (!row.compliance_screen) {
    const compliance = await loadAnalisisArtifactJson(
      sb,
      requestId,
      "compliance_screen",
      artifacts,
    );
    if (compliance) out.compliance_screen = compliance;
  }
  if (!row.onchain) {
    const onchain = await loadAnalisisArtifactJson(
      sb,
      requestId,
      "onchain",
      artifacts,
    );
    if (onchain) out.onchain = onchain;
  }

  return out;
}
