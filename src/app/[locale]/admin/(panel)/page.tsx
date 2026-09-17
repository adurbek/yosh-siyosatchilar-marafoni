import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [faqCount, photoCount, videoCount] = await Promise.all([
    prisma.faqItem.count(),
    prisma.mediaItem.count({ where: { type: "photo" } }),
    prisma.mediaItem.count({ where: { type: "video" } }),
  ]);

  const cards = [
    { label: "FAQ savollari", value: faqCount, href: "/admin/faq" },
    { label: "Rasmlar", value: photoCount, href: "/admin/media" },
    { label: "Videolar", value: videoCount, href: "/admin/media" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Boshqaruv paneli</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-3xl font-bold text-primary-container">{c.value}</div>
            <div className="mt-1 text-sm text-slate-500">{c.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
