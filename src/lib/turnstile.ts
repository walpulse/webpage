type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

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
      console.error(
        "turnstile siteverify failed",
        json["error-codes"]?.join(",") ?? "unknown",
      );
    }
    return json.success ? "ok" : "failed";
  } catch {
    return "failed";
  }
}

export function turnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
}
