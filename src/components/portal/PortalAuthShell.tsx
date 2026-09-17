"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/paths";

export function PortalAuthShell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("portal");

  return (
    <div className="portal-atmosphere flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href={routes.home} className="mb-6 flex items-center gap-3">
            <Image
              src="/brand/logo/Logo-Mark.png"
              alt="Walpulse"
              width={64}
              height={64}
              className="h-16 w-16"
              priority
            />
            <span className="font-display text-2xl font-semibold tracking-tight text-pure">
              Walpulse
            </span>
          </Link>
          {title ? <h1 className="portal-page-title">{title}</h1> : null}
          {subtitle ? (
            <p
              className={
                title
                  ? "mt-2 text-sm leading-relaxed text-muted"
                  : "portal-section-title"
              }
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="portal-panel portal-panel--accent p-6">
          <span className="portal-panel__hairline" aria-hidden />
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href={routes.home} className="hover:text-primary">
            {t("backToSite")}
          </Link>
        </p>
      </div>
    </div>
  );
}
