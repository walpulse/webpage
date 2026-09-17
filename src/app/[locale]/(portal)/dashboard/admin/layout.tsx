import { setRequestLocale } from "next-intl/server";
import { requireOperadorSistema } from "@/lib/portal/session";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireOperadorSistema(locale);
  return children;
}
