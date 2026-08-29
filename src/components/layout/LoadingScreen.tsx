"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Full-screen splash shown on the initial page load. It is part of the SSR
 * markup (so it covers the page from the first paint) and fades itself out
 * once the window has finished loading, then unmounts.
 */
export function LoadingScreen() {
  const t = useTranslations("Nav");
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const hide = () => setFading(true);
    let start: ReturnType<typeof setTimeout>;

    if (document.readyState === "complete") {
      start = setTimeout(hide, 500);
    } else {
      window.addEventListener("load", hide, { once: true });
    }
    // Safety net so the splash never gets stuck.
    const fallback = setTimeout(hide, 3000);

    return () => {
      clearTimeout(start);
      clearTimeout(fallback);
      window.removeEventListener("load", hide);
    };
  }, []);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setRemoved(true), 600);
    return () => clearTimeout(t);
  }, [fading]);

  if (removed) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-primary-container transition-opacity duration-500",
        fading && "pointer-events-none opacity-0",
      )}
      aria-hidden={fading}
    >
      <Image
        src="/logo-marafon-white.png"
        alt={t("logoAlt")}
        width={905}
        height={393}
        priority
        className="h-auto w-64 sm:w-80"
      />
    </div>
  );
}
