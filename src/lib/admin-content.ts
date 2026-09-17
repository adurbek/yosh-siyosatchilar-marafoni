// The "Marafon haqida" content sections shown as a collapsible group in the
// admin sidebar. Each maps to an editable PageContent row (by slug) and a
// public route.
export const CONTENT_SECTIONS = [
  {
    slug: "conference",
    label: "Yosh parlament a'zolarining XII global konferensiyasi Parlamentlararo ittifoq bilan hamkorlikda",
    ns: "Conference",
    route: "/conference",
  },
  {
    slug: "parliament-youth",
    label: "Parlament va yoshlar",
    ns: "ParliamentYouth",
    route: "/conference/parliament-youth",
  },
  {
    slug: "info-note",
    label: "Umumiy axborot eslatmasi",
    ns: "InfoNote",
    route: "/conference/info-note",
  },
  {
    slug: "history",
    label: "Yoshlar parlamenti tarixi",
    ns: null,
    route: "/conference/history",
  },
] as const;

// Standalone top-level editable sections (own sidebar item).
export const STANDALONE_SECTIONS = [
  { slug: "dastur", label: "Dastur", ns: "Programs", route: "/programs" },
  { slug: "manifist", label: "Manifist", ns: null, route: "/" },
] as const;

export const ALL_SECTIONS = [...CONTENT_SECTIONS, ...STANDALONE_SECTIONS];

export type ContentSection = (typeof ALL_SECTIONS)[number];

export function sectionBySlug(slug: string): ContentSection | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug);
}
