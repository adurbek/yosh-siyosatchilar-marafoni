import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RelatedLinks } from "@/components/conference/RelatedLinks";
import { getPageContent } from "@/lib/page-content";

const IMG_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw";
const IMG_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q";

// Thin dotted rule used to separate the major content blocks.
function Divider() {
  return <div className="border-t border-dashed border-outline-variant/60" />;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Conference" });
  return { title: t("title") };
}

export default async function ConferencePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Conference");
  const conferences = t.raw("conferences") as string[];

  const managed = await getPageContent("conference", locale);
  const title = managed?.title ?? t("title");
  const intro = managed?.paragraphs ?? null;

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* ===== Title band: breadcrumb + emblem + heading ===== */}
        <Container className="pt-6 pb-8">
          <nav
            className="mb-6 flex items-center gap-2 font-body text-body-md"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("breadcrumbHome")}
            </Link>
            <Icon
              name="chevron_right"
              className="text-base text-on-surface-variant/60"
            />
            <span className="text-primary">{title}</span>
          </nav>

          <div className="flex items-center gap-6">
            <Image
              src="/logo.svg"
              alt="IPU"
              width={96}
              height={96}
              className="hidden flex-shrink-0 sm:block"
              priority
            />
            <h1 className="font-display text-2xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
              {title}
            </h1>
          </div>

          {intro && (
            <div className="mt-6 space-y-4 font-body text-body-md leading-relaxed text-on-surface-variant">
              {intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== About: text (left) + stacked photos (right) ===== */}
        <Container className="py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_460px]">
            <div>
              <h2 className="mb-6 font-headline text-headline-sm font-bold text-on-surface">
                {t("aboutTitle")}
              </h2>
              <div className="space-y-4 text-justify font-body text-body-md leading-relaxed text-on-surface-variant">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
                <p>{t("listIntro")}</p>
                <ul className="space-y-2 pl-6">
                  {conferences.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-container" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>{t("p4")}</p>
              </div>
            </div>

            {/* Right rail: two photos with the signature teal diagonal accents */}
            <div className="relative flex flex-col gap-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm">
                <Image
                  src={IMG_1}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm">
                <Image
                  src={IMG_2}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
              </div>
              {/* Decorative teal parallelogram anchored bottom-right */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-4 hidden h-28 w-40 bg-gradient-to-br from-secondary-fixed-dim to-primary-container lg:block"
                style={{ clipPath: "polygon(28% 0, 100% 0, 72% 100%, 0 100%)" }}
              />
            </div>
          </div>
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== Purpose banner ===== */}
        <Container className="py-12">
          <div className="relative overflow-hidden rounded-sm bg-[#eaf6fd] px-6 py-12 md:px-12">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-2/5 bg-gradient-to-r from-[#a5dcec] to-primary-container md:block"
              style={{ clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="mb-4 font-display text-xl font-extrabold uppercase text-on-surface md:text-2xl">
                {t("goalTitle")}
              </h2>
              <p className="font-body text-body-md leading-relaxed text-on-surface-variant">
                {t("goalText")}
              </p>
            </div>
          </div>
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== Speakers ===== */}
        <Container className="py-12">
          <h2 className="mb-8 font-display text-xl font-extrabold uppercase text-on-surface md:text-2xl">
            {t("speakersTitle")}
          </h2>
          <p className="py-8 text-center font-body text-body-md text-on-surface-variant/70">
            {t("speakersEmpty")}
          </p>
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== Organizers ===== */}
        <Container className="py-12">
          <h2 className="mb-8 font-display text-xl font-extrabold uppercase text-on-surface md:text-2xl">
            {t("organizersTitle")}
          </h2>
          <div className="flex items-center gap-5 rounded-sm bg-gradient-to-r from-[#e6f7f6] to-[#eaf6fd] px-6 py-5">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-on-primary-fixed text-white">
              <Icon name="account_balance" className="text-2xl" />
            </span>
            <span className="font-headline text-body-lg font-bold uppercase leading-snug text-on-surface">
              {t("organizerName")}
            </span>
          </div>
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== Organizing committee contacts ===== */}
        <Container className="py-12">
          <div className="rounded-sm bg-surface-container-low px-6 py-10 md:px-12">
            <h2 className="mb-8 text-center font-display text-xl font-extrabold uppercase text-on-surface md:text-2xl">
              {t("contactsTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Icon name="mail" className="text-2xl text-primary-container" />
                <div>
                  <div className="font-headline text-body-md font-bold text-on-surface">
                    {t("emailLabel")}
                  </div>
                  <a
                    href={`mailto:${t("email")}`}
                    className="font-body text-body-md text-on-surface-variant transition-colors hover:text-primary"
                  >
                    {t("email")}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="call" className="text-2xl text-primary-container" />
                <div>
                  <div className="font-headline text-body-md font-bold text-on-surface">
                    {t("phoneLabel")}
                  </div>
                  <a
                    href={`tel:${t("phone").replace(/\s/g, "")}`}
                    className="font-body text-body-md text-on-surface-variant transition-colors hover:text-primary"
                  >
                    {t("phone")}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon
                  name="location_on"
                  className="text-2xl text-primary-container"
                />
                <div>
                  <div className="font-headline text-body-md font-bold text-on-surface">
                    {t("addressLabel")}
                  </div>
                  <span className="font-body text-body-md text-on-surface-variant">
                    {t("address")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <Divider />
        </Container>

        {/* ===== Related links ===== */}
        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
