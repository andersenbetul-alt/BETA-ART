export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Her sayfanın dile göre URL parçası. Ana sayfanın parçası boştur (`/tr`, `/en`).
 * Yeni bir sayfa eklerken buraya bir anahtar ekleyin; menü, dil değiştirici ve
 * sitemap otomatik olarak bu tablodan beslenir.
 */
export const routes = {
  home: { tr: "", en: "" },
  services: { tr: "hizmetler", en: "services" },
  aiWorkforce: { tr: "ai-workforce", en: "ai-workforce" },
  approach: { tr: "yaklasim", en: "approach" },
  insights: { tr: "icgoruler", en: "insights" },
  about: { tr: "hakkimizda", en: "about" },
  careers: { tr: "kariyer", en: "careers" },
  contact: { tr: "iletisim", en: "contact" },
  privacy: { tr: "gizlilik", en: "privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export const routeKeys = Object.keys(routes) as RouteKey[];

/**
 * Menüde görünen sayfalar. Ana sayfa logoya, gizlilik sayfası altbilgiye
 * bağlı olduğu için burada yer almaz.
 *
 * `satisfies` her girdinin geçerli bir route anahtarı olmasını garanti eder;
 * `NavKey` de doğrudan bu diziden türetildiği için içerik sözlüğündeki `nav`
 * alanıyla her zaman aynı kalır.
 */
export const navKeys = [
  "services",
  "aiWorkforce",
  "approach",
  "insights",
  "about",
  "careers",
  "contact",
] as const satisfies readonly RouteKey[];

export type NavKey = (typeof navKeys)[number];

export function path(key: RouteKey, locale: Locale): string {
  const segment = routes[key][locale];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

/** `/tr/hizmetler` -> `services`. Bulunamazsa `home` döner. */
export function routeKeyFromPathname(pathname: string): RouteKey {
  const [, maybeLocale, segment] = pathname.split("/");
  if (!maybeLocale || !isLocale(maybeLocale) || !segment) return "home";
  const match = routeKeys.find((key) => routes[key][maybeLocale] === segment);
  return match ?? "home";
}

/**
 * Aynı sayfanın diğer dildeki adresi.
 *
 * Bölüm adı çevrilir, altındaki segmentler korunur; böylece
 * `/tr/kariyer/<ilan>` adresi `/en/careers/<ilan>` adresine eşlenir.
 */
export function alternatePath(pathname: string, target: Locale): string {
  const [, , , ...rest] = pathname.split("/");
  const base = path(routeKeyFromPathname(pathname), target);
  return rest.length > 0 ? `${base}/${rest.join("/")}` : base;
}

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviar.com"
).replace(/\/$/, "");

export function absoluteUrl(pathname: string): string {
  return `${siteUrl}${pathname}`;
}

/**
 * Dile göre sosyal paylaşım görseli (`public/` altında,
 * `npm run assets:social` ile üretilir).
 *
 * `alt` görselin içeriğini anlatır: paylaşımı ekran okuyucuyla duyan kişi
 * yalnızca "NAVIAR" duyuyordu, bu da bağlantının neden paylaşıldığını
 * söylemiyor.
 */
export function ogImage(locale: Locale) {
  return {
    url: `/og-${locale}.png`,
    width: 1200,
    height: 630,
    alt:
      locale === "tr"
        ? "NAVIAR — Stratejiniz sunumda kalıyorsa sorun strateji değil. Yönetim & strateji, insan kaynakları ve kurumsal eğitim danışmanlığı."
        : "NAVIAR — If your strategy stays in the deck, the strategy is not the problem. Management and strategy, HR and corporate learning consultancy.",
  };
}
