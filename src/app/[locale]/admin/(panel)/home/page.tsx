import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import {
  updateHeroAction,
  createMediaAction,
  updateMediaAction,
  deleteMediaAction,
} from "../../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";
const labelCls = "mb-1 block text-xs font-medium text-slate-500";
const cardCls = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
const btnCls =
  "rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary";
const delBtnCls =
  "rounded bg-red-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-700";

/** Three-column (uz/ru/en) text row used across the Hero form. */
function LangRow({
  label,
  name,
  values,
  textarea = false,
}: {
  label: string;
  name: string;
  values: { uz: string; ru: string; en: string };
  textarea?: boolean;
}) {
  const langs = [
    { key: "Uz", tag: "O‘zbek", val: values.uz },
    { key: "En", tag: "Ingliz", val: values.en },
  ];
  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {langs.map((l) => (
          <label key={l.key}>
            <span className={labelCls}>{l.tag}</span>
            {textarea ? (
              <textarea name={`${name}${l.key}`} defaultValue={l.val} rows={3} className={inputCls} />
            ) : (
              <input name={`${name}${l.key}`} defaultValue={l.val} className={inputCls} />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default async function AdminHomePage() {
  // Message-file defaults per language, so the form is prefilled in uz/ru/en
  // and saving never regresses a translated Hero to the Uzbek text.
  const [tUz, tRu, tEn] = await Promise.all([
    getTranslations({ locale: "uz", namespace: "Hero" }),
    getTranslations({ locale: "ru", namespace: "Hero" }),
    getTranslations({ locale: "en", namespace: "Hero" }),
  ]);
  const hero = await prisma.heroContent.findUnique({ where: { id: 1 } });
  const [photos, videos] = await Promise.all([
    prisma.mediaItem.findMany({ where: { type: "photo" }, orderBy: { order: "asc" } }),
    prisma.mediaItem.findMany({ where: { type: "video" }, orderBy: { order: "asc" } }),
  ]);

  // Prefill the forms with the current effective text (DB value, else the
  // message-file default), so the admin edits real content.
  const currentImage = hero?.image || "/hero-majlis.jpg";
  // datetime-local wants "YYYY-MM-DDTHH:MM"; slice it off the stored ISO string.
  const countdownLocal = (hero?.countdownTarget || "2026-09-03T00:00:00+05:00").slice(0, 16);
  const title = {
    uz: hero?.titleUz || tUz("title"),
    ru: hero?.titleRu || tRu("title"),
    en: hero?.titleEn || tEn("title"),
  };
  const description = {
    uz: hero?.descriptionUz || tUz("description"),
    ru: hero?.descriptionRu || tRu("description"),
    en: hero?.descriptionEn || tEn("description"),
  };
  const organizer = {
    uz: hero?.organizerUz || tUz("organizer"),
    ru: hero?.organizerRu || tRu("organizer"),
    en: hero?.organizerEn || tEn("organizer"),
  };

  return (
    <div className="max-w-4xl space-y-10">
      <h1 className="text-2xl font-bold">Bosh sahifa</h1>

      {/* ===== Hero (rasm + matnlar) ===== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Hero bo‘limi</h2>
        <form action={updateHeroAction} className={`${cardCls} space-y-5`}>
          {/* Current image + upload */}
          <div className="flex flex-wrap items-start gap-5">
            <div>
              <span className={labelCls}>Joriy rasm</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt="Hero"
                className="h-28 w-48 rounded-lg border border-slate-200 object-cover"
              />
            </div>
            <label className="flex-1">
              <span className={labelCls}>Rasmni almashtirish (ixtiyoriy)</span>
              <input type="file" name="image" accept="image/*" className={inputCls} />
              <span className="mt-1 block text-xs text-slate-400">
                Yangi rasm tanlansa, joriy rasm o‘rniga qo‘yiladi.
              </span>
            </label>
          </div>

          {/* Soatni to‘g‘rilash — hisoblagich tugash sanasi va vaqti */}
          <label className="block max-w-xs">
            <span className={labelCls}>Soat (hisoblagich) sanasi va vaqti</span>
            <input
              type="datetime-local"
              name="countdownTarget"
              defaultValue={countdownLocal}
              className={inputCls}
            />
            <span className="mt-1 block text-xs text-slate-400">
              Toshkent vaqti (+05:00). Hero’dagi orqa hisob shu vaqtga qadar sanaydi.
            </span>
          </label>

          <LangRow label="Sarlavha" name="title" values={title} />
          <LangRow label="Tavsif (sarlavha ostidagi)" name="description" values={description} />
          <LangRow label="Tashkilotchi matni" name="organizer" values={organizer} textarea />

          <div>
            <button className={btnCls}>Saqlash</button>
          </div>
        </form>
      </section>

      {/* ===== Rasmlar ===== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Rasmlar (galereya)</h2>

        <form action={createMediaAction} className={`${cardCls} flex flex-wrap items-end gap-3`}>
          <input type="hidden" name="type" value="photo" />
          <label className="flex-1">
            <span className={labelCls}>Rasm fayli</span>
            <input type="file" name="file" accept="image/*" required className={inputCls} />
          </label>
          <label className="flex-1">
            <span className={labelCls}>Sarlavha (ixtiyoriy)</span>
            <input name="titleUz" className={inputCls} />
          </label>
          <button className={btnCls}>Yuklash</button>
        </form>

        {photos.length === 0 ? (
          <p className="text-sm text-slate-500">Rasm yo‘q.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.titleUz} className="h-32 w-full object-cover" />
                <div className="space-y-2 p-2">
                  <form action={updateMediaAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="titleUz" defaultValue={p.titleUz} placeholder="Sarlavha" className={inputCls} />
                    <button className="rounded bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800">
                      Saqlash
                    </button>
                  </form>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className={delBtnCls}>O‘chirish</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Videolar ===== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Videolar</h2>

        <form action={createMediaAction} className={`${cardCls} flex flex-wrap items-end gap-3`}>
          <input type="hidden" name="type" value="video" />
          <label className="flex-1">
            <span className={labelCls}>Video havolasi (YouTube/MP4/URL)</span>
            <input name="src" required placeholder="https://…" className={inputCls} />
          </label>
          <label className="flex-1">
            <span className={labelCls}>Sarlavha (ixtiyoriy)</span>
            <input name="titleUz" className={inputCls} />
          </label>
          <button className={btnCls}>Qo‘shish</button>
        </form>

        {videos.length === 0 ? (
          <p className="text-sm text-slate-500">Video yo‘q.</p>
        ) : (
          <div className="space-y-2">
            {videos.map((v) => (
              <div key={v.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <a href={v.src} target="_blank" rel="noreferrer" className="block truncate text-xs text-primary-container hover:underline">
                  {v.src}
                </a>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <form action={updateMediaAction} className="flex flex-1 items-center gap-2">
                    <input type="hidden" name="id" value={v.id} />
                    <input name="titleUz" defaultValue={v.titleUz} placeholder="Sarlavha" className={inputCls} />
                    <button className="rounded bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800">
                      Saqlash
                    </button>
                  </form>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className={delBtnCls}>O‘chirish</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
