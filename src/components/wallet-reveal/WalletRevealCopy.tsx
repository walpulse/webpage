"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { REVEAL_LEVELS, type RevealLevel } from "@/lib/walletReveal";
import { routes } from "@/lib/paths";

type Props = {
  level: RevealLevel;
};

export function WalletRevealCopy({ level }: Props) {
  const t = useTranslations("reveal");
  const common = useTranslations("common");

  return (
    <div className="wallet-reveal__copy">
      <div className="wallet-reveal__layers">
        {REVEAL_LEVELS.map((id) => {
          const active = id === level;
          const TitleTag = active ? "h1" : "p";
          return (
            <div
              key={id}
              className={`wallet-reveal__layer${active ? " is-active" : ""}`}
              aria-hidden={!active}
            >
              <p className="wallet-reveal__kicker">{t(`levels.${id}.kicker`)}</p>
              <TitleTag className="wallet-reveal__title">
                {t(`levels.${id}.title`)}
              </TitleTag>
              <p className="wallet-reveal__body">{t(`levels.${id}.body`)}</p>
            </div>
          );
        })}
      </div>

      <div className="wallet-reveal__footer">
        <p className="wallet-reveal__principle">{t("principle")}</p>
        <div className="wallet-reveal__cta">
          <Button href={routes.contacto} className="btn-premium">
            {common("talkToTeam")}
          </Button>
        </div>
      </div>
    </div>
  );
}
