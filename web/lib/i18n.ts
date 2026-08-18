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

export function formatPrice(amount: number, locale: Locale): string {
  const { code } = currencyByLocale[locale];
  const intlLocale = locale === 'no' ? 'nb-NO' : locale === 'tr' ? 'tr-TR' : 'en-IE';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
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
    'cart.checkout': 'Til kassen',
    'cart.remove': 'Fjern',
    'cart.continue': 'Fortsett å handle',
    'footer.legal': 'Vilkår og personvern',
    'footer.terms': 'Salgsbetingelser',
    'footer.privacy': 'Personvernerklæring',
    'footer.returns': 'Angrerett og retur',
    'footer.cookies': 'Informasjonskapsler',
    'footer.contact': 'Kontakt',
    'footer.orgnr': 'Org.nr',
    'about.title': 'Om COBBAN',
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
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.continue': 'Continue shopping',
    'footer.legal': 'Terms and privacy',
    'footer.terms': 'Terms of sale',
    'footer.privacy': 'Privacy policy',
    'footer.returns': 'Returns and withdrawal',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Contact',
    'footer.orgnr': 'Org. no.',
    'about.title': 'About COBBAN',
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
    'cart.checkout': 'Ödemeye geç',
    'cart.remove': 'Kaldır',
    'cart.continue': 'Alışverişe devam et',
    'footer.legal': 'Sözleşmeler ve gizlilik',
    'footer.terms': 'Mesafeli satış sözleşmesi',
    'footer.privacy': 'KVKK aydınlatma metni',
    'footer.returns': 'İade ve cayma hakkı',
    'footer.cookies': 'Çerez politikası',
    'footer.contact': 'İletişim',
    'footer.orgnr': 'Vergi no',
    'about.title': 'COBBAN Hakkında',
  },
};

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries[defaultLocale][key] ?? key;
}
