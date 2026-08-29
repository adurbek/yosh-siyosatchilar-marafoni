"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { DateTab } from "@/components/ui/DateTab";
import { cn } from "@/lib/utils";
import { mediaPhotos, mediaVideos } from "@/lib/media";

type Album = { id: string; day: string; month: string; date: string };
type Mode = "photo" | "video";

const EMBLEM = "/logo-emblem-navy.png";

export function MediaGallery({ initialMode = "photo" }: { initialMode?: Mode }) {
  const t = useTranslations("Media");
  const photoAlbums = t.raw("albums") as Album[];
  const videoAlbums = t.raw("videoAlbums") as Album[];

  const [mode, setMode] = useState<Mode>(initialMode);
  const albums = mode === "photo" ? photoAlbums : videoAlbums;

  const [activeId, setActiveId] = useState(
    (initialMode === "video" ? videoAlbums : photoAlbums)[0]?.id,
  );
  const [lightbox, setLightbox] = useState<number | null>(null);

  const activeAlbum = albums.find((a) => a.id === activeId) ?? albums[0];
  const items =
    (mode === "photo" ? mediaPhotos : mediaVideos)[activeAlbum?.id] ?? [];

  const heading = mode === "photo" ? t("photoTitle") : t("videoTitle");

  // Switching photo/video resets to that mode's first album.
  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setActiveId((next === "photo" ? photoAlbums : videoAlbums)[0]?.id);
    setLightbox(null);
  }

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <div>
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
        <span className="text-primary">{heading}</span>
      </nav>

      <h1 className="mb-8 font-display text-3xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
        {heading}
      </h1>

      {/* Photo / Video toggle */}
      <div className="mb-10 flex flex-wrap gap-3">
        {(["photo", "video"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "rounded-lg px-6 py-3 font-label text-label-caps transition-colors",
              mode === m
                ? "bg-on-primary-fixed text-white"
                : "border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low",
            )}
          >
            {m === "photo" ? t("photoTitle") : t("videoTitle")}
          </button>
        ))}
      </div>

      {albums.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-low px-6 py-20 text-center font-body text-body-md text-on-surface-variant">
          {t("videoEmpty")}
        </div>
      ) : (
        <>
          {/* Date tabs */}
          <div className="mb-8 flex flex-wrap gap-4">
            {albums.map((a) => (
              <DateTab
                key={a.id}
                day={a.day}
                month={a.month}
                active={a.id === activeAlbum?.id}
                onClick={() => {
                  setActiveId(a.id);
                  setLightbox(null);
                }}
              />
            ))}
          </div>

          {/* Album */}
          {activeAlbum && (
            <div className="rounded-lg border border-outline-variant/30 bg-white p-5 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <Image
                  src={EMBLEM}
                  alt={t("eventTitle")}
                  width={48}
                  height={40}
                  className="h-10 w-auto flex-shrink-0"
                />
                <div>
                  <h2 className="text-base font-bold uppercase leading-snug text-on-surface md:text-lg">
                    {t("eventTitle")}
                  </h2>
                  <time
                    className="mt-1 block font-label text-sm text-primary-container"
                    dateTime={activeAlbum.date}
                  >
                    {activeAlbum.date}
                  </time>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={mode === "video" ? "Play" : undefined}
                    className="group relative aspect-[16/11] overflow-hidden rounded-md bg-surface-container"
                  >
                    {mode === "video" ? (
                      <>
                        <video
                          src={`${src}#t=0.1`}
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
                        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <Icon name="play_arrow" className="ml-0.5 text-3xl text-on-primary-fixed" />
                        </span>
                      </>
                    ) : (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <Icon name="close" className="text-2xl" />
          </button>

          {items.length > 1 && (
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25"
            >
              <Icon name="chevron_left" className="text-3xl" />
            </button>
          )}

          {mode === "video" ? (
            <video
              src={items[lightbox]}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-5xl rounded-lg bg-black shadow-2xl"
            />
          ) : (
            <div
              className="relative aspect-[4/3] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[lightbox]}
                alt=""
                fill
                sizes="100vw"
                className="rounded-lg object-contain"
              />
            </div>
          )}

          {items.length > 1 && (
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25"
            >
              <Icon name="chevron_right" className="text-3xl" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
