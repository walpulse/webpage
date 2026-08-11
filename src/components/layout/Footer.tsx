import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-glass bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo/Logo-Mark.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11"
            />
            <span className="font-display text-lg font-semibold text-pure">
              Walpulse
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <LanguageSwitcher />
          <p className="text-xs text-muted">
            © {year} {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
