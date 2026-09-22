import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GafiLatamExchangesPage } from "@/components/cripto-exchanges/GafiLatamExchangesPage";
import { routes } from "@/lib/paths";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.regulacionLatinoamericana,
    title: t("regulacionLatinoamericanaTitle"),
    description: t("regulacionLatinoamericanaDescription"),
    siteName: t("siteName"),
  });
}

export default async function RegulacionLatinoamericanaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = absoluteUrl(locale, routes.regulacionLatinoamericana);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("regulacionLatinoamericanaTitle"),
    description: t("regulacionLatinoamericanaDescription"),
    url,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Walpulse",
      url: "https://www.walpulse.com",
    },
    about: [
      { "@type": "Thing", name: "FATF" },
      { "@type": "Thing", name: "GAFILAT" },
      { "@type": "Thing", name: "Virtual asset service providers" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GafiLatamExchangesPage locale={locale} />
    </>
  );
}
