import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/i18n";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, details, firstCall } = dict.contact;

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
            {/*
              Formdan önce cevaplanması gereken soru "bu bir satış araması mı?"
              Sol sütun bu yüzden iletişim bilgisiyle değil, görüşmenin
              içeriğiyle başlar.
            */}
            <h2 className="font-display text-2xl text-ink-900">
              {firstCall.title}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-800/85">
              {firstCall.description}
            </p>

            <ol className="mt-7 space-y-5">
              {firstCall.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-ink-950"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-800/80">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-7 border-l-2 border-accent-500 bg-white py-4 pl-5 pr-4 text-[0.95rem] leading-relaxed text-ink-900">
              {firstCall.boundary}
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-800/80">
              {firstCall.pricing}
            </p>

            <h2 className="mt-12 font-display text-2xl text-ink-900">
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
