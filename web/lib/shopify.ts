import 'server-only';
import type { Locale } from './i18n';
import type { CategoryId } from './products';
import type { ProductView } from './types';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION ?? '2025-07';

export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

/** Storefront API @inContext yönlendirmesi — dil ve ülkeye göre fiyat/çeviri. */
const contextByLocale: Record<Locale, { language: string; country: string }> = {
  no: { language: 'NB', country: 'NO' },
  en: { language: 'EN', country: 'DE' },
  tr: { language: 'TR', country: 'TR' },
};

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function storefront<T>(
  query: string,
  variables: Record<string, unknown>,
  revalidate = 300,
): Promise<T> {
  if (!isShopifyConfigured()) throw new Error('Shopify ortam değişkenleri tanımlı değil');

  const res = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    // Sepet mutasyonları önbelleğe alınmamalı; okumalar 5 dk tutulur.
    ...(revalidate > 0 ? { next: { revalidate } } : { cache: 'no-store' as const }),
  });

  if (!res.ok) throw new Error(`Shopify Storefront API ${res.status}`);

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  if (!json.data) throw new Error('Shopify boş yanıt döndü');
  return json.data;
}

/* ------------------------------------------------------------------ ürünler */

const PRODUCT_FIELDS = `
  handle
  title
  description
  tags
  availableForSale
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) {
    nodes {
      id
      sku
      quantityAvailable
      availableForSale
      price { amount currencyCode }
    }
  }
`;

type ShopifyProductNode = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: {
    nodes: {
      id: string;
      sku: string | null;
      quantityAvailable: number | null;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    }[];
  };
};

const CATEGORY_TAGS: CategoryId[] = ['hjem', 'klaer', 'skjonnhet', 'gaver'];

function toView(node: ShopifyProductNode): ProductView {
  const variant = node.variants.nodes[0];
  const category = CATEGORY_TAGS.find((c) => node.tags.includes(c)) ?? 'gaver';

  // Satılabilirliği availableForSale belirler: stok takibi kapalıysa ya da
  // "stok bitince satmaya devam et" açıksa quantityAvailable 0/null gelir ama
  // ürün satılmaya devam eder.
  const available = variant?.availableForSale ?? node.availableForSale;
  // Kalan adet yalnızca stok takibi açıkken bilinir; bilinmiyorsa null —
  // 1 varsayarsak takipsiz ürünlerde müşteri tek adetle sınırlanır.
  const stock = typeof variant?.quantityAvailable === 'number' ? variant.quantityAvailable : null;

  // Fiyat, sepete eklenecek varyantın kendi fiyatı olmalı; minVariantPrice
  // çok varyantlı üründe gösterilen ile tahsil edilen tutarı ayırır.
  const price = variant?.price ?? node.priceRange.minVariantPrice;

  return {
    slug: node.handle,
    sku: variant?.sku ?? node.handle,
    category,
    price: Number(price.amount),
    currency: price.currencyCode,
    available,
    stock,
    hsCode: '',
    originCountry: '',
    material: '',
    dimensions: '',
    name: node.title,
    summary: node.description,
    bullets: [],
    swatch: '#D8CBB8',
    imageUrl: node.featuredImage?.url,
    imageAlt: node.featuredImage?.altText ?? node.title,
    variantId: variant?.id,
  };
}

/** Tek seferde çekilecek en fazla sayfa — kaçak döngüye karşı emniyet. */
const MAX_PRODUCT_PAGES = 10;

export async function fetchProducts(locale: Locale): Promise<ProductView[]> {
  const { language, country } = contextByLocale[locale];
  const query = `query Products($language: LanguageCode!, $country: CountryCode!, $after: String)
     @inContext(language: $language, country: $country) {
       products(first: 100, sortKey: BEST_SELLING, after: $after) {
         nodes { ${PRODUCT_FIELDS} }
         pageInfo { hasNextPage endCursor }
       }
     }`;

  const all: ProductView[] = [];
  let after: string | null = null;

  // 100'den fazla ürünü olan mağazada sayfalamayı takip et; aksi halde vitrin,
  // sitemap ve checkout katalogları sessizce kırpılır.
  for (let page = 0; page < MAX_PRODUCT_PAGES; page++) {
    const data: {
      products: { nodes: ShopifyProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
    } = await storefront(query, { language, country, after });

    all.push(...data.products.nodes.map(toView));
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
    if (!after) break;
  }

  return all;
}

export async function fetchProduct(locale: Locale, handle: string): Promise<ProductView | null> {
  const { language, country } = contextByLocale[locale];
  const data = await storefront<{ product: ShopifyProductNode | null }>(
    `query Product($handle: String!, $language: LanguageCode!, $country: CountryCode!)
     @inContext(language: $language, country: $country) {
       product(handle: $handle) { ${PRODUCT_FIELDS} }
     }`,
    { handle, language, country },
  );
  return data.product ? toView(data.product) : null;
}

/* ------------------------------------------------------------------- sepet */

export type CheckoutLine = { variantId: string; quantity: number };

/** Sepeti Shopify'da oluşturur ve müşteriyi yönlendireceğimiz checkout adresini döner. */
export async function createCheckout(locale: Locale, lines: CheckoutLine[]): Promise<string> {
  const { language, country } = contextByLocale[locale];
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation CartCreate($lines: [CartLineInput!]!, $language: LanguageCode!, $country: CountryCode!)
     @inContext(language: $language, country: $country) {
       cartCreate(input: { lines: $lines }) {
         cart { checkoutUrl }
         userErrors { field message }
       }
     }`,
    {
      lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      language,
      country,
    },
    0,
  );

  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join('; '));
  if (!cart) throw new Error('Shopify sepet oluşturamadı');
  return cart.checkoutUrl;
}
