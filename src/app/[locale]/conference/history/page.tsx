import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticlePage } from "@/components/conference/ArticlePage";
import { getPageContent } from "@/lib/page-content";

const FALLBACK_TITLE = "Yoshlar parlamenti tarixi";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const managed = await getPageContent("history", locale);
  return { title: managed?.title ?? FALLBACK_TITLE };
}

export default async function HistoryPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("ParliamentYouth");

  const managed = await getPageContent("history", locale);
  const title = managed?.title ?? FALLBACK_TITLE;
  const paragraphs = managed?.paragraphs ?? [];

  return (
    <ArticlePage
      breadcrumb={{
        home: t("breadcrumbHome"),
        about: t("breadcrumbAbout"),
        current: title,
      }}
      title={title}
      paragraphs={paragraphs}
      images={[]}
    />
  );
}
