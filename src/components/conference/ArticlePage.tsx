import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RelatedLinks } from "@/components/conference/RelatedLinks";
import { TealWedge } from "@/components/conference/TealWedge";

function Divider() {
  return (
    <Container>
      <div className="border-t border-dashed border-outline-variant/60" />
    </Container>
  );
}

type Props = {
  breadcrumb: { home: string; about: string; current: string };
  title: string;
  paragraphs: string[];
  images: string[];
};

/**
 * Shared layout for the "Tadbir haqida" sub-pages: breadcrumb + heading,
 * a two-column body (justified text on the left, a stack of photos capped by
 * the signature teal diagonal wedge on the right), and the related-links band.
 */
export function ArticlePage({ breadcrumb, title, paragraphs, images }: Props) {
  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Title band */}
        <Container className="pt-6 pb-8">
          <nav
            className="mb-6 flex flex-wrap items-center gap-2 font-body text-body-md"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {breadcrumb.home}
            </Link>
            <Icon
              name="chevron_right"
              className="text-base text-on-surface-variant/60"
            />
            <Link
              href="/conference"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              {breadcrumb.about}
            </Link>
            <Icon
              name="chevron_right"
              className="text-base text-on-surface-variant/60"
            />
            <span className="text-primary">{breadcrumb.current}</span>
          </nav>

          <h1 className="font-display text-2xl font-extrabold uppercase leading-tight text-on-surface md:text-4xl">
            {title}
          </h1>
        </Container>

        <Divider />

        {/* Body */}
        <Container className="py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_440px]">
            <div className="space-y-4 text-justify font-body text-body-md leading-relaxed text-on-surface-variant">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Right rail: stacked photos capped by a teal diagonal wedge */}
            <div className="flex flex-col gap-6">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover"
                  />
                </div>
              ))}
              <TealWedge className="hidden h-72 w-full lg:block" />
            </div>
          </div>
        </Container>

        <Divider />

        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
