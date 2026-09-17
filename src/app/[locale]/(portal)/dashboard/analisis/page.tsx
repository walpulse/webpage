import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminAnalisisList } from "@/components/portal/admin/AdminAnalisisList";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { getMiUsuario } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("navAnalisis"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardAnalisisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal" });
  const usuario = await getMiUsuario();

  if (usuario?.es_operador_sistema) {
    return <AdminAnalisisList />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PortalPageHeader title={t("navAnalisis")} />
      <PortalPanel variant="inset" className="mt-6 py-6">
        <p className="text-sm leading-relaxed text-muted">
          {t("stubComingSoon")}
        </p>
      </PortalPanel>
    </div>
  );
}
