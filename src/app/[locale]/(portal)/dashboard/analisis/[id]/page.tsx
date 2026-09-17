import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminAnalisisDetail } from "@/components/portal/admin/AdminAnalisisDetail";
import { getMiUsuario } from "@/lib/portal/session";
import { routes } from "@/lib/paths";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.analisis" });
  return {
    title: t("detail.title"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardAnalisisDetallePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const usuario = await getMiUsuario();

  if (!usuario?.es_operador_sistema) {
    redirect(`/${locale}${routes.dashboard}`);
  }

  return <AdminAnalisisDetail analisisId={id} />;
}
