import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import { NewsCard } from "@/components/news/NewsCard";
import { sortByDateDesc, type NewsItem } from "@/lib/news";

// The homepage never shows more than the three most recent news items.
const MAX_ITEMS = 3;

export function NewsSection() {
  const t = useTranslations("News");
  const items = sortByDateDesc(t.raw("items") as NewsItem[]).slice(0, MAX_ITEMS);

  return (
    <section id="news" className="w-full bg-background py-section-gap">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-headline-md font-headline uppercase text-on-primary-fixed">
            {t("title")}
          </h2>
          <Link
            href="/news"
            className="flex flex-shrink-0 items-center gap-1 font-label text-label-caps uppercase text-primary transition-colors hover:text-primary-container"
          >
            {t("all")}
            <Icon name="chevron_right" className="text-sm" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} moreLabel={t("more")} />
          ))}
        </div>
      </Container>
    </section>
  );
}
