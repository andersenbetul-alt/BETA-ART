# 08 — Shopify Kurulumu (mevcut mağaza → COBBAN)

## Mevcut durum

| | |
|---|---|
| Mağaza adı | **Min butikk** (varsayılan Norveççe ad) |
| Domain | `p8q2mw-ab.myshopify.com` |
| Plan | **trial — satışa başlamadan önce ücretli plana geçmen gerekiyor** |
| Para birimi | NOK |
| Ülke / saat dilimi | Norveç / CEST |
| E-posta | andersen.betul@gmail.com |

> ⚠️ **Plan: trial — you'll need to upgrade before you can start selling and unlock full features**

## 1. Temel ayarlar (Settings)

### Store details
- [ ] Store name: `Min butikk` → **`COBBAN`**
- [ ] Store contact email: `hei@cobban.com`
- [ ] Sender email: `hei@cobban.com` (SPF/DKIM doğrulaması yap — mailler spam'e düşmesin)
- [ ] Billing address = şirket adresi (org.nr geldikten sonra güncelle)
- [ ] Standards and formats: metric, NOK, `dd.mm.yyyy`
- [ ] Order ID prefix: `CB-`

### Domain
- [ ] `cobban.com` satın al → Settings > Domains > Connect existing domain
- [ ] `www` → apex yönlendirmesi, SSL otomatik
- [ ] `cobban.no` alındığında ikinci domain olarak bağla (Markets ile NO'ya yönlendir)

### Plan
- [ ] Trial'dan **Basic** plana geç (satış öncesi zorunlu)
- [ ] Yıllık ödeme %25 indirim sağlıyor — nakit varsa tercih et

## 2. Ödeme (Payments)

- [ ] **Shopify Payments** aktive et (org.nr + banka hesabı gerekir)
- [ ] **Vipps** uygulamasını kur — Norveç'te olmazsa olmaz
- [ ] **Klarna** (fatura / taksit) — Norveç'te sepet ortalamasını artırır
- [ ] PayPal — uluslararası müşteri için
- [ ] Türkiye satışı için ayrı: **iyzico** veya TR mağazası (bkz. Markets)
- [ ] Manual payment: kapalı tut

## 3. Vergi (Taxes and duties)

- [ ] Norway: **MVA %25**, "All prices include tax" ✅ (Norveç'te yasal zorunluluk)
- [ ] MVA numarası geldiğinde Settings > Taxes > Norway > VAT number gir
- [ ] Diğer ülkeler: "Collect tax" kapalı başla; IOSS/VOEC alınca aç
- [ ] Duties & import taxes: **DDU/DAP** başla (müşteri gümrükte öder, açıkça yaz)
      → hacim artınca **DDP**'ye geç (sen ödersin, dönüşüm artar)

## 4. Kargo (Shipping and delivery)

Kargo bölgeleri:

| Bölge | Ücret | Ücretsiz eşik |
|---|---|---|
| Norge | 79 NOK | 799 NOK |
| Norden (SE/DK/FI) | 129 NOK | 1.299 NOK |
| EU | 179 NOK | 1.999 NOK |
| Türkiye | 149 NOK | 1.499 NOK |
| Resten av verden | 249 NOK | — |

- [ ] Bring/Posten uygulamasını kur (etiket + takip)
- [ ] Paket boyut profillerini tanımla (S/M/L) — yanlış boyut kâr yer
- [ ] Local pickup: Oslo'daysan aç, ücretsiz

## 5. Markets (çok ülke / çok dil / çok para birimi)

- [ ] **Primary market:** Norway (NOK, Norveççe)
- [ ] Market 2: European Union (EUR, İngilizce)
- [ ] Market 3: Türkiye (TRY, Türkçe)
- [ ] Market 4: Rest of world (EUR/USD, İngilizce)
- [ ] Diller: **Norsk bokmål (varsayılan), English, Türkçe**
      → Settings > Languages > Add language
- [ ] Çeviri uygulaması: **Translate & Adapt** (Shopify resmî, ücretsiz)
- [ ] Fiyatlar: otomatik kur **kapalı**, her market için el ile yuvarlanmış fiyat

## 6. Ürün yapısı (çok kategorili mağaza için)

```
Koleksiyonlar (ana menü)
├── Hjem & interiør      (ev & dekorasyon)
├── Klær & tilbehør      (giyim & aksesuar)
├── Skjønnhet            (kozmetik & bakım)
├── Gaver                (hediyelik)
└── Nyheter / Bestselgere / Tilbud  (otomatik koleksiyonlar)
```

**Her ürün için zorunlu alanlar**
- [ ] Başlık: `Ürün adı – ayırt edici özellik` (60 karakter altı)
- [ ] Açıklama: 1 vaat cümlesi + 3 madde + malzeme/ölçü tablosu
- [ ] En az 4 görsel, 1:1 oran, beyaz/fog zemin + 1 kullanım görseli
- [ ] SKU: `CB-<KATEGORİ>-<3 harf>-<3 rakam>` ör. `CB-HOME-CER-001`
- [ ] Barkod (EAN) — pazaryerleri için gerekir
- [ ] Ağırlık + paket boyutu (kargo hesabı doğru olsun)
- [ ] HS kodu + menşe ülke (**gümrük için zorunlu**, Shopify'da ürün > Shipping altında)
- [ ] SEO başlık + açıklama (üç dilde de)

## 7. Kurulacak uygulamalar (öncelik sırası)

| Uygulama | Ne için | Maliyet |
|---|---|---|
| **Vipps** | Norveç ödeme | Ücretsiz kurulum |
| **Translate & Adapt** | Çok dilli | Ücretsiz |
| **Bring / Posten** | Kargo etiketi | Ücretsiz |
| **Judge.me / Loox** | Ürün yorumları (görselli) | ~15 USD/ay |
| **Klaviyo** | E-posta + SMS otomasyonu | Ücretsiz → 20 USD/ay |
| **Shopify Search & Discovery** | Filtre + arama | Ücretsiz |
| **Shipentegra / Entegrabaz** | TR pazaryeri + stok senkron | ~30 USD/ay |
| **Shopify Flow** | Otomasyon (stok uyarısı, sipariş etiketi) | Ücretsiz |

> **Uygulama enflasyonuna dikkat:** her uygulama site hızını düşürür.
> 8'den fazla uygulama kurma; 3 ayda bir kullanılmayanları sil.

## 8. Yasal sayfalar (Settings > Policies)

Shopify'ın otomatik şablonlarını **kullanma** — genel ve eksikler.
`docs/sozlesmeler/` klasöründeki metinleri yapıştır:

- [ ] Salgsbetingelser / Terms of sale / Mesafeli Satış Sözleşmesi
- [ ] Personvernerklæring / Privacy policy / KVKK Aydınlatma Metni
- [ ] Angrerett / Refund policy / İade ve Cayma Politikası
- [ ] Frakt / Shipping policy / Teslimat Politikası
- [ ] Informasjonskapsler / Cookie policy / Çerez Politikası
- [ ] Footer'a: org.nr, şirket adı, adres, ETBİS bandı (TR satışı için)

## 9. Checkout ayarları

- [ ] Misafir ödeme **açık** (hesap zorunlu değil)
- [ ] Tek sayfa checkout
- [ ] Adres otomatik tamamlama açık
- [ ] Pazarlama izni kutusu **işaretsiz** gelsin (GDPR — önceden işaretli olamaz)
- [ ] Terkedilmiş sepet e-postası: 1 saat / 24 saat / 72 saat
- [ ] Sipariş sonrası: kargo takip e-postası + teslimat sonrası yorum daveti (7. gün)

## 10. Lansman öncesi son kontrol

- [ ] Ücretli plana geçildi
- [ ] Test siparişi verildi (gerçek kart, sonra iade)
- [ ] Vipps test edildi
- [ ] Mobilde tüm akış denendi
- [ ] Tüm ürünlerde HS kodu + menşe var
- [ ] Üç dilde de checkout denendi
- [ ] Şifre koruması kaldırıldı (Online Store > Preferences)
- [ ] Google Search Console + Analytics 4 + Meta Pixel bağlandı
