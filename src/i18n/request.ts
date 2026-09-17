import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Uzbek is the source of truth. Overlay the active locale's messages on top
  // of it so any namespace not yet translated (e.g. a long document page) falls
  // back to the Uzbek text instead of throwing a missing-message error.
  const uz = (await import(`../../messages/uz.json`)).default;
  const messages =
    locale === "uz"
      ? uz
      : { ...uz, ...(await import(`../../messages/${locale}.json`)).default };

  return { locale, messages };
});
