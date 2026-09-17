import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegistroForm } from "@/components/portal/RegistroForm";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("registerTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function RegistroPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  return <RegistroForm initialToken={typeof token === "string" ? token : ""} />;
}
