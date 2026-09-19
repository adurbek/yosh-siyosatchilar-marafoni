import type { Prisma } from "@prisma/client";
import {
  createProgramDayAction,
  updateProgramDayAction,
  deleteProgramDayAction,
  moveProgramDayAction,
  createProgramSessionAction,
  updateProgramSessionAction,
  deleteProgramSessionAction,
  moveProgramSessionAction,
} from "@/app/[locale]/admin/actions";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

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

function MoveButtons({
  action,
  id,
  disableUp,
  disableDown,
}: {
  action: (formData: FormData) => void;
  id: string;
  disableUp: boolean;
  disableDown: boolean;
}) {
  return (
    <div className="flex gap-1">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="up" />
        <button
          type="submit"
          disabled={disableUp}
          className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
        >
          ↑
        </button>
      </form>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="down" />
        <button
          type="submit"
          disabled={disableDown}
          className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
        >
          ↓
        </button>
      </form>
    </div>
  );
}

type DayWithSessions = Prisma.ProgramDayGetPayload<{
  include: { sessions: true };
}>;

export function ProgramScheduleEditor({ days }: { days: DayWithSessions[] }) {
  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-xl font-bold">Marafon jadvali (kunlar va sessiyalar)</h2>

      {/* Add new day */}
      <form
        action={createProgramDayAction}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h3 className="font-semibold text-primary-container">Yangi kun qo‘shish</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Field label="Kun (masalan 15)" name="day" required />
          <Field label="Oy (UZ)" name="monthUz" required />
          <Field label="Oy (RU)" name="monthRu" />
          <Field label="Oy (EN)" name="monthEn" />
        </div>
        <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
          Kun qo‘shish
        </button>
      </form>

      {days.length === 0 && (
        <p className="text-sm text-slate-500">Hozircha jadval kunlari yo‘q.</p>
      )}

      {days.map((day, di) => (
        <div key={day.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase text-slate-400">
              Kun #{di + 1}
            </div>
            <div className="flex items-center gap-3">
              <MoveButtons
                action={moveProgramDayAction}
                id={day.id}
                disableUp={di === 0}
                disableDown={di === days.length - 1}
              />
              <form action={deleteProgramDayAction}>
                <input type="hidden" name="id" value={day.id} />
                <button className="text-sm font-medium text-red-600 hover:text-red-700">
                  Kunni o‘chirish
                </button>
              </form>
            </div>
          </div>

          <form action={updateProgramDayAction} className="mb-6 space-y-3 border-b border-slate-100 pb-6">
            <input type="hidden" name="id" value={day.id} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Field label="Kun (masalan 15)" name="day" defaultValue={day.day} required />
              <Field label="Oy (UZ)" name="monthUz" defaultValue={day.monthUz} required />
              <Field label="Oy (RU)" name="monthRu" defaultValue={day.monthRu} />
              <Field label="Oy (EN)" name="monthEn" defaultValue={day.monthEn} />
            </div>
            <button className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
              Kunni saqlash
            </button>
          </form>

          {/* Sessions for this day */}
          <div className="space-y-4">
            {day.sessions.map((session, si) => (
              <div key={session.id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase text-slate-400">
                    Sessiya #{si + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <MoveButtons
                      action={moveProgramSessionAction}
                      id={session.id}
                      disableUp={si === 0}
                      disableDown={si === day.sessions.length - 1}
                    />
                    <form action={deleteProgramSessionAction}>
                      <input type="hidden" name="id" value={session.id} />
                      <button className="text-sm font-medium text-red-600 hover:text-red-700">
                        O‘chirish
                      </button>
                    </form>
                  </div>
                </div>
                <form action={updateProgramSessionAction} className="space-y-3">
                  <input type="hidden" name="id" value={session.id} />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Boshlanish vaqti" name="start" defaultValue={session.start} required />
                    <Field label="Tugash vaqti" name="end" defaultValue={session.end} required />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Field label="Nomi (UZ)" name="titleUz" defaultValue={session.titleUz} required />
                    <Field label="Nomi (RU)" name="titleRu" defaultValue={session.titleRu} />
                    <Field label="Nomi (EN)" name="titleEn" defaultValue={session.titleEn} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Field label="Tafsilot (UZ)" name="detailsUz" defaultValue={session.detailsUz} textarea />
                    <Field label="Tafsilot (RU)" name="detailsRu" defaultValue={session.detailsRu} textarea />
                    <Field label="Tafsilot (EN)" name="detailsEn" defaultValue={session.detailsEn} textarea />
                  </div>
                  <button className="rounded-lg bg-primary-container px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary">
                    Sessiyani saqlash
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Add new session */}
          <form
            action={createProgramSessionAction}
            className="mt-4 space-y-3 rounded-lg border border-dashed border-slate-300 p-4"
          >
            <input type="hidden" name="dayId" value={day.id} />
            <h4 className="text-sm font-semibold text-primary-container">Yangi sessiya qo‘shish</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Boshlanish vaqti" name="start" required />
              <Field label="Tugash vaqti" name="end" required />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Nomi (UZ)" name="titleUz" required />
              <Field label="Nomi (RU)" name="titleRu" />
              <Field label="Nomi (EN)" name="titleEn" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Tafsilot (UZ)" name="detailsUz" textarea />
              <Field label="Tafsilot (RU)" name="detailsRu" textarea />
              <Field label="Tafsilot (EN)" name="detailsEn" textarea />
            </div>
            <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
              Sessiya qo‘shish
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
