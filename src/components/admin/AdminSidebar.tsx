"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CONTENT_SECTIONS, STANDALONE_SECTIONS } from "@/lib/admin-content";
import { logoutAction } from "@/app/[locale]/admin/actions";

const mediaSub = [
  { href: "/admin/media/photos", label: "Fotomaterial" },
  { href: "/admin/media/videos", label: "Videomaterial" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const onContent = pathname?.includes("/admin/content");
  const onMedia = pathname?.includes("/admin/media");
  const [aboutOpen, setAboutOpen] = useState<boolean>(!!onContent);
  const [mediaOpen, setMediaOpen] = useState<boolean>(!!onMedia);

  const linkCls = (active: boolean) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  const subCls = (active: boolean) =>
    `truncate rounded-lg px-3 py-2 text-[13px] transition-colors ${
      active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  const groupBtn =
    "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col bg-primary-container text-white">
      <div className="px-6 py-6 text-lg font-bold">Manifist admin</div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        <a href="/admin" className={linkCls(pathname?.endsWith("/admin") ?? false)}>
          Boshqaruv
        </a>

        <a href="/admin/home" className={linkCls(pathname?.includes("/admin/home") ?? false)}>
          Bosh sahifa
        </a>

        {/* Marafon haqida — collapsible */}
        <button type="button" onClick={() => setAboutOpen((v) => !v)} aria-expanded={aboutOpen} className={groupBtn}>
          Marafon haqida
          <span className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
        {aboutOpen && (
          <div className="mb-1 flex flex-col gap-0.5 border-l border-white/15 pl-3">
            {CONTENT_SECTIONS.map((s) => {
              const href = `/admin/content/${s.slug}`;
              return (
                <a key={s.slug} href={href} title={s.label} className={subCls(pathname?.includes(href) ?? false)}>
                  {s.label}
                </a>
              );
            })}
          </div>
        )}

        {STANDALONE_SECTIONS.map((s) => {
          const href = `/admin/content/${s.slug}`;
          return (
            <a key={s.slug} href={href} className={linkCls(pathname?.includes(href) ?? false)}>
              {s.label}
            </a>
          );
        })}

        <a href="/admin/faq" className={linkCls(pathname?.includes("/admin/faq") ?? false)}>
          FAQ
        </a>

        {/* Media — collapsible */}
        <button type="button" onClick={() => setMediaOpen((v) => !v)} aria-expanded={mediaOpen} className={groupBtn}>
          Media
          <span className={`transition-transform ${mediaOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
        {mediaOpen && (
          <div className="mb-1 flex flex-col gap-0.5 border-l border-white/15 pl-3">
            {mediaSub.map((m) => (
              <a key={m.href} href={m.href} className={subCls(pathname?.includes(m.href) ?? false)}>
                {m.label}
              </a>
            ))}
          </div>
        )}

        <a href="/admin/password" className={linkCls(pathname?.includes("/admin/password") ?? false)}>
          Parol
        </a>
      </nav>

      <form action={logoutAction} className="p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Chiqish
        </button>
      </form>
    </aside>
  );
}
