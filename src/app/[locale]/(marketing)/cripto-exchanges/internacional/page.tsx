import { permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routes } from "@/lib/paths";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Legacy URL — keep for SEO / bookmarks. */
export default async function CriptoExchangesInternacionalRedirect({
  params,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  permanentRedirect(`/${locale}${routes.regulacionLatinoamericana}`);
}
