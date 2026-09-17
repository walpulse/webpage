import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminClienteCreateForm } from "@/components/portal/admin/AdminClientesList";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.admin" });
  return {
    title: t("nuevoTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminClienteNuevoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminClienteCreateForm />;
}
