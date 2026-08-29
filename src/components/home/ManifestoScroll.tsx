"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

/**
 * Manifesto section shown right after the Hero.
 *
 * A plain two-column layout: the left column holds the organiser logos and the
 * manifesto text, the right column shows the "manifest" panel. Everything
 * scrolls with the page naturally — nothing is pinned to the viewport.
 */

const DEFAULT_PARAGRAPHS = [
  "Yosh siyosatchilar marafoni — yoshlarni siyosiy hayotga jalb etish, ularning ovozini eshitish va real qarorlarga aylantirishga qaratilgan tashabbus.",
  "“G‘oya Ber, Fikir Bildir” manifesti yoshlarning umumiy intilishlarini aks ettiradi hamda kelajakni birgalikda qurish uchun qo‘llanma bo‘lib xizmat qiladi.",
];

export function ManifestoScroll({
  panelTitle = "Kelajakni Birgalikda Yarat",
  paragraphs = DEFAULT_PARAGRAPHS,
}: {
  panelTitle?: string;
  paragraphs?: string[];
}) {
  const t = useTranslations("Manifesto");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative bg-white py-16 md:py-24">
      <Container className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
        {/* ===== Left: logos + manifesto text ===== */}
        <div className="flex flex-col gap-8">
          {/* Organiser / partner logos — sized to fit the column on one row
              so the wide KAS mark is never clipped. */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:flex-nowrap md:justify-between md:gap-6">
            {[
              { src: "/logo-marafon-navy.png", alt: tNav("logoAlt"), width: 905, height: 393, size: "h-16 md:h-20" },
              { src: "/logo-yoshlar-parlamenti.png", alt: tNav("logoYouthParliament"), width: 1492, height: 875, size: "h-16 md:h-20" },
              { src: "/logo-kas.png", alt: "Konrad Adenauer Stiftung", width: 1741, height: 531, size: "h-11 md:h-14" },
            ].map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`${logo.size} w-auto object-contain`}
              />
            ))}
          </div>

          {paragraphs[0] && (
            <figure className="border-t-4 border-primary bg-[#f1f2f4] p-6 md:p-8">
              <div className="mb-3 font-display text-5xl leading-none text-[#0f2a56]">
                &quot;
              </div>
              <blockquote className="font-body text-body-md font-medium leading-relaxed text-on-primary-fixed md:text-lg">
                {paragraphs[0]}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-sm font-bold text-primary-container">
                  YP
                </span>
                <span className="text-sm">
                  <span className="block font-semibold text-on-surface">{t("quoteName")}</span>
                  <span className="block text-on-surface-variant">{t("quoteRole")}</span>
                </span>
              </figcaption>
            </figure>
          )}

          {paragraphs.slice(1).map((p, i) => (
            <p
              key={i}
              className="font-body text-body-md leading-relaxed text-on-surface-variant md:text-lg"
            >
              {p}
            </p>
          ))}

          {/* Manifest tavsifi */}
          <div>
            <h3 className="mb-4 font-display text-2xl font-extrabold uppercase leading-tight text-on-primary-fixed md:text-3xl">
              {t("heading")}
            </h3>
            <div className="space-y-4 font-body text-body-md leading-relaxed text-on-surface-variant md:text-lg">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>

          {/* Yakuniy iqtibos */}
          <figure className="border-t-4 border-primary bg-[#f1f2f4] p-6 md:p-8">
            <div className="mb-3 font-display text-5xl leading-none text-[#0f2a56]">&quot;</div>
            <blockquote className="font-body text-body-md font-medium leading-relaxed text-on-primary-fixed md:text-lg">
              {t("finalQuote")}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-sm font-bold text-primary-container">
                MQ
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-on-surface">{t("committee")}</span>
                <span className="block text-on-surface-variant">{t("committeeOrg")}</span>
              </span>
            </figcaption>
          </figure>
        </div>

        {/* ===== Right: manifest panel — sticks in place while the section
            scrolls, offset below the fixed header so it never touches it. ===== */}
        <div className="flex md:sticky md:top-28 md:self-start md:justify-end">
          <div
            className="relative w-full max-w-md bg-primary-container p-8 text-white md:p-10"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 86% 100%, 0 100%)" }}
          >
            <h2 className="font-display text-2xl font-extrabold uppercase leading-tight md:text-3xl">
              {panelTitle}
            </h2>
            <p className="mt-4 font-body text-body-md text-white/85">
              {t("downloadHint")}
            </p>

            <div className="mt-8 w-40">
              <Image
                src="/logo-marafon-white.png"
                alt={t("badgeLabel")}
                width={905}
                height={393}
                className="h-auto w-full"
              />
              <div className="mt-3 text-center font-display text-xs font-extrabold uppercase text-white">
                {t("badgeLabel")}
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded bg-secondary-fixed px-6 py-3 font-label text-label-caps uppercase text-on-secondary-fixed transition-colors hover:bg-secondary-fixed-dim"
              >
                {t("register")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
