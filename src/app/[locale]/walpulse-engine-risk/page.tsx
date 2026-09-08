import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EngineRiskPage } from "@/components/engine-risk/EngineRiskPage";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.walpulseEngineRisk,
    title: t("engineRiskTitle"),
    description: t("engineRiskDescription"),
    siteName: t("siteName"),
  });
}

export default async function WalpulseEngineRiskRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EngineRiskPage locale={locale} />;
}
