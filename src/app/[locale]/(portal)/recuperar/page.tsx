import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RecuperarForm } from "@/components/portal/RecuperarForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("recoverTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function RecuperarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RecuperarForm />;
}
