"use client";

import { useTranslations } from "next-intl";
import { isKnownStatus, isKnownTier } from "@/lib/portal/analisisLabels";

type Tone = "ok" | "warn" | "error" | "neutral";

/** Maps `analisis_requests.status` / `analisis_run_stages.status` to a badge tone. */
export function statusTone(status: string): Tone {
  switch (status) {
    case "succeeded":
    case "succeeded_with_warnings":
      return "ok";
    case "failed":
    case "packaging_failed":
      return "error";
    case "accepted":
    case "claimed":
    case "running":
    case "started":
      return "warn";
    default:
      return "neutral";
  }
}

export function StatusBadge({
  status,
  size,
}: {
  status: string;
  size?: "sm";
}) {
  const t = useTranslations("portal.analisis");
  const label = isKnownStatus(status) ? t(`statusLabels.${status}`) : status;

  return (
    <span
      className={`portal-badge portal-badge--${statusTone(status)}${size === "sm" ? " portal-badge--sm" : ""}`}
    >
      {label}
    </span>
  );
}

export function TierBadge({ tier, size }: { tier: string; size?: "sm" }) {
  const t = useTranslations("portal.analisis");
  const label = isKnownTier(tier) ? t(`tierLabels.${tier}`) : tier;

  return (
    <span
      className={`portal-badge portal-badge--info${size === "sm" ? " portal-badge--sm" : ""}`}
    >
      {label}
    </span>
  );
}
