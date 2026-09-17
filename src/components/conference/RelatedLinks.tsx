import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

// Shared "related pages" band shown at the bottom of the conference sub-pages.
// Labels come from the Conference namespace so they stay consistent everywhere.
export async function RelatedLinks() {
  const t = await getTranslations("Conference");

  const links = [
    { label: t("linkLowerHouse"), href: "/conference/lower-house" },
    { label: t("linkParliamentYouth"), href: "/conference/parliament-youth" },
    { label: t("linkInfoNote"), href: "/conference/info-note" },
    { label: t("linkCommission"), href: "/conference/history" },
  ];

  return (
    <Container className="py-12">
      <div className="rounded-sm bg-gradient-to-r from-[#e6f7f6] to-[#eaf6fd] p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center justify-between gap-3 rounded-sm bg-white px-4 py-4 font-label text-[11px] uppercase leading-tight text-on-surface shadow-sm transition-colors hover:text-primary"
            >
              {link.label}
              <Icon
                name="arrow_forward"
                className="text-base text-primary-container"
              />
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
