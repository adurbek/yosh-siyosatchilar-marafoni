import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RegistrationForm } from "@/components/register/RegistrationForm";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Register" });
  return { title: t("title") };
}

export default async function RegisterPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Register");

  return (
    <>
      <Header />
      <main className="flex-grow bg-[#eaf3fb]">
        {/* Breadcrumb */}
        <Container className="py-6">
          <nav className="flex items-center gap-2 font-body text-body-md" aria-label="Breadcrumb">
            <Link href="/" className="text-on-surface-variant transition-colors hover:text-primary">
              {t("breadcrumbHome")}
            </Link>
            <Icon name="chevron_right" className="text-base text-on-surface-variant/60" />
            <span className="text-primary">{t("title")}</span>
          </nav>
        </Container>

        {/* Form */}
        <Container className="pb-section-gap">
          <div className="rounded-lg bg-white/60 p-6 shadow-sm md:p-10">
            <RegistrationForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
