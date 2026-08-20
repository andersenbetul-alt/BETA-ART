# BETA

BETA ürün ailesinin kategorileri ve ilk ürün olan **AI Workforce**'un
tanımı, satış sayfası ve kurulum playbook'u.

## Ürün kategorileri

| Kategori | Odak |
| --- | --- |
| **BETA WORK** | AI çalışanları — *ilk ürün* |
| BETA BUSINESS | şirket kurma |
| BETA CAREER | yeni kariyer |
| BETA LEARN | AI eğitimi |
| BETA CREATOR | içerik ve kişisel marka |
| BETA SENIOR | yaşlılara dijital destek |
| BETA LIFE | kişisel AI |

## İlk ürün: AI Workforce

> **AI çalışanlar şirketiniz için 24/7 çalışsın.**
>
> "Şirketinizde tekrar eden işleri analiz ediyoruz ve bunları AI çalışanlarıyla
> otomatikleştiriyoruz."

Küçük işletmeye kurulan üç AI çalışanı:

- **AI Receptionist** — gelen her temas karşılanır: telefon, WhatsApp, web,
  e-posta, randevu
- **AI Sales Assistant** — talep nitelenir, takip edilir, teklife dönüşür
- **AI Office Assistant** — evrak, son tarih, veri girişi, toplantı takibi

Bu üç rolün altında yedi iş alanı yer alır (Email, Customer Service, Sales,
Research, Content, Meeting, Admin). Teslimat beş adımlı akışla yapılır: analiz,
seçim, kurulum, devreye alma, ölçüm.

- Satış sayfası: `work.html`
- Ürün tanımı: `data/workforce.json`
- Kurulum ve satış playbook'u: [`docs/ai-workforce-playbook.md`](docs/ai-workforce-playbook.md)

## İş geliştirme incelemesi

Konseptin bütününe dair değerlendirme: kapasite tavanı, odak, hizmet-SaaS
tuzağı, GDPR yükümlülüğü, sıralama önerisi ve ilk 90 günde ölçülecekler.

- [`docs/business-review.md`](docs/business-review.md) — tam metin
- `review.html` — görsel özet (grafikler, `build_review.py` ile üretilir)

## Ödeme altyapısı

Tüm ürünler (blog, Curiosity Engine, AI business) tek merkezi ödeme
altyapısından satılır — ürün başına ayrı ödeme sistemi kurulmaz.

- Mimari ve kararlar: [`docs/payment-architecture.md`](docs/payment-architecture.md)
- Veritabanı şeması: `db/schema.sql` (20 tablo)
- İş kuralları: `db/functions.sql` (kredi düşme, erişim kontrolü)
- Testler: `db/test.sql`

Temel ilke: Stripe ve Vipps tahsilat kanalıdır, muhasebe defteri değil.
Erişim, abonelik ve kredi doğruluğunun tek kaynağı kendi veritabanımızdır.

```bash
# Şemayı ve testleri çalıştırma
psql -f db/schema.sql -f db/seed.sql -f db/functions.sql -f db/test.sql
```

## Metin standardı

Sayfalardaki bütün metinler Conversion Copy + UX Writing standardına göre
yazılır: başlık sonuç söyler, her sayfada tek net CTA bulunur, en güçlü üç
itiraz yazılıp cevaplanır, kanıt bölümüne uydurma ifade girmez.

- Standart ve kontrol listesi: [`docs/copy-standards.md`](docs/copy-standards.md)
- Arayüz mikro metinleri: `data/ux-copy.json`

## Ekip

21 rol, 7 fonksiyon grubu ve tetikleyiciye bağlı 5 işe alım dalgası.
Çekirdek ekip 7-9 kişi; roller tek kişide birleşir veya danışman olarak alınır.

- Organizasyon ve işe alım sırası: [`docs/team-and-org.md`](docs/team-and-org.md)
- Roller ve dalgalar: `data/team.json` → `team.html`

## Yapı

```
data/categories.json            Kategorilerin tek kaynağı
data/workforce.json             AI Workforce ürün tanımı (roller, iş alanları, süreç, paketler)
data/team.json                  Ürün ve web ekibi: roller, gruplar, işe alım dalgaları
data/ux-copy.json               Buton, form, hata, boş durum ve onay metinleri
docs/ai-workforce-playbook.md   Satış akışı, analiz şablonu, kurulum kontrol listesi
docs/payment-architecture.md    Ödeme mimarisi, kararlar, açık sorular
docs/team-and-org.md            Organizasyon yapısı ve işe alım sırası
docs/copy-standards.md          Metin standardı, yasak kalıplar, yayın kontrol listesi
docs/business-review.md         İş geliştirme incelemesi ve karar noktaları
db/schema.sql                   Ödeme veritabanı şeması
db/seed.sql                     Ürün kataloğu ve kredi fiyatları
db/functions.sql                consume_credits, has_entitlement, grant_period_credits
db/test.sql                     Kredi ve erişim mantığı testleri
build.py                        JSON'lardan index.html, work.html ve team.html üretir
build_review.py                 review.html (incelemenin görsel özeti) üretir
index.html                      Kategori sayfası (üretilen)
work.html                       AI Workforce sayfası (üretilen)
team.html                       Ekip ve organizasyon sayfası (üretilen)
```

## Kullanım

İçerikleri `data/` altındaki JSON dosyalarında düzenleyin, ardından sayfaları
yeniden üretin:

```bash
python3 build.py
```

Sayfalar tek dosyadır, harici bağımlılığı yoktur ve doğrudan tarayıcıda
açılabilir. Duyarlıdır; açık/koyu temayı işletim sistemi tercihine göre uygular.
