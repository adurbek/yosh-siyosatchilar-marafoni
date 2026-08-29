import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RotatingBadge } from "./RotatingBadge";

export function SdgSection() {
  const t = useTranslations("Sdg");

  return (
    <section
      id="programs"
      className="relative mt-10 w-full overflow-hidden bg-surface-container-low py-12"
    >
      {/* Decorative diagonal shards */}
      <div className="pointer-events-none absolute inset-0 z-0 flex opacity-20">
        <div className="h-[150%] w-1/3 -translate-y-1/4 translate-x-1/2 -skew-x-12 bg-secondary-fixed" />
        <div className="h-[150%] w-1/3 -translate-y-1/4 translate-x-full -skew-x-12 bg-primary" />
      </div>

      <Container className="relative z-10 grid grid-cols-1 items-center gap-stack-lg lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-display-lg-mobile font-display uppercase leading-tight text-on-primary-fixed md:text-display-lg">
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-primary-container">{chunks}</span>
              ),
            })}
          </h2>
          <p className="max-w-lg font-body text-body-md text-on-surface-variant">
            {t("description")}
          </p>
          <Button href="/programs" variant="outline">
            {t("cta")}
          </Button>
        </div>

        <div className="flex justify-center">
          <RotatingBadge className="w-full max-w-sm" />
        </div>
      </Container>
    </section>
  );
}
