"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { hasPhotos } from "@/lib/admin-content";
import { parseImages } from "@/lib/page-content";
import { DEFAULT_PAGE_IMAGES } from "@/lib/page-images";
import {
  checkPassword,
  createSession,
  destroySession,
  updatePassword,
  isAuthenticated,
} from "@/lib/admin-auth";

async function assertAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* ── Auth ── */

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    return { error: "Parol noto‘g‘ri." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: unknown, formData: FormData) {
  await assertAuth();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!(await checkPassword(current))) return { error: "Joriy parol noto‘g‘ri." };
  if (next.length < 6) return { error: "Yangi parol kamida 6 belgidan iborat bo‘lsin." };
  if (next !== confirm) return { error: "Parollar mos kelmadi." };

  await updatePassword(next);
  return { ok: "Parol yangilandi." };
}

/* ── FAQ ── */

export async function createFaqAction(formData: FormData) {
  await assertAuth();
  const max = await prisma.faqItem.aggregate({ _max: { order: true } });
  await prisma.faqItem.create({
    data: {
      order: (max._max.order ?? -1) + 1,
      questionUz: String(formData.get("questionUz") ?? "").trim(),
      answerUz: String(formData.get("answerUz") ?? "").trim(),
      questionRu: String(formData.get("questionRu") ?? "").trim(),
      answerRu: String(formData.get("answerRu") ?? "").trim(),
      questionEn: String(formData.get("questionEn") ?? "").trim(),
      answerEn: String(formData.get("answerEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/faq");
  refreshPublic();
}

export async function updateFaqAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  await prisma.faqItem.update({
    where: { id },
    data: {
      questionUz: String(formData.get("questionUz") ?? "").trim(),
      answerUz: String(formData.get("answerUz") ?? "").trim(),
      questionRu: String(formData.get("questionRu") ?? "").trim(),
      answerRu: String(formData.get("answerRu") ?? "").trim(),
      questionEn: String(formData.get("questionEn") ?? "").trim(),
      answerEn: String(formData.get("answerEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/faq");
  refreshPublic();
}

export async function deleteFaqAction(formData: FormData) {
  await assertAuth();
  await prisma.faqItem.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/faq");
  refreshPublic();
}

/* ── Marafon haqida — page content ── */

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function updatePageContentAction(formData: FormData) {
  await assertAuth();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  const data: {
    titleUz: string; titleRu: string; titleEn: string;
    bodyUz: string; bodyRu: string; bodyEn: string;
    images?: string | null;
  } = {
    titleUz: String(formData.get("titleUz") ?? "").trim(),
    titleRu: String(formData.get("titleRu") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    bodyUz: String(formData.get("bodyUz") ?? ""),
    bodyRu: String(formData.get("bodyRu") ?? ""),
    bodyEn: String(formData.get("bodyEn") ?? ""),
  };

  // Photo list (sent only by sections that show photos). Starts from the
  // saved list (or the page defaults if never edited), then: removed rows are
  // dropped, rows with a chosen file are replaced, and newly added files are
  // appended. "resetImages" goes back to the page defaults.
  if (formData.get("imagesForm") === "1" && hasPhotos(slug)) {
    if (formData.get("resetImages") === "on") {
      data.images = null;
    } else {
      const existing = await prisma.pageContent.findUnique({
        where: { slug },
        select: { images: true },
      });
      const current = parseImages(existing?.images ?? null) ?? DEFAULT_PAGE_IMAGES[slug] ?? [];
      const next: string[] = [];
      for (let i = 0; i < current.length; i++) {
        if (formData.get(`removeImage_${i}`) === "on") continue;
        const replacement = formData.get(`replaceImage_${i}`);
        const saved = replacement instanceof File ? await saveImageUpload(replacement) : null;
        next.push(saved ?? current[i]);
      }
      for (const file of formData.getAll("newImages")) {
        if (!(file instanceof File)) continue;
        const saved = await saveImageUpload(file);
        if (saved) next.push(saved);
      }
      data.images = JSON.stringify(next);
    }
  }

  await prisma.pageContent.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
  revalidatePath(`/admin/content/${slug}`);
  refreshPublic();
}

/* ── Dastur (program schedule) ── */

export async function createProgramDayAction(formData: FormData) {
  await assertAuth();
  const max = await prisma.programDay.aggregate({ _max: { order: true } });
  await prisma.programDay.create({
    data: {
      order: (max._max.order ?? -1) + 1,
      day: String(formData.get("day") ?? "").trim(),
      monthUz: String(formData.get("monthUz") ?? "").trim(),
      monthRu: String(formData.get("monthRu") ?? "").trim(),
      monthEn: String(formData.get("monthEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function updateProgramDayAction(formData: FormData) {
  await assertAuth();
  await prisma.programDay.update({
    where: { id: String(formData.get("id") ?? "") },
    data: {
      day: String(formData.get("day") ?? "").trim(),
      monthUz: String(formData.get("monthUz") ?? "").trim(),
      monthRu: String(formData.get("monthRu") ?? "").trim(),
      monthEn: String(formData.get("monthEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function deleteProgramDayAction(formData: FormData) {
  await assertAuth();
  await prisma.programDay.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function moveProgramDayAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const days = await prisma.programDay.findMany({ orderBy: { order: "asc" } });
  const idx = days.findIndex((d) => d.id === id);
  if (idx === -1) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= days.length) return;
  await prisma.$transaction([
    prisma.programDay.update({ where: { id: days[idx].id }, data: { order: days[swapWith].order } }),
    prisma.programDay.update({ where: { id: days[swapWith].id }, data: { order: days[idx].order } }),
  ]);
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function createProgramSessionAction(formData: FormData) {
  await assertAuth();
  const dayId = String(formData.get("dayId") ?? "");
  const max = await prisma.programSession.aggregate({
    where: { dayId },
    _max: { order: true },
  });
  await prisma.programSession.create({
    data: {
      dayId,
      order: (max._max.order ?? -1) + 1,
      start: String(formData.get("start") ?? "").trim(),
      end: String(formData.get("end") ?? "").trim(),
      titleUz: String(formData.get("titleUz") ?? "").trim(),
      titleRu: String(formData.get("titleRu") ?? "").trim(),
      titleEn: String(formData.get("titleEn") ?? "").trim(),
      detailsUz: String(formData.get("detailsUz") ?? "").trim(),
      detailsRu: String(formData.get("detailsRu") ?? "").trim(),
      detailsEn: String(formData.get("detailsEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function updateProgramSessionAction(formData: FormData) {
  await assertAuth();
  await prisma.programSession.update({
    where: { id: String(formData.get("id") ?? "") },
    data: {
      start: String(formData.get("start") ?? "").trim(),
      end: String(formData.get("end") ?? "").trim(),
      titleUz: String(formData.get("titleUz") ?? "").trim(),
      titleRu: String(formData.get("titleRu") ?? "").trim(),
      titleEn: String(formData.get("titleEn") ?? "").trim(),
      detailsUz: String(formData.get("detailsUz") ?? "").trim(),
      detailsRu: String(formData.get("detailsRu") ?? "").trim(),
      detailsEn: String(formData.get("detailsEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function deleteProgramSessionAction(formData: FormData) {
  await assertAuth();
  await prisma.programSession.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

export async function moveProgramSessionAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const session = await prisma.programSession.findUnique({ where: { id } });
  if (!session) return;
  const siblings = await prisma.programSession.findMany({
    where: { dayId: session.dayId },
    orderBy: { order: "asc" },
  });
  const idx = siblings.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= siblings.length) return;
  await prisma.$transaction([
    prisma.programSession.update({ where: { id: siblings[idx].id }, data: { order: siblings[swapWith].order } }),
    prisma.programSession.update({ where: { id: siblings[swapWith].id }, data: { order: siblings[idx].order } }),
  ]);
  revalidatePath("/admin/content/dastur");
  refreshPublic();
}

/* ── Marafon haqida menu ── */

export async function createMenuItemAction(formData: FormData) {
  await assertAuth();
  const max = await prisma.aboutMenuItem.aggregate({ _max: { order: true } });
  await prisma.aboutMenuItem.create({
    data: {
      order: (max._max.order ?? -1) + 1,
      level: Number(formData.get("level") ?? 0) === 1 ? 1 : 0,
      href: String(formData.get("href") ?? "").trim(),
      labelUz: String(formData.get("labelUz") ?? "").trim(),
      labelRu: String(formData.get("labelRu") ?? "").trim(),
      labelEn: String(formData.get("labelEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/menu");
  refreshPublic();
}

export async function updateMenuItemAction(formData: FormData) {
  await assertAuth();
  await prisma.aboutMenuItem.update({
    where: { id: String(formData.get("id") ?? "") },
    data: {
      level: Number(formData.get("level") ?? 0) === 1 ? 1 : 0,
      href: String(formData.get("href") ?? "").trim(),
      labelUz: String(formData.get("labelUz") ?? "").trim(),
      labelRu: String(formData.get("labelRu") ?? "").trim(),
      labelEn: String(formData.get("labelEn") ?? "").trim(),
    },
  });
  revalidatePath("/admin/menu");
  refreshPublic();
}

export async function deleteMenuItemAction(formData: FormData) {
  await assertAuth();
  await prisma.aboutMenuItem.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/menu");
  refreshPublic();
}

export async function moveMenuItemAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const items = await prisma.aboutMenuItem.findMany({ orderBy: { order: "asc" } });
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= items.length) return;
  await prisma.$transaction([
    prisma.aboutMenuItem.update({ where: { id: items[idx].id }, data: { order: items[swapWith].order } }),
    prisma.aboutMenuItem.update({ where: { id: items[swapWith].id }, data: { order: items[idx].order } }),
  ]);
  revalidatePath("/admin/menu");
  refreshPublic();
}

/* ── Media ── */

async function saveUpload(file: File): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const ext = path.extname(file.name) || ".bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

/** Save an uploaded photo after checking type and size; null if rejected/empty. */
async function saveImageUpload(file: File): Promise<string | null> {
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) return null;
  const ext = path.extname(file.name).toLowerCase();
  if (!IMAGE_EXTS.has(ext) || !file.type.startsWith("image/")) return null;
  return saveUpload(file);
}

export async function createMediaAction(formData: FormData) {
  await assertAuth();
  const type = String(formData.get("type") ?? "photo");
  let src = String(formData.get("src") ?? "").trim();

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    src = await saveUpload(file);
  }
  if (!src) return;

  const max = await prisma.mediaItem.aggregate({ _max: { order: true } });
  await prisma.mediaItem.create({
    data: {
      type: type === "video" ? "video" : "photo",
      src,
      titleUz: String(formData.get("titleUz") ?? "").trim(),
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/admin/media");
  revalidatePath("/admin/home");
  refreshPublic();
}

export async function deleteMediaAction(formData: FormData) {
  await assertAuth();
  await prisma.mediaItem.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/media");
  revalidatePath("/admin/home");
  refreshPublic();
}

export async function updateMediaAction(formData: FormData) {
  await assertAuth();
  await prisma.mediaItem.update({
    where: { id: String(formData.get("id") ?? "") },
    data: { titleUz: String(formData.get("titleUz") ?? "").trim() },
  });
  revalidatePath("/admin/media");
  revalidatePath("/admin/home");
  refreshPublic();
}

/* ── Bosh sahifa (Hero) ── */

export async function updateHeroAction(formData: FormData) {
  await assertAuth();
  // The picker sends a local datetime ("YYYY-MM-DDTHH:MM"); store it as a full
  // ISO string in Tashkent time (+05:00) so the countdown is timezone-stable.
  const rawTarget = String(formData.get("countdownTarget") ?? "").trim();
  const countdownTarget = rawTarget ? `${rawTarget.slice(0, 16)}:00+05:00` : "";

  const data: {
    titleUz: string; titleRu: string; titleEn: string;
    descriptionUz: string; descriptionRu: string; descriptionEn: string;
    organizerUz: string; organizerRu: string; organizerEn: string;
    countdownTarget: string;
    image?: string;
  } = {
    titleUz: String(formData.get("titleUz") ?? "").trim(),
    titleRu: String(formData.get("titleRu") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    descriptionUz: String(formData.get("descriptionUz") ?? "").trim(),
    descriptionRu: String(formData.get("descriptionRu") ?? "").trim(),
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim(),
    organizerUz: String(formData.get("organizerUz") ?? "").trim(),
    organizerRu: String(formData.get("organizerRu") ?? "").trim(),
    organizerEn: String(formData.get("organizerEn") ?? "").trim(),
    countdownTarget,
  };

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    data.image = await saveUpload(file);
  }

  await prisma.heroContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidatePath("/admin/home");
  refreshPublic();
}
