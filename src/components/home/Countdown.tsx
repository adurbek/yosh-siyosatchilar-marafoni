"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function diff(target: number): TimeLeft | null {
  const delta = target - Date.now();
  if (delta <= 0) return null;
  const seconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

/** Live countdown to the marathon start (default: 15 October 2026). */
export function Countdown({ targetIso = "2026-10-15T08:30:00+05:00" }: { targetIso?: string }) {
  const t = useTranslations("Countdown");
  const target = new Date(targetIso).getTime();
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { value: number; label: string }[] = [
    { value: time?.days ?? 0, label: t("days") },
    { value: time?.hours ?? 0, label: t("hours") },
    { value: time?.minutes ?? 0, label: t("minutes") },
    { value: time?.seconds ?? 0, label: t("seconds") },
  ];

  if (mounted && time === null) {
    return (
      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-highest/20 px-6 py-4 font-label text-label-caps uppercase text-secondary-fixed backdrop-blur-md">
        {t("started")}
      </div>
    );
  }

  return (
    <div
      className="flex gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-highest/20 p-3 backdrop-blur-md"
      suppressHydrationWarning
      aria-label="Countdown timer"
    >
      {units.map((unit, i) => (
        <div
          key={unit.label}
          className={`px-3 text-center ${i < units.length - 1 ? "border-r border-outline-variant/30" : ""}`}
        >
          <div
            className="font-display text-2xl font-extrabold leading-none tabular-nums text-white md:text-3xl"
            suppressHydrationWarning
          >
            {mounted ? String(unit.value).padStart(2, "0") : "--"}
          </div>
          <div className="mt-1 font-label text-[11px] tracking-wide text-secondary-fixed">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
