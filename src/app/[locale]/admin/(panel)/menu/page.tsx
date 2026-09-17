import { prisma } from "@/lib/prisma";
import {
  createMenuItemAction,
  updateMenuItemAction,
  deleteMenuItemAction,
  moveMenuItemAction,
} from "../../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

function LevelSelect({ value }: { value?: number }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">Turi</span>
      <select name="level" defaultValue={String(value ?? 0)} className={inputCls}>
        <option value="0">Asosiy band (qalin)</option>
        <option value="1">Ichki band (chekintirilgan)</option>
      </select>
    </label>
  );
}

export default async function AdminMenuPage() {
  const items = await prisma.aboutMenuItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">Marafon haqida menyusi</h1>
      <p className="mb-6 text-sm text-slate-500">
        Dropdown bandlarini boshqaring. «Asosiy band» qalin va nuqta bilan, «Ichki band» chekintirilgan holda ko‘rinadi.
      </p>

      {/* Add new */}
      <form
        action={createMenuItemAction}
        className="mb-8 space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-primary-container">Yangi band</h2>
        <div className="grid grid-cols-2 gap-3">
          <LevelSelect />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Havola (href)</span>
            <input name="href" placeholder="/conference/..." className={inputCls} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Nomi (UZ)</span>
          <input name="labelUz" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Nomi (EN)</span>
          <input name="labelEn" className={inputCls} />
        </label>
        <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
          Qo‘shish
        </button>
      </form>

      {/* Existing */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${
              item.level === 1 ? "ml-6 border-l-4 border-l-primary-container/30" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">
                #{i + 1} · {item.level === 1 ? "ichki" : "asosiy"}
              </span>
              <div className="flex gap-1">
                <form action={moveMenuItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">↑</button>
                </form>
                <form action={moveMenuItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">↓</button>
                </form>
              </div>
            </div>

            <form action={updateMenuItemAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <div className="grid grid-cols-2 gap-3">
                <LevelSelect value={item.level} />
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Havola (href)</span>
                  <input name="href" defaultValue={item.href} className={inputCls} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Nomi (UZ)</span>
                <input name="labelUz" defaultValue={item.labelUz} required className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Nomi (EN)</span>
                <input name="labelEn" defaultValue={item.labelEn} className={inputCls} />
              </label>
              <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
                Saqlash
              </button>
            </form>
            <form action={deleteMenuItemAction} className="mt-3 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={item.id} />
              <button className="text-sm font-medium text-red-600 hover:text-red-700">O‘chirish</button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">Bandlar yo‘q.</p>}
      </div>
    </div>
  );
}
