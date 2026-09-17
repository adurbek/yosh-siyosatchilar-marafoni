import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { MediaGalleryDb } from "@/components/media/MediaGalleryDb";
import { getSiteMedia } from "@/lib/site-media";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Media" });
  return { title: t("photoTitle") };
}

export default async function MediaPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await props.params;
  const { tab } = await props.searchParams;
  setRequestLocale(locale);

  const { photos, videos } = await getSiteMedia();

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <Container className="pt-6 pb-16">
          <MediaGalleryDb
            photos={photos}
            videos={videos}
            initialMode={tab === "video" ? "video" : "photo"}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
