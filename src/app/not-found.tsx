import Link from "next/link";
import { getDictionary } from "@/content";
import { defaultLocale, path } from "@/lib/i18n";
import "./globals.css";

export default function GlobalNotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <html lang={dict.meta.htmlLang} className="h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-sand-50 px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
            404
          </p>
          <h1 className="mt-5 font-display text-4xl text-ink-900">
            {dict.notFound.title}
          </h1>
          <p className="mt-4 leading-relaxed text-ink-800/75">
            {dict.notFound.description}
          </p>
          <Link
            href={path("home", defaultLocale)}
            className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {dict.actions.backHome}
          </Link>
        </div>
      </body>
    </html>
  );
}
