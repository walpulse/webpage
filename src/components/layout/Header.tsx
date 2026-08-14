"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  headerNavItems,
  type HeaderNavDropdown,
  type HeaderNavItem,
} from "@/lib/paths";
import { LanguageSwitcher } from "./LanguageSwitcher";

function navLinkClass(active: boolean) {
  return `rounded-md px-3 py-2 text-sm transition-colors duration-300 ${
    active ? "text-primary" : "text-muted hover:text-pure"
  }`;
}

function WhoUsesDropdown({
  item,
  pathname,
}: {
  item: HeaderNavDropdown;
  pathname: string;
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = pathname.startsWith("/cripto-exchanges");

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${navLinkClass(active)} inline-flex items-center gap-1`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {t(item.labelKey)}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-50 min-w-[19rem] pt-1"
        >
          <div className="rounded-lg border border-glass/70 bg-void/95 py-1 shadow-[0_16px_40px_color-mix(in_oklab,var(--void)_70%,transparent)] backdrop-blur-md">
            {item.children.map((child) => (
              <Link
                key={child.region}
                href={child.href}
                role="menuitem"
                className="block px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-pure"
                onClick={() => setOpen(false)}
              >
                {t(child.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavItems({
  pathname,
  onNavigate,
  mobile,
}: {
  pathname: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const t = useTranslations("nav");

  return (
    <>
      {headerNavItems.map((item: HeaderNavItem) => {
        if (item.type === "dropdown") {
          if (mobile) {
            return (
              <div key={item.labelKey} className="flex flex-col gap-0.5">
                <p className="px-3 pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted/80">
                  {t(item.labelKey)}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.region}
                    href={child.href}
                    className="rounded-md px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-pure"
                    onClick={onNavigate}
                  >
                    {t(child.labelKey)}
                  </Link>
                ))}
              </div>
            );
          }
          return (
            <WhoUsesDropdown
              key={item.labelKey}
              item={item}
              pathname={pathname}
            />
          );
        }

        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        if (mobile) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-pure"
              onClick={onNavigate}
            >
              {t(item.labelKey)}
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClass(active)}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const open = openPath === pathname;

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

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <NavItems pathname={pathname} />
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-glass/70 text-pure lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpenPath(open ? null : pathname)}
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
        </div>
      </div>

      {open ? (
        <div className="border-t border-glass bg-void/95 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            <NavItems
              pathname={pathname}
              mobile
              onNavigate={() => setOpenPath(null)}
            />
          </nav>
          <LanguageSwitcher className="mt-4 sm:hidden" />
        </div>
      ) : null}
    </header>
  );
}
