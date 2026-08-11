"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { headerNavItems } from "@/lib/paths";
import { LanguageSwitcher } from "./LanguageSwitcher";

const hasHeaderNav = headerNavItems.length > 0;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        transparent
          ? "border-b border-transparent bg-void/10 backdrop-blur-[2px]"
          : "border-b border-glass/60 bg-void/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/logo/Logo-Mark.png"
            alt="Walpulse"
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-pure">
            Walpulse
          </span>
        </Link>

        {hasHeaderNav ? (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {headerNavItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm transition-colors duration-300 ${
                    active ? "text-primary" : "text-muted hover:text-pure"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          <LanguageSwitcher className={hasHeaderNav ? "hidden sm:inline-flex" : "inline-flex"} />
          {hasHeaderNav ? (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-glass/70 text-pure lg:hidden"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {hasHeaderNav && open ? (
        <div className="border-t border-glass bg-void/95 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {headerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-pure"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="mt-4 sm:hidden" />
        </div>
      ) : null}
    </header>
  );
}
