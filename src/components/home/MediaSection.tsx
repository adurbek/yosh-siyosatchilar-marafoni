"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const DEFAULT_VIDEO =
  "https://api.sdg2030.uz/storage/4950c807-78f0-4db7-95a9-2042ff60d71c.mp4";

const DEFAULT_THUMBS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2Ah3N19NOiGphFpgM6OjgfjGCJ0Zn3pTFDKigRIpPWu6dmZsWdQQQAMEeMcou3O3inB3TRdhnU23OHW6rSDktbTzoMVOGu4EOVXFSCJVs0i7yfrQ3WGjlzqnzyQrelmDn8Sg48AjjdR31aaJ9a7FpEUUMernqYCpGQNACV4KLZYbBGsKSWbS5G1iZp0LZ6IcEOIcHb0uOPus56KVhoSwetkTQBFHTelvHCti7iA4FYyFI3yX1hmXi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0oW0e7qc58HVv9cGeXWV19nVNcq2zWW0cGDJLaoaohPyrp8I2Ld8onVSOSADcQtnP7d-WttJz1ZdES1Vaj0ySw47M65bbRHaqlA84ilGCbR9zhyG9zGHmnfOa7P7ckKsLEAVYHRT3_NF7ASpqTII2LwurNqR2-R4ZL31ixs6QMkL2-yWUvB7RWzTvfPAteLj09t5lsUHohQu-76m5C1Z2ox4B8M-jtF8bcYpDOUnN79-eCGpIyACl",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3maoAgkGltrcsAYeKD0-rzZYpkBBQfcfT80UDsESIZ1mpJRXvN-xRkDbN5ql3x4NRbluQ03t0WLfGOzMz7JzZxs68qhmWNu7B9rvIGOCL9LggGtz_o5lAL_p5P4hBGNX6boG_S0npGMgo43WVUJY2G2zKq2er4B76iSysTBXNVymMc_EodjpPbSHV2uDQLDEiwopf7sZHxOtBCzxLiGjeGXSjMCyJJiFPcCQNom5mi79eVOdFzuxv",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgPitXe175mPoocWSJyaRH3WcUgwI6G2WpZYvdPZwklosUY689OhWhZ-gn_tk92klxRIyEU3E3jlJDnBwBbAwRh4NpUGc_CXfBquGqDoz9PUiB-jfqFzetvx-Ro3dT-MI5Ko7UksN1F-dlnDcOkVjblDvlmqQVmm-b88FuTjX5fySbps6QEd7X2lF0tw3aMvWazTP58comEw-qLuRemZpkYwQbqokxRDJ0idGkSABdAKRUqJeM1fuZ",
];

type Lightbox = { type: "video" } | { type: "photo"; index: number } | null;

export function MediaSection({
  photos,
  featureVideo,
}: {
  photos?: string[];
  featureVideo?: string;
}) {
  const t = useTranslations("Media");
  const thumbs = photos && photos.length > 0 ? photos.slice(0, 4) : DEFAULT_THUMBS;
  const video = featureVideo || DEFAULT_VIDEO;
  const [lightbox, setLightbox] = useState<Lightbox>(null);

  const close = useCallback(() => setLightbox(null), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((lb) => {
        if (!lb || lb.type !== "photo") return lb;
        const next = (lb.index + dir + thumbs.length) % thumbs.length;
        return { type: "photo", index: next };
      });
    },
    [thumbs.length],
  );

  useEffect(() => {
    if (!lightbox) return;
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
    <section id="media" className="w-full bg-surface py-section-gap">
      <Container>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-headline-md font-headline uppercase text-on-primary-fixed">
            {t("title")}
          </h2>
          <a
            href="/media"
            className="font-label text-label-caps uppercase text-primary transition-colors hover:text-primary-container"
          >
            {t("more")}
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Feature video */}
          <button
            type="button"
            onClick={() => setLightbox({ type: "video" })}
            aria-label="Play"
            className="group relative min-h-[360px] overflow-hidden rounded-lg bg-tertiary-container md:min-h-full"
          >
            <video
              src={`${video}#t=0.1`}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-lg backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-white/30">
              <Icon name="play_arrow" className="ml-1 text-3xl text-white" />
            </span>
          </button>

          {/* Thumbnail grid */}
          <div className="grid grid-cols-2 gap-4">
            {thumbs.map((src, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setLightbox({ type: "photo", index: i })}
                className="group relative h-44 overflow-hidden rounded-lg bg-surface-container md:h-auto md:min-h-[220px]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </Container>

      {lightbox && (
        <MediaLightbox
          lightbox={lightbox}
          thumbs={thumbs}
          video={video}
          onClose={close}
          onStep={step}
        />
      )}
    </section>
  );
}

function MediaLightbox({
  lightbox,
  thumbs,
  video,
  onClose,
  onStep,
}: {
  lightbox: Exclude<Lightbox, null>;
  thumbs: string[];
  video: string;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const iconBtn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute right-4 top-4 z-10 ${iconBtn}`}
      >
        <Icon name="close" className="text-2xl" />
      </button>

      {lightbox.type === "video" ? (
        <video
          src={video}
          controls
          autoPlay
          playsInline
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] w-full max-w-5xl rounded-lg bg-black shadow-2xl"
        />
      ) : (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${iconBtn}`}
          >
            <Icon name="chevron_left" className="text-3xl" />
          </button>

          <div
            className="relative aspect-[4/3] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={thumbs[lightbox.index]} alt="" fill sizes="100vw" className="rounded-lg object-contain" />
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 ${iconBtn}`}
          >
            <Icon name="chevron_right" className="text-3xl" />
          </button>
        </>
      )}
    </div>
  );
}
