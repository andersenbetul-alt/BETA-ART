import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_LINE_QTY, planCheckout } from '../lib/checkout.ts';
import type { ProductView } from '../lib/types.ts';

function product(overrides: Partial<ProductView> = {}): ProductView {
  return {
    slug: 'kopp',
    sku: 'CB-HOME-CER-001',
    category: 'hjem',
    price: 349,
    currency: 'NOK',
    available: true,
    stock: 5,
    hsCode: '6912.00',
    originCountry: 'TR',
    material: 'Steintøy',
    dimensions: 'Ø 8,5 cm',
    name: 'Kaffekopp',
    summary: '',
    bullets: [],
    swatch: '#000',
    variantId: 'gid://shopify/ProductVariant/1',
    ...overrides,
  };
}

test('geçerli satır varyant kimliğine çevrilir', () => {
  const plan = planCheckout([product()], [{ slug: 'kopp', qty: 2 }]);
  assert.deepEqual(plan, {
    ok: true,
    lines: [{ variantId: 'gid://shopify/ProductVariant/1', quantity: 2 }],
  });
});

test('fiyat istemciden gelse bile yok sayılır', () => {
  // İstemci fiyat göndermeye çalışırsa sonuç değişmemeli.
  const plan = planCheckout([product()], [{ slug: 'kopp', qty: 1, price: 1 } as never]);
  assert.equal(plan.ok, true);
  assert.deepEqual(plan.ok && plan.lines, [
    { variantId: 'gid://shopify/ProductVariant/1', quantity: 1 },
  ]);
});

test('stoktan fazla adet reddedilir', () => {
  const plan = planCheckout([product({ stock: 2 })], [{ slug: 'kopp', qty: 3 }]);
  assert.deepEqual(plan, { ok: false, unavailable: ['kopp'] });
});

test('stok takibi kapalıysa üst sınır uygulanmaz', () => {
  const plan = planCheckout([product({ stock: null })], [{ slug: 'kopp', qty: 40 }]);
  assert.equal(plan.ok, true);
});

test('satılamayan ürün reddedilir', () => {
  const plan = planCheckout([product({ available: false })], [{ slug: 'kopp', qty: 1 }]);
  assert.deepEqual(plan, { ok: false, unavailable: ['kopp'] });
});

test('katalogda olmayan slug reddedilir', () => {
  const plan = planCheckout([product()], [{ slug: 'yok', qty: 1 }]);
  assert.deepEqual(plan, { ok: false, unavailable: ['yok'] });
});

test('varyant kimliği olmayan ürün (yerel katalog) reddedilir', () => {
  const plan = planCheckout([product({ variantId: undefined })], [{ slug: 'kopp', qty: 1 }]);
  assert.deepEqual(plan, { ok: false, unavailable: ['kopp'] });
});

test('geçersiz adetler reddedilir', () => {
  for (const qty of [0, -1, 1.5, Number.NaN, MAX_LINE_QTY + 1, '2', null, undefined]) {
    const plan = planCheckout([product({ stock: null })], [{ slug: 'kopp', qty }]);
    assert.equal(plan.ok, false, `qty=${String(qty)} kabul edilmemeliydi`);
  }
});

test('sınırdaki adet kabul edilir', () => {
  const plan = planCheckout([product({ stock: null })], [{ slug: 'kopp', qty: MAX_LINE_QTY }]);
  assert.equal(plan.ok, true);
});

test('tek satır bile karşılanamıyorsa tüm istek reddedilir', () => {
  // Sessizce atlanırsa müşteri eksik siparişle ödeme sayfasına düşer.
  const catalog = [product(), product({ slug: 'sape', available: false })];
  const plan = planCheckout(catalog, [
    { slug: 'kopp', qty: 1 },
    { slug: 'sape', qty: 1 },
  ]);
  assert.deepEqual(plan, { ok: false, unavailable: ['sape'] });
});

test('boş sepet reddedilir', () => {
  assert.deepEqual(planCheckout([product()], []), { ok: false, unavailable: [] });
});

test('slug string değilse reddedilir', () => {
  const plan = planCheckout([product()], [{ slug: 42, qty: 1 } as never]);
  assert.deepEqual(plan, { ok: false, unavailable: ['?'] });
});
