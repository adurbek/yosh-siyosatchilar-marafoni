import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sectionBySlug, hasPhotos } from "@/lib/admin-content";
import { parseImages } from "@/lib/page-content";
import { DEFAULT_PAGE_IMAGES } from "@/lib/page-images";
import { updatePageContentAction } from "../../../actions";
import { ProgramScheduleEditor } from "@/components/admin/ProgramScheduleEditor";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

export default async function ContentEditorPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const section = sectionBySlug(slug);
  if (!section) notFound();

  const content = await prisma.pageContent.findUnique({ where: { slug } });
  const programDays =
    slug === "dastur"
      ? await prisma.programDay.findMany({
          orderBy: { order: "asc" },
          include: { sessions: { orderBy: { order: "asc" } } },
        })
      : null;

  // Photo list: the saved one, else the page defaults (shown until first save).
  const savedImages = parseImages(content?.images ?? null);
  const images = savedImages ?? DEFAULT_PAGE_IMAGES[slug] ?? [];
  const showPhotos = hasPhotos(slug);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">{section.label}</h1>
      <a
        href={section.route}
        target="_blank"
        rel="noreferrer"
        className="mb-6 inline-block text-sm text-primary-container hover:underline"
      >
        Saytdagi sahifani ochish ↗
      </a>

      <form
        action={updatePageContentAction}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="slug" value={slug} />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Sarlavha (UZ)</span>
            <input name="titleUz" defaultValue={content?.titleUz ?? ""} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Sarlavha (EN)</span>
            <input name="titleEn" defaultValue={content?.titleEn ?? ""} className={inputCls} />
          </label>
        </div>

        <p className="text-xs text-slate-400">
          Matn: har bir xatboshini bo‘sh qator bilan ajrating.
        </p>

        {(["Uz", "En"] as const).map((L) => (
          <label key={L} className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              Matn ({L.toUpperCase()})
            </span>
            <textarea
              name={`body${L}`}
              defaultValue={(content?.[`body${L}` as "bodyUz"] as string) ?? ""}
              rows={8}
              className={inputCls}
            />
          </label>
        ))}

        {showPhotos && (
          <div className="space-y-4 border-t border-slate-200 pt-5">
            <input type="hidden" name="imagesForm" value="1" />
            <div>
              <span className="block text-sm font-semibold text-slate-700">Rasmlar</span>
              <p className="mt-1 text-xs text-slate-400">
                Sahifadagi rasmlarni almashtirish, o‘chirish yoki yangisini qo‘shish mumkin.
                O‘zgarishlar pastdagi «Saqlash» tugmasi bilan saqlanadi.
                (JPG, PNG, WEBP, GIF, AVIF; har biri 8 MB gacha)
              </p>
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-slate-500">Hozircha rasm yo‘q.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {images.map((src, i) => (
                  <div key={`${i}-${src}`} className="space-y-2 rounded-lg border border-slate-200 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Rasm ${i + 1}`}
                      className="h-36 w-full rounded-md border border-slate-200 object-cover"
                    />
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-500">
                        {i + 1}-rasmni almashtirish
                      </span>
                      <input type="file" name={`replaceImage_${i}`} accept="image/*" className={inputCls} />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-red-700">
                      <input type="checkbox" name={`removeImage_${i}`} />
                      Bu rasmni o‘chirish
                    </label>
                  </div>
                ))}
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                Yangi rasm(lar) qo‘shish (bir nechtasini tanlash mumkin)
              </span>
              <input type="file" name="newImages" accept="image/*" multiple className={inputCls} />
            </label>

            {savedImages !== null && (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="resetImages" />
                Standart rasmlarga qaytarish
              </label>
            )}
          </div>
        )}

        <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
          Saqlash
        </button>
      </form>

      {programDays && <ProgramScheduleEditor days={programDays} />}
    </div>
  );
}
