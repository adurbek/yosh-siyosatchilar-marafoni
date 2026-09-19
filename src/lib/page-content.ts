import "server-only";
import { prisma } from "./prisma";

/** Decode the stored photo list; null when the page was never given one. */
export function parseImages(raw: string | null): string[] | null {
  if (raw === null) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x !== "") : null;
  } catch {
    return null;
  }
}

/**
 * Resolve admin-managed content for a section in the given locale.
 * Returns null when there is no row or no meaningful content, so callers can
 * fall back to their message-file text.
 */
export async function getPageContent(slug: string, locale: string) {
  const c = await prisma.pageContent.findUnique({ where: { slug } });
  if (!c) return null;

  // Locale-strict: for English we return the English column as-is (no Uzbek
  // fallback), so an empty English value yields null and the caller falls back
  // to its own English default (message file / component default) instead of
  // leaking Uzbek onto the English site.
  const pick = (uz: string, en: string) => (locale === "en" ? en : uz);

  const title = pick(c.titleUz, c.titleEn).trim();
  const body = pick(c.bodyUz, c.bodyEn);
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    title: title || null,
    paragraphs: paragraphs.length > 0 ? paragraphs : null,
    // Photo list is language-independent; null = never edited (defaults apply).
    images: parseImages(c.images),
  };
}
