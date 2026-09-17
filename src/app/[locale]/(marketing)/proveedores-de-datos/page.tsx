import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DataProvidersPage } from "@/components/providers/DataProvidersPage";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.proveedoresDeDatos,
    title: t("proveedoresTitle"),
    description: t("proveedoresDescription"),
    siteName: t("siteName"),
  });
}

export default async function ProveedoresDeDatosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DataProvidersPage locale={locale} />;
}
