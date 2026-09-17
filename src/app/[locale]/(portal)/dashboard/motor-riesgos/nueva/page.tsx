import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RiesgoMatrizCreateForm } from "@/components/portal/riesgo/RiesgoMatrizCreateForm";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { routes } from "@/lib/paths";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.riesgo" });
  return {
    title: t("nuevaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function NuevaMatrizPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal.riesgo" });

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href={routes.dashboardMotorRiesgos}
        className="text-sm text-muted hover:text-pure"
      >
        ← {t("volverMotor")}
      </Link>
      <PortalPageHeader
        className="mt-4"
        title={t("nuevaTitle")}
        description={t("nuevaIntro")}
      />
      <RiesgoMatrizCreateForm />
    </div>
  );
}
