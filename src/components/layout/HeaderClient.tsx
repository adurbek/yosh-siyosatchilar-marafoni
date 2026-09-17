"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export type AboutItem = { id: string; label: string; href: string; level: number };

// Simple anchor items (no dropdown).
const simpleItems = [
  { key: "programs", href: "/programs" },
  { key: "news", href: "/news" },
] as const;

// "Media" dropdown: two flat entries.
const mediaMenu = [
  { key: "photo", href: "/media" },
  { key: "video", href: "/media?tab=video" },
] as const;

function Bullet() {
  return (
    <span className="mt-[7px] h-2 w-2 flex-shrink-0 bg-secondary" aria-hidden />
  );
}

function Brand({ height = 92 }: { height?: number }) {
  const t = useTranslations("Nav");
  const width = Math.round((height * 905) / 393);
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo-marafon-navy.png"
        alt={t("logoAlt")}
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}

export function HeaderClient({ aboutItems }: { aboutItems: AboutItem[] }) {
  const t = useTranslations("Nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"about" | "media" | null>(null);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest/95 shadow-sm backdrop-blur"
      style={{ fontFamily: "var(--font-roboto)" }}
    >
      {/* ===== Mobile top bar: burger (left) · logo (center) · language (right) ===== */}
      <Container className="grid grid-cols-3 items-center py-1.5 md:hidden">
        <button
          type="button"
          className="justify-self-start pl-2"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Icon name={mobileOpen ? "close" : "menu"} className="text-2xl text-on-primary-fixed" />
        </button>
        <div className="justify-self-center">
          <Brand height={68} />
        </div>
        <div className="justify-self-end">
          <LanguageSwitcher />
        </div>
      </Container>

      {/* ===== Desktop bar ===== */}
      <Container className="hidden items-center justify-between py-1.5 md:flex">
        <Brand />

        <nav className="flex items-center gap-6">
          {/* About dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("about")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-expanded={openMenu === "about"}
              aria-haspopup="true"
              onClick={() => setOpenMenu((v) => (v === "about" ? null : "about"))}
              className="text-label-caps uppercase text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("about")}
            </button>

            {openMenu === "about" && (
              <div className="absolute left-0 top-full z-50 w-[420px] pt-3">
                <div className="rounded-lg border border-outline-variant/40 bg-white p-5 shadow-lg">
                  {aboutItems.map((item) =>
                    item.level === 0 ? (
                      <a
                        key={item.id}
                        href={item.href}
                        className="mt-4 flex gap-3 text-body-md font-semibold leading-snug text-on-surface transition-colors first:mt-0 hover:text-primary"
                      >
                        <Bullet />
                        {item.label}
                      </a>
                    ) : (
                      <a
                        key={item.id}
                        href={item.href}
                        className="mt-3 block pl-5 text-body-md leading-snug text-on-surface-variant transition-colors hover:text-primary"
                      >
                        {item.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {simpleItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-label-caps uppercase text-on-surface-variant transition-colors hover:text-primary"
            >
              {t(item.key)}
            </a>
          ))}

          {/* Media dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("media")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-expanded={openMenu === "media"}
              aria-haspopup="true"
              onClick={() => setOpenMenu((v) => (v === "media" ? null : "media"))}
              className="text-label-caps uppercase text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("media")}
            </button>

            {openMenu === "media" && (
              <div className="absolute left-0 top-full z-50 w-[240px] pt-3">
                <div className="rounded-lg border border-outline-variant/40 bg-white p-5 shadow-lg">
                  <ul className="space-y-4">
                    {mediaMenu.map((item) => (
                      <li key={item.key}>
                        <a
                          href={item.href}
                          className="flex items-center gap-3 text-body-md text-on-surface transition-colors hover:text-primary"
                        >
                          <span className="h-2 w-2 flex-shrink-0 bg-secondary" aria-hidden />
                          {t(`mediaMenu.${item.key}` as "mediaMenu.photo")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <a
            href="/faq"
            className="text-label-caps uppercase text-on-surface-variant transition-colors hover:text-primary"
          >
            {t("faq")}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button href="/register" variant="primary">
            {t("register")}
          </Button>
        </div>
      </Container>

      {/* ===== Mobile dropdown menu (no language switcher inside) ===== */}
      <div
        className={cn(
          "overflow-hidden border-t border-outline-variant bg-surface-container-lowest transition-[max-height] duration-300 md:hidden",
          mobileOpen ? "max-h-[44rem]" : "max-h-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {/* About (collapsible) */}
          <button
            type="button"
            onClick={() => setMobileAboutOpen((v) => !v)}
            aria-expanded={mobileAboutOpen}
            className="flex items-center justify-between rounded px-2 py-3 text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
          >
            {t("about")}
            <Icon
              name="expand_more"
              className={cn("text-base transition-transform", mobileAboutOpen && "rotate-180")}
            />
          </button>
          {mobileAboutOpen && (
            <div className="mb-1 flex flex-col gap-2 border-l border-outline-variant/40 pl-4">
              {aboutItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-1 text-body-md",
                    item.level === 0
                      ? "font-semibold text-on-surface"
                      : "pl-3 text-on-surface-variant",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {simpleItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded px-2 py-3 text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
            >
              {t(item.key)}
            </a>
          ))}

          {/* Media (collapsible) */}
          <button
            type="button"
            onClick={() => setMobileMediaOpen((v) => !v)}
            aria-expanded={mobileMediaOpen}
            className="flex items-center justify-between rounded px-2 py-3 text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
          >
            {t("media")}
            <Icon
              name="expand_more"
              className={cn("text-base transition-transform", mobileMediaOpen && "rotate-180")}
            />
          </button>
          {mobileMediaOpen && (
            <div className="mb-1 flex flex-col gap-2 border-l border-outline-variant/40 pl-4">
              {mediaMenu.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1 text-body-md text-on-surface-variant"
                >
                  {t(`mediaMenu.${item.key}` as "mediaMenu.photo")}
                </a>
              ))}
            </div>
          )}

          <a
            href="/faq"
            onClick={() => setMobileOpen(false)}
            className="rounded px-2 py-3 text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
          >
            {t("faq")}
          </a>

          <div className="mt-2">
            <Button href="/register" variant="primary" className="w-full">
              {t("register")}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
