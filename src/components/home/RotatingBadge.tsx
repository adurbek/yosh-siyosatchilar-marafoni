import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Circular brand badge: the marafon emblem sits in the centre while
 * the marathon name curves around the rim and slowly rotates.
 * Pure CSS animation (respects prefers-reduced-motion via .badge-rotate).
 */
export function RotatingBadge({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const ringText = `${t("logoAlt").toUpperCase()} • `;
  return (
    <div
      className={cn(
        "relative aspect-square rounded-full bg-white shadow-lg",
        className,
      )}
    >
      {/* Rotating curved text ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <path
            id="badge-ring"
            d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
            fill="none"
          />
        </defs>
        <text className="fill-primary font-label uppercase" style={{ fontSize: "6.6px" }}>
          <textPath
            href="#badge-ring"
            startOffset="0"
            textLength={251}
            lengthAdjust="spacingAndGlyphs"
          >
            {ringText.repeat(2)}
          </textPath>
        </text>
      </svg>

      {/* Centre emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo-emblem-navy.png"
          alt={t("logoAlt")}
          width={218}
          height={182}
          className="h-auto w-[34%]"
        />
      </div>
    </div>
  );
}
