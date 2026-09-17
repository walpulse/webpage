import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoAnalisisForm } from "@/components/demo/DemoAnalisisForm";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.demo,
    title: t("demoTitle"),
    description: t("demoDescription"),
    siteName: t("siteName"),
  });
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");
  const tc = await getTranslations("common");

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__visual" aria-hidden>
          <Image
            src="/brand/demo/header-demo.png"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 899px) 100vw, 48vw"
            className="page-hero__image"
          />
        </div>
        <div className="page-hero__scrim" aria-hidden />
        <div className="page-hero__content">
          <div className="page-hero__copy">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary/90">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-pure md:text-5xl md:leading-[1.08]">
              {t("title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {t("intro")}
            </p>
          </div>
        </div>
      </section>

      <Section className="section-band-surface border-t border-glass/30">
        <div className="mx-auto max-w-2xl">
          <div className="contact-form-panel">
            <DemoAnalisisForm />
          </div>
          <p className="mt-8 text-xs leading-relaxed text-muted">
            {tc("disclaimerShort")}
          </p>
        </div>
      </Section>
    </>
  );
}
