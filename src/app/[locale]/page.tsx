import { setRequestLocale } from "next-intl/server";
import { HomeCrawlContent } from "@/components/seo/HomeCrawlContent";
import { WalletReveal } from "@/components/wallet-reveal/WalletReveal";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HomeCrawlContent locale={locale} />
      <WalletReveal />
    </>
  );
}
