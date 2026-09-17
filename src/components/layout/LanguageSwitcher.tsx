"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  uz: "O'Z",
  en: "EN",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-0.5 rounded border border-outline-variant px-1.5 py-0.5 font-label text-xs text-on-surface transition-colors hover:border-primary md:gap-1 md:px-2 md:py-1 md:text-label-caps"
      >
        <span>{labels[locale]}</span>
        <Icon name="expand_more" className="text-xs md:text-sm" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-[6rem] overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-md"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => switchTo(l)}
                className={cn(
                  "w-full px-3 py-2 text-left font-label text-label-caps hover:bg-surface-container-low transition-colors",
                  l === locale && "text-primary",
                )}
              >
                {labels[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
