import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "./Countdown";
import { getHeroContent, pickLocale } from "@/lib/hero-content";

const DEFAULT_HERO_IMAGE = "/hero-majlis.jpg";

export async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("Hero");
  const hero = await getHeroContent();

  // Admin-managed content overrides the message-file defaults; empty fields
  // fall back to the translations so nothing ever renders blank.
  const image = hero?.image || DEFAULT_HERO_IMAGE;
  const title =
    (hero && pickLocale(locale, hero.titleUz, hero.titleRu, hero.titleEn)) ||
    t("title");
  const description =
    (hero &&
      pickLocale(locale, hero.descriptionUz, hero.descriptionRu, hero.descriptionEn)) ||
    t("description");
  const organizer =
    (hero &&
      pickLocale(locale, hero.organizerUz, hero.organizerRu, hero.organizerEn)) ||
    t("organizer");

  return (
    <section
      id="about"
      className="relative flex w-full items-center overflow-hidden bg-primary-container text-on-primary"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-multiply"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary-container/90 via-primary-container/70 to-transparent" />

      <Container className="relative z-20 flex min-h-[70vh] flex-col items-start gap-6 py-10 md:grid md:min-h-[80vh] md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-6 md:py-14">
        {/* Asosiy text: title + subtitle */}
        <div className="order-1 flex flex-col items-start gap-4 md:col-start-1 md:row-start-1">
          <div className="h-1 w-12 bg-white" />

          <div className="flex flex-col gap-1">
            <h1 className="max-w-3xl text-2xl font-display font-extrabold uppercase leading-tight text-white md:text-[2.75rem]">
              {title}
            </h1>

            <p className="max-w-3xl font-display text-2xl font-extrabold uppercase leading-tight text-white md:text-[2.75rem]">
              {description}
            </p>
          </div>
        </div>

        {/* Matn: organizer text */}
        <p className="order-2 max-w-md font-body text-base leading-snug text-white/70 md:col-start-2 md:row-start-1 md:mt-10 md:max-w-sm md:justify-self-end md:text-right">
          {organizer}
        </p>

        {/* Tugma: CTAs */}
        <div className="order-3 flex flex-wrap gap-3 md:col-start-1 md:row-start-2">
          <Button href="/register" variant="teal">
            {t("primaryCta")}
          </Button>
          <Button href="/programs" variant="outlineWhite">
            {t("secondaryCta")}
          </Button>
        </div>

        {/* Soat: countdown */}
        <div className="order-4 md:col-start-2 md:row-start-2 md:justify-self-end">
          {hero?.countdownTarget ? <Countdown targetIso={hero.countdownTarget} /> : <Countdown />}
        </div>
      </Container>
    </section>
  );
}
