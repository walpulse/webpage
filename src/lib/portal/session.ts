import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MiUsuario } from "@/lib/portal/types";
import { redirect } from "next/navigation";
import { routes } from "@/lib/paths";

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getMiUsuario(): Promise<MiUsuario | null> {
  const { supabase, user } = await getSessionUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc("get_mi_usuario");
  if (error || data == null) return null;
  const row = data as MiUsuario;
  return {
    ...row,
    es_operador_sistema: Boolean(row.es_operador_sistema),
  };
}

/** Server-only: redirect non-operators away from admin console. */
export async function requireOperadorSistema(
  locale: string,
): Promise<MiUsuario> {
  const usuario = await getMiUsuario();
  if (!usuario?.es_operador_sistema) {
    redirect(`/${locale}${routes.dashboard}`);
  }
  return usuario;
}
