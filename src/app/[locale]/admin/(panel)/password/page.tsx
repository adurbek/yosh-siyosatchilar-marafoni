"use client";

import { useActionState } from "react";
import { changePasswordAction } from "../../actions";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0f2a56] focus:ring-2 focus:ring-[#0f2a56]/20";

export default function AdminPasswordPage() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Parolni almashtirish</h1>
      <form
        action={formAction}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Joriy parol</span>
          <input type="password" name="current" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Yangi parol</span>
          <input type="password" name="next" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Yangi parolni tasdiqlang</span>
          <input type="password" name="confirm" required className={inputCls} />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm text-green-600">{state.ok}</p>}

        <button
          disabled={pending}
          className="rounded-lg bg-[#0f2a56] px-5 py-2 text-sm font-semibold text-white hover:bg-[#15376e] disabled:opacity-60"
        >
          {pending ? "Saqlanmoqda…" : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
