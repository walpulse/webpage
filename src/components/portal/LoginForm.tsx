"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useState } from "react";
import { Link } from "@/i18n/navigation";
import { portalErrorKey } from "@/lib/portal/errors";
import type { MiUsuario } from "@/lib/portal/types";
import { routes } from "@/lib/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import { PortalInput } from "@/components/portal/ui/PortalField";
import { PortalAuthShell } from "./PortalAuthShell";

export function LoginForm() {
  const t = useTranslations("portal");
  const te = useTranslations("portal.errors");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setPending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setErrorKey(portalErrorKey(signInError.message));
        return;
      }

      const { data, error: rpcError } = await supabase.rpc("get_mi_usuario");
      if (rpcError) {
        await supabase.auth.signOut();
        setErrorKey(portalErrorKey(rpcError.message));
        return;
      }

      const perfil = data as MiUsuario | null;
      if (!perfil) {
        await supabase.auth.signOut();
        setErrorKey("no_portal_access");
        return;
      }
      if (!perfil.activado || !perfil.cliente_activado) {
        await supabase.auth.signOut();
        setErrorKey("usuario_inactive");
        return;
      }

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
    <PortalAuthShell subtitle={t("loginSubtitle")}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PortalInput
          label={t("email")}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PortalInput
          label={t("password")}
          type="password"
          required
          autoComplete="current-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorKey ? (
          <PortalAlert>{te(errorKey as "generic")}</PortalAlert>
        ) : null}

        <PortalButton type="submit" pending={pending} className="mt-1 py-2.5">
          {pending ? t("submitting") : t("loginSubmit")}
        </PortalButton>

        <div className="flex flex-col gap-2 text-center text-xs text-muted">
          <p>
            {t("haveInvite")}{" "}
            <Link
              href={routes.registro}
              className="text-primary hover:underline"
            >
              {t("goRegister")}
            </Link>
          </p>
          <p>
            <Link
              href={routes.recuperar}
              className="text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </p>
        </div>
      </form>
    </PortalAuthShell>
  );
}
