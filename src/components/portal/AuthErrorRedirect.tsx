"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/paths";

/**
 * When Supabase Auth fails a recovery/verify redirect, it often lands on Site URL
 * with ?error=&error_code= (e.g. otp_expired). Send the user to /recuperar.
 */
export function AuthErrorRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const error =
      params.get("error") ??
      params.get("error_code") ??
      hashParams.get("error") ??
      hashParams.get("error_code");

    if (!error) return;

    router.replace(`${routes.recuperar}?error=recovery_session_invalid`);
  }, [router]);

  return null;
}
