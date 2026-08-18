# 11 — Geliştirme Planı (yaşayan backlog)

Bu proje sürekli geliştirilecek. Her oturumda bu listeyi güncelle:
bitenleri işaretle, yeni çıkanları ekle.

## Şu an engelleyen işler

| # | İş | Nerede | Not |
|---|---|---|---|
| 1 | Shopify ücretli plana geçiş | Shopify admin | Satış öncesi zorunlu |
| 2 | Mağaza adını `COBBAN` yap | Settings → Store details | API'de mutation yok, elle |
| 3 | Storefront API token üret ve `.env.local`'a gir | Shopify admin → Develop apps | Ödemeyi açar |
| 4 | Ürünleri DRAFT → ACTIVE | Shopify admin | Storefront API sadece ACTIVE döndürür |
| 5 | `cobban.com` domainini al | Domain sağlayıcı | Sonra Shopify'a bağla |
| 6 | Marka benzerlik araştırması + tescil | Patentstyret, TÜRKPATENT | "Çoban" çakışma riski var |

## Web — sıradaki geliştirmeler

- [ ] **Ürün görselleri** — Shopify'a yüklenince otomatik gelir; şu an renk bloğu
- [ ] **Kargo tutarını Shopify'dan al** — sepetteki kargo satırı hâlâ yerel tablodan
      geliyor (`lib/products.ts` → `shipping`), checkout'ta farklı çıkabilir.
      Çözüm: `cartCreate` sonrası `cart.cost.totalAmount` oku ya da satırı
      "tahmini kargo" olarak etiketle
- [ ] **Arama** — Storefront API `products(query:)` ile
- [ ] **Filtre/sıralama** — fiyat, yenilik, stok durumu
- [ ] **Ürün varyantları** — şu an ilk varyant kullanılıyor; beden/renk seçimi yok
- [ ] **Yorumlar** — Judge.me veya Shopify metafield
- [ ] **Sepet Shopify'da tutulsun** — şu an localStorage; `cartId` saklanırsa
      cihazlar arası ve terkedilmiş sepet e-postası mümkün olur
- [ ] **Yasal sayfaların tam metni** — `docs/sozlesmeler/` içerikleri sayfalara taşınacak
- [ ] **Analytics** — GA4 + Meta Pixel, yalnızca `cobban:consent` sonrası
- [ ] **E-posta yakalama** — ücretsiz kargo karşılığı pop-up, Klaviyo
- [ ] **Görsel optimizasyonu** — `next/image` + Shopify CDN loader
- [ ] **Test** — en azından `/api/checkout` doğrulama mantığı için birim testleri

## İçerik ve pazarlama

- [ ] İlk 20 gerçek ürünün seçimi ve tedarikçi anlaşması
- [ ] Ürün fotoğraf çekimi (ürün başına 4+ görsel, 1 ölçek görseli)
- [ ] Üç dilde ürün açıklamaları
- [ ] Instagram/TikTok/Pinterest hesapları + ilk 9 içerik
- [ ] Etsy mağazası, sonra Trendyol

## Şirket

Ayrıntı için `docs/10-kontrol-listesi.md`. Özet sıra:
Norveç ENK kaydı → banka → MVA takibi → Türkiye şahıs firması → ETBİS → e-fatura.

## Tamamlananlar

- [x] Şirket kurulum dokümantasyonu (Norveç + Türkiye + iki ülkeli model)
- [x] Yasal metin şablonları (TR/NO/EN + çerez)
- [x] Marka kimliği: logo, palet, tipografi, ses tonu
- [x] 3 dilli Next.js vitrini (anasayfa, liste, detay, sepet, kurumsal)
- [x] Shopify Storefront API bağlantısı + yerel kataloğa otomatik düşme
- [x] Gerçek checkout (`/api/checkout` → `cartCreate`), sunucu tarafı doğrulama
- [x] GDPR/KVKK uyumlu çerez rıza bandı
- [x] `sitemap.xml`, `robots.txt`, schema.org `Product` JSON-LD, hreflang
- [x] Shopify'da 4 koleksiyon, 8 taslak ürün, `en`+`tr` dilleri
