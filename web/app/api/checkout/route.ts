import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { createCheckout, isShopifyConfigured } from '@/lib/shopify';
import { planCheckout } from '@/lib/checkout';

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

  const plan = planCheckout(catalog, lines);
  if (!plan.ok) {
    return NextResponse.json(
      { error: 'Sepetteki ürünler satın alınamıyor', unavailable: plan.unavailable },
      { status: 409 },
    );
  }

  try {
    const checkoutUrl = await createCheckout(locale, plan.lines);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('[checkout] Shopify sepet oluşturulamadı:', error);
    return NextResponse.json({ error: 'Ödeme sayfası oluşturulamadı' }, { status: 502 });
  }
}
