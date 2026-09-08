"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { DemoResultPanel } from "@/components/demo/DemoResultPanel";
import {
  DemoTurnstile,
  resetTurnstileWidgets,
} from "@/components/demo/DemoTurnstile";
import {
  type DemoIdioma,
  type DemoPublicResult,
  type DemoTier,
} from "@/lib/demoAnalisis";
import { turnstileSiteKey as getTurnstileSiteKey } from "@/lib/turnstile";

type Phase =
  | "idle"
  | "submitting"
  | "polling"
  | "done"
  | "error"
  | "timeout";

const POLL_MS = 20_000;
const POLL_TIMEOUT_MS = 25 * 60_000;
const STORAGE_KEY = "walpulse.demo.request";

type StoredPoll = {
  request_id: string;
  tier: DemoTier;
  wallet: string;
  idioma: DemoIdioma;
  email: string;
  started_at: number;
};

function readStored(): StoredPoll | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPoll;
  } catch {
    return null;
  }
}

function writeStored(value: StoredPoll | null) {
  try {
    if (!value) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function DemoAnalisisForm() {
  const t = useTranslations("demo");
  const [tier, setTier] = useState<DemoTier>("basica");
  const [wallet, setWallet] = useState("");
  const [email, setEmail] = useState("");
  const [idioma, setIdioma] = useState<DemoIdioma>("es");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<string | null>(null);
  const [result, setResult] = useState<DemoPublicResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef<number>(0);

  const turnstileSiteKey = getTurnstileSiteKey();
  const needsCaptcha = Boolean(turnstileSiteKey);

  const needsAsyncFields = tier === "estandar" || tier === "experta";
  const busy = phase === "submitting" || phase === "polling";

  const clearPollTimer = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const mapError = useCallback(
    (code: string | undefined) => {
      const known = [
        "invalid_address",
        "invalid_email",
        "invalid_idioma",
        "invalid_tier",
        "invalid_api_key",
        "client_disabled",
        "upstream_error",
        "analisis_failed",
        "analisis_in_progress",
        "no_onchain_footprint",
        "server_misconfigured",
        "not_found",
        "db_error",
        "server_error",
        "timeout",
        "failed",
        "rate_limited",
        "captcha_failed",
      ];
      if (code && known.includes(code)) return t(`errors.${code}` as "errors.invalid_address");
      return t("errors.generic");
    },
    [t],
  );

  const pollOnce = useCallback(
    async (id: string): Promise<"continue" | "done" | "fail"> => {
      const res = await fetch(
        `/api/demo-analisis?request_id=${encodeURIComponent(id)}`,
      );
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        status?: string;
        terminal?: boolean;
        ready?: boolean;
        result?: DemoPublicResult;
      };

      if (!res.ok || !data.ok) {
        setErrorKey(data.error ?? "generic");
        setPhase("error");
        writeStored(null);
        return "fail";
      }

      setPollStatus(data.status ?? null);

      if (data.ready && data.result) {
        setResult(data.result);
        setPhase("done");
        writeStored(null);
        return "done";
      }

      if (data.terminal) {
        if (
          data.status === "failed" ||
          data.status === "packaging_failed"
        ) {
          setErrorKey("failed");
          setPhase("error");
          writeStored(null);
          return "fail";
        }
        if (data.result) {
          setResult(data.result);
          setPhase("done");
          writeStored(null);
          return "done";
        }
      }

      if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
        setPhase("timeout");
        return "fail";
      }

      return "continue";
    },
    [],
  );

  const schedulePollRef = useRef<(id: string) => void>(() => {});

  const schedulePoll = useCallback(
    (id: string) => {
      clearPollTimer();
      pollTimer.current = setTimeout(async () => {
        try {
          const next = await pollOnce(id);
          if (next === "continue") schedulePollRef.current(id);
        } catch {
          setErrorKey("generic");
          setPhase("error");
          writeStored(null);
        }
      }, POLL_MS);
    },
    [clearPollTimer, pollOnce],
  );

  useEffect(() => {
    schedulePollRef.current = schedulePoll;
  }, [schedulePoll]);

  const startPolling = useCallback(
    (stored: StoredPoll) => {
      setRequestId(stored.request_id);
      setTier(stored.tier);
      setWallet(stored.wallet);
      setEmail(stored.email);
      setIdioma(stored.idioma);
      startedAt.current = stored.started_at;
      setPhase("polling");
      setPollStatus("accepted");
      void (async () => {
        try {
          const next = await pollOnce(stored.request_id);
          if (next === "continue") schedulePollRef.current(stored.request_id);
        } catch {
          setErrorKey("generic");
          setPhase("error");
        }
      })();
    },
    [pollOnce],
  );

  useEffect(() => {
    const stored = readStored();
    if (!stored?.request_id) {
      return () => clearPollTimer();
    }
    const resume = window.setTimeout(() => {
      startPolling(stored);
    }, 0);
    return () => {
      window.clearTimeout(resume);
      clearPollTimer();
    };
  }, [clearPollTimer, startPolling]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;

    if (needsCaptcha && !turnstileToken) {
      setErrorKey("captcha_failed");
      setPhase("error");
      return;
    }

    clearPollTimer();
    setErrorKey(null);
    setResult(null);
    setRequestId(null);
    setPollStatus(null);
    setPhase("submitting");

    try {
      const res = await fetch("/api/demo-analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          address: wallet,
          ...(needsAsyncFields ? { email, idioma } : {}),
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        mode?: "sync" | "async";
        result?: DemoPublicResult;
        request_id?: string;
        status?: string;
      };

      if (!res.ok || !data.ok) {
        // 403 is only used for Turnstile failure; surface it even if the body is odd.
        const code =
          data.error ??
          (res.status === 403
            ? "captcha_failed"
            : res.status === 429
              ? "rate_limited"
              : "generic");
        setErrorKey(code);
        setPhase("error");
        setTurnstileToken(null);
        resetTurnstileWidgets();
        return;
      }

      if (data.mode === "sync" && data.result) {
        setResult(data.result);
        setRequestId(data.result.request_id || null);
        setPhase("done");
        writeStored(null);
        setTurnstileToken(null);
        resetTurnstileWidgets();
        return;
      }

      if (data.mode === "async" && data.request_id) {
        const stored: StoredPoll = {
          request_id: data.request_id,
          tier,
          wallet: wallet.toLowerCase(),
          idioma,
          email,
          started_at: Date.now(),
        };
        writeStored(stored);
        setTurnstileToken(null);
        resetTurnstileWidgets();
        startPolling(stored);
        return;
      }

      setErrorKey("generic");
      setPhase("error");
      setTurnstileToken(null);
      resetTurnstileWidgets();
    } catch {
      setErrorKey("generic");
      setPhase("error");
      setTurnstileToken(null);
      resetTurnstileWidgets();
    }
  }

  const field =
    "w-full rounded-lg border border-glass bg-void/60 px-3.5 py-2.5 text-sm text-pure placeholder:text-muted/70 focus:border-primary focus:outline-none disabled:opacity-60";

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2" disabled={busy}>
          <legend className="text-sm text-muted">{t("fieldTier")}</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["basica", "estandar", "experta"] as const).map((id) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  tier === id
                    ? "border-primary/60 bg-primary/10 text-pure"
                    : "border-glass bg-void/40 text-muted hover:border-glass/90"
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  value={id}
                  checked={tier === id}
                  onChange={() => setTier(id)}
                  className="accent-[var(--primary)]"
                />
                {t(`tiers.${id}`)}
              </label>
            ))}
          </div>
          <p className="text-xs text-muted">
            {tier === "basica" ? t("hintBasica") : t("hintAsync")}
          </p>
        </fieldset>

        <label className="block space-y-1.5">
          <span className="text-sm text-muted">{t("fieldWallet")}</span>
          <input
            className={`${field} font-mono`}
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x…"
            required
            pattern="0x[a-fA-F0-9]{40}"
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        {needsAsyncFields ? (
          <>
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("fieldEmail")}</span>
              <input
                type="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
                autoComplete="email"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-muted">{t("fieldIdioma")}</span>
              <select
                className={field}
                value={idioma}
                onChange={(e) => setIdioma(e.target.value as DemoIdioma)}
                disabled={busy}
              >
                <option value="es">{t("idioma.es")}</option>
                <option value="en">{t("idioma.en")}</option>
                <option value="pt">{t("idioma.pt")}</option>
              </select>
            </label>
          </>
        ) : null}

        {needsCaptcha ? (
          <DemoTurnstile
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
          />
        ) : null}

        <Button
          type="submit"
          disabled={busy || (needsCaptcha && !turnstileToken)}
          aria-busy={busy}
        >
          {phase === "submitting"
            ? t("submitting")
            : phase === "polling"
              ? t("polling")
              : t("submit")}
        </Button>
      </form>

      {phase === "submitting" ? (
        <div
          className="demo-waiting rounded-xl border border-glass/70 bg-void/40 p-5"
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="flex items-start gap-4">
            <span
              className="demo-waiting__spinner mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
              aria-hidden
            >
              <span className="demo-waiting__ring h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin" />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
                {t("waitingEyebrow")}
              </p>
              <p className="mt-2 text-sm text-muted">{t("waitingBasica")}</p>
              <div
                className="mt-4 h-1 overflow-hidden rounded-full bg-glass/60"
                aria-hidden
              >
                <div className="demo-waiting__bar h-full w-1/3 rounded-full bg-primary/80 motion-safe:animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {phase === "polling" && requestId ? (
        <div
          className="demo-waiting rounded-xl border border-glass/70 bg-void/40 p-5"
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="flex items-start gap-4">
            <span
              className="demo-waiting__spinner mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
              aria-hidden
            >
              <span className="demo-waiting__ring h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
                {t("pollingEyebrow")}
              </p>
              <p className="mt-2 text-sm text-muted">{t("pollingBody")}</p>
              <p className="mt-3 font-mono text-xs text-pure/80 break-all">
                {t("requestId")}: {requestId}
              </p>
              {pollStatus ? (
                <p className="mt-2 text-xs text-muted">
                  {t("statusLabel")}:{" "}
                  <span className="text-pure">{pollStatus}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {phase === "timeout" && requestId ? (
        <div className="rounded-xl border border-glass/70 bg-void/40 p-5" role="status">
          <p className="text-sm text-muted">{t("timeoutBody")}</p>
          <p className="mt-3 font-mono text-xs text-pure/80 break-all">
            {t("requestId")}: {requestId}
          </p>
        </div>
      ) : null}

      {phase === "error" ? (
        <p className="text-sm text-red-300/90" role="alert">
          {mapError(errorKey ?? undefined)}
        </p>
      ) : null}

      {phase === "done" && result ? <DemoResultPanel result={result} /> : null}
    </div>
  );
}
