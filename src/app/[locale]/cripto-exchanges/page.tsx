import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { routes } from "@/lib/paths";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ region?: string }>;
};

export default async function CriptoExchangesIndexPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { region } = await searchParams;
  setRequestLocale(locale);

  if (region === "row") {
    redirect({ href: routes.criptoExchangesInternacional, locale });
  }

  redirect({ href: routes.criptoExchangesUruguay, locale });
}
