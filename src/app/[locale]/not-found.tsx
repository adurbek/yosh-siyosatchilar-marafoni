import { NotFoundView } from "@/components/layout/NotFoundView";

// Rendered when a page inside the site calls notFound() (e.g. an unknown news
// id). Unmatched URLs are handled by app/global-not-found.tsx.
export default function NotFound() {
  return <NotFoundView />;
}
