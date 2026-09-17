import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RiesgoMatrizDetail } from "@/components/portal/riesgo/RiesgoMatrizDetail";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalPageHeader } from "@/components/portal/ui/PortalPageHeader";
import { routes } from "@/lib/paths";
import {
  getMatriz,
  getMisMatrices,
  getReglas,
  getSenales,
} from "@/lib/portal/riesgo";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ v?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.riesgo" });
  return {
    title: t("matrizTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function MatrizDetallePage({
  params,
  searchParams,
}: Props) {
  const { locale, id } = await params;
  const { v } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal.riesgo" });
  const te = await getTranslations({ locale, namespace: "portal.errors" });

  // El listado llena el selector de destino para copiar una versión a otra matriz.
  const [matriz, matrices, senales] = await Promise.all([
    getMatriz(id),
    getMisMatrices(),
    getSenales(),
  ]);

  // La versión viaja por `version_num` (legible en la URL) y cae en la última.
  const versiones = [...(matriz.result?.matriz.versiones ?? [])].sort(
    (a, b) => b.version_num - a.version_num,
  );
  const pedida = Number(v);
  const seleccionada =
    versiones.find((version) => version.version_num === pedida) ??
    versiones[0] ??
    null;
  const reglas = seleccionada ? await getReglas(seleccionada.id) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={routes.dashboardMotorRiesgos}
        className="text-sm text-muted hover:text-pure"
      >
        ← {t("volverMotor")}
      </Link>

      {matriz.result ? (
        <>
          <PortalPageHeader
            className="mt-4"
            eyebrow={t("matrizTitle")}
            title={matriz.result.matriz.nombre}
            description={t("cicloHint")}
          />
          <RiesgoMatrizDetail
            data={matriz.result}
            matrices={matrices.result?.rows ?? []}
            senales={senales.result ?? []}
            versionSeleccionada={seleccionada}
            reglas={reglas?.result ?? []}
            reglasErrorKey={reglas?.errorKey ?? null}
          />
        </>
      ) : (
        <PortalAlert className="mt-6">
          {te((matriz.errorKey ?? "generic") as "generic")}
        </PortalAlert>
      )}
    </div>
  );
}
