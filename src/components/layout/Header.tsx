import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { HeaderClient, type AboutItem } from "./HeaderClient";

// Fallback structure used when the DB has no menu rows yet (labels from JSON).
const FALLBACK = [
  { key: "conference", level: 0, href: "/conference" },
  { key: "lowerHouse", level: 1, href: "/conference/lower-house" },
  { key: "parliamentYouth", level: 1, href: "/conference/parliament-youth" },
  { key: "infoNote", level: 1, href: "/conference/info-note" },
  { key: "commission", level: 0, href: "/conference/history" },
] as const;

// Server component: the "Marafon haqida" menu is managed from the admin panel
// (DB). Falls back to the message-file labels when no rows exist yet.
export async function Header() {
  const locale = await getLocale();
  const rows = await prisma.aboutMenuItem.findMany({ orderBy: { order: "asc" } });

  let aboutItems: AboutItem[];
  if (rows.length > 0) {
    const pick = (uz: string, ru: string, en: string) =>
      locale === "ru" ? ru || uz : locale === "en" ? en || uz : uz;
    aboutItems = rows.map((r) => ({
      id: r.id,
      href: r.href,
      level: r.level,
      label: pick(r.labelUz, r.labelRu, r.labelEn),
    }));
  } else {
    const t = await getTranslations("Nav");
    aboutItems = FALLBACK.map((f) => ({
      id: f.key,
      href: f.href,
      level: f.level,
      label: t(`aboutMenu.${f.key}` as "aboutMenu.conference"),
    }));
  }

  return <HeaderClient aboutItems={aboutItems} />;
}
