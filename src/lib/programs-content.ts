import "server-only";
import { prisma } from "./prisma";
import { pickLocale } from "./hero-content";

export type ProgramSessionView = {
  title: string;
  start: string;
  end: string;
  details?: string;
};

export type ProgramDayView = {
  id: string;
  day: string;
  month: string;
  sessions: ProgramSessionView[];
};

/**
 * Admin-managed marathon schedule for the given locale, or null when no days
 * have been configured yet so the caller can fall back to its message-file
 * schedule.
 */
export async function getProgramDays(locale: string): Promise<ProgramDayView[] | null> {
  const days = await prisma.programDay.findMany({
    orderBy: { order: "asc" },
    include: { sessions: { orderBy: { order: "asc" } } },
  });
  if (days.length === 0) return null;

  return days.map((d) => ({
    id: d.id,
    day: d.day,
    month: pickLocale(locale, d.monthUz, d.monthRu, d.monthEn),
    sessions: d.sessions.map((s) => ({
      title: pickLocale(locale, s.titleUz, s.titleRu, s.titleEn),
      start: s.start,
      end: s.end,
      details: pickLocale(locale, s.detailsUz, s.detailsRu, s.detailsEn) || undefined,
    })),
  }));
}
