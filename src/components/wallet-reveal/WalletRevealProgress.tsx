"use client";

import { useTranslations } from "next-intl";
import { REVEAL_LEVELS, type RevealLevel } from "@/lib/walletReveal";

type Props = {
  level: RevealLevel;
  onSelect: (level: RevealLevel) => void;
};

export function WalletRevealProgress({ level, onSelect }: Props) {
  const t = useTranslations("reveal");

  return (
    <ol className="wallet-reveal__dots" aria-label={t("progressLabel")}>
      {REVEAL_LEVELS.map((id) => {
        const current = id === level;
        const label =
          t(`levels.${id}.kicker`).trim() || t(`levels.${id}.title`);
        return (
          <li key={id}>
            <button
              type="button"
              className={`wallet-reveal__dot${current ? " is-active" : ""}`}
              aria-current={current ? "step" : undefined}
              aria-label={label}
              onClick={() => onSelect(id)}
            />
          </li>
        );
      })}
    </ol>
  );
}
