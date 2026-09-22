import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { getTerminosCopy } from "@/lib/terminosContent";
import { routes } from "@/lib/paths";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.terminos,
    title: t("terminosTitle"),
    description: t("terminosDescription"),
    siteName: t("siteName"),
  });
}

export default async function TerminosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getTerminosCopy(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const contactEmail = "carolina.rodriguez@walpulse.com";
  const url = absoluteUrl(locale, routes.terminos);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("terminosTitle"),
    description: t("terminosDescription"),
    url,
    inLanguage: locale,
    dateModified: "2026-09-18",
    isPartOf: { "@type": "WebSite", name: "Walpulse", url: "https://www.walpulse.com" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="section-band-void border-b border-glass/30">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {copy.lastUpdatedLabel}: {copy.lastUpdated}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl md:leading-[1.12]">
            {copy.title}
          </h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted md:text-[1.05rem]">
            {copy.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Section className="section-band-surface border-t border-glass/30">
        <div className="mx-auto max-w-3xl space-y-12">
          {copy.sections.map((section) => (
            <article key={section.id} id={`seccion-${section.id}`}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-pure md:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-4 text-base leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
              {section.subsections?.map((sub) => (
                <div key={sub.title} className="mt-5">
                  <h3 className="text-sm font-semibold text-pure">{sub.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">
                    {sub.body}
                  </p>
                </div>
              ))}
              {section.id === "10" ? (
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted">
                  <li>
                    {locale === "pt"
                      ? "E-mail: "
                      : locale === "en"
                        ? "Email: "
                        : "Correo electrónico: "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary-soft underline-offset-2 hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </li>
                  <li>
                    {locale === "pt"
                      ? "Formulário de contato: "
                      : locale === "en"
                        ? "Contact form: "
                        : "Formulario de contacto: "}
                    <Link
                      href={routes.contacto}
                      className="text-primary-soft underline-offset-2 hover:underline"
                    >
                      /{locale}
                      {routes.contacto}
                    </Link>
                  </li>
                </ul>
              ) : section.bullets ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
