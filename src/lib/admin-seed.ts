import "server-only";
import { prisma } from "./prisma";
import { ALL_SECTIONS } from "./admin-content";
import uz from "../../messages/uz.json";
import ru from "../../messages/ru.json";
import en from "../../messages/en.json";

type JsonFaq = { id: string; question: string; answer: string };

/**
 * Seed the FaqItem table from the existing message JSON the first time the
 * admin panel is opened, so the panel starts with the current content.
 */
export async function seedFaqIfEmpty() {
  const count = await prisma.faqItem.count();
  if (count > 0) return;

  const uzItems = (uz.Faq?.items ?? []) as JsonFaq[];
  const ruItems = (ru.Faq?.items ?? []) as JsonFaq[];
  const enItems = (en.Faq?.items ?? []) as JsonFaq[];

  if (uzItems.length === 0) return;

  await prisma.faqItem.createMany({
    data: uzItems.map((item, i) => ({
      order: i,
      questionUz: item.question,
      answerUz: item.answer,
      questionRu: ruItems[i]?.question ?? "",
      answerRu: ruItems[i]?.answer ?? "",
      questionEn: enItems[i]?.question ?? "",
      answerEn: enItems[i]?.answer ?? "",
    })),
  });
}

type AboutMenu = Record<string, string>;

/**
 * Seed the "Marafon haqida" dropdown items from the current menu structure the
 * first time the admin panel is opened.
 */
export async function seedAboutMenuIfEmpty() {
  const count = await prisma.aboutMenuItem.count();
  if (count > 0) return;

  const uzM = (uz.Nav?.aboutMenu ?? {}) as AboutMenu;
  const ruM = (ru.Nav?.aboutMenu ?? {}) as AboutMenu;
  const enM = (en.Nav?.aboutMenu ?? {}) as AboutMenu;

  const structure: { key: string; level: number; href: string }[] = [
    { key: "conference", level: 0, href: "/conference" },
    { key: "lowerHouse", level: 1, href: "/conference/lower-house" },
    { key: "parliamentYouth", level: 1, href: "/conference/parliament-youth" },
    { key: "infoNote", level: 1, href: "/conference/info-note" },
    { key: "commission", level: 0, href: "/conference/history" },
  ];

  await prisma.aboutMenuItem.createMany({
    data: structure
      .filter((s) => uzM[s.key])
      .map((s, i) => ({
        order: i,
        level: s.level,
        href: s.href,
        labelUz: uzM[s.key] ?? "",
        labelRu: ruM[s.key] ?? "",
        labelEn: enM[s.key] ?? "",
      })),
  });
}

/**
 * Seed editable page content for the "Marafon haqida" sections from the current
 * message-file text the first time the admin panel is opened.
 */
export async function seedPageContentIfEmpty() {
  const existing = await prisma.pageContent.findMany({ select: { slug: true } });
  const have = new Set(existing.map((r) => r.slug));

  const nsOf = (msgs: Record<string, unknown>, ns: string | null) =>
    (ns ? (msgs[ns] as Record<string, unknown>) : undefined) ?? {};
  const joinParas = (v: unknown) =>
    Array.isArray(v) ? (v as string[]).join("\n\n") : "";

  // Default manifesto text (currently hardcoded in the ManifestoScroll section).
  const MANIFIST_UZ = [
    "Yosh siyosatchilar marafoni — yoshlarni siyosiy hayotga jalb etish, ularning ovozini eshitish va real qarorlarga aylantirishga qaratilgan tashabbus.",
    "Marafon davomida ishtirokchilar g‘oyalarini taqdim etadi, ekspertlar bilan muhokama qiladi va o‘z hududlari uchun tashabbuslar ishlab chiqadi.",
    "“G‘oya Ber, Fikir Bildir” manifesti yoshlarning umumiy intilishlari va tashvishlarini aks ettiradi hamda kelajakni birgalikda qurish uchun qo‘llanma bo‘lib xizmat qiladi.",
    "Manifest adolat, tenglik hamda imkoniyat qadriyatlariga asoslanadi va butun mamlakat yoshlarining fikrini ifodalaydi.",
  ].join("\n\n");

  for (const s of ALL_SECTIONS) {
    if (have.has(s.slug)) continue;
    const u = nsOf(uz as Record<string, unknown>, s.ns);
    const r = nsOf(ru as Record<string, unknown>, s.ns);
    const e = nsOf(en as Record<string, unknown>, s.ns);

    const isManifist = s.slug === "manifist";
    await prisma.pageContent.create({
      data: {
        slug: s.slug,
        titleUz: (u.title as string) ?? (isManifist ? "Kelajakni Birgalikda Yarat" : s.label),
        titleRu: (r.title as string) ?? "",
        titleEn: (e.title as string) ?? "",
        bodyUz: isManifist ? MANIFIST_UZ : joinParas(u.paragraphs),
        bodyRu: joinParas(r.paragraphs),
        bodyEn: joinParas(e.paragraphs),
      },
    });
  }
}
