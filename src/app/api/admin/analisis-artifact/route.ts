import { NextResponse } from "next/server";
import {
  isArtifactKind,
  loadAnalisisArtifactJson,
  type AnalisisArtifactMeta,
} from "@/lib/portal/analisisArtifacts";
import { getMiUsuario } from "@/lib/portal/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/admin/analisis-artifact?request_id=&kind=
 * Operadores: descarga un JSON del bucket privado analisis-artifacts.
 */
export async function GET(request: Request) {
  const usuario = await getMiUsuario();
  if (!usuario) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!usuario.es_operador_sistema) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const requestId = url.searchParams.get("request_id")?.trim() ?? "";
  const kindRaw = url.searchParams.get("kind")?.trim().toLowerCase() ?? "";

  if (!UUID_RE.test(requestId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_request_id" },
      { status: 400 },
    );
  }
  if (!isArtifactKind(kindRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();

    // Confirm request exists (ops catalog); list_analisis_artifacts raises if missing
    const { data: listed, error: listErr } = await admin.rpc(
      "list_analisis_artifacts",
      { p_request_id: requestId },
    );
    if (listErr) {
      const msg = listErr.message || "";
      if (msg.includes("request_not_found")) {
        return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
      }
      console.error("list_analisis_artifacts", listErr.message);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    const artifacts = (Array.isArray(listed) ? listed : []) as AnalisisArtifactMeta[];
    const body = await loadAnalisisArtifactJson(
      admin,
      requestId,
      kindRaw,
      artifacts,
    );

    if (body == null) {
      return NextResponse.json({ ok: false, error: "artifact_not_found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      request_id: requestId,
      kind: kindRaw,
      data: body,
    });
  } catch (err) {
    console.error(
      "admin analisis-artifact GET failed",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
