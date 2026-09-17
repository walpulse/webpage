import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnalisisCatalog } from "@/components/analisis/AnalisisCatalog";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.analisis,
    title: t("analisisTitle"),
    description: t("analisisDescription"),
    siteName: t("siteName"),
  });
}

export default async function AnalisisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AnalisisCatalog locale={locale} />;
}
