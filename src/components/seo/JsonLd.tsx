import { CONTACT_EMAIL } from "@/lib/paths";
import { SITE_URL } from "@/lib/seo";

type Props = {
  locale: string;
};

export function SiteJsonLd({ locale }: Props) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Walpulse",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo/Logo-Mark.png`,
    email: CONTACT_EMAIL,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Walpulse",
    url: SITE_URL,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Walpulse",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
