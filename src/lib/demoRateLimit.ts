import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitKind = "submit" | "poll";

export type RateLimitResult =
  | { ok: true; remaining: number; reset: number }
  | { ok: false; remaining: number; reset: number; retryAfterSec: number }
  | { ok: false; misconfigured: true };

function redisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

let submitLimiter: Ratelimit | null = null;
let pollLimiter: Ratelimit | null = null;

function getLimiter(kind: RateLimitKind): Ratelimit | null {
  if (!redisConfigured()) return null;

  if (kind === "submit") {
    if (!submitLimiter) {
      submitLimiter = new Ratelimit({
        redis: Redis.fromEnv(),
        // 15 successful submits / IP / 15 min — applied after Turnstile so
        // captcha failures do not burn quota.
        limiter: Ratelimit.slidingWindow(15, "15 m"),
        prefix: "walpulse:demo:submit",
        analytics: false,
      });
    }
    return submitLimiter;
  }

  if (!pollLimiter) {
    pollLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "walpulse:demo:poll",
      analytics: false,
    });
  }
  return pollLimiter;
}

/** Client IP from Vercel / proxy headers. */
export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

/**
 * Rate-limit demo traffic by IP.
 * - Missing Upstash in development: fail-open
 * - Missing Upstash in production: fail-closed (misconfigured)
 */
export async function enforceDemoRateLimit(
  kind: RateLimitKind,
  ip: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter(kind);

  if (!limiter) {
    if (process.env.NODE_ENV === "development") {
      return { ok: true, remaining: 999, reset: Date.now() };
    }
    return { ok: false, misconfigured: true };
  }

  const { success, remaining, reset } = await limiter.limit(ip);
  if (success) {
    return { ok: true, remaining, reset };
  }

  const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { ok: false, remaining, reset, retryAfterSec };
}
