import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticlePage } from "@/components/conference/ArticlePage";
import { getPageContent } from "@/lib/page-content";
import { resolvePageImages } from "@/lib/page-images";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "LowerHouse" });
  return { title: t("title") };
}

export default async function LowerHousePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("LowerHouse");

  // Admin-managed content overrides the message-file text when present.
  const managed = await getPageContent("lower-house", locale);
  const title = managed?.title ?? t("title");
  const paragraphs = managed?.paragraphs ?? (t.raw("paragraphs") as string[]);

  return (
    <ArticlePage
      breadcrumb={{
        home: t("breadcrumbHome"),
        about: t("breadcrumbAbout"),
        current: title,
      }}
      title={title}
      paragraphs={paragraphs}
      images={resolvePageImages("lower-house", managed?.images)}
    />
  );
}
