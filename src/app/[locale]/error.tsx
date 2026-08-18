"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { buttonClass, Arrow } from "@/components/ui/button";
import { getDictionary } from "@/content";
import { defaultLocale, isLocale, path, type Locale } from "@/lib/i18n";

/**
 * Sayfa gövdesinde oluşan hataları yakalar. Header ve footer korunur,
 * yalnızca içerik alanı bu bileşenle değişir.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  useEffect(() => {
    // Hata izlenebilir olsun; digest sunucu günlüğündeki kayda karşılık gelir.
    console.error("[error boundary]", error.digest ?? "", error);
  }, [error]);

  return (
    <Container>
      <div className="flex min-h-[60vh] max-w-2xl flex-col justify-center py-24">
        <p className="eyebrow">500</p>
        <h1 className="mt-6 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
          {dict.error.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-800/75">
          {dict.error.description}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className={buttonClass("primary")}
          >
            {dict.error.retry}
            <Arrow />
          </button>
          <Link href={path("contact", locale)} className={buttonClass("secondary")}>
            {dict.nav.contact}
            <Arrow />
          </Link>
        </div>
      </div>
    </Container>
  );
}
