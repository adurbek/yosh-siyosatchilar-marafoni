"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { countryCodes } from "@/lib/countries";

const inputClass =
  "w-full rounded border border-[#cbd5e0] bg-white px-4 py-3 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 block font-body text-body-md font-medium text-on-surface">
        {required && <span className="text-error">* </span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <Icon
        name="expand_more"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
    </div>
  );
}

export function RegistrationForm() {
  const t = useTranslations("Register");
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Localized, alphabetically sorted country list.
  const countries = useMemo(() => {
    let display: Intl.DisplayNames | null = null;
    try {
      display = new Intl.DisplayNames([locale, "en"], { type: "region" });
    } catch {
      display = null;
    }
    return countryCodes
      .map((code) => ({ code, name: display?.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Backend wiring comes in a later phase; simulate a short request.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSuccess(true);
  }

  const selectClass = `${inputClass} appearance-none pr-10`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate={false}>
        {/* Event */}
        <Field label={t("eventLabel")} required>
          <SelectWrap>
            <select name="event" required defaultValue="" className={selectClass}>
              <option value="" disabled>
                {t("eventPlaceholder")}
              </option>
              <option value="conference-xii">{t("eventOption")}</option>
            </select>
          </SelectWrap>
        </Field>

        <hr className="my-8 border-outline-variant/40" />

        {/* Personal name */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label={t("firstName")} required>
            <input
              name="firstName"
              required
              placeholder={t("firstNamePlaceholder")}
              className={inputClass}
            />
          </Field>
          <Field label={t("lastName")} required>
            <input
              name="lastName"
              required
              placeholder={t("lastNamePlaceholder")}
              className={inputClass}
            />
          </Field>
          <Field label={t("middleName")}>
            <input
              name="middleName"
              placeholder={t("middleNamePlaceholder")}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Gender / birth / country */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label={t("gender")} required>
            <SelectWrap>
              <select name="gender" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  {t("genderPlaceholder")}
                </option>
                <option value="male">{t("genderMale")}</option>
                <option value="female">{t("genderFemale")}</option>
              </select>
            </SelectWrap>
          </Field>
          <Field label={t("birthDate")}>
            <input
              name="birthDate"
              type="date"
              placeholder={t("birthDatePlaceholder")}
              className={inputClass}
            />
          </Field>
          <Field label={t("country")} required>
            <SelectWrap>
              <select name="country" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  {t("countryPlaceholder")}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </SelectWrap>
          </Field>
        </div>

        {/* Contacts / participant type */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label={t("email")} required>
            <input
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className={inputClass}
            />
          </Field>
          <Field label={t("phone")} required>
            <input
              name="phone"
              type="tel"
              required
              placeholder={t("phonePlaceholder")}
              className={inputClass}
            />
          </Field>
          <Field label={t("participantType")} required>
            <SelectWrap>
              <select name="participantType" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  {t("participantTypePlaceholder")}
                </option>
                <option value="delegate">{t("participantDelegate")}</option>
                <option value="observer">{t("participantObserver")}</option>
                <option value="expert">{t("participantExpert")}</option>
                <option value="media">{t("participantMedia")}</option>
                <option value="guest">{t("participantGuest")}</option>
              </select>
            </SelectWrap>
          </Field>
        </div>

        {/* Submit */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-primary-container px-10 py-3 font-label text-label-caps uppercase text-on-primary transition-colors hover:bg-primary disabled:opacity-60"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </form>

      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Register");
  const [ack, setAck] = useState(true);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-10 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient success badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary-container">
          <Icon name="check" className="text-5xl text-white" />
        </div>

        <h3 className="mb-6 text-headline-sm font-headline font-bold text-on-surface">
          {t("successTitle")}
        </h3>

        <label className="mb-6 inline-flex items-center gap-2 font-body text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="h-4 w-4 accent-primary-container"
          />
          {t("successAck")}
        </label>

        <button
          type="button"
          onClick={onClose}
          disabled={!ack}
          className="w-full rounded bg-primary-container py-3 font-label text-label-caps uppercase text-on-primary transition-colors hover:bg-primary disabled:opacity-60"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
