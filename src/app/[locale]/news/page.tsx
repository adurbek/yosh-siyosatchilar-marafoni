import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "News" });
  return { title: t("title") };
}

export default async function NewsIndexPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("News");

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <Container className="pt-6 pb-8">
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 font-body text-body-md"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("breadcrumbHome")}
            </Link>
            <Icon
              name="chevron_right"
              className="text-base text-on-surface-variant/60"
            />
            <span className="text-primary">{t("title")}</span>
          </nav>

          <h1 className="font-display text-3xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
            {t("title")}
          </h1>
        </Container>
      </main>
      <Footer />
    </>
  );
}
