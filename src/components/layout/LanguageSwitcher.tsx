"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const flagSrc: Record<AppLocale, string> = {
  es: "/brand/flags/es.svg",
  pt: "/brand/flags/pt.svg",
  en: "/brand/flags/en.svg",
};

const localeNames: Record<AppLocale, string> = {
  es: "Español",
  pt: "Português",
  en: "English",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-glass bg-surface/60 p-1 ${className}`}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`rounded-md p-1.5 transition-[box-shadow,opacity,background-color] ${
              active
                ? "bg-primary/15 ring-1 ring-primary/50"
                : "opacity-70 hover:opacity-100 hover:bg-glass/40"
            }`}
            aria-pressed={active}
            aria-label={localeNames[code]}
            title={localeNames[code]}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flagSrc[code]}
              alt=""
              width={22}
              height={15}
              className="h-[15px] w-[22px] rounded-[2px] object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}
