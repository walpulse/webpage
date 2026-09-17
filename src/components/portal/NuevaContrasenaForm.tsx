"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { portalErrorKey } from "@/lib/portal/errors";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { PortalAuthShell } from "./PortalAuthShell";

export function NuevaContrasenaForm() {
  const t = useTranslations("portal");
  const te = useTranslations("portal.errors");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get("error") === "recovery_session_invalid" ||
          params.get("error") ||
          params.get("error_code")
        ) {
          if (!cancelled) {
            setErrorKey("recovery_session_invalid");
            setReady(false);
            setChecking(false);
          }
          return;
        }

        // Legacy: email still points directly here with ?code= — bounce to server callback
        const code = params.get("code");
        if (code) {
          const cleanNext = encodeURIComponent(window.location.pathname);
          window.location.replace(
            `/auth/callback?code=${encodeURIComponent(code)}&next=${cleanNext}`,
          );
          return;
        }

        const supabase = createSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (!cancelled) {
            setReady(true);
            setChecking(false);
          }
          return;
        }

        // Wait briefly for hash/implicit recovery or cookie propagation from callback
        await new Promise((r) => setTimeout(r, 400));
        const again = await supabase.auth.getSession();
        if (!cancelled) {
          if (again.data.session) {
            setReady(true);
          } else {
            setErrorKey("recovery_session_invalid");
            setReady(false);
          }
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          setErrorKey("recovery_session_invalid");
          setReady(false);
          setChecking(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);

    if (password.length < 8) {
      setErrorKey("weak_password");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorKey("password_mismatch");
      return;
    }

    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorKey(
          portalErrorKey(error.message) === "generic"
            ? "recovery_session_invalid"
            : portalErrorKey(error.message),
        );
        return;
      }

      await supabase.auth.signOut();
      router.replace(routes.login);
      router.refresh();
    } catch {
      setErrorKey("recovery_session_invalid");
    } finally {
      setPending(false);
    }
  }

  const displayError = errorKey ?? "recovery_session_invalid";

  return (
    <PortalAuthShell
      title={t("newPasswordTitle")}
      subtitle={t("newPasswordSubtitle")}
    >
      {checking ? (
        <div className="flex flex-col gap-2.5" aria-busy>
          <span className="portal-skeleton block h-9 w-full" />
          <span className="portal-skeleton block h-9 w-full" />
          <span className="portal-skeleton block h-9 w-2/3" />
        </div>
      ) : !ready ? (
        <div className="flex flex-col gap-4">
          <PortalAlert>
            {te(displayError as "recovery_session_invalid")}
          </PortalAlert>
          <p className="text-center text-xs text-muted">
            <Link
              href={routes.recuperar}
              className="text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
            {" · "}
            <Link href={routes.login} className="text-primary hover:underline">
              {t("goLogin")}
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <PortalInput
            label={t("password")}
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PortalInput
            label={t("passwordConfirm")}
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          {errorKey ? (
            <PortalAlert>{te(errorKey as "generic")}</PortalAlert>
          ) : null}

          <PortalButton type="submit" pending={pending} className="mt-1 py-2.5">
            {pending ? t("submitting") : t("newPasswordSubmit")}
          </PortalButton>
        </form>
      )}
    </PortalAuthShell>
  );
}
