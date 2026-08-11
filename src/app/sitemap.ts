import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  INDEXABLE_PATHS,
  absoluteUrl,
  languageAlternates,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of INDEXABLE_PATHS) {
    const languages = languageAlternates(path);
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
