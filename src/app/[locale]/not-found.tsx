"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { buttonClass, Arrow } from "@/components/ui/button";
import { getDictionary } from "@/content";
import { defaultLocale, isLocale, path, type Locale } from "@/lib/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <Container>
      <div className="flex min-h-[60vh] max-w-2xl flex-col justify-center py-24">
        <p className="eyebrow">404</p>
        <h1 className="mt-6 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
          {dict.notFound.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-800/75">
          {dict.notFound.description}
        </p>
        <div className="mt-9">
          <Link
            href={path("home", locale)}
            className={`${buttonClass("primary")} w-fit`}
          >
            {dict.actions.backHome}
            <Arrow />
          </Link>
        </div>
      </div>
    </Container>
  );
}
