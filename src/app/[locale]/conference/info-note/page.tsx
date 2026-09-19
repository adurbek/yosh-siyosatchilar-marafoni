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
import { resolvePageImages } from "@/lib/page-images";

type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  paragraphsAfter?: string[];
  bullets2?: string[];
};

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 font-headline text-body-lg font-bold uppercase text-on-surface">
        {section.heading}
      </h2>
      <div className="space-y-4 font-body text-body-md leading-relaxed text-on-surface-variant">
        {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        {section.bullets && (
          <ul className="space-y-3 pl-1">
            {section.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {section.paragraphsAfter?.map((p, i) => <p key={i}>{p}</p>)}
        {section.bullets2 && (
          <ul className="space-y-3 pl-1">
            {section.bullets2.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "InfoNote" });
  return { title: t("title") };
}

export default async function InfoNotePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("InfoNote");

  const managed = await getPageContent("info-note", locale);
  const title = managed?.title ?? t("title");
  const intro = managed?.paragraphs ?? null;
  const images = resolvePageImages("info-note", managed?.images);

  const sectionsA = t.raw("sectionsA") as Section[];
  const sectionsB = t.raw("sectionsB") as Section[];
  const contacts = t.raw("contacts") as { ipu: string[]; senate: string[] };
  const annex = t.raw("annex") as {
    label: string;
    title: string;
    dates: string;
    subtitle: string;
    instruction: string;
    delegation: string;
    contactTitle: string;
    fields: string[];
    sessionLabels: string[];
    note: string;
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Title band */}
        <Container className="pt-6 pb-8">
          <nav
            className="mb-6 flex flex-wrap items-center gap-2 font-body text-body-md"
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
              href="/conference"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("breadcrumbAbout")}
            </Link>
            <Icon name="chevron_right" className="text-base text-on-surface-variant/60" />
            <span className="text-primary">{title}</span>
          </nav>

          <h1 className="font-display text-2xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
            {title}
          </h1>

          {intro && (
            <div className="mt-6 space-y-4 font-body text-body-md leading-relaxed text-on-surface-variant">
              {intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {/* Admin-managed photos (none by default) */}
          {images.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </Container>

        <Container>
          <div className="border-t border-dashed border-outline-variant/60" />
        </Container>

        {/* Document body — capped narrower for readability, like the reference */}
        <Container className="py-12">
          <div className="max-w-4xl">
            <h2 className="mb-2 text-center font-headline text-body-lg font-bold text-on-surface">
              {t("leadTitle")}
            </h2>

            {sectionsA.map((section) => (
              <SectionBlock key={section.heading} section={section} />
            ))}

            {/* Two-column contacts */}
            <div className="mt-8 grid grid-cols-1 gap-8 font-body text-body-md leading-relaxed text-on-surface-variant sm:grid-cols-2">
              <div className="space-y-4">
                {contacts.ipu.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="space-y-4">
                {contacts.senate.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {sectionsB.map((section) => (
              <SectionBlock key={section.heading} section={section} />
            ))}

            {/* Annex 1 — synchronous interpretation booth request form */}
            <div className="relative mt-14 overflow-hidden">
              <p className="mb-8 font-body text-body-md text-on-surface-variant">
                {annex.label}
              </p>
              <div className="relative z-10 max-w-2xl">
                <div className="space-y-0 divide-y divide-outline-variant/50 text-center">
                  <p className="pb-4 font-headline text-body-md font-bold text-on-surface">
                    {annex.title}
                  </p>
                  <p className="py-4 font-body text-body-md text-on-surface-variant">
                    {annex.dates}
                  </p>
                  <p className="py-4 font-headline text-body-md font-bold text-on-surface">
                    {annex.subtitle}
                  </p>
                  <p className="pt-4 font-body text-body-md text-on-surface-variant">
                    {annex.instruction}
                  </p>
                </div>

                <p className="mt-10 font-body text-body-md text-on-surface-variant">
                  {annex.delegation}
                </p>
                <p className="mt-4 font-body text-body-md text-on-surface-variant">
                  {annex.contactTitle}
                </p>

                {/* Form field labels laid out on a 3-column grid */}
                <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-8">
                  {annex.fields.map((label, i) =>
                    label ? (
                      <div key={i} className="border-b border-outline-variant/60 pb-1">
                        <span className="font-body text-body-md text-on-surface-variant">
                          {label}
                        </span>
                      </div>
                    ) : (
                      <div key={i} />
                    ),
                  )}
                </div>

                {/* Session rows */}
                <div className="mt-10 divide-y divide-outline-variant/50">
                  {[0, 1, 2].map((row) => (
                    <div
                      key={row}
                      className="grid grid-cols-4 gap-4 py-4 font-body text-body-md text-on-surface-variant"
                    >
                      {annex.sessionLabels.map((label, i) => (
                        <span key={i}>{label}</span>
                      ))}
                    </div>
                  ))}
                </div>

                <p className="mt-8 flex gap-2 font-body text-body-md text-on-surface-variant">
                  <span className="flex-shrink-0">•</span>
                  <span>{annex.note}</span>
                </p>
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <div className="border-t border-dashed border-outline-variant/60" />
        </Container>

        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
