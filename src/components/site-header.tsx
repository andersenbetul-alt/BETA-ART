"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { Container } from "./ui/container";
import { Arrow } from "./ui/button";
import {
  alternatePath,
  navKeys,
  path,
  routeKeyFromPathname,
  type Locale,
} from "@/lib/i18n";
import type { Dictionary } from "@/content";

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeKey = routeKeyFromPathname(pathname);
  const otherLocale: Locale = locale === "tr" ? "en" : "tr";

  const closeMenu = () => setOpen(false);

  // Menü açıkken: Escape kapatsın, arkadaki sayfa kaymasın, geniş ekrana
  // geçildiğinde durum kendiliğinden sıfırlansın.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const wide = window.matchMedia("(min-width: 80rem)");
    const onWiden = () => setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWiden);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWiden);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-ink-900/10 ${
        open ? "bg-sand-50" : "bg-sand-50/85 backdrop-blur-md"
      }`}
    >
      <Container>
        <div className="flex h-18 items-center justify-between gap-6 py-4">
          <Link href={path("home", locale)} aria-label={dict.meta.siteName}>
            <Logo />
          </Link>

          <nav
            aria-label={dict.footer.navTitle}
            className="hidden items-center gap-8 xl:flex"
          >
            {navKeys.map((key) => (
              <Link
                key={key}
                href={path(key, locale)}
                aria-current={activeKey === key ? "page" : undefined}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  activeKey === key
                    ? "text-ink-900"
                    : "text-ink-800/70 hover:text-ink-900"
                }`}
              >
                {dict.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Link
              href={alternatePath(pathname, otherLocale)}
              hrefLang={otherLocale}
              className="rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-800/80 transition-colors hover:border-ink-900/40 hover:text-ink-900"
            >
              {otherLocale}
            </Link>
            <Link
              href={path("contact", locale)}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
            >
              {dict.actions.contact}
              <Arrow />
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 xl:hidden"
          >
            <span className="sr-only">
              {open ? dict.actions.closeMenu : dict.actions.openMenu}
            </span>
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M5 5l10 10M15 5 5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={dict.footer.navTitle}
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink-900/10 bg-sand-50 xl:hidden"
        >
          <Container>
            <nav className="flex flex-col gap-1 py-5">
              {navKeys.map((key) => (
                <Link
                  key={key}
                  href={path(key, locale)}
                  onClick={closeMenu}
                  aria-current={activeKey === key ? "page" : undefined}
                  className={`rounded-lg px-2 py-3 text-base font-medium ${
                    activeKey === key
                      ? "bg-ink-900/5 text-ink-900"
                      : "text-ink-800/80"
                  }`}
                >
                  {dict.nav[key]}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-3 border-t border-ink-900/10 pt-4">
                <Link
                  href={path("contact", locale)}
                  onClick={closeMenu}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  {dict.actions.contact}
                  <Arrow />
                </Link>
                <Link
                  href={alternatePath(pathname, otherLocale)}
                  hrefLang={otherLocale}
                  onClick={closeMenu}
                  className="rounded-full border border-ink-900/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-800"
                >
                  {otherLocale}
                </Link>
              </div>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
