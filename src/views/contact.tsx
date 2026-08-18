import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/i18n";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, details } = dict.contact;

  const rows = [
    {
      ...details.email,
      href: `mailto:${details.email.value}`,
    },
    {
      ...details.phone,
      href: `tel:${details.phone.value.replace(/[^+\d]/g, "")}`,
    },
    { ...details.address, href: undefined },
    { ...details.hours, href: undefined },
  ];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              {details.title}
            </h2>
            <dl className="mt-7 space-y-6">
              {rows.map((row) => (
                <div key={row.label} className="border-t border-ink-900/10 pt-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                    {row.label}
                  </dt>
                  <dd className="mt-2 text-lg text-ink-900">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="underline-offset-4 hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ContactForm locale={locale} dict={dict} />
        </div>
      </Section>
    </>
  );
}
