import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sectionBySlug } from "@/lib/admin-content";
import { updatePageContentAction } from "../../../actions";

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

        <button className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
          Saqlash
        </button>
      </form>
    </div>
  );
}
