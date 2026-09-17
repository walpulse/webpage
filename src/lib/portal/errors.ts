/** Map Postgres P0001 / Auth messages to i18n keys under `portal.errors.*`. */
export function portalErrorKey(raw: string | null | undefined): string {
  const msg = (raw ?? "").trim().toLowerCase();

  const codes = [
    "invalid_email",
    "invalid_token",
    "not_authenticated",
    "invitacion_not_found",
    "invitacion_expired",
    "invitacion_revoked",
    "invitacion_already_accepted",
    "email_mismatch",
    "usuario_already_registered",
    "usuario_already_exists",
    "cliente_inactive_or_missing",
    "auth_email_missing",
    "no_portal_access",
    "usuario_inactive",
    "missing_token",
    "weak_password",
    "password_mismatch",
    "invalid_credentials",
    "email_not_confirmed",
    "signup_failed",
    "accept_failed",
    "recovery_failed",
    "recovery_session_invalid",
    "recovery_rate_limited",
    "rate_limited",
    "not_operador_sistema",
    "cliente_not_found",
    "cliente_inactive",
    "invalid_nombre",
    "es_operador_sistema_immutable",
    "pending_invitacion_exists",
    "api_key_not_found",
    "invalid_order_by",
    "invalid_order_dir",
    "invalid_tier",
    "invalid_status",
    "invalid_idioma",
    "analisis_not_found",
    "analisis_not_ready",
    "analisis_in_flight",
    "pdf_missing",
    "email_missing",
    "portal_dashboard_key_protected",
    "matriz_not_found",
    "matriz_slug_exists",
    "matriz_sin_vigente",
    "invalid_slug",
    "version_required",
    "version_not_found_or_not_borrador",
    "version_not_found",
    "version_not_publicado",
    "version_cliente_mismatch",
    "version_matriz_mismatch",
    "version_cannot_be_sandbox_and_produccion",
    "version_frozen",
    "version_obsoleta",
    "regla_not_found",
    "senal_not_found",
    "invalid_regla",
    "invalid_efecto",
    "puntos_exceden_100",
    "puntos_incompletos",
    "generic",
  ] as const;

  for (const code of codes) {
    if (msg === code || msg.includes(code)) return code;
  }

  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return "invalid_credentials";
  }
  if (msg.includes("email not confirmed")) return "email_not_confirmed";
  if (
    msg.includes("redirect") ||
    msg.includes("not allowed") ||
    msg.includes("redirect_uri")
  ) {
    return "recovery_failed";
  }
  if (
    msg.includes("rate limit") ||
    msg.includes("security purposes") ||
    msg.includes("only request this once") ||
    msg.includes("over_email_send_rate_limit") ||
    msg.includes("email rate limit")
  ) {
    return "rate_limited";
  }
  if (msg.includes("password") && !msg.includes("reset")) return "weak_password";

  return "generic";
}
