import { portalErrorKey } from "@/lib/portal/errors";
import { getSessionUser } from "@/lib/portal/session";
import type {
  RiesgoMatricesResult,
  RiesgoMatrizResult,
  RiesgoRegla,
  Senal,
} from "@/lib/portal/types";

/**
 * Server-only: Motor de Riesgos del cliente de la sesión. El contrato de las
 * RPCs `portal_*` está en `docs/motor-riesgos-portal-rpcs.md`. Ante un error de
 * la base devuelven el `errorKey` traducible y la UI cae en su alerta.
 */

export async function getSenales(): Promise<{
  result: Senal[] | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("portal_list_senales");
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };

  const rows = (data as { rows?: Senal[] } | null)?.rows;
  return { result: rows ?? [], errorKey: null };
}

export async function getMisMatrices(): Promise<{
  result: RiesgoMatricesResult | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("portal_list_riesgo_matrices");
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };
  if (data == null) return { result: null, errorKey: "generic" };

  return { result: data as RiesgoMatricesResult, errorKey: null };
}

export async function getMatriz(matrizId: string): Promise<{
  result: RiesgoMatrizResult | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("portal_get_riesgo_matriz", {
    p_matriz_id: matrizId,
  });
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };
  if (data == null) return { result: null, errorKey: "matriz_not_found" };

  return { result: data as RiesgoMatrizResult, errorKey: null };
}

export async function getReglas(versionId: string): Promise<{
  result: RiesgoRegla[] | null;
  errorKey: string | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { result: null, errorKey: "not_authenticated" };

  const { data, error } = await supabase.rpc("portal_list_riesgo_reglas", {
    p_matriz_version_id: versionId,
  });
  if (error) return { result: null, errorKey: portalErrorKey(error.message) };

  const rows = (data as { rows?: RiesgoRegla[] } | null)?.rows;
  return { result: rows ?? [], errorKey: null };
}
