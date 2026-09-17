"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DemoResultPanel } from "@/components/demo/DemoResultPanel";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput, PortalSelect } from "@/components/portal/ui/PortalField";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { StatusBadge } from "@/components/portal/ui/StatusBadge";
import {
  type DemoIdioma,
  type DemoPublicResult,
  type DemoTier,
} from "@/lib/demoAnalisis";

type Phase =
  | "idle"
  | "submitting"
  | "polling"
  | "done"
  | "error"
  | "timeout";

const POLL_MS = 20_000;
const POLL_TIMEOUT_MS = 25 * 60_000;
const STORAGE_KEY = "walpulse.portal.analisis.request";

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

export function PortalAnalisisForm({
  defaultEmail,
  defaultIdioma,
}: {
  defaultEmail: string;
  defaultIdioma: DemoIdioma;
}) {
  const t = useTranslations("portal.nuevoAnalisis");
  const [tier, setTier] = useState<DemoTier>("basica");
  const [wallet, setWallet] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [idioma, setIdioma] = useState<DemoIdioma>(defaultIdioma);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<string | null>(null);
  const [result, setResult] = useState<DemoPublicResult | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef<number>(0);

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
        "portal_api_key_missing",
        "unauthorized",
        "not_found",
        "db_error",
        "server_error",
        "timeout",
        "failed",
        "generic",
      ];
      if (code && known.includes(code)) {
        return t(`errors.${code}` as "errors.invalid_address");
      }
      return t("errors.generic");
    },
    [t],
  );

  const pollOnce = useCallback(
    async (id: string): Promise<"continue" | "done" | "fail"> => {
      const res = await fetch(
        `/api/portal-analisis?request_id=${encodeURIComponent(id)}`,
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
        if (data.status === "failed" || data.status === "packaging_failed") {
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

    clearPollTimer();
    setErrorKey(null);
    setResult(null);
    setRequestId(null);
    setPollStatus(null);
    setPhase("submitting");

    try {
      const res = await fetch("/api/portal-analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          address: wallet,
          ...(needsAsyncFields ? { email, idioma } : {}),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        mode?: "sync" | "async";
        result?: DemoPublicResult;
        request_id?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorKey(
          data.error ?? (res.status === 401 ? "unauthorized" : "generic"),
        );
        setPhase("error");
        return;
      }

      if (data.mode === "sync" && data.result) {
        setResult(data.result);
        setRequestId(data.result.request_id || null);
        setPhase("done");
        writeStored(null);
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
        startPolling(stored);
        return;
      }

      setErrorKey("generic");
      setPhase("error");
    } catch {
      setErrorKey("generic");
      setPhase("error");
    }
  }

  return (
    <div className="space-y-8">
      <PortalPanel hairline>
        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset className="space-y-2" disabled={busy}>
            <legend className="portal-label__text">{t("fieldTier")}</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["basica", "estandar", "experta"] as const).map((id) => (
                <label
                  key={id}
                  className={`portal-panel flex cursor-pointer items-center gap-2.5 px-3.5 py-3 text-sm ${
                    tier === id
                      ? "portal-panel--accent text-pure"
                      : "portal-panel--inset text-muted"
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
            <p className="text-xs leading-relaxed text-muted">
              {tier === "basica" ? t("hintBasica") : t("hintAsync")}
            </p>
          </fieldset>

          <PortalInput
            label={t("fieldWallet")}
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x…"
            required
            pattern="0x[a-fA-F0-9]{40}"
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
            fieldClassName="portal-field--mono"
          />

          {needsAsyncFields ? (
            <>
              <PortalInput
                label={t("fieldEmail")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
                autoComplete="email"
              />
              <PortalSelect
                label={t("fieldIdioma")}
                value={idioma}
                onChange={(e) => setIdioma(e.target.value as DemoIdioma)}
                disabled={busy}
              >
                <option value="es">{t("idioma.es")}</option>
                <option value="en">{t("idioma.en")}</option>
                <option value="pt">{t("idioma.pt")}</option>
              </PortalSelect>
            </>
          ) : null}

          <PortalButton
            type="submit"
            pending={busy}
            className="mt-1 w-full py-2.5 sm:w-auto"
          >
            {phase === "submitting"
              ? t("submitting")
              : phase === "polling"
                ? t("polling")
                : t("submit")}
          </PortalButton>
        </form>
      </PortalPanel>

      {phase === "submitting" ? (
        <PortalPanel
          variant="inset"
          className="p-5"
          padded={false}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <p className="portal-eyebrow">{t("waitingEyebrow")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("waitingBasica")}
          </p>
          <div className="portal-progress mt-4" aria-hidden />
        </PortalPanel>
      ) : null}

      {phase === "polling" && requestId ? (
        <PortalPanel
          variant="inset"
          className="p-5"
          padded={false}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <p className="portal-eyebrow">{t("pollingEyebrow")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pollingBody")}
          </p>
          <div className="portal-progress mt-4" aria-hidden />
          <p className="mt-4 break-all font-mono text-xs text-pure/80">
            {t("requestId")}: {requestId}
          </p>
          {pollStatus ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              {t("statusLabel")}:
              <StatusBadge status={pollStatus} size="sm" />
            </p>
          ) : null}
        </PortalPanel>
      ) : null}

      {phase === "timeout" && requestId ? (
        <PortalPanel
          variant="inset"
          className="p-5"
          padded={false}
          role="status"
        >
          <p className="text-sm leading-relaxed text-muted">
            {t("timeoutBody")}
          </p>
          <p className="mt-3 break-all font-mono text-xs text-pure/80">
            {t("requestId")}: {requestId}
          </p>
        </PortalPanel>
      ) : null}

      {phase === "error" ? (
        <PortalAlert>{mapError(errorKey ?? undefined)}</PortalAlert>
      ) : null}

      {phase === "done" && result ? <DemoResultPanel result={result} /> : null}
    </div>
  );
}
