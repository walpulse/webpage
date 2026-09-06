import Image from "next/image";
import {
  providersByRoleGroup,
  providersPageForLocale,
  roleForLocale,
} from "@/lib/dataProviders";

type Props = {
  locale: string;
};

export function DataProvidersGrid({ locale }: Props) {
  const copy = providersPageForLocale(locale);
  const groups = providersByRoleGroup();

  return (
    <div className="providers-grid-wrap">
      {groups.map(({ group, providers }) => {
        if (providers.length === 0) return null;
        const sharedRole = roleForLocale(providers[0], locale);
        return (
          <section key={group} className="providers-group">
            <div className="providers-group__head">
              <h2 className="providers-group__title">
                {copy.sectionTitles[group]}
              </h2>
              <p className="providers-group__role">
                <span className="providers-group__role-label">
                  {copy.roleLabel}
                </span>
                {sharedRole}
                {group === "catalogs" ? (
                  <span className="providers-group__extra">
                    {" "}
                    — {copy.catalogsExtra}
                  </span>
                ) : null}
              </p>
            </div>
            <ul className="providers-grid">
              {providers.map((provider) => (
                <li key={provider.id}>
                  <a
                    href={provider.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="providers-card"
                  >
                    <span
                      className={
                        provider.logoPlate === "dark"
                          ? "providers-card__logo providers-card__logo--dark"
                          : "providers-card__logo"
                      }
                      aria-hidden
                    >
                      <Image
                        src={provider.logoSrc}
                        alt=""
                        width={96}
                        height={96}
                        className="providers-card__img"
                        loading="lazy"
                        fetchPriority="low"
                        unoptimized
                      />
                    </span>
                    <span className="providers-card__name">{provider.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            {group === "ofac" ? (
              <p className="providers-ofac-note">{copy.disclaimer}</p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
