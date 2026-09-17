import "server-only";
import { prisma } from "./prisma";

export type SiteMediaItem = { src: string; title: string };

/** Admin-managed media, grouped by type (ordered). */
export async function getSiteMedia(): Promise<{
  photos: SiteMediaItem[];
  videos: SiteMediaItem[];
}> {
  const rows = await prisma.mediaItem.findMany({ orderBy: { order: "asc" } });
  return {
    photos: rows.filter((r) => r.type === "photo").map((r) => ({ src: r.src, title: r.titleUz })),
    videos: rows.filter((r) => r.type === "video").map((r) => ({ src: r.src, title: r.titleUz })),
  };
}
