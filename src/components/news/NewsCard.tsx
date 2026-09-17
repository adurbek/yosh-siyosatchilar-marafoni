import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { newsCovers, type NewsItem } from "@/lib/news";

/** A single news card: cover, title, excerpt, and a date · "more" footer. */
export function NewsCard({
  item,
  moreLabel,
}: {
  item: NewsItem;
  moreLabel: string;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-outline-variant/30 bg-white shadow-sm">
      <Link
        href={`/news/${item.id}`}
        className="relative block h-48 overflow-hidden bg-surface-container"
      >
        <Image
          src={newsCovers[item.id]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-3 line-clamp-2 text-headline-sm font-headline text-on-surface">
          <Link href={`/news/${item.id}`} className="transition-colors hover:text-primary">
            {item.title}
          </Link>
        </h3>
        <p className="mb-6 line-clamp-3 flex-grow font-body text-body-md text-on-surface-variant">
          {item.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/20 pt-4">
          <span className="flex items-center gap-2 text-on-surface-variant/70">
            <Icon name="calendar_today" className="text-sm" />
            <time className="font-label text-xs" dateTime={item.date}>
              {item.date}
            </time>
          </span>
          <Link
            href={`/news/${item.id}`}
            className="flex items-center gap-1 font-label text-label-caps uppercase text-primary transition-colors hover:text-primary-container"
          >
            {moreLabel}
            <Icon name="chevron_right" className="text-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}
