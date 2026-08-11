import { getTranslations } from "next-intl/server";

export async function HeroContent() {
  const t = await getTranslations("home");

  return (
    <div className="w-full max-w-lg text-left md:max-w-none">
      <h1 className="text-display-hero font-display font-semibold text-pure">
        {t("heroHeadline")}
      </h1>
      <p className="mt-7 max-w-md text-[1.05rem] leading-[1.7] text-muted md:text-lg md:leading-[1.75]">
        {t("heroSub")}
      </p>
      <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-muted/90">
        {t("heroPrinciple")}
      </p>
    </div>
  );
}
