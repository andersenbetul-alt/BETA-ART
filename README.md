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

## Yapı

```
data/categories.json            Kategorilerin tek kaynağı
data/workforce.json             AI Workforce ürün tanımı (roller, iş alanları, süreç, paketler)
docs/ai-workforce-playbook.md   Satış akışı, analiz şablonu, kurulum kontrol listesi
docs/payment-architecture.md    Ödeme mimarisi, kararlar, açık sorular
db/schema.sql                   Ödeme veritabanı şeması
db/seed.sql                     Ürün kataloğu ve kredi fiyatları
db/functions.sql                consume_credits, has_entitlement, grant_period_credits
db/test.sql                     Kredi ve erişim mantığı testleri
build.py                        JSON'lardan index.html ve work.html üretir
index.html                      Kategori sayfası (üretilen)
work.html                       AI Workforce sayfası (üretilen)
```

## Kullanım

İçerikleri `data/` altındaki JSON dosyalarında düzenleyin, ardından sayfaları
yeniden üretin:

```bash
python3 build.py
```

Sayfalar tek dosyadır, harici bağımlılığı yoktur ve doğrudan tarayıcıda
açılabilir. Duyarlıdır; açık/koyu temayı işletim sistemi tercihine göre uygular.
