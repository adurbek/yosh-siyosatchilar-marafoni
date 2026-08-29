"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f2a56] p-6">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-1 text-2xl font-bold text-[#0f2a56]">Admin panel</h1>
        <p className="mb-6 text-sm text-slate-500">Kirish uchun parolni kiriting</p>

        <label className="mb-2 block text-sm font-medium text-slate-700">Parol</label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-[#0f2a56] focus:ring-2 focus:ring-[#0f2a56]/20"
        />

        {state?.error && (
          <p className="mt-3 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-[#0f2a56] py-2.5 font-semibold text-white transition-colors hover:bg-[#15376e] disabled:opacity-60"
        >
          {pending ? "Kirilmoqda…" : "Kirish"}
        </button>
      </form>
    </div>
  );
}
