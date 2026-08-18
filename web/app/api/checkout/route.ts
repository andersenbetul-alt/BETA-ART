import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { createCheckout, isShopifyConfigured } from '@/lib/shopify';
import { MAX_LINE_QTY } from '@/lib/types';

type Body = { locale?: string; lines?: { slug?: unknown; qty?: unknown }[] };

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: 'Shopify yapılandırılmadı. web/.env.example dosyasına bak.' },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi' }, { status: 400 });
  }

  const { locale, lines } = body;
  if (!locale || !isLocale(locale)) {
    return NextResponse.json({ error: 'Geçersiz dil' }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Sepet boş' }, { status: 400 });
  }

  // Fiyat ve varyant her zaman sunucudaki katalogdan alınır — istemciden gelen
  // slug ve adet dışındaki hiçbir veriye güvenilmez.
  const catalog = await getProducts(locale);

  const checkoutLines = [];
  // Karşılanamayan satırı sessizce atlamak müşteriyi eksik bir siparişe
  // yönlendirir; hepsini topla ve isteği reddet.
  const unavailable: string[] = [];

  for (const line of lines) {
    if (typeof line?.slug !== 'string') {
      unavailable.push('');
      continue;
    }

    const qty = Number(line.qty);
    const product = catalog.find((p) => p.slug === line.slug);

    if (
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > MAX_LINE_QTY ||
      !product?.variantId ||
      !product.available ||
      (product.stock !== null && qty > product.stock)
    ) {
      unavailable.push(line.slug);
      continue;
    }

    checkoutLines.push({ variantId: product.variantId, quantity: qty });
  }

  if (unavailable.length > 0 || checkoutLines.length === 0) {
    return NextResponse.json(
      { error: 'Sepetteki ürünler satın alınamıyor', unavailable },
      { status: 409 },
    );
  }

  try {
    const checkoutUrl = await createCheckout(locale, checkoutLines);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('[checkout] Shopify sepet oluşturulamadı:', error);
    return NextResponse.json({ error: 'Ödeme sayfası oluşturulamadı' }, { status: 502 });
  }
}
