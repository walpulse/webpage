import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NuevaContrasenaForm } from "@/components/portal/NuevaContrasenaForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("newPasswordTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function NuevaContrasenaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NuevaContrasenaForm />;
}
