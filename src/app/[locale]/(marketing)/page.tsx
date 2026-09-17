import { setRequestLocale } from "next-intl/server";
import { AuthErrorRedirect } from "@/components/portal/AuthErrorRedirect";
import { HomeCrawlContent } from "@/components/seo/HomeCrawlContent";
import { WalletReveal } from "@/components/wallet-reveal/WalletReveal";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AuthErrorRedirect />
      <HomeCrawlContent locale={locale} />
      <WalletReveal />
    </>
  );
}
