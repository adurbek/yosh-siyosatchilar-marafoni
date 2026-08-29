import "server-only";
import { prisma } from "./prisma";

export type HeroContentRow = {
  image: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  organizerUz: string;
  organizerRu: string;
  organizerEn: string;
  countdownTarget: string;
};

/** The single admin-managed Hero row (id = 1), or null if never saved. */
export async function getHeroContent(): Promise<HeroContentRow | null> {
  return prisma.heroContent.findUnique({ where: { id: 1 } });
}

/** Pick the value for the active locale, falling back to Uzbek then to a default. */
export function pickLocale(
  locale: string,
  uz: string,
  ru: string,
  en: string,
): string {
  const v = locale === "ru" ? ru : locale === "en" ? en : uz;
  return v || uz;
}
