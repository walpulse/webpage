import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  INDEXABLE_PATHS,
  absoluteUrl,
  languageAlternates,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const priorityFor = (path: string): number => {
    if (path === "/") return 1;
    if (
      path === "/analisis" ||
      path === "/demo" ||
      path === "/proveedores-de-datos"
    ) {
      return 0.85;
    }
    if (path === "/ejemplo") return 0.5;
    return 0.7;
  };

  for (const path of INDEXABLE_PATHS) {
    const languages = languageAlternates(path);
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: priorityFor(path),
        alternates: { languages },
      });
    }
  }

  return entries;
}
