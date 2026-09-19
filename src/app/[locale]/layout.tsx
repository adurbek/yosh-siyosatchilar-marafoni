import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hanken_Grotesk, Inter, JetBrains_Mono, Roboto } from "next/font/google";
import { routing } from "@/i18n/routing";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import "../globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Content is DB-driven (admin-editable) and the shared Header/Footer query the
// database, so render at request time instead of prerendering at build. This
// keeps the build from needing a DB connection and always serves fresh content.
export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: {
      default: t("title"),
      template: `%s`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${hanken.variable} ${inter.variable} ${jetbrains.variable} ${roboto.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body antialiased">
        <NextIntlClientProvider>
          <LoadingScreen />
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
