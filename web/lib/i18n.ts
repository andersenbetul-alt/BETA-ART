export const locales = ['no', 'en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'no';

export const localeNames: Record<Locale, string> = {
  no: 'Norsk',
  en: 'English',
  tr: 'Türkçe',
};

/** Her pazar için ayrı para birimi — otomatik kur çevirimi KULLANILMAZ. */
export const currencyByLocale: Record<Locale, { code: string; symbol: string; position: 'before' | 'after' }> = {
  no: { code: 'NOK', symbol: 'kr', position: 'after' },
  en: { code: 'EUR', symbol: '€', position: 'before' },
  tr: { code: 'TRY', symbol: '₺', position: 'after' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * `currency` verilmezse pazarın varsayılan birimi kullanılır. Shopify fiyatları
 * kendi para birimiyle gelir — o birim her zaman çağrı sırasında geçilmelidir,
 * aksi halde tutar doğru ama sembol yanlış olur.
 */
export function formatPrice(amount: number, locale: Locale, currency?: string): string {
  const code = currency || currencyByLocale[locale].code;
  const intlLocale = locale === 'no' ? 'nb-NO' : locale === 'tr' ? 'tr-TR' : 'en-IE';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: code,
    // Yerel katalog tam sayı kullanır; Shopify 349,90 gibi kuruşlu fiyat dönebilir.
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

type Dict = Record<string, string>;

export const dictionaries: Record<Locale, Dict> = {
  no: {
    'nav.products': 'Produkter',
    'nav.about': 'Om oss',
    'nav.cart': 'Handlekurv',
    'hero.title': 'Nordisk enkelhet, håndplukket kvalitet.',
    'hero.body': 'Vi velger få, men riktige produkter — til hjemmet, garderoben og gavebordet.',
    'hero.cta': 'Se utvalget',
    'usp.shipping': 'Fri frakt over 799 kr',
    'usp.returns': '30 dagers åpent kjøp',
    'usp.support': 'Kundeservice på norsk',
    'usp.vipps': 'Betal med Vipps eller Klarna',
    'products.title': 'Alle produkter',
    'products.all': 'Alle',
    'products.empty': 'Ingen produkter i denne kategorien ennå.',
    'product.addToCart': 'Legg i handlekurv',
    'product.inStock': 'På lager',
    'product.outOfStock': 'Utsolgt',
    'product.material': 'Materiale',
    'product.dimensions': 'Mål',
    'product.origin': 'Opprinnelse',
    'product.sku': 'Varenummer',
    'product.back': 'Tilbake til produkter',
    'cart.title': 'Handlekurv',
    'cart.empty': 'Handlekurven din er tom.',
    'cart.subtotal': 'Delsum',
    'cart.shipping': 'Frakt',
    'cart.freeShipping': 'Gratis',
    'cart.total': 'Totalt',
    'cart.vatIncluded': 'Alle priser inkl. 25 % mva.',
    'cart.shippingNote': 'Frakt er et estimat. Endelig fraktpris beregnes i kassen.',
    'cart.freeShippingLeft': 'Legg til {amount} for fri frakt',
    'cart.freeShippingReached': 'Du har fri frakt',
    'cart.each': 'per stk',
    'product.delivery': 'Levering',
    'product.deliveryTime': '1–3 virkedager med Posten/Bring',
    'product.shippingCost': 'Frakt {fee} · fri frakt over {threshold}',
    'product.returnsLine': '30 dagers åpent kjøp · første retur er gratis',
    'product.paymentLine': 'Visa · Mastercard · Vipps · Klarna',
    'cart.checkout': 'Til kassen',
    'cart.remove': 'Fjern',
    'cart.continue': 'Fortsett å handle',
    'cart.checkoutUnavailable': 'Kassen er ikke koblet til ennå. Se web/.env.example.',
    'cart.itemsUnavailable': 'Disse varene kan ikke kjøpes nå og må fjernes:',
    'footer.legal': 'Vilkår og personvern',
    'footer.contact': 'Kontakt',
    'footer.orgnr': 'Org.nr',
    'about.title': 'Om COBBAN',
    'a11y.skip': 'Hopp til innhold',
    'a11y.mainNav': 'Hovedmeny',
    'legal.draftTitle': 'Utkast — ikke gyldig ennå',
    'legal.draftBody': 'Dette dokumentet har felter som ikke er fylt ut. Det er ikke juridisk bindende før feltene er fylt inn og teksten er gjennomgått av advokat.',
    'search.label': 'Søk i produkter',
    'search.placeholder': 'Søk …',
    'search.submit': 'Søk',
    'search.results': 'Treff for',
    'sort.label': 'Sorter',
    'sort.featured': 'Anbefalt',
    'sort.priceAsc': 'Pris: lav til høy',
    'sort.priceDesc': 'Pris: høy til lav',
    'sort.name': 'Navn A–Å',
  },
  en: {
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.cart': 'Cart',
    'hero.title': 'Nordic simplicity, handpicked quality.',
    'hero.body': 'We choose few but right products — for your home, your wardrobe and your gift table.',
    'hero.cta': 'Browse the range',
    'usp.shipping': 'Free shipping over 799 NOK',
    'usp.returns': '30-day free returns',
    'usp.support': 'Support in 3 languages',
    'usp.vipps': 'Pay with card, Vipps or Klarna',
    'products.title': 'All products',
    'products.all': 'All',
    'products.empty': 'No products in this category yet.',
    'product.addToCart': 'Add to cart',
    'product.inStock': 'In stock',
    'product.outOfStock': 'Sold out',
    'product.material': 'Material',
    'product.dimensions': 'Dimensions',
    'product.origin': 'Origin',
    'product.sku': 'SKU',
    'product.back': 'Back to products',
    'cart.title': 'Your cart',
    'cart.empty': 'Your cart is empty.',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.freeShipping': 'Free',
    'cart.total': 'Total',
    'cart.vatIncluded': 'Prices include Norwegian VAT where applicable.',
    'cart.shippingNote': 'Shipping is an estimate. The final rate is calculated at checkout.',
    'cart.freeShippingLeft': 'Add {amount} for free shipping',
    'cart.freeShippingReached': 'You have free shipping',
    'cart.each': 'each',
    'product.delivery': 'Delivery',
    'product.deliveryTime': '4–8 business days',
    'product.shippingCost': 'Shipping {fee} · free over {threshold}',
    'product.returnsLine': '30-day returns · first return is free',
    'product.paymentLine': 'Visa · Mastercard · Vipps · Klarna · PayPal',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.continue': 'Continue shopping',
    'cart.checkoutUnavailable': 'Checkout is not connected yet. See web/.env.example.',
    'cart.itemsUnavailable': 'These items cannot be purchased right now and must be removed:',
    'footer.legal': 'Terms and privacy',
    'footer.contact': 'Contact',
    'footer.orgnr': 'Org. no.',
    'about.title': 'About COBBAN',
    'a11y.skip': 'Skip to content',
    'a11y.mainNav': 'Main menu',
    'legal.draftTitle': 'Draft — not yet in force',
    'legal.draftBody': 'This document still contains unfilled fields. It is not legally binding until they are completed and the text has been reviewed by a lawyer.',
    'search.label': 'Search products',
    'search.placeholder': 'Search …',
    'search.submit': 'Search',
    'search.results': 'Results for',
    'sort.label': 'Sort',
    'sort.featured': 'Featured',
    'sort.priceAsc': 'Price: low to high',
    'sort.priceDesc': 'Price: high to low',
    'sort.name': 'Name A–Z',
  },
  tr: {
    'nav.products': 'Ürünler',
    'nav.about': 'Hakkımızda',
    'nav.cart': 'Sepet',
    'hero.title': 'İskandinav sadeliği, özenle seçilmiş kalite.',
    'hero.body': 'Az ama doğru ürün seçiyoruz — eviniz, gardırobunuz ve hediye masanız için.',
    'hero.cta': 'Ürünleri gör',
    'usp.shipping': '1.500 ₺ üzeri ücretsiz kargo',
    'usp.returns': '30 gün koşulsuz iade',
    'usp.support': 'Türkçe müşteri desteği',
    'usp.vipps': 'Kredi kartına taksit imkânı',
    'products.title': 'Tüm ürünler',
    'products.all': 'Tümü',
    'products.empty': 'Bu kategoride henüz ürün yok.',
    'product.addToCart': 'Sepete ekle',
    'product.inStock': 'Stokta',
    'product.outOfStock': 'Tükendi',
    'product.material': 'Malzeme',
    'product.dimensions': 'Ölçüler',
    'product.origin': 'Menşe',
    'product.sku': 'Ürün kodu',
    'product.back': 'Ürünlere dön',
    'cart.title': 'Sepetim',
    'cart.empty': 'Sepetiniz boş.',
    'cart.subtotal': 'Ara toplam',
    'cart.shipping': 'Kargo',
    'cart.freeShipping': 'Ücretsiz',
    'cart.total': 'Toplam',
    'cart.vatIncluded': 'Tüm fiyatlara KDV dahildir.',
    'cart.shippingNote': 'Kargo tutarı tahminidir. Kesin tutar ödeme adımında hesaplanır.',
    'cart.freeShippingLeft': 'Ücretsiz kargo için {amount} ekle',
    'cart.freeShippingReached': 'Kargo bedava',
    'cart.each': 'adedi',
    'product.delivery': 'Teslimat',
    'product.deliveryTime': '2–4 iş günü',
    'product.shippingCost': 'Kargo {fee} · {threshold} üzeri ücretsiz',
    'product.returnsLine': '30 gün koşulsuz iade · ilk iade ücretsiz',
    'product.paymentLine': 'Kredi kartı · Taksit · Havale/EFT',
    'cart.checkout': 'Ödemeye geç',
    'cart.remove': 'Kaldır',
    'cart.continue': 'Alışverişe devam et',
    'cart.checkoutUnavailable': 'Ödeme henüz bağlanmadı. Bkz. web/.env.example.',
    'cart.itemsUnavailable': 'Şu ürünler şu anda satın alınamıyor, sepetten çıkarılmalı:',
    'footer.legal': 'Sözleşmeler ve gizlilik',
    'footer.contact': 'İletişim',
    'footer.orgnr': 'Vergi no',
    'about.title': 'COBBAN Hakkında',
    'a11y.skip': 'İçeriğe atla',
    'a11y.mainNav': 'Ana menü',
    'legal.draftTitle': 'Taslak — henüz yürürlükte değil',
    'legal.draftBody': 'Bu metinde doldurulmamış alanlar var. Alanlar doldurulup bir avukat tarafından incelenmeden yasal olarak bağlayıcı değildir.',
    'search.label': 'Ürünlerde ara',
    'search.placeholder': 'Ara …',
    'search.submit': 'Ara',
    'search.results': 'Arama sonucu',
    'sort.label': 'Sırala',
    'sort.featured': 'Önerilen',
    'sort.priceAsc': 'Fiyat: düşükten yükseğe',
    'sort.priceDesc': 'Fiyat: yüksekten düşüğe',
    'sort.name': 'İsim A–Z',
  },
};

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries[defaultLocale][key] ?? key;
}

/** `t()` metnindeki {alan} yer tutucularını doldurur. */
export function tf(locale: Locale, key: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(locale, key),
  );
}

const countryNames: Record<string, Record<Locale, string>> = {
  TR: { no: 'Tyrkia', en: 'Türkiye', tr: 'Türkiye' },
  NO: { no: 'Norge', en: 'Norway', tr: 'Norveç' },
};

/** ISO ülke kodunu okunur ada çevirir; bilinmiyorsa kodu döndürür. */
export function countryName(code: string, locale: Locale): string {
  return countryNames[code]?.[locale] ?? code;
}
