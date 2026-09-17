import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function PartnersSection() {
  const t = await getTranslations("Nav");

  // Organiser / partner logos, shown side by side on a single row. Each logo
  // sets its own height so wide/landscape marks (e.g. KAS) don't dominate.
  const logos = [
    { src: "/logo-marafon-navy.png", alt: t("logoAlt"), width: 905, height: 393, size: "h-20 md:h-28" },
    { src: "/logo-yoshlar-parlamenti.png", alt: t("logoYouthParliament"), width: 1492, height: 875, size: "h-20 md:h-28" },
    { src: "/logo-kas.png", alt: "Konrad Adenauer Stiftung", width: 1741, height: 531, size: "h-14 md:h-20" },
  ] as const;

  return (
    <section className="mt-16 w-full py-14">
      <Container className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`${logo.size} w-auto object-contain`}
          />
        ))}
      </Container>
    </section>
  );
}
