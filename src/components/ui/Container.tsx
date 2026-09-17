import { cn } from "@/lib/utils";

/** Centered content wrapper capped at the design's 1280px container width. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-gutter", className)}>
      {children}
    </div>
  );
}
