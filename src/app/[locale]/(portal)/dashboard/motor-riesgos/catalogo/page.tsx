import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SenalesCatalogo } from "@/components/portal/riesgo/SenalesCatalogo";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { getSenales } from "@/lib/portal/riesgo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("navRiesgoSenales"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardSenalesCatalogoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal" });
  const tr = await getTranslations({ locale, namespace: "portal.riesgo" });
  const te = await getTranslations({ locale, namespace: "portal.errors" });

  const senales = await getSenales();

  return (
    <div className="mx-auto max-w-5xl">
      <PortalPageHeader
        title={t("navRiesgoSenales")}
        description={tr("catalogoIntro")}
      />

      <PortalPanel className="mt-4" hairline>
        {senales.result ? (
          <SenalesCatalogo senales={senales.result} />
        ) : (
          <PortalAlert>
            {te((senales.errorKey ?? "generic") as "generic")}
          </PortalAlert>
        )}
      </PortalPanel>
    </div>
  );
}
