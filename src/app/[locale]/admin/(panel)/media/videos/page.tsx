import { prisma } from "@/lib/prisma";
import { createMediaAction, deleteMediaAction } from "../../../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

export default async function AdminVideosPage() {
  const videos = await prisma.mediaItem.findMany({
    where: { type: "video" },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Videomaterial</h1>

      <form
        action={createMediaAction}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <input type="hidden" name="type" value="video" />
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-slate-500">Video havolasi (YouTube/MP4/URL)</span>
          <input name="src" required placeholder="https://…" className={inputCls} />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-slate-500">Sarlavha (ixtiyoriy)</span>
          <input name="titleUz" className={inputCls} />
        </label>
        <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
          Qo‘shish
        </button>
      </form>

      <div className="space-y-2">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{v.titleUz || "Video"}</div>
              <a href={v.src} target="_blank" rel="noreferrer" className="truncate text-xs text-primary-container hover:underline">
                {v.src}
              </a>
            </div>
            <form action={deleteMediaAction}>
              <input type="hidden" name="id" value={v.id} />
              <button className="rounded bg-red-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-700">
                O‘chirish
              </button>
            </form>
          </div>
        ))}
        {videos.length === 0 && <p className="text-sm text-slate-500">Video yo‘q.</p>}
      </div>
    </div>
  );
}
