import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortalKpis } from "@/components/portal/PortalKpis";
import { PortalKpisOperador } from "@/components/portal/PortalKpisOperador";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import {
  getKpisGlobales,
  getKpisPorCliente,
  getMisKpis,
} from "@/lib/portal/kpis";
import { getMiUsuario } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return {
    title: t("navHome"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal" });
  // El scope de KPIs depende del rol, así que el usuario se resuelve primero.
  const usuario = await getMiUsuario();
  const esOperador = Boolean(usuario?.es_operador_sistema);

  const ops = esOperador
    ? await Promise.all([getKpisGlobales(), getKpisPorCliente()])
    : null;
  const misKpis = esOperador ? null : await getMisKpis();

  const globales = ops?.[0] ?? null;
  const porCliente = ops?.[1] ?? null;
  const kpisErrorKey =
    (esOperador ? globales?.errorKey : misKpis?.errorKey) ?? "generic";

  return (
    <div className="mx-auto max-w-5xl">
      <PortalPageHeader
        eyebrow={t("portalLabel")}
        title={t("homeGreeting", {
          name: usuario?.nombre?.trim() || usuario?.email || "",
        })}
        description={t("homeIntro")}
      />

      {esOperador && globales?.result ? (
        <PortalKpisOperador
          globales={globales.result}
          porCliente={porCliente?.result ?? null}
        />
      ) : !esOperador && misKpis?.result ? (
        <PortalKpis data={misKpis.result} />
      ) : (
        <PortalAlert className="mt-8">{t(`errors.${kpisErrorKey}`)}</PortalAlert>
      )}
    </div>
  );
}
