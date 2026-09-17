"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { portalErrorKey } from "@/lib/portal/errors";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { PortalAuthShell } from "./PortalAuthShell";

const RECOVERY_NEXT_COOKIE = "walpulse_recovery_next";

function recoveryRedirectTo(): string {
  // Exact allowlist match — no query string (Supabase often rejects ?next=…).
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  return `${origin}/auth/callback`;
}

function setRecoveryNextCookie(path: string) {
  // Same-browser one-shot hint for /auth/callback after email click.
  const maxAge = 60 * 60; // 1h
  document.cookie = `${RECOVERY_NEXT_COOKIE}=${encodeURIComponent(path)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function RecuperarForm() {
  const t = useTranslations("portal");
  const te = useTranslations("portal.errors");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "recovery_session_invalid") {
      setErrorKey("recovery_session_invalid");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setErrorDetail(null);
    setPending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const nextPath = `/${locale}${routes.nuevaContrasena}`;
      setRecoveryNextCookie(nextPath);

      const redirectTo = recoveryRedirectTo();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo },
      );

      if (error) {
        const key = portalErrorKey(error.message);
        setErrorKey(key === "generic" ? "recovery_failed" : key);
        setErrorDetail(error.message);
        return;
      }

      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "recovery_failed";
      const key = portalErrorKey(message);
      setErrorKey(key === "generic" ? "recovery_failed" : key);
      setErrorDetail(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <PortalAuthShell
      title={t("recoverTitle")}
      subtitle={t("recoverSubtitle")}
    >
      {sent ? (
        <div className="flex flex-col gap-4">
          <PortalAlert variant="success">{t("recoverySent")}</PortalAlert>
          <p className="text-center text-xs text-muted">
            <Link href={routes.login} className="text-primary hover:underline">
              {t("goLogin")}
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <PortalInput
            label={t("email")}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errorKey ? (
            <PortalAlert>
              <p>{te(errorKey as "generic")}</p>
              {errorDetail ? (
                <p className="mt-1 text-xs opacity-80">{errorDetail}</p>
              ) : null}
            </PortalAlert>
          ) : null}

          <PortalButton type="submit" pending={pending} className="mt-1 py-2.5">
            {pending ? t("submitting") : t("recoverSubmit")}
          </PortalButton>

          <p className="text-center text-xs text-muted">
            <Link href={routes.login} className="text-primary hover:underline">
              {t("goLogin")}
            </Link>
          </p>
        </form>
      )}
    </PortalAuthShell>
  );
}
