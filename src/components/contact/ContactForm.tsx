"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contacto");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          email,
          organizacion: org,
          mensaje: message,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setName("");
      setEmail("");
      setOrg("");
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-lg border border-glass bg-void/60 px-3.5 py-2.5 text-sm text-pure placeholder:text-muted/70 focus:border-primary focus:outline-none disabled:opacity-60";

  const busy = status === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-muted">{t("form.name")}</span>
        <input
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          disabled={busy}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-muted">{t("form.email")}</span>
        <input
          type="email"
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={busy}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-muted">{t("form.org")}</span>
        <input
          className={field}
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          autoComplete="organization"
          disabled={busy}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-muted">{t("form.message")}</span>
        <textarea
          className={`${field} min-h-32 resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={busy}
        />
      </label>
      <Button type="submit" className="btn-premium" disabled={busy}>
        {busy ? t("form.sending") : t("form.submit")}
      </Button>
      {status === "success" ? (
        <p className="text-sm text-primary-soft" role="status">
          {t("form.success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          {t("form.error")}
        </p>
      ) : null}
      {status === "idle" || status === "sending" ? (
        <p className="text-xs text-muted">{t("form.hint")}</p>
      ) : null}
    </form>
  );
}
