import { prisma } from "@/lib/prisma";
import { createMediaAction, deleteMediaAction } from "../../../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0f2a56] focus:ring-2 focus:ring-[#0f2a56]/20";

export default async function AdminPhotosPage() {
  const photos = await prisma.mediaItem.findMany({
    where: { type: "photo" },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Fotomaterial</h1>

      <form
        action={createMediaAction}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <input type="hidden" name="type" value="photo" />
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-slate-500">Rasm fayli</span>
          <input type="file" name="file" accept="image/*" required className={inputCls} />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-slate-500">Sarlavha (ixtiyoriy)</span>
          <input name="titleUz" className={inputCls} />
        </label>
        <button className="rounded-lg bg-[#0f2a56] px-5 py-2 text-sm font-semibold text-white hover:bg-[#15376e]">
          Yuklash
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.titleUz} className="h-32 w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs text-slate-500">{p.titleUz || "—"}</span>
              <form action={deleteMediaAction}>
                <input type="hidden" name="id" value={p.id} />
                <button className="rounded bg-red-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-700">
                  O‘chirish
                </button>
              </form>
            </div>
          </div>
        ))}
        {photos.length === 0 && <p className="text-sm text-slate-500">Rasm yo‘q.</p>}
      </div>
    </div>
  );
}
