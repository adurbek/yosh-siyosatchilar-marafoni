import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { MediaSection } from "@/components/home/MediaSection";
import { FaqSection } from "@/components/home/FaqSection";
import { getSiteMedia } from "@/lib/site-media";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { photos, videos } = await getSiteMedia();

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <ManifestoSection />
        <FaqSection />
        <MediaSection
          photos={photos.length ? photos.map((p) => p.src) : undefined}
          featureVideo={videos[0]?.src}
        />
      </main>
      <Footer />
    </>
  );
}
