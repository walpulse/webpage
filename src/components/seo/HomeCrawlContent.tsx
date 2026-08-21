import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { certsByLocale, signalKeys } from "@/lib/signalCerts";
import { routes } from "@/lib/paths";

type Props = {
  locale: string;
};

export async function HomeCrawlContent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const common = await getTranslations({ locale, namespace: "common" });
  const reveal = await getTranslations({ locale, namespace: "reveal" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const copy = certsByLocale[locale] ?? certsByLocale.es;

  const signalsList = (
    <ul>
      {signalKeys.map((key) => {
        const cert = copy.certs[key];
        return (
          <li key={key}>
            <strong>{cert.name}</strong> — {cert.summary}
          </li>
        );
      })}
    </ul>
  );

  const links = (
    <nav aria-label={t("siteName")}>
      <ul>
        <li>
          <Link href={routes.analisis}>{nav("analisis")}</Link>
        </li>
        <li>
          <Link href={routes.criptoExchangesUruguay}>
            {nav("cryptoExchangesPsav")}
          </Link>
        </li>
        <li>
          <Link href={routes.criptoExchangesInternacional}>
            {nav("cryptoExchanges")}
          </Link>
        </li>
        <li>
          <Link href={routes.nosotros}>{nav("nosotros")}</Link>
        </li>
        <li>
          <Link href={routes.comoFunciona}>{nav("comoFunciona")}</Link>
        </li>
        <li>
          <Link href={routes.ejemplo}>{t("ejemploTitle")}</Link>
        </li>
        <li>
          <Link href={routes.contacto}>{nav("earlyAccess")}</Link>
        </li>
      </ul>
    </nav>
  );

  const article = (
    <>
      <h1>{reveal("levels.0.title")}</h1>
      <p>{t("homeDescription")}</p>
      <p>{reveal("principle")}</p>
      <p>{common("principle")}</p>
      <p>{common("disclaimerShort")}</p>
      <h2>{reveal("intro.title")}</h2>
      <p>{reveal("intro.body")}</p>
      <h2>{copy.analyzesTitle}</h2>
      {signalsList}
      {links}
    </>
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Walpulse wallet analysis — signal parts",
    description: t("homeDescription"),
    numberOfItems: signalKeys.length,
    itemListElement: signalKeys.map((key, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: copy.certs[key].name,
      description: copy.certs[key].summary,
    })),
  };

  return (
    <>
      <section className="sr-only" aria-label={t("siteName")}>
        {article}
      </section>

      <noscript>
        <section>{article}</section>
      </noscript>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
