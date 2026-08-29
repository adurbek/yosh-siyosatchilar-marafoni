"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
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

export async function updatePageContentAction(formData: FormData) {
  await assertAuth();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  const data = {
    titleUz: String(formData.get("titleUz") ?? "").trim(),
    titleRu: String(formData.get("titleRu") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    bodyUz: String(formData.get("bodyUz") ?? ""),
    bodyRu: String(formData.get("bodyRu") ?? ""),
    bodyEn: String(formData.get("bodyEn") ?? ""),
  };
  await prisma.pageContent.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
  revalidatePath(`/admin/content/${slug}`);
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
