import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const linkClass =
  "font-body text-sm text-white/90 transition-colors hover:text-primary-fixed-dim";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  const col1 = [
    { label: tNav("about"), href: "/#about" },
    { label: tNav("programs"), href: "/programs" },
    { label: tNav("news"), href: "/news" },
  ];
  const col2 = [
    { label: tNav("media"), href: "/media" },
    { label: tNav("faq"), href: "/faq" },
  ];

  return (
    <footer className="w-full bg-primary-container text-white">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand + tagline */}
          <div className="md:col-span-4">
            <div className="mb-5 flex justify-center md:justify-start">
              <Image
                src="/logo-yoshlar-parlamenti-white.png"
                alt={tNav("logoYouthParliament")}
                width={1492}
                height={875}
                className="h-[72px] w-auto"
              />
            </div>
            <p className="max-w-xs font-body text-sm leading-relaxed text-white/80">
              {t("tagline")}
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-x-12 md:contents">
            {/* Link column 1 */}
            <nav className="flex flex-col gap-4 md:col-span-2">
              {col1.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Link column 2 */}
            <nav className="flex flex-col gap-4 md:col-span-3">
              {col2.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contacts */}
          <div className="md:col-span-3">
            <h3 className="mb-5 text-body-md font-headline font-bold text-white">
              {t("contactsTitle")}
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Icon name="location_on" className="mt-0.5 text-base text-primary-fixed-dim" />
                <span className="font-body text-sm text-white/90">
                  {t("address")}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="call" className="mt-0.5 text-base text-primary-fixed-dim" />
                <span className="font-body text-sm text-white/90">
                  {t("phoneLabel")}{" "}
                  <a
                    href="tel:+998883339607"
                    className="whitespace-nowrap text-primary-fixed-dim underline underline-offset-2 hover:text-secondary-fixed"
                  >
                    +998&nbsp;88&nbsp;333&nbsp;96&nbsp;07
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: copyright + integrator mark */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-body text-sm text-white/60">{t("rights")}</p>
          <p className="font-body text-sm text-white/80">
            <a
              href="https://t.me/abdurahmonov_add"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-fixed-dim transition-colors hover:text-secondary-fixed"
            >
              Abdurahmonov
            </a>{" "}
            tomonidan yaratilgan
          </p>
        </div>
      </Container>
    </footer>
  );
}
