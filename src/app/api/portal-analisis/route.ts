import { NextResponse } from "next/server";
import {
  ADDRESS_RE,
  EMAIL_RE,
  edgeSlugForTier,
  isDemoIdioma,
  isDemoTier,
  isSuccessStatus,
  isTerminalStatus,
  toPublicResult,
  type DemoIdioma,
  type DemoTier,
} from "@/lib/demoAnalisis";
import { enrichRowWithAnalisisArtifact } from "@/lib/portal/analisisArtifacts";
import { clientIpFromRequest } from "@/lib/demoRateLimit";
import { getMiUsuario } from "@/lib/portal/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const FUNCTIONS_BASE =
  process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "https://api.walpulse.com";

type SubmitBody = {
  tier?: unknown;
  address?: unknown;
  email?: unknown;
  idioma?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapUpstreamError(json: Record<string, unknown>): string {
  const err = typeof json.error === "string" ? json.error : "upstream_error";
  const detail = typeof json.detail === "string" ? json.detail : "";
  if (
    detail.includes("origins_missing_chains") ||
    detail.includes("missing_chains") ||
    detail.includes("no_onchain_footprint")
  ) {
    return "no_onchain_footprint";
  }
  if (err === "analisis_failed") return "analisis_failed";
  if (err === "invalid_upstream_json") return "upstream_error";
  return err;
}

function portalEnv() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? "";
  return { serviceRole, supabaseUrl };
}

async function callEdgeFunction(
  slug: string,
  body: Record<string, unknown>,
  apiKey: string,
  serviceRole: string,
  visitorIp?: string | null,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${serviceRole}`,
    apikey: serviceRole,
    "X-Api-Key": apiKey,
  };
  const ip = visitorIp?.trim().toLowerCase();
  if (ip && ip !== "unknown") {
    headers["x-walpulse-client-ip"] = ip;
  }

  const res = await fetch(`${FUNCTIONS_BASE}/functions/v1/${slug}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    json = { error: "invalid_upstream_json" };
  }
  return { status: res.status, json };
}

async function resolvePortalApiKey(clienteId: string): Promise<string | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.rpc(
    "service_get_portal_dashboard_api_key",
    { p_cliente_id: clienteId },
  );
  if (error || typeof data !== "string" || !data.trim()) {
    console.error(
      "service_get_portal_dashboard_api_key failed",
      error?.message ?? "empty",
    );
    return null;
  }
  return data.trim();
}

/** Submit: Básica sync or Estándar/Experta accept (portal session). */
export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const { serviceRole, supabaseUrl } = portalEnv();
  if (!serviceRole || !supabaseUrl) {
    return NextResponse.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  const usuario = await getMiUsuario();
  if (!usuario?.cliente_id || !usuario.activado || !usuario.cliente_activado) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const tierRaw = asTrimmedString(body.tier).toLowerCase();
  if (!isDemoTier(tierRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_tier" }, { status: 400 });
  }
  const tier: DemoTier = tierRaw;

  const address = asTrimmedString(body.address);
  if (!ADDRESS_RE.test(address)) {
    return NextResponse.json({ ok: false, error: "invalid_address" }, { status: 400 });
  }
  const wallet = address.toLowerCase();

  let idioma: DemoIdioma = "es";
  let email: string | undefined;

  if (tier === "estandar" || tier === "experta") {
    const idiomaRaw = asTrimmedString(body.idioma).toLowerCase() || "es";
    if (!isDemoIdioma(idiomaRaw)) {
      return NextResponse.json({ ok: false, error: "invalid_idioma" }, { status: 400 });
    }
    idioma = idiomaRaw;

    email = asTrimmedString(body.email).toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
  }

  const apiKey = await resolvePortalApiKey(usuario.cliente_id);
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "portal_api_key_missing" },
      { status: 503 },
    );
  }

  const slug = edgeSlugForTier(tier);
  const payload: Record<string, unknown> =
    tier === "basica"
      ? { address: wallet }
      : { address: wallet, idioma, email };

  try {
    const { status, json } = await callEdgeFunction(
      slug,
      payload,
      apiKey,
      serviceRole,
      ip,
    );

    if (tier === "basica") {
      if (status >= 400) {
        const err = mapUpstreamError(json);
        return NextResponse.json(
          {
            ok: false,
            error: err,
            request_id: json.request_id ?? null,
            detail:
              typeof json.detail === "string" ? json.detail : undefined,
          },
          { status: status >= 500 ? 502 : status },
        );
      }

      const result = toPublicResult(
        {
          ...json,
          tier: "basica",
          wallet,
          idioma: "es",
        },
        {
          requestId:
            typeof json.request_id === "string" ? json.request_id : undefined,
          idioma: "es",
        },
      );

      return NextResponse.json({
        ok: true,
        mode: "sync" as const,
        result,
      });
    }

    if (status !== 202 && status !== 200) {
      const err =
        typeof json.error === "string" ? json.error : "upstream_error";
      const existingId =
        typeof json.existing_request_id === "string"
          ? json.existing_request_id
          : null;
      return NextResponse.json(
        {
          ok: false,
          error: err,
          ...(existingId ? { existing_request_id: existingId } : {}),
        },
        { status: status >= 500 ? 502 : status },
      );
    }

    const requestId =
      typeof json.request_id === "string" ? json.request_id : null;
    if (!requestId) {
      return NextResponse.json(
        { ok: false, error: "missing_request_id" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        mode: "async" as const,
        request_id: requestId,
        status: typeof json.status === "string" ? json.status : "accepted",
        tier,
        wallet,
        idioma,
        email,
      },
      { status: 202 },
    );
  } catch (err) {
    console.error(
      "portal-analisis POST failed",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

/** Poll Estándar/Experta by request_id (scoped to session cliente). */
export async function GET(request: Request) {
  const usuario = await getMiUsuario();
  if (!usuario?.cliente_id || !usuario.activado || !usuario.cliente_activado) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestId = url.searchParams.get("request_id")?.trim() ?? "";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  ) {
    return NextResponse.json({ ok: false, error: "invalid_request_id" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("portal_get_analisis_request", {
      p_id: requestId,
    });

    if (error) {
      console.error("portal_get_analisis_request failed", error.message);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const row = data as Record<string, unknown>;
    const idiomaRaw =
      typeof row.idioma === "string" ? row.idioma : "es";
    const idioma: DemoIdioma = isDemoIdioma(idiomaRaw) ? idiomaRaw : "es";
    const status = typeof row.status === "string" ? row.status : "unknown";

    const enriched = await enrichRowWithAnalisisArtifact(
      getSupabaseAdmin(),
      row,
    );
    const result = toPublicResult(enriched, { requestId, idioma });

    return NextResponse.json({
      ok: true,
      request_id: requestId,
      status,
      terminal: isTerminalStatus(status),
      ready:
        isSuccessStatus(status) &&
        Boolean(result.synthesis_grade || result.modules.length),
      result,
    });
  } catch (err) {
    console.error(
      "portal-analisis GET failed",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
