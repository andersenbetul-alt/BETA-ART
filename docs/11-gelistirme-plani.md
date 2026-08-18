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

## Kalite denetiminden çıkan açık işler

UX incelemesi (Ağu 2026) — dönüşümü en çok etkileyenler:

- [ ] **Ücretsiz kargo eşiği kullanılmıyor.** Sepette "Fri frakt için 300 kr kaldı"
      çubuğu yok. AOV hedefi 600 kr, eşik 799 kr — kullanılmayan en büyük kaldıraç
- [ ] **Dil değişince pazar da sessizce değişiyor.** NO→EN geçişinde 1.248 kr sepet
      123 € oluyor, kargo eşiği 799 kr'dan 199 €'ya kayıyor. Dil ile pazarı ayır
      ya da para birimi değişimini kullanıcıya bildir
- [ ] **Ürün sayfasında teslimat ve ödeme bloğu yok** — kargo süresi, ücreti,
      iade koşulu ve Vipps/Klarna ödeme rozetleri yalnızca anasayfada
- [ ] **Sepette birim fiyat yok**, yalnızca satır toplamı; adet butonları 30 px
      (dokunmatik hedef 44 px olmalı)
- [ ] **Sepete ekleme geri bildirimi zayıf** — 1,8 sn'lik ✓ dışında bir şey yok;
      mini sepet ve "ödemeye geç" kısayolu gerekli
- [ ] **HS kodu ürün sayfasında görünüyor** — gümrük verisi, müşteriye anlamsız.
      Menşe "TR" yerine "Türkiye" yazılmalı
- [ ] **Arama alt dizeye bakıyor**: "ull" araması "Bomullsveke" yüzünden mum getiriyor
- [ ] **Footer'da `{{ORG_NR}}` görünüyor** — Norveçli müşteri org.nr'yi doğrular;
      şirket kurulunca doldurulacak

Bilinen ve bilerek ertelenen:

- [ ] **Google Fonts rıza öncesi yükleniyor.** GDPR açısından sorunlu (IP adresi
      Google'a gidiyor). Doğru çözüm yazı tiplerini kendi sunucumuzdan sunmak;
      bu ortamda fonts.gstatic.com engelli olduğu için indirilemedi

## Web — sıradaki geliştirmeler

- [ ] **Ürün görselleri** — Shopify'a yüklenince otomatik gelir; şu an renk bloğu
- [ ] **Kargo tutarını Shopify'dan al** — satır şimdilik "tahminidir" diye
      etiketlendi; kesin çözüm `cartCreate` sonrası `cart.cost` okumak
- [ ] **Ürün varyantları** — şu an ilk varyant kullanılıyor; beden/renk seçimi yok
- [ ] **Yorumlar** — Judge.me veya Shopify metafield
- [ ] **Sepet Shopify'da tutulsun** — şu an localStorage; `cartId` saklanırsa
      cihazlar arası ve terkedilmiş sepet e-postası mümkün olur
- [ ] **E-posta yakalama** — ücretsiz kargo karşılığı pop-up, Klaviyo
- [ ] **Görsel optimizasyonu** — `next/image` + Shopify CDN loader

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
- [x] Arama ve sıralama (durum URL'de)
- [x] Yasal metinler `docs/sozlesmeler/`'den siteye bağlandı; eksik alan varsa
      "taslak" uyarısı + `noindex`
- [x] GA4 yalnızca rıza sonrası yükleniyor
- [x] Ödeme doğrulaması için 12 birim testi (`npm test`)
