"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Item = { src: string; title: string };
type Mode = "photo" | "video";

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null;
}

export function MediaGalleryDb({
  photos,
  videos,
  initialMode = "photo",
}: {
  photos: Item[];
  videos: Item[];
  initialMode?: Mode;
}) {
  const t = useTranslations("Media");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [photoLb, setPhotoLb] = useState<number | null>(null);
  const [videoLb, setVideoLb] = useState<number | null>(null);

  const heading = mode === "photo" ? t("photoTitle") : t("videoTitle");

  const closePhoto = useCallback(() => setPhotoLb(null), []);
  const stepPhoto = useCallback(
    (dir: 1 | -1) =>
      setPhotoLb((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (photoLb === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePhoto();
      if (e.key === "ArrowRight") stepPhoto(1);
      if (e.key === "ArrowLeft") stepPhoto(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [photoLb, closePhoto, stepPhoto]);

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={cn(
        "rounded px-5 py-2.5 text-label-caps font-label font-bold transition-colors",
        mode === m
          ? "bg-[#0f2a56] text-white"
          : "border border-outline-variant bg-white text-on-surface hover:text-primary",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 font-body text-body-md" aria-label="Breadcrumb">
        <Link href="/" className="text-on-surface-variant transition-colors hover:text-primary">
          {t("breadcrumbHome")}
        </Link>
        <Icon name="chevron_right" className="text-base text-on-surface-variant/60" />
        <span className="text-primary">{heading}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
          {heading}
        </h1>
        <div className="flex gap-2">
          {tab("photo", t("photoTitle"))}
          {tab("video", t("videoTitle"))}
        </div>
      </div>

      {mode === "photo" ? (
        photos.length === 0 ? (
          <p className="text-on-surface-variant">Rasmlar hozircha yo‘q.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhotoLb(i)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container"
              >
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )
      ) : videos.length === 0 ? (
        <p className="text-on-surface-variant">Videolar hozircha yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setVideoLb(i)}
              className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-primary-container/90 text-white"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
                <Icon name="play_arrow" className="ml-1 text-3xl" />
              </span>
              {v.title && (
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/40 px-3 py-2 text-left text-sm">
                  {v.title}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Photo lightbox */}
      {photoLb !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closePhoto}
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              stepPhoto(-1);
            }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/25"
          >
            <Icon name="chevron_left" className="text-3xl" />
          </button>
          <div className="relative aspect-[4/3] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[photoLb].src} alt="" fill sizes="100vw" className="rounded-lg object-contain" />
          </div>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              stepPhoto(1);
            }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/25"
          >
            <Icon name="chevron_right" className="text-3xl" />
          </button>
        </div>
      )}

      {/* Video modal */}
      {videoLb !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideoLb(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setVideoLb(null)}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/25"
          >
            <Icon name="close" className="text-2xl" />
          </button>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {youtubeEmbed(videos[videoLb].src) ? (
              <iframe
                src={youtubeEmbed(videos[videoLb].src)!}
                title={videos[videoLb].title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="aspect-video w-full rounded-lg bg-black shadow-2xl"
              />
            ) : (
              <video
                src={videos[videoLb].src}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-full rounded-lg bg-black shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
