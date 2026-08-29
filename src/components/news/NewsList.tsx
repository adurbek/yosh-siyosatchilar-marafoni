"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { NewsCard } from "@/components/news/NewsCard";
import { newsCovers, sortByDateDesc, type NewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [10, 20, 50];

/** The newest item, rendered as a wide horizontal banner (page 1 only). */
function FeaturedNews({ item, moreLabel }: { item: NewsItem; moreLabel: string }) {
  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-lg border border-outline-variant/30 bg-white shadow-sm md:grid-cols-2">
      <Link
        href={`/news/${item.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-container md:aspect-auto md:min-h-[320px]"
      >
        <Image
          src={newsCovers[item.id]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </Link>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <time
          className="mb-3 font-label text-sm text-on-surface-variant/70"
          dateTime={item.date}
        >
          {item.date}
        </time>
        <h3 className="mb-4 text-2xl font-display font-extrabold leading-tight text-on-surface md:text-3xl">
          <Link href={`/news/${item.id}`} className="transition-colors hover:text-primary">
            {item.title}
          </Link>
        </h3>
        <p className="mb-6 line-clamp-3 font-body text-body-md leading-relaxed text-on-surface-variant">
          {item.excerpt}
        </p>
        <Link
          href={`/news/${item.id}`}
          className="flex w-fit items-center gap-1 font-label text-label-caps uppercase text-primary transition-colors hover:text-primary-container"
        >
          {moreLabel}
          <Icon name="chevron_right" className="text-sm" />
        </Link>
      </div>
    </article>
  );
}

export function NewsList() {
  const t = useTranslations("News");
  const items = sortByDateDesc(t.raw("items") as NewsItem[]);

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  // On the first page the newest item is featured; the rest fill the grid.
  const featured = current === 1 ? pageItems[0] : undefined;
  const gridItems = featured ? pageItems.slice(1) : pageItems;

  return (
    <div className="space-y-10">
      {featured && <FeaturedNews item={featured} moreLabel={t("more")} />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item) => (
          <NewsCard key={item.id} item={item} moreLabel={t("more")} />
        ))}
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={current === 1}
          aria-label="Previous page"
          className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevron_left" className="text-xl" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPage(n)}
            aria-current={n === current ? "page" : undefined}
            className={cn(
              "h-10 min-w-10 rounded-md px-3 font-label text-label-caps transition-colors",
              n === current
                ? "bg-primary-container text-white"
                : "text-on-surface hover:bg-surface-container-low",
            )}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={current === totalPages}
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevron_right" className="text-xl" />
        </button>

        <label className="ml-1 flex items-center rounded-md border border-outline-variant/60 bg-white">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            aria-label={t("perPage")}
            className="cursor-pointer rounded-md bg-transparent px-3 py-2 font-body text-body-md text-on-surface outline-none"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} / {t("perPage")}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
