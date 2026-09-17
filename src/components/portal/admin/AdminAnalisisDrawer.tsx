"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AdminAnalisisDetail } from "@/components/portal/admin/AdminAnalisisDetail";
import { adminAnalisisPath } from "@/lib/paths";

export function AdminAnalisisDrawer({
  analisisId,
  onClose,
  onChanged,
}: {
  analisisId: string;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const t = useTranslations("portal.analisis");
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const frame = requestAnimationFrame(() => setShown(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t("detail.close")}
        onClick={onClose}
        className={`absolute inset-0 bg-void/70 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-200 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("detail.drawerLabel")}
        className={`portal-drawer relative flex h-full w-full flex-col overflow-y-auto overscroll-contain motion-safe:transition-transform motion-safe:duration-200 sm:max-w-3xl lg:max-w-4xl ${
          shown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="portal-topbar sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link
            href={adminAnalisisPath(analisisId)}
            className="portal-eyebrow--muted font-mono text-[10px] uppercase tracking-[0.14em] hover:text-primary"
          >
            {t("detail.openFullPage")}
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="portal-btn portal-btn--ghost portal-btn--sm"
          >
            {t("detail.close")}
          </button>
        </div>

        <div className="p-4 md:p-6">
          <AdminAnalisisDetail
            key={analisisId}
            analisisId={analisisId}
            variant="drawer"
            onChanged={onChanged}
          />
        </div>
      </div>
    </div>
  );
}
