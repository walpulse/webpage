import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminClienteDetail } from "@/components/portal/admin/AdminClienteDetail";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.admin" });
  return {
    title: t("detalleTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminClienteDetallePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminClienteDetail clienteId={id} />;
}
