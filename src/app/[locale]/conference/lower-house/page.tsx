import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticlePage } from "@/components/conference/ArticlePage";

const IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q",
];

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

  return (
    <ArticlePage
      breadcrumb={{
        home: t("breadcrumbHome"),
        about: t("breadcrumbAbout"),
        current: t("title"),
      }}
      title={t("title")}
      paragraphs={t.raw("paragraphs") as string[]}
      images={IMAGES}
    />
  );
}
