import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { FaqSection } from "@/components/home/FaqSection";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return { title: t("title") };
}

export default async function FaqPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <Container className="pt-6">
          <nav
            className="flex flex-wrap items-center gap-2 font-body text-body-md"
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
        </Container>

        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
