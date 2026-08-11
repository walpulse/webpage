import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Deep-merge locale messages over Spanish fallback. */
function mergeMessages(fallback: Messages, override: Messages): Messages {
  const result: Messages = { ...fallback };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    if (isObject(current) && isObject(value)) {
      result[key] = mergeMessages(current, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const esMessages = (await import("../messages/es.json")).default as Messages;
  const localeMessages =
    locale === "es"
      ? esMessages
      : ((await import(`../messages/${locale}.json`)).default as Messages);

  return {
    locale,
    messages:
      locale === "es" ? esMessages : mergeMessages(esMessages, localeMessages),
  };
});
