"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Session = {
  title: string;
  start: string;
  end: string;
  details?: string;
};

type Day = {
  id: string;
  day: string;
  month: string;
  sessions: Session[];
};

/* ── Live countdown, rendered as filled teal pills (e.g. "10 kun"). ── */
function diff(target: number) {
  const delta = target - Date.now();
  if (delta <= 0) return null;
  const s = Math.floor(delta / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function CountdownPills({ targetIso }: { targetIso: string }) {
  const t = useTranslations("Programs.countdown");
  const target = new Date(targetIso).getTime();
  const [time, setTime] = useState<ReturnType<typeof diff>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (mounted && time === null) {
    return (
      <div className="rounded bg-primary-container px-4 py-2 text-body-md text-white">
        {t("started")}
      </div>
    );
  }

  const units = [
    { value: time?.days ?? 0, label: t("days") },
    { value: time?.hours ?? 0, label: t("hours") },
    { value: time?.minutes ?? 0, label: t("minutes") },
    { value: time?.seconds ?? 0, label: t("seconds") },
  ];

  return (
    <div className="flex flex-wrap gap-2" suppressHydrationWarning>
      {units.map((u) => (
        <div
          key={u.label}
          className="flex min-w-[64px] items-baseline justify-center gap-1 rounded bg-primary-container px-3 py-2 text-white"
          suppressHydrationWarning
        >
          <span className="text-lg font-bold tabular-nums leading-none">
            {mounted ? u.value : "--"}
          </span>
          <span className="text-sm">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── One expandable session row. ── */
function SessionRow({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(session.details);

  return (
    <div className="rounded-lg border border-outline-variant/40 bg-white">
      <button
        type="button"
        onClick={() => hasDetails && setOpen((v) => !v)}
        aria-expanded={hasDetails ? open : undefined}
        className={cn(
          "flex w-full items-center gap-4 px-5 py-5 text-left md:px-6",
          !hasDetails && "cursor-default",
        )}
      >
        <span className="flex-grow text-base font-semibold text-on-surface md:text-lg">
          {session.title}
        </span>

        <span className="flex flex-shrink-0 items-center gap-2 text-primary-container">
          <Icon name="schedule" className="text-lg" />
          <span className="whitespace-nowrap text-body-md tabular-nums">
            {session.start} - {session.end}
          </span>
        </span>

        {hasDetails && (
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors">
            <Icon
              name="add"
              className={cn("text-xl transition-transform", open && "rotate-45")}
            />
          </span>
        )}
      </button>

      {hasDetails && open && (
        <div className="border-t border-outline-variant/40 px-5 pb-5 pt-4 font-body text-body-md text-on-surface-variant md:px-6">
          {session.details}
        </div>
      )}
    </div>
  );
}

export function ProgramsSchedule({ days }: { days: Day[] }) {
  const t = useTranslations("Programs");
  const eventTitle = t("eventTitle");
  const targetIso = t("targetIso");
  const [activeId, setActiveId] = useState<string | undefined>(days[0]?.id);
  const activeDay = days.find((d) => d.id === activeId) ?? days[0];

  return (
    <div className="space-y-10">
      {/* ── Featured event banner ── */}
      <div className="rounded-lg border-b-2 border-primary-container bg-[#e7f4f4] px-5 py-5 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-container">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-container" />
          </span>
          <CountdownPills targetIso={targetIso} />
        </div>
        <h2 className="mt-5 text-base font-bold uppercase leading-snug text-on-surface md:text-lg">
          {eventTitle}
        </h2>
      </div>

      {/* ── Day tabs (only shown when there's more than one day) ── */}
      {days.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                d.id === activeDay?.id
                  ? "bg-primary-container text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
              )}
            >
              {d.day} {d.month}
            </button>
          ))}
        </div>
      )}

      {/* ── Selected day schedule ── */}
      {activeDay && (
        <div className="space-y-4">
          <div className="rounded-lg bg-surface-container-low px-5 py-6 md:px-8">
            <div className="font-label text-label-caps uppercase text-primary-container">
              {activeDay.day} {activeDay.month}
            </div>
            <h3 className="mt-2 text-base font-bold uppercase leading-snug text-on-surface md:text-xl">
              {eventTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {activeDay.sessions.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
