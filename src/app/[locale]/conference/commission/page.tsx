import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RelatedLinks } from "@/components/conference/RelatedLinks";
import { MemberCard } from "@/components/conference/MemberCard";

type Member = { name: string; role: string };

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Commission" });
  return { title: t("title") };
}

export default async function CommissionPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Commission");
  const members = t.raw("members") as Member[];

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Title band: breadcrumb + heading */}
        <Container className="pt-6 pb-8">
          <nav
            className="mb-6 flex flex-wrap items-center gap-2 font-body text-body-md"
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
            <Link
              href="/conference"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("breadcrumbAbout")}
            </Link>
            <Icon
              name="chevron_right"
              className="text-base text-on-surface-variant/60"
            />
            <span className="text-primary">{t("title")}</span>
          </nav>

          <h1 className="font-display text-2xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
            {t("title")}
          </h1>
        </Container>

        {/* Members: two-column grid of member rows */}
        <Container className="pb-12">
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {members.map((m, i) => (
              <MemberCard
                key={i}
                name={m.name}
                role={m.role}
                photo={`/commission/${i + 1}.jpg`}
              />
            ))}
          </div>
        </Container>

        <Container>
          <div className="border-t border-dashed border-outline-variant/60" />
        </Container>

        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
