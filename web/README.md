# COBBAN — Storefront

Çok dilli (🇳🇴 Norsk · 🇬🇧 English · 🇹🇷 Türkçe), çok pazarlı (NOK / EUR / TRY)
e-ticaret vitrini. Next.js App Router + TypeScript, harici UI kütüphanesi yok.

## Çalıştırma

```bash
cd web
npm install
npm run dev      # http://localhost:3000 → /no adresine yönlenir
npm run build    # üretim derlemesi
npm run typecheck
npm test          # ödeme doğrulama testleri
npm run check     # typecheck + test + build
```

## Yapı

```
app/
  layout.tsx                       kök layout (metadata)
  page.tsx                         / → /no yönlendirmesi
  [locale]/
    layout.tsx                     dil doğrulama, <html lang>, font, header/footer
    page.tsx                       anasayfa (hero, USP, öne çıkan ürünler)
    urunler/page.tsx               ürün listesi + kategori/arama/sıralama
    urunler/[slug]/page.tsx        ürün detay (SSG, hreflang alternates)
    sepet/page.tsx                 sepet
    kurumsal/page.tsx              hakkımızda + yasal sayfa dizini
    kurumsal/[sayfa]/page.tsx      yasal metinler (docs/sozlesmeler'den okunur)
  api/checkout/route.ts            Shopify sepeti oluşturur, sunucuda doğrular
components/
  CartContext.tsx                  sepet state'i (localStorage, client-only)
  Header.tsx / Footer.tsx          navigasyon, dil değiştirici (aynı sayfada kalır)
  ProductCard.tsx / AddToCart.tsx / CartView.tsx
components/
  ProductFilters.tsx               arama kutusu + sıralama (durum URL'de)
  Analytics.tsx                    GA4 — yalnızca rıza sonrası yüklenir
lib/
  i18n.ts                          diller, sözlükler, para birimi, formatPrice
  products.ts                      yerel ürün kataloğu (Shopify yoksa yedek)
  catalog.ts                       Shopify → yerel katalog geçişi
  shopify.ts                       Storefront API istemcisi
  checkout.ts                      sepet doğrulama (saf fonksiyon, testli)
  legal.ts                         docs/sozlesmeler markdown'larını okur
  site.ts                          mutlak adres tek kaynağı
tests/
  checkout.test.ts                 ödeme doğrulama testleri (node --test)
```

## Tasarım kararları

- **Fiyatlar pazar başına el ile yazılır** (`price: { no, en, tr }`).
  Otomatik kur çevirimi yok — `347,83 kr` gibi fiyatlar güven kırar.
  Bkz. `docs/07-fiyatlandirma-ve-birim-ekonomi.md`.
- **Fiyatlar vergi dahil gösterilir** — Norveç'te *prisopplysningsforskriften*
  gereği yasal zorunluluk.
- **Sepet yalnızca istemcide okunur** (`useEffect`), böylece sunucu/istemci
  HTML uyuşmazlığı oluşmaz.
- Ürünlerde **HS kodu ve menşe ülke** alanları var — gümrük beyanı ve
  pazaryeri beslemesi için gerekli.
- Renkler `brand/tokens.css` ile aynı; açık/koyu tema desteklenir.

## Shopify bağlantısı

`.env.example` dosyasını `.env.local` olarak kopyala ve Storefront API token'ını gir:

```bash
cp .env.example .env.local
```

Token yoksa site **yerel katalogla** çalışmaya devam eder, sadece ödeme devre dışı kalır.
Token varsa ürünler, fiyatlar, stok ve çeviriler Shopify'dan gelir; ödeme
`cartCreate` ile oluşturulan gerçek Shopify checkout adresine yönlenir.

Gereken Storefront API izinleri:
`unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`,
`unauthenticated_read_checkouts`.

### Veri akışı

```
sayfa → lib/catalog.ts ─┬─ Shopify yapılandırılmışsa → lib/shopify.ts (Storefront API)
                        └─ değilse veya API hata verirse → lib/products.ts (yerel katalog)

Shopify sorgusu başarılı olup ürün bulamazsa yerel kataloğa DÜŞÜLMEZ — sayfa 404
döner, aksi halde mağazadan silinmiş ürün satın alınamaz bir sayfa olarak kalır.

sepet → POST /api/checkout → varyant + fiyat sunucuda doğrulanır
                           → cartCreate → checkoutUrl → yönlendirme
```

Fiyat ve varyant kimliği **hiçbir zaman istemciden alınmaz** — `/api/checkout`
yalnızca slug ve adedi kabul eder, geri kalanını sunucudaki kataloglardan okur.

## Yapılacaklar (lansman öncesi)

- [ ] Gerçek ürün fotoğrafları — Shopify'a yüklenince otomatik gelir,
      yoksa renk bloğu placeholder gösterilir.
- [ ] Yasal metinlerin tam hâlini `docs/sozlesmeler/` klasöründen sayfalara taşı.
- [ ] Analytics 4 / Meta Pixel — **yalnızca rıza sonrası** yüklensin
      (`window.addEventListener('cobban:consent', ...)` olayını dinle).
- [ ] `NEXT_PUBLIC_SITE_URL`'i gerçek alan adına ayarla (sitemap, robots, canonical ve JSON-LD kullanıyor).

## Hazır olanlar

- ✅ Shopify Storefront API bağlantısı + yerel kataloğa otomatik düşme
- ✅ Gerçek checkout (`/api/checkout` → Shopify `cartCreate`)
- ✅ GDPR/KVKK uyumlu çerez rıza bandı — reddet butonu kabul ile eşit ağırlıkta
- ✅ `sitemap.xml`, `robots.txt`, schema.org `Product` JSON-LD (iade politikası dahil)
- ✅ `hreflang` alternatifleri ve canonical adresler
- ✅ Arama ve sıralama (durum URL'de — paylaşılabilir, geri tuşu çalışır)
- ✅ Yasal metinler `docs/sozlesmeler/`'den okunuyor; doldurulmamış `{{...}}`
     alanı varsa sayfa "taslak" uyarısı gösterir ve `noindex` olur
- ✅ GA4 yalnızca rıza sonrası yüklenir (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- ✅ Ödeme doğrulaması için 12 birim testi

## Shopify ile ilişki

Bu vitrin, Shopify'ı **headless ticaret motoru** olarak kullanacak şekilde
tasarlandı: stok, sipariş, ödeme ve kargo Shopify'da kalır; tasarım ve hız burada.
Mağaza kurulum adımları: `docs/08-shopify-kurulum.md`.
