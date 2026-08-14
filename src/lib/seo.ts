import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { routes, type AppRoute } from "@/lib/paths";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.walpulse.com"
).replace(/\/$/, "");

/** Indexable app paths (locale prefix added separately). */
export const INDEXABLE_PATHS: readonly AppRoute[] = [
  routes.home,
  routes.criptoExchangesInternacional,
  routes.criptoExchangesUruguay,
  routes.nosotros,
  routes.comoFunciona,
  routes.contacto,
  routes.ejemplo,
] as const;

const OG_LOCALE: Record<string, string> = {
  es: "es_UY",
  en: "en_US",
  pt: "pt_BR",
};

export function localizedPath(locale: string, path: string): string {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}

type PageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  siteName?: string;
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName = "Walpulse",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(locale, path);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? "es_UY",
      url,
      title,
      description,
      siteName,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Walpulse",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
