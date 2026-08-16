# BETA ART Archive — Teknik Denetim (kod değiştirilmedi)

Denetim salt-okunur yapıldı. Aşağıda önce mevcut durum, sonra P0/P1/P2 önceliklerle eksikler ve her madde için somut teknik çözüm var.

## Mevcut durum (uygulanmış)

- TanStack Start v1 + React 19 + Vite, dosya tabanlı 7 route: `/`, `/plates/$slug`, `/contact`, `/privacy`, `/license-terms`, `/refunds`.
- Tasarım sistemi: Tailwind v4, `src/styles.css` içinde token'lar; `focus-ring` yardımcı sınıfı mevcut.
- İçerik tamamen statik: 12 plaka `src/data/collection.ts` içinde sabit dizi; tüm metadata `PLACEHOLDER` ("To be supplied"), doğrulama durumu "Awaiting verified original".
- Merkezî placeholder yönetimi: `src/config/site.ts` + launch checklist yorumları.
- SEO: her sayfada `head()`, canonical, robots index,follow, OG/Twitter, ana sayfa ve plaka sayfalarında JSON-LD; `public/robots.txt` var.
- Görseller: 8 adet JPG, `width`/`height` ve `loading="lazy"` verilmiş.
- Hata yakalama: `src/lib/error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts`, `__root` errorComponent.
- Güvenlik altyapısı: `src/start.ts` içinde CSRF middleware + error middleware aktif.
- Form doğrulama: `LicenseRequestForm.tsx` içinde el yazımı validasyon (uzunluk + e-posta regex), aria-invalid/aria-describedby, success state.

## Yalnızca demo / hiç yok

- Veritabanı yok: `supabase/` altında sadece `config.toml`, migration yok, tablo yok. `src/integrations/supabase/*` istemcileri duruyor ama hiçbir yerden kullanılmıyor.
- Auth/rol yok, admin paneli yok, yükleme yok, EXIF/RAW/C2PA doğrulaması yok, sipariş/lisans kaydı yok, ödeme yok, dosya teslimi yok, release kayıtları yok.
- Form hiçbir yere göndermiyor (`TODO (LAUNCH)`), e-posta/bildirim yok.
- Test yok (vitest/playwright bağımlılığı ve test dosyası yok), rate limiting yok, CI kalite kapısı yok.

---

## P0 — Launch engelleyiciler

1. **Kalıcı veri katmanı yok.** Çözüm: Lovable Cloud'da şema — `plates`, `plate_assets`, `licenses`, `license_requests`, `orders`, `releases`, `provenance_records`. Her `CREATE TABLE` sonrası GRANT + RLS + policy. Genel katalog için yalnızca `anon SELECT` (published plakalar), yazma yolu sadece server function.
2. **Sipariş/lisans talebi kaydedilmiyor.** Çözüm: `src/lib/orders.functions.ts` içinde `createServerFn({method:"POST"}).inputValidator(zod schema).handler()` → `license_requests` insert + admin bildirimi (Resend/e-posta connector). Formu bu fonksiyona bağla, "gönderilmedi" uyarısını kaldır.
3. **Auth ve rol modeli yok.** Çözüm: Cloud auth (e-posta + Google), `app_role` enum + ayrı `user_roles` tablosu + `has_role()` security-definer fonksiyonu. Admin route'ları `_authenticated/` altında; server fn'lerde `requireSupabaseAuth` middleware ve `start.ts`'e `attachSupabaseAuth` eklenmesi.
4. **Güvenli dosya teslimi yok.** Çözüm: private storage bucket (`originals`, `deliverables`); public URL asla verme. Ödeme/onay sonrası server fn ile kısa ömürlü signed URL (10–15 dk), indirme sayacı ve `download_tokens` tablosu; RAW dosyaları hiçbir koşulda müşteriye açılmaz.
5. **Ödeme yok.** Çözüm: Stripe Checkout — server route `src/routes/api/public/stripe-webhook.ts` (imza doğrulaması zorunlu), `orders.status` webhook ile `paid`'e geçer, teslim yalnız `paid` sonrası. Fiyatlar sunucuda hesaplanır, istemciden gelen tutara asla güvenilmez.
6. **Production güvenliği.** Çözüm: tüm sır okumaları `.handler()` içinde `process.env`; admin client sadece doğrulamadan sonra dinamik import; `/api/public/*` uçlarında imza/secret kontrolü; CSP + `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` başlıkları (SSR response header'ları).

## P1 — Ürün güvenilirliği

7. **Fotoğraf yükleme ve EXIF/RAW doğrulaması yok.** Çözüm: admin yükleme ekranı → storage'a doğrudan yükleme; server fn ile EXIF çıkarımı (Worker-uyumlu saf JS `exifr`; `sharp`/native paket kullanılamaz), çıkarılan alanlar `provenance_records`'a yazılır. RAW varlığı checksum (SHA-256) ile kaydedilir; C2PA manifesti varsa `c2pa` alanına doğrulama sonucu, yoksa "Not provided". "Human Verified" rozeti yalnız RAW + capture record + imzalı lisans üçü de doluysa gösterilir (şu an doğru şekilde kapalı).
8. **Telif / model / property release kayıtları yok.** Çözüm: `releases` tablosu (tip: model/property, imza tarihi, dosya referansı, geçerlilik, bölge) + `plate_releases` ilişkisi. Ticari/Extended lisans akışında release eksikse sipariş engellenir; admin panelinde uyarı.
9. **Rate limiting yok.** Çözüm: `rate_limits` tablosu veya KV üzerinden IP+e-posta bazlı pencere (örn. form için 5/saat), server fn/handler başında kontrol, aşımda 429; ayrıca honeypot alanı + Turnstile.
10. **Test yok.** Çözüm: vitest + Testing Library (form validasyonu, fiyat hesabı, provenance görünürlük kuralı), Playwright e2e (katalog → plaka → talep akışı), CI'da `tsgo` + eslint + test.
11. **Hata izleme yüzeysel.** Çözüm: mevcut `error-capture` korunur; üstüne Sentry (client + server fn sarmalayıcı), release/sourcemap yükleme, kullanıcıya sızmayan sağlayıcı hataları.
12. **Görsel optimizasyonu eksik.** Çözüm: AVIF/WebP türevleri + `<picture>`/`srcset` ile 480/960/1440/1920 varyantları, hero için `fetchpriority="high"` ve `loading="eager"`, diğerleri lazy (mevcut), storage önünde CDN dönüşümü. Şu anki 100–130 KB JPG'ler geçici; gerçek arşiv görselleri çok daha büyük olacağı için pipeline şart.

## P2 — Cila

13. **SEO/structured data.** `sitemap.xml` yok → `src/routes/sitemap[.]xml.ts` server route ile dinamik üret; robots.txt'e sitemap satırı. JSON-LD'de yalnızca bilinen alanlar (şu an doğru); gerçek veri geldikçe `ImageObject.creator`, `contentUrl`, `Offer.price` doldurulur. `og:image` gerçek 1200×630 ile değişmeli; plaka sayfalarında mutlak `og:image` eklenmeli.
14. **Erişilebilirlik.** Skip-link, mobil menüde focus trap + Escape, `aria-current` navigasyon, form hata özeti (`role="alert"` + ilk hatalı alana odak), kontrast denetimi (muted metinler), `prefers-reduced-motion`. Otomatik kontrol için axe-playwright.
15. **Performans.** Font `display=swap` var; kritik fontları preload et, kullanılmayan Radix/recharts bağımlılıklarını kaldır (bundle'da gereksiz yük), route bazlı prefetch ayarı.
16. **İçerik/uyum.** Legal sayfalar şablon; hukuki inceleme, KVKK/GDPR veri işleme metni, çerez politikası (analitik eklenirse), fatura zorunlu alanları (org no, VAT) hâlâ `To be supplied`.

## Önerilen sıra

1) Şema + RLS/GRANT → 2) auth + roller → 3) talep formunu server fn'e bağla → 4) admin yükleme + EXIF/provenance → 5) release kayıtları → 6) ödeme + signed delivery → 7) rate limit, testler, izleme → 8) görsel pipeline, sitemap, a11y cilası.
