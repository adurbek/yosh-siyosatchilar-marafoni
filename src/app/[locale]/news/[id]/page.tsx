import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import {
  newsCovers,
  newsBodyImages,
  getNewsIds,
  sortByDateDesc,
  type NewsItem,
} from "@/lib/news";

export function generateStaticParams() {
  return getNewsIds().map((id) => ({ id }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await props.params;
  const t = await getTranslations({ locale, namespace: "News" });
  const item = (t.raw("items") as NewsItem[]).find((n) => n.id === id);
  return { title: item?.title ?? t("title") };
}

function DateLabel({ date }: { date: string }) {
  return (
    <span className="flex items-center gap-2 text-on-surface-variant/80">
      <Icon name="calendar_today" className="text-base" />
      <time className="font-label text-sm" dateTime={date}>
        {date}
      </time>
    </span>
  );
}

export default async function NewsArticlePage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("News");

  const items = t.raw("items") as NewsItem[];
  const item = items.find((n) => n.id === id);
  if (!item) notFound();

  const body = item.body ?? [item.excerpt];
  const bodyImages = newsBodyImages[id] ?? [];
  const others = sortByDateDesc(items.filter((n) => n.id !== id));

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <Container className="pt-6 pb-16">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 font-body text-body-md"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("breadcrumbHome")}
            </Link>
            <Icon name="chevron_right" className="text-base text-on-surface-variant/60" />
            <Link
              href="/#news"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("title")}
            </Link>
            <Icon name="chevron_right" className="text-base text-on-surface-variant/60" />
            <span className="line-clamp-1 text-primary">{item.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* ── Article ── */}
            <article className="min-w-0">
              <div className="mb-4 flex items-center gap-4">
                <Link
                  href="/#news"
                  aria-label={t("title")}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                >
                  <Icon name="arrow_back" className="text-xl" />
                </Link>
                <DateLabel date={item.date} />
              </div>

              <h1 className="mb-8 font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
                {item.title}
              </h1>

              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface-container">
                <Image
                  src={newsCovers[id]}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-8 space-y-5 text-justify font-body text-body-md leading-relaxed text-on-surface-variant">
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {bodyImages.map((src, i) => (
                <div
                  key={i}
                  className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface-container"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                </div>
              ))}
            </article>

            {/* ── "Boshqa yangiliklar" sidebar ── */}
            <aside className="lg:border-l lg:border-outline-variant/40 lg:pl-10">
              <h2 className="mb-6 font-display text-xl font-extrabold text-on-surface">
                {t("other")}
              </h2>
              <ul className="space-y-6">
                {others.map((n) => (
                  <li
                    key={n.id}
                    className="border-b border-outline-variant/40 pb-6 last:border-b-0 last:pb-0"
                  >
                    <Link href={`/news/${n.id}`} className="group block">
                      <h3 className="font-body text-base font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                        {n.title}
                      </h3>
                      <div className="mt-3">
                        <DateLabel date={n.date} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
