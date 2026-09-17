import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/portal/DashboardShell";
import { getMiUsuario, getSessionUser } from "@/lib/portal/session";
import { routes } from "@/lib/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { user } = await getSessionUser();
  if (!user) {
    redirect(`/${locale}${routes.login}`);
  }

  const usuario = await getMiUsuario();
  if (!usuario || !usuario.activado || !usuario.cliente_activado) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect(`/${locale}${routes.login}?error=no_portal_access`);
  }

  return <DashboardShell usuario={usuario}>{children}</DashboardShell>;
}
