import { cn } from "@/lib/utils";

/** Thin wrapper around Google Material Symbols (loaded in the root layout). */
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("material-symbols-outlined", className)}>
      {name}
    </span>
  );
}
