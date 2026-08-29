import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

const FEATURED_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q";

export function FeaturedEvent() {
  const t = useTranslations("Featured");

  return (
    <section className="w-full py-10">
      {/* Left-bleeding card (~half width on desktop) with a big "Parliament Arc"
          semicircle on the right. The photo fills the whole card. */}
      <div className="relative flex min-h-[340px] w-full items-center overflow-hidden rounded-r-[100px] bg-primary-container text-on-primary shadow-sm md:w-[72%] lg:w-[48%] lg:rounded-r-[400px]">
        <Image
          src={FEATURED_IMAGE}
          alt={t("title")}
          fill
          sizes="(max-width: 1024px) 72vw, 48vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* Even teal tint across the whole card: photo stays visible everywhere
            while the left stays dark enough for the text. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/90 via-primary-container/65 to-primary-container/45" />

        <div className="relative z-10 max-w-md py-10 pl-8 pr-8 md:pl-12">
          <h2 className="mb-4 text-2xl font-headline font-bold uppercase leading-tight md:text-3xl">
            {t("title")}
          </h2>
          <p className="mb-6 line-clamp-4 font-body text-sm text-white/90 md:text-body-md">
            {t("description")}
          </p>
          <Button href="/register" variant="white" className="w-fit">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
