"use client";

import { useEffect } from "react";
import { getDictionary } from "@/content";
import { defaultLocale } from "@/lib/i18n";
import "./globals.css";

/**
 * Kök layout'un kendisi çökerse devreye girer. Layout render edilemediği için
 * kendi <html> ve <body> etiketlerini taşımak zorundadır.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = getDictionary(defaultLocale);

  useEffect(() => {
    // Kök layout çöktüğünde tek iz burada kalır.
    console.error("[global error]", error.digest ?? "", error);
  }, [error]);

  return (
    <html lang={dict.meta.htmlLang} className="h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-sand-50 px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
            500
          </p>
          <h1 className="mt-5 font-display text-4xl text-ink-900">
            {dict.error.title}
          </h1>
          <p className="mt-4 leading-relaxed text-ink-800/75">
            {dict.error.description}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {dict.error.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
