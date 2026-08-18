import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./ui/container";
import { navKeys, path, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { details } = dict.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-100">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-100/70">
              {dict.footer.about}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              {dict.footer.navTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={path(key, locale)}
                    className="text-ink-100/75 transition-colors hover:text-white"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              {dict.footer.contactTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-ink-100/75">
              <li>
                <a
                  href={`mailto:${details.email.value}`}
                  className="transition-colors hover:text-white"
                >
                  {details.email.value}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${details.phone.value.replace(/[^+\d]/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {details.phone.value}
                </a>
              </li>
              <li>{details.address.value}</li>
              <li>{details.hours.value}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-xs text-ink-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.meta.siteName}. {dict.footer.rights}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>{dict.footer.legal}</p>
            <Link
              href={path("privacy", locale)}
              className="text-ink-100/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {dict.footer.privacyLink}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
