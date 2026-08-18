import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/content";
import {
  absoluteUrl,
  isLocale,
  locales,
  path,
  routeKeys,
  ogImage,
  siteUrl,
  type Locale,
} from "@/lib/i18n";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const displaySerif = Source_Serif_4({
  variable: "--font-display-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/** Mobil tarayıcı çubuğunu marka lacivertiyle boyar. */
export const viewport: Viewport = {
  themeColor: "#0a1f33",
};

/** Sadece tanımlı diller derlenir; /fr gibi adresler 404 döner. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: path("home", locale),
      languages: {
        tr: path("home", "tr"),
        en: path("home", "en"),
        "x-default": path("home", "tr"),
      },
      types: {
        "application/rss+xml": [
          { url: `/${locale}/rss.xml`, title: dict.insights.hero.title },
        ],
      },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      url: absoluteUrl(path("home", locale)),
      images: [ogImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      images: [ogImage(locale).url],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: dict.meta.siteName,
    description: dict.meta.description,
    url: absoluteUrl(path("home", typedLocale)),
    email: dict.contact.details.email.value,
    telephone: dict.contact.details.phone.value,
    areaServed: "TR",
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    knowsLanguage: ["tr", "en"],
    sameAs: [] as string[],
  };

  return (
    <html
      lang={dict.meta.htmlLang}
      className={`${inter.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.actions.skipToContent}
        </a>
        <SiteHeader locale={typedLocale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={typedLocale} dict={dict} />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}

// Sayfa dosyalarının hepsinin bu diller için üretildiğinden emin olmak adına
// route anahtarlarını dışa aktarıyoruz (sitemap tarafından da kullanılıyor).
export const knownRouteKeys = routeKeys;
