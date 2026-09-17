import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  IconMail,
  IconTelegram,
  IconX,
} from "@/components/contact/ContactChannelIcons";
import { ContactForm } from "@/components/contact/ContactForm";
import { Section } from "@/components/ui/Section";
import { CONTACT_CHANNELS, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const channelCopyByLocale: Record<
  string,
  {
    telegram: string;
    email: string;
    x: string;
    channelsLabel: string;
  }
> = {
  es: {
    telegram: "Telegram",
    email: "Correo",
    x: "X",
    channelsLabel: "Canales",
  },
  en: {
    telegram: "Telegram",
    email: "Email",
    x: "X",
    channelsLabel: "Channels",
  },
  pt: {
    telegram: "Telegram",
    email: "E-mail",
    x: "X",
    channelsLabel: "Canais",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: routes.contacto,
    title: t("contactoTitle"),
    description: t("contactoDescription"),
    siteName: t("siteName"),
  });
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");
  const tc = await getTranslations("common");
  const labels = channelCopyByLocale[locale] ?? channelCopyByLocale.es;

  const channels = [
    {
      key: "telegram",
      label: labels.telegram,
      value: CONTACT_CHANNELS.telegramHandle,
      href: CONTACT_CHANNELS.telegramUrl,
      Icon: IconTelegram,
    },
    {
      key: "email",
      label: labels.email,
      value: CONTACT_CHANNELS.email,
      href: `mailto:${CONTACT_CHANNELS.email}`,
      Icon: IconMail,
    },
    {
      key: "x",
      label: labels.x,
      value: CONTACT_CHANNELS.xHandle,
      href: CONTACT_CHANNELS.xUrl,
      Icon: IconX,
    },
  ] as const;

  return (
    <Section className="section-atmosphere relative overflow-hidden pt-20 md:pt-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <div className="mb-10 max-w-3xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">{t("intro")}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted">{t("earlyAccess")}</p>

          <div className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/90">
              {labels.channelsLabel}
            </p>
            <ul className="contact-channels mt-4">
              {channels.map(({ Icon, ...channel }) => (
                <li key={channel.key}>
                  <a
                    href={channel.href}
                    target={channel.key === "email" ? undefined : "_blank"}
                    rel={channel.key === "email" ? undefined : "noreferrer"}
                    className="contact-channel"
                  >
                    <span className="contact-channel__icon" aria-hidden>
                      <Icon />
                    </span>
                    <span className="contact-channel__text">
                      <span className="contact-channel__label">{channel.label}</span>
                      <span className="contact-channel__value">{channel.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted">
            {tc("disclaimerShort")}
          </p>
        </div>

        <div className="contact-form-panel">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
