import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ProgramsSchedule } from "@/components/programs/ProgramsSchedule";
import { getPageContent } from "@/lib/page-content";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Programs" });
  return { title: t("title") };
}

export default async function ProgramsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Programs");

  const managed = await getPageContent("dastur", locale);
  const title = managed?.title ?? t("title");
  const intro = managed?.paragraphs ?? null;

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Title band: breadcrumb + centered heading */}
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
            <span className="text-primary">{title}</span>
          </nav>

          <h1 className="text-center font-display text-3xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
            {title}
          </h1>

          {intro && (
            <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center font-body text-body-md leading-relaxed text-on-surface-variant">
              {intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </Container>

        <Container className="pb-16">
          <ProgramsSchedule />
        </Container>
      </main>
      <Footer />
    </>
  );
}
