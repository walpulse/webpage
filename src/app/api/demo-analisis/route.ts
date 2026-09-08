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
import {
  clientIpFromRequest,
  enforceDemoRateLimit,
} from "@/lib/demoRateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const maxDuration = 120;

const FUNCTIONS_BASE =
  process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "https://api.walpulse.com";

type SubmitBody = {
  tier?: unknown;
  address?: unknown;
  email?: unknown;
  idioma?: unknown;
  turnstileToken?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Map Edge Function failures to stable demo error codes. */
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
  return err;
}

function demoEnv() {
  const apiKey = process.env.WALPULSE_DEMO_API_KEY?.trim() ?? "";
  const clienteId = process.env.WALPULSE_DEMO_CLIENTE_ID?.trim() ?? "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? "";
  return { apiKey, clienteId, serviceRole, supabaseUrl };
}

function rateLimitResponse(
  result: Awaited<ReturnType<typeof enforceDemoRateLimit>>,
) {
  if ("misconfigured" in result && result.misconfigured) {
    return NextResponse.json(
      { ok: false, error: "server_misconfigured" },
      { status: 503 },
    );
  }
  if (!result.ok && "retryAfterSec" in result) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSec) },
      },
    );
  }
  return null;
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
  // Forward visitor IP so accept Edge can guard wallet+tier+IP (not the BFF egress IP).
  const ip = visitorIp?.trim().toLowerCase();
  if (ip && ip !== "unknown") {
    headers["x-forwarded-for"] = ip;
    headers["x-real-ip"] = ip;
    headers["cf-connecting-ip"] = ip;
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

/** Submit: Básica sync or Estándar/Experta accept. */
export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);

  const { apiKey, serviceRole, supabaseUrl } = demoEnv();
  if (!apiKey || !serviceRole || !supabaseUrl) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }

  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const captcha = await verifyTurnstileToken(
    asTrimmedString(body.turnstileToken),
    ip,
  );
  if (captcha === "misconfigured") {
    return NextResponse.json(
      { ok: false, error: "server_misconfigured" },
      { status: 503 },
    );
  }
  if (captcha === "failed") {
    return NextResponse.json(
      { ok: false, error: "captcha_failed" },
      { status: 403 },
    );
  }

  // After Turnstile: failed captchas must not consume submit quota.
  const limited = rateLimitResponse(await enforceDemoRateLimit("submit", ip));
  if (limited) return limited;

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

    // Async accept
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
      "demo-analisis POST failed",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

/** Poll Estándar/Experta by request_id (scoped to Demo User). */
export async function GET(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = rateLimitResponse(await enforceDemoRateLimit("poll", ip));
  if (limited) return limited;

  const { clienteId } = demoEnv();
  if (!clienteId) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc("get_analisis_request", {
      p_id: requestId,
    });

    if (error) {
      console.error("get_analisis_request failed", error.message);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const row = data as Record<string, unknown>;
    if (String(row.cliente_id) !== clienteId) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const idiomaRaw =
      typeof row.idioma === "string" ? row.idioma : "es";
    const idioma: DemoIdioma = isDemoIdioma(idiomaRaw) ? idiomaRaw : "es";
    const status = typeof row.status === "string" ? row.status : "unknown";

    const result = toPublicResult(row, { requestId, idioma });

    return NextResponse.json({
      ok: true,
      request_id: requestId,
      status,
      terminal: isTerminalStatus(status),
      ready: isSuccessStatus(status) && Boolean(result.synthesis_grade || result.modules.length),
      result,
    });
  } catch (err) {
    console.error(
      "demo-analisis GET failed",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
