import { portalErrorKey } from "@/lib/portal/errors";
import { getSessionUser } from "@/lib/portal/session";
import type {
  AdminClienteKpisResult,
  PortalKpiVentana,
  PortalKpisGlobalResult,
  PortalKpisResult,
  PortalKpisRow,
} from "@/lib/portal/types";

const VENTANAS: readonly PortalKpiVentana[] = ["7d", "30d", "total"];

export type PortalKpisPorCliente = {
  refrescado_at: string | null;
  porVentana: Record<PortalKpiVentana, PortalKpisRow[]>;
};

/**
 * Server-only: KPIs del cliente logueado desde `walpulse.mv_cliente_analisis_kpis`.
 * Sin `p_ventana` la RPC devuelve las tres ventanas (7d / 30d / total) en una llamada.
 */
export async function getMisKpis(): Promise<{
  result: PortalKpisResult | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("portal_get_mis_kpis");
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };
  if (data == null) return { result: null, errorKey: "generic" };

  return { result: data as PortalKpisResult, errorKey: null };
}

/**
 * Server-only, solo operadores: KPIs de plataforma desde
 * `walpulse.mv_analisis_kpis_globales`. Sin `p_ventana` devuelve las tres ventanas.
 */
export async function getKpisGlobales(): Promise<{
  result: PortalKpisGlobalResult | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("admin_get_kpis_globales");
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };
  if (data == null) return { result: null, errorKey: "generic" };

  return { result: data as PortalKpisGlobalResult, errorKey: null };
}

/**
 * Server-only, solo operadores: desglose por cliente. `admin_list_cliente_kpis`
 * devuelve una sola ventana por llamada, así que se piden las tres en paralelo
 * para que el selector de ventana quede en estado local y comparta snapshot
 * con los totales.
 */
export async function getKpisPorCliente(): Promise<{
  result: PortalKpisPorCliente | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const responses = await Promise.all(
    VENTANAS.map((ventana) =>
      supabase.rpc("admin_list_cliente_kpis", { p_ventana: ventana }),
    ),
  );

  const failed = responses.find((response) => response.error);
  if (failed?.error) {
    return { result: null, errorKey: portalErrorKey(failed.error.message) };
  }

  const porVentana = {} as Record<PortalKpiVentana, PortalKpisRow[]>;
  let refrescadoAt: string | null = null;

  VENTANAS.forEach((ventana, index) => {
    const payload = responses[index].data as AdminClienteKpisResult | null;
    porVentana[ventana] = payload?.rows ?? [];
    refrescadoAt = refrescadoAt ?? payload?.refrescado_at ?? null;
  });

  return { result: { refrescado_at: refrescadoAt, porVentana }, errorKey: null };
}
