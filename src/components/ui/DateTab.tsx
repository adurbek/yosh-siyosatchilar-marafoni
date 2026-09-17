import { cn } from "@/lib/utils";

/**
 * A "ticket"-shaped date tab with side notches, used by the Programs and Media
 * pages. The notches are white circles straddling the vertical edges, so the
 * tab must sit on a white background for the cut-out effect to read.
 */
export function DateTab({
  day,
  month,
  active,
  onClick,
}: {
  day: string;
  month: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex h-[92px] w-[112px] flex-shrink-0 flex-col items-center justify-center rounded-2xl transition-colors",
        active
          ? "bg-primary-container text-white"
          : "bg-surface-container-low text-on-surface hover:bg-surface-container",
      )}
    >
      <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      <span className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
      <span className="text-2xl font-bold leading-none">{day}</span>
      <span className="mt-1 text-sm">{month}</span>
    </button>
  );
}
