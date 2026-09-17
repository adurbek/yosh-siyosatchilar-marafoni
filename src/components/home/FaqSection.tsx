import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { FaqAccordion, type FaqEntry } from "./FaqAccordion";

type JsonFaq = { id: string; question: string; answer: string };

// Server component: FAQ content is managed from the admin panel (DB). If the
// database has no entries yet, it falls back to the message-file content.
export async function FaqSection() {
  const locale = await getLocale();
  const t = await getTranslations("Faq");

  const rows = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  let items: FaqEntry[];
  if (rows.length > 0) {
    const pick = (uz: string, ru: string, en: string) =>
      locale === "ru" ? ru || uz : locale === "en" ? en || uz : uz;
    items = rows.map((r) => ({
      id: r.id,
      question: pick(r.questionUz, r.questionRu, r.questionEn),
      answer: pick(r.answerUz, r.answerRu, r.answerEn),
    }));
  } else {
    items = (t.raw("items") as JsonFaq[]).map((it) => ({
      id: it.id,
      question: it.question,
      answer: it.answer,
    }));
  }

  return <FaqAccordion title={t("title")} items={items} />;
}
