import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "uz",
  // "uz" is served at the root without a prefix, "en" gets a prefix.
  localePrefix: "as-needed",
});
