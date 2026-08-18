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
```

## Yapı

```
app/
  layout.tsx                       kök layout (metadata)
  page.tsx                         / → /no yönlendirmesi
  [locale]/
    layout.tsx                     dil doğrulama, <html lang>, font, header/footer
    page.tsx                       anasayfa (hero, USP, öne çıkan ürünler)
    urunler/page.tsx               ürün listesi + kategori filtresi (?kategori=)
    urunler/[slug]/page.tsx        ürün detay (SSG, hreflang alternates)
    sepet/page.tsx                 sepet
    kurumsal/page.tsx              hakkımızda + yasal metin başlıkları
components/
  CartContext.tsx                  sepet state'i (localStorage, client-only)
  Header.tsx / Footer.tsx          navigasyon, dil değiştirici (aynı sayfada kalır)
  ProductCard.tsx / AddToCart.tsx / CartView.tsx
lib/
  i18n.ts                          diller, sözlükler, para birimi, formatPrice
  products.ts                      ürün kataloğu, kategoriler, kargo eşikleri
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

## Yapılacaklar (lansman öncesi)

- [ ] **Shopify Storefront API bağlantısı** — ürün ve stok Shopify'dan gelsin,
      `lib/products.ts` yerini `lib/shopify.ts` alsın.
      Gerekli env: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
- [ ] **Checkout** — Shopify Cart API ile `checkoutUrl`'e yönlendir
      (`CartView.tsx` içindeki devre dışı buton).
- [ ] Gerçek ürün fotoğrafları (`public/products/`), şu an renk bloğu placeholder.
- [ ] Çerez rıza banner'ı (reddet butonu kabul ile eşit görünürlükte — GDPR).
- [ ] Yasal metinlerin tam hâlini `docs/sozlesmeler/` klasöründen sayfalara taşı.
- [ ] `sitemap.xml` + `robots.txt` + JSON-LD `Product` şeması.
- [ ] Analytics 4 / Meta Pixel (yalnızca rıza sonrası yüklensin).

## Shopify ile ilişki

Bu vitrin, Shopify'ı **headless ticaret motoru** olarak kullanacak şekilde
tasarlandı: stok, sipariş, ödeme ve kargo Shopify'da kalır; tasarım ve hız burada.
Mağaza kurulum adımları: `docs/08-shopify-kurulum.md`.
