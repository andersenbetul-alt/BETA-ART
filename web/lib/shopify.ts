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
    nodes: { id: string; sku: string | null; quantityAvailable: number | null; availableForSale: boolean }[];
  };
};

const CATEGORY_TAGS: CategoryId[] = ['hjem', 'klaer', 'skjonnhet', 'gaver'];

function toView(node: ShopifyProductNode): ProductView {
  const variant = node.variants.nodes[0];
  const category = CATEGORY_TAGS.find((c) => node.tags.includes(c)) ?? 'gaver';
  // quantityAvailable yalnızca stok takibi açıkken dolu gelir; null ise
  // availableForSale'a düşeriz, aksi halde takipsiz ürünler "tükendi" görünür.
  const stock =
    variant?.quantityAvailable ?? (variant?.availableForSale || node.availableForSale ? 1 : 0);

  return {
    slug: node.handle,
    sku: variant?.sku ?? node.handle,
    category,
    price: Math.round(Number(node.priceRange.minVariantPrice.amount)),
    currency: node.priceRange.minVariantPrice.currencyCode,
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

export async function fetchProducts(locale: Locale): Promise<ProductView[]> {
  const { language, country } = contextByLocale[locale];
  const data = await storefront<{ products: { nodes: ShopifyProductNode[] } }>(
    `query Products($language: LanguageCode!, $country: CountryCode!)
     @inContext(language: $language, country: $country) {
       products(first: 100, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } }
     }`,
    { language, country },
  );
  return data.products.nodes.map(toView);
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
