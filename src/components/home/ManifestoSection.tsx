import { getLocale } from "next-intl/server";
import { getPageContent } from "@/lib/page-content";
import { ManifestoScroll } from "./ManifestoScroll";

// Server wrapper: the manifesto text and panel title are managed from the
// admin panel (PageContent slug "manifist"), with the component's own defaults
// as fallback.
export async function ManifestoSection() {
  const locale = await getLocale();
  const managed = await getPageContent("manifist", locale);

  return (
    <ManifestoScroll
      panelTitle={managed?.title ?? undefined}
      paragraphs={managed?.paragraphs ?? undefined}
    />
  );
}
