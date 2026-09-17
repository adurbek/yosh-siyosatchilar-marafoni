import { cn } from "@/lib/utils";

/**
 * Signature layered teal wedge used at the bottom of the conference pages.
 * A right-triangle (apex top, hypotenuse running to the bottom-left) built
 * from several diagonal bands parallel to the hypotenuse, plus a thin dark
 * stripe, to reproduce the layered look from the design.
 */
export function TealWedge({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      {/* Base band — lightest */}
      <div
        className="absolute inset-0 bg-gradient-to-bl from-[#bfeaf1] to-[#a6dde9]"
        style={{ clipPath: "polygon(78% 0, 100% 100%, 0 100%)" }}
      />
      {/* Mid band */}
      <div
        className="absolute inset-0 bg-gradient-to-bl from-[#a2d8e6] to-[#8fcfe0]"
        style={{ clipPath: "polygon(85% 0, 100% 100%, 22% 100%)" }}
      />
      {/* Inner band — deeper teal */}
      <div
        className="absolute inset-0 bg-gradient-to-bl from-[#77c6da] to-[#5bbcd2]"
        style={{ clipPath: "polygon(91% 0, 100% 100%, 46% 100%)" }}
      />
      {/* Thin dark accent stripe */}
      <div
        className="absolute inset-0 bg-[#38a4be]"
        style={{ clipPath: "polygon(86% 0, 90% 0, 46% 100%, 41% 100%)" }}
      />
    </div>
  );
}
