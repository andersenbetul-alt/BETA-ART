# QBLOGG üye sistemi (Q Brief Pro) — kurulum ve mimari

Tarih: 24.08.2026 · Durum: v1 kod hazır, Supabase projesi kullanıcı adımı bekliyor
Karar kaydı: kullanıcı onayı ile — ayrı üye uygulaması · kapsam Q Brief Pro ·
giriş yöntemi magic link (şifresiz). İş modelindeki karşılığı: B1→B2 basamağı
(`docs/is-modeli.md`).

## Mimari

```
qblogg.com (mevcut site)          DEĞİŞMEDİ — sıfır bağımlılık, statik
        │  (yalnız bağlantı)
        ▼
uye.qblogg.com (yeni, ayrı Vercel projesi)
  uye/index.html   tek dosyalık istemci: magic link girişi + brief arşivi
  uye/config.js    Supabase adresi + anon anahtarı (tek yapılandırma noktası)
  uye/vercel.json  bu uygulamaya özel başlıklar/CSP
        │
        ▼
Supabase (auth.users + Postgres)
  uye/schema.sql   profiles + briefs + RLS politikaları
```

- Ana sitenin dağıtımı `uye/` klasörünü hiç kopyalamaz; iki uygulama ayrı
  Vercel projeleridir. Sitenin "çerez yok, üçüncü taraf yok" vaadi bozulmaz —
  o vaat qblogg.com içindir, üye uygulamasının kendi gizlilik notu olacaktır.
- Üye uygulaması bilinçli olarak derlemesizdir: tek HTML + supabase-js'in
  esm.sh üzerinden ESM importu. CSP yalnız esm.sh ve *.supabase.co'ya izin verir.
- Gövde metinleri `textContent` ile basılır (markdown şimdilik düz metin
  gösterilir) — HTML enjeksiyon yüzeyi yoktur.

## Veri modeli ve engine ile ilişki

v1 iki tablodur: `profiles` (auth.users'a bağlı; `plan_status`:
free/active/lapsed) ve `briefs` (arşiv; `is_sample=true` olanlar girişsiz
tanıtım içeriğidir). Erişim RLS ile: aktif olmayan üye yalnız örnekleri görür.

`engine/schema-billing.sql`'in dört tasarım kararı bilinçli olarak v2'ye
devredildi ve UNUTULMAMALI:
1. Para tam sayı (øre) saklanır.
2. Bakiye sütunu değil append-only kredi defteri.
3. **Hak (entitlement) ödemeden ayrıdır** — v1'deki `plan_status` alanı bu
   ilkenin kısayoludur; Stripe webhook bağlanınca (v2, Supabase edge function)
   entitlement tablosuna geçilir.
4. Webhook tekilliği (aynı olay iki kez işlenmez).

v1'de ödeme durumu elle güncellenir: Supabase panel → Table editor →
profiles → ilgili satırda `plan_status` = `active` (ödeme onayı sizden geçer).

## Kurulum — sizin adımlarınız (adım adım)

1. **Supabase projesi açın:** supabase.com → Sign in → **New project**.
   Organization: kendi hesabınız; Name: `qblogg-uye`; Database password:
   güçlü bir şifre (not alın, bana GÖNDERMEYİN); Region: **eu-north-1
   (Stockholm)** ya da en yakın AB bölgesi → **Create new project**.
   1-2 dakika kurulum sürer.
2. **Şemayı çalıştırın:** sol menü **SQL Editor** → New query →
   depodaki `uye/schema.sql` içeriğini yapıştırın → **Run**.
   "Success. No rows returned" görmelisiniz. Hata görürseniz mesajı bana
   aynen yapıştırın.
3. **Auth ayarı:** sol menü **Authentication → URL Configuration** →
   *Site URL* alanına üye uygulamasının adresini yazın (ilk aşamada
   `https://qblogg-uye.vercel.app`, alan adı bağlanınca
   `https://uye.qblogg.com`) → Save. (Magic link e-postaları varsayılan
   Supabase göndericisiyle çalışır; özel gönderici v2 konusu.)
4. **Anahtarları alın:** **Project Settings → API** → şu ikisini bana
   yapıştırın: *Project URL* ve *anon public* anahtarı. (service_role
   anahtarını PAYLAŞMAYIN — istemediğim tek anahtar o.)
5. Gerisi bende: anahtarları `uye/config.js`'e işler, `qblogg-uye` Vercel
   projesini dağıtır, giriş akışını uçtan uca test ederim.

## v1 sınırları (bilinçli)

- Ödeme entegrasyonu yok (elle aktivasyon) — Stripe Payment Link +
  webhook v2.
- Tek dil (TR) — talep olursa i18n.
- Brief içerikleri düz metin — zengin biçim v2.
- Ana siteye "Üye girişi" bağlantısı, uygulama canlıya çıkınca eklenecek
  (iskelet kuralı gereği 8 sayfada birden).
