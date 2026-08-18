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
  approach: { tr: "yaklasim", en: "approach" },
  about: { tr: "hakkimizda", en: "about" },
  contact: { tr: "iletisim", en: "contact" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export const routeKeys = Object.keys(routes) as RouteKey[];

/** Menüde görünen sayfalar (ana sayfa logoya bağlı olduğu için hariç). */
export type NavKey = Exclude<RouteKey, "home">;

export const navKeys: NavKey[] = ["services", "approach", "about", "contact"];

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

/** Aynı sayfanın diğer dildeki adresi. */
export function alternatePath(pathname: string, target: Locale): string {
  return path(routeKeyFromPathname(pathname), target);
}

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviar.com"
).replace(/\/$/, "");

export function absoluteUrl(pathname: string): string {
  return `${siteUrl}${pathname}`;
}
