import { prisma } from "@/lib/prisma";
import { createFaqAction, updateFaqAction, deleteFaqAction } from "../../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0f2a56] focus:ring-2 focus:ring-[#0f2a56]/20";

function Field({
  label,
  name,
  defaultValue = "",
  textarea = false,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} required={required} rows={2} className={inputCls} />
      ) : (
        <input name={name} defaultValue={defaultValue} required={required} className={inputCls} />
      )}
    </label>
  );
}

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">FAQ savollari</h1>

      {/* Add new */}
      <form
        action={createFaqAction}
        className="mb-8 space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-[#0f2a56]">Yangi savol qo‘shish</h2>
        <Field label="Savol (UZ)" name="questionUz" required />
        <Field label="Javob (UZ)" name="answerUz" textarea required />
        <Field label="Savol (EN)" name="questionEn" />
        <Field label="Javob (EN)" name="answerEn" textarea />
        <button className="rounded-lg bg-[#0f2a56] px-5 py-2 text-sm font-semibold text-white hover:bg-[#15376e]">
          Qo‘shish
        </button>
      </form>

      {/* Existing */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase text-slate-400">#{i + 1}</div>
            <form action={updateFaqAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <Field label="Savol (UZ)" name="questionUz" defaultValue={item.questionUz} required />
              <Field label="Javob (UZ)" name="answerUz" defaultValue={item.answerUz} textarea required />
              <Field label="Savol (EN)" name="questionEn" defaultValue={item.questionEn} />
              <Field label="Javob (EN)" name="answerEn" defaultValue={item.answerEn} textarea />
              <button className="rounded-lg bg-[#0f2a56] px-5 py-2 text-sm font-semibold text-white hover:bg-[#15376e]">
                Saqlash
              </button>
            </form>
            <form action={deleteFaqAction} className="mt-3 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={item.id} />
              <button className="text-sm font-medium text-red-600 hover:text-red-700">
                O‘chirish
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">Hozircha savollar yo‘q.</p>
        )}
      </div>
    </div>
  );
}
