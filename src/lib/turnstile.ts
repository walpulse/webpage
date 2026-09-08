type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

/** Temporary test bypass — set NEXT_PUBLIC_DEMO_SKIP_TURNSTILE=1 (must also skip UI). */
export function isTurnstileSkipped(): boolean {
  const raw = process.env.NEXT_PUBLIC_DEMO_SKIP_TURNSTILE?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Dev without secret: fail-open. Prod without secret: fail-closed.
 *
 * Note: we intentionally omit `remoteip`. Passing a mismatched IP (common
 * behind Vercel/CDN multi-hop `x-forwarded-for`) makes siteverify return
 * success=false → demo POST 403 `captcha_failed`.
 */
export async function verifyTurnstileToken(
  token: string,
  _remoteIp?: string,
): Promise<"ok" | "failed" | "misconfigured"> {
  if (isTurnstileSkipped()) return "ok";

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  if (!secret) {
    return process.env.NODE_ENV === "development" ? "ok" : "misconfigured";
  }

  const trimmed = token.trim();
  if (!trimmed) return "failed";

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", trimmed);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    const json = (await res.json()) as TurnstileVerifyResponse;
    if (!json.success) {
      const codes = json["error-codes"] ?? [];
      console.error(
        "turnstile siteverify failed",
        codes.length ? codes.join(",") : "unknown",
      );
      // Common misconfig: site key / secret from different widgets → invalid-input-response
      // or invalid-input-secret. Check Cloudflare Turnstile ↔ Vercel env pair.
    }
    return json.success ? "ok" : "failed";
  } catch {
    return "failed";
  }
}

export function turnstileSiteKey(): string {
  if (isTurnstileSkipped()) return "";
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
}
