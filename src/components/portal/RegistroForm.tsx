"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useState } from "react";
import { Link } from "@/i18n/navigation";
import { portalErrorKey } from "@/lib/portal/errors";
import type { AcceptInvitacionResult } from "@/lib/portal/types";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { PortalAuthShell } from "./PortalAuthShell";

export function RegistroForm({ initialToken }: { initialToken: string }) {
  const t = useTranslations("portal");
  const te = useTranslations("portal.errors");
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);

    const trimmedToken = token.trim();
    if (trimmedToken.length < 16) {
      setErrorKey("missing_token");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorKey("password_mismatch");
      return;
    }
    if (password.length < 8) {
      setErrorKey("weak_password");
      return;
    }

    setPending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: nombre.trim() ? { full_name: nombre.trim() } : undefined,
          },
        });

      if (signUpError) {
        setErrorKey(portalErrorKey(signUpError.message));
        return;
      }

      // If email confirmation is ON, there may be no session yet.
      if (!signUpData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (signInError) {
          setErrorKey(
            portalErrorKey(
              signInError.message.includes("Email not confirmed")
                ? "email_not_confirmed"
                : signInError.message,
            ),
          );
          return;
        }
      }

      const { data, error: acceptError } = await supabase.rpc(
        "accept_usuario_invitacion",
        { p_token: trimmedToken },
      );

      if (acceptError) {
        setErrorKey(portalErrorKey(acceptError.message));
        return;
      }

      const result = data as AcceptInvitacionResult | null;
      if (!result?.usuario_id) {
        setErrorKey("accept_failed");
        return;
      }

      // Optional display name: Auth metadata only for now (perfil.nombre stays null unless we add RPC).
      router.replace(routes.dashboard);
      router.refresh();
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <PortalAuthShell
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PortalInput
          label={t("inviteToken")}
          type="text"
          required
          autoComplete="off"
          spellCheck={false}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t("inviteTokenPlaceholder")}
          fieldClassName="portal-field--mono"
        />
        <PortalInput
          label={t("email")}
          hint={t("emailMustMatch")}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PortalInput
          label={t("nombre")}
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
          {pending ? t("submitting") : t("registerSubmit")}
        </PortalButton>

        <p className="text-center text-xs text-muted">
          {t("alreadyRegistered")}{" "}
          <Link href={routes.login} className="text-primary hover:underline">
            {t("goLogin")}
          </Link>
        </p>
      </form>
    </PortalAuthShell>
  );
}
