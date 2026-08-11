import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CriptoExchangesContent } from "@/components/cripto-exchanges/CriptoExchangesContent";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.criptoExchanges,
    title: t("criptoExchangesTitle"),
    description: t("criptoExchangesDescription"),
    siteName: t("siteName"),
  });
}

export default async function CriptoExchangesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CriptoExchangesContent locale={locale} />;
}
