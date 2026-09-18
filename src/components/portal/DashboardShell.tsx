"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/paths";
import type { MiUsuario } from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

type NavLabelKey =
  | "navHome"
  | "navNuevoAnalisis"
  | "navAnalisis"
  | "navMotorRiesgos"
  | "navRiesgoMatrices"
  | "navRiesgoSenales"
  | "navAdminClientes";

type NavItem = {
  href: string;
  labelKey: NavLabelKey;
  exact: boolean;
  /** Los sub-items del menú lateral van sin icono. */
  icon?: () => React.ReactNode;
  /** Sub-items del menú lateral; el padre queda como encabezado del grupo. */
  children?: NavItem[];
};

const baseNavItems: NavItem[] = [
  {
    href: routes.dashboard,
    labelKey: "navHome",
    exact: true,
    icon: HomeIcon,
  },
  {
    href: routes.dashboardAnalisisNuevo,
    labelKey: "navNuevoAnalisis",
    exact: true,
    icon: NuevoAnalisisIcon,
  },
  {
    href: routes.dashboardAnalisis,
    labelKey: "navAnalisis",
    exact: false,
    icon: AnalisisIcon,
  },
  {
    href: routes.dashboardMotorRiesgos,
    labelKey: "navMotorRiesgos",
    exact: false,
    icon: RiskIcon,
    children: [
      {
        href: routes.dashboardMotorRiesgos,
        labelKey: "navRiesgoMatrices",
        exact: false,
      },
      {
        href: routes.dashboardMotorRiesgosCatalogo,
        labelKey: "navRiesgoSenales",
        exact: true,
      },
    ],
  },
];

const adminNavItems: NavItem[] = [
  {
    href: routes.adminClientes,
    labelKey: "navAdminClientes",
    exact: false,
    icon: ClientsIcon,
  },
];

/** Items navegables en orden, con los hijos en lugar de su padre. */
function flattenNav(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => item.children ?? [item]);
}

function navActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  if (href === routes.dashboardAnalisis) {
    if (pathname === routes.dashboardAnalisisNuevo) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === routes.dashboardMotorRiesgos) {
    // El catálogo es hermano, no parte de Matrices.
    if (pathname === routes.dashboardMotorRiesgosCatalogo) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({
  usuario,
  children,
}: {
  usuario: MiUsuario;
  children: React.ReactNode;
}) {
  const t = useTranslations("portal");
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace(routes.login);
    router.refresh();
  }

  const displayName = usuario.nombre?.trim() || usuario.email;
  const rolLabel =
    usuario.rol === "member" ? t("rolLabels.member") : usuario.rol;
  const navItems = flattenNav(
    usuario.es_operador_sistema
      ? [...baseNavItems, ...adminNavItems]
      : baseNavItems,
  );
  const currentNavItem = navItems.find((item) =>
    navActive(pathname, item.href, item.exact),
  );

  const navGroups = (
    <>
      <NavGroup items={baseNavItems} pathname={pathname} t={t} />
      {usuario.es_operador_sistema ? (
        <>
          <p className="portal-eyebrow--muted mt-4 px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            Admin
          </p>
          <NavGroup items={adminNavItems} pathname={pathname} t={t} />
        </>
      ) : null}
    </>
  );

  return (
    <div className="flex min-h-full flex-1">
      {/* Alto de viewport y sticky: si no, el aside se estira con el contenido
          y el pie con el logout queda fuera de pantalla en las páginas largas. */}
      <aside className="portal-sidebar sticky top-0 hidden h-dvh w-60 shrink-0 flex-col md:flex">
        <div className="flex items-center gap-2.5 border-b border-glass/60 px-4 py-4">
          <Image
            src="/brand/logo/Logo-Mark.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-[0.95rem] font-semibold tracking-tight text-pure">
              Walpulse
            </p>
            <p className="portal-eyebrow--muted truncate font-mono text-[10px] uppercase tracking-[0.12em]">
              {t("portalLabel")}
            </p>
          </div>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
          aria-label={t("navLabel")}
        >
          {navGroups}
        </nav>

        <div className="border-t border-glass/60 p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="portal-nav-item w-full"
          >
            <LogoutIcon />
            {t("logout")}
          </button>
        </div>
      </aside>

      <div className="portal-atmosphere flex min-w-0 flex-1 flex-col">
        <header className="portal-topbar sticky top-0 z-20 flex h-14 items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate text-pure">
              {usuario.cliente_nombre}
            </span>
            {currentNavItem ? (
              <>
                <span className="hidden text-muted/50 md:block" aria-hidden>
                  ·
                </span>
                <span className="hidden truncate text-pure/70 md:block">
                  {t(currentNavItem.labelKey)}
                </span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <div className="min-w-0 text-right">
              <p className="truncate text-sm text-pure">{displayName}</p>
              <p className="truncate text-[11px] text-muted">{rolLabel}</p>
            </div>
          </div>
        </header>

        <nav
          className="portal-topbar sticky top-14 z-10 flex gap-1.5 overflow-x-auto px-3 py-2.5 md:hidden"
          aria-label={t("navLabel")}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`portal-tab shrink-0${
                navActive(pathname, item.href, item.exact) ? " is-active" : ""
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => void logout()}
            className="portal-tab shrink-0"
          >
            {t("logout")}
          </button>
        </nav>

        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

function groupChildActive(pathname: string, children: NavItem[]) {
  return children.some((child) =>
    navActive(pathname, child.href, child.exact),
  );
}

function NavGroup({
  items,
  pathname,
  t,
}: {
  items: NavItem[];
  pathname: string;
  t: (key: NavLabelKey) => string;
}) {
  return (
    <>
      {items.map((item) => {
        if (item.children) {
          return (
            <NavCollapsible
              key={item.href}
              item={item}
              pathname={pathname}
              t={t}
            />
          );
        }

        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`portal-nav-item${
              navActive(pathname, item.href, item.exact) ? " is-active" : ""
            }`}
          >
            {Icon ? <Icon /> : null}
            {t(item.labelKey)}
          </Link>
        );
      })}
    </>
  );
}

/**
 * Grupo con hijos: el padre es un toggle (no navega). Se abre solo si la
 * ruta actual cae en un hijo; el usuario puede cerrarlo/abrirlo a mano.
 */
function NavCollapsible({
  item,
  pathname,
  t,
}: {
  item: NavItem & { children: NavItem[] };
  pathname: string;
  t: (key: NavLabelKey) => string;
}) {
  const Icon = item.icon;
  const panelId = useId();
  const childActive = groupChildActive(pathname, item.children);
  const [open, setOpen] = useState(childActive);

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  return (
    <div className="portal-nav-group">
      <button
        type="button"
        className={`portal-nav-parent${childActive ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {Icon ? <Icon /> : null}
        <span className="min-w-0 flex-1 truncate text-left">
          {t(item.labelKey)}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        id={panelId}
        className={`portal-nav-sublist${open ? " is-open" : ""}`}
        hidden={!open}
      >
        {item.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={`portal-nav-item portal-nav-item--sub${
              navActive(pathname, child.href, child.exact) ? " is-active" : ""
            }`}
          >
            {t(child.labelKey)}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`portal-nav-chevron${open ? " is-open" : ""}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalisisIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 16V10M12 16V7M16 16v-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NuevoAnalisisIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2M15 12H4m0 0l3-3M4 12l3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
