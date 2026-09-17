import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RiesgoMatricesList } from "@/components/portal/riesgo/RiesgoMatricesList";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { PortalPanel } from "@/components/portal/ui/PortalPanel";
import { routes } from "@/lib/paths";
import { getMisMatrices } from "@/lib/portal/riesgo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("navRiesgoMatrices"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardMotorRiesgosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal" });
  const tr = await getTranslations({ locale, namespace: "portal.riesgo" });
  const te = await getTranslations({ locale, namespace: "portal.errors" });

  const matrices = await getMisMatrices();

  return (
    <div className="mx-auto max-w-5xl">
      <PortalPageHeader
        title={t("navRiesgoMatrices")}
        description={tr("intro")}
        actions={
          <Link
            href={routes.dashboardMotorRiesgosNueva}
            className="portal-btn portal-btn--primary"
          >
            {tr("nuevaMatriz")}
          </Link>
        }
      />

      <p className="mt-3 text-[11px] leading-snug text-muted/80">
        {tr("sinEvaluadorHint")}
      </p>

      <PortalPanel className="mt-4" hairline>
        {matrices.result ? (
          <RiesgoMatricesList data={matrices.result} />
        ) : (
          <PortalAlert>
            {te((matrices.errorKey ?? "generic") as "generic")}
          </PortalAlert>
        )}
      </PortalPanel>
    </div>
  );
}
