import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortalAnalisisForm } from "@/components/portal/PortalAnalisisForm";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import type { DemoIdioma } from "@/lib/demoAnalisis";
import { getMiUsuario } from "@/lib/portal/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/paths";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.nuevoAnalisis" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardAnalisisNuevoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal.nuevoAnalisis" });
  const usuario = await getMiUsuario();

  if (!usuario) {
    redirect(`/${locale}${routes.login}`);
  }

  const defaultIdioma: DemoIdioma =
    locale === "en" || locale === "pt" ? locale : "es";

  return (
    <div className="mx-auto max-w-3xl">
      <PortalPageHeader title={t("title")} description={t("intro")} />
      <div className="mt-8">
        <PortalAnalisisForm
          defaultEmail={usuario.email}
          defaultIdioma={defaultIdioma}
        />
      </div>
    </div>
  );
}
