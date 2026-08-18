# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Proje

NAVIAR danışmanlık firmasının çift dilli (TR/EN) kurumsal web sitesi.
Next.js 16 App Router, TypeScript, Tailwind CSS v4. Sürekli geliştirilen bir proje.

## Komutlar

```bash
npm run dev          # geliştirme sunucusu
npm run build        # production derlemesi (rota tablosunu da gösterir)
npm run check        # tip + lint + test — değişiklikten sonra bunu çalıştır
npm test             # yalnızca testler
npm run test:watch   # izleme modunda
```

Tek bir test dosyası veya tek bir test:

```bash
npx vitest run tests/i18n.test.ts
npx vitest run -t "ilan detayında aynı ilanda kalır"
```

`npm run check` yeşilse de rota davranışı değiştiyse `npm run build` çıktısındaki
rota tablosuna bak: hangi adreslerin statik üretildiğini orada görürsün.

## Mimari

### Çok dillilik — her dilin kendi slug'ı var

Kök layout `src/app/[locale]/layout.tsx` altındadır (Next.js'in izin verdiği
i18n düzeni); `src/app/layout.tsx` **yoktur**, eklenirse dil segmenti bozulur.

Her sayfanın her dilde ayrı bir dizini vardır ve **her dosya yalnızca kendi
dilinde render eder, diğerinde `notFound()` çağırır**:

```
src/app/[locale]/hizmetler/page.tsx   -> locale !== "tr" ise 404
src/app/[locale]/services/page.tsx    -> locale !== "en" ise 404
```

İkisi de `src/views/services.tsx` içindeki aynı görünümü render eder. Amaç her
içeriğin tek bir canonical adresi olması; `/en/hizmetler` bilinçli olarak 404'tür.

Sözleşme: **görünüm mantığı `src/views/` içinde, rota dosyaları yalnızca dil
kontrolü + metadata.** Rota dosyalarına iş mantığı koyma.

### Yönlendirme tablosu tek kaynaktır

`src/lib/i18n.ts` içindeki `routes` tablosu menüyü, dil değiştiriciyi, sitemap'i
ve hreflang etiketlerini besler. Yeni sayfa eklerken önce buraya anahtar ekle;
diğerleri kendiliğinden güncellenir.

`navKeys` diziden türetilir (`as const satisfies readonly RouteKey[]`), bu yüzden
menüde görünecek sayfalar içerik sözlüğündeki `nav` alanıyla derleme zamanında
eşleşmek zorundadır. Yeni rota eklemek menüyü kazara genişletmez.

`/` adresi `src/proxy.ts` içinde `Accept-Language` başlığına göre yönlendirilir.
(Next.js 16'da `middleware` → `proxy` olarak yeniden adlandırıldı.)

### İçerik: iki sözlük, tek tip

Sitedeki **tüm metinler** `src/content/tr.ts` ve `en.ts` içindedir; bileşenlerde
sabit metin yoktur. İkisi de `src/content/types.ts` içindeki `Dictionary` tipine
uyar, dolayısıyla bir dilde alan eklerken diğerini unutmak derleme hatasıdır.

### Dilden bağımsız kimlikler

URL'de veya bağlantı çıpasında görünen kimlikler **iki dilde de aynıdır** ve
paylaşılan modüllerde sabit birleşim tipi olarak tanımlanır:

- `src/content/jobs.ts` → `jobIds` (ilan adresleri: `/tr/kariyer/<id>`)
- `src/content/articles.ts` → `articleIds` (yazı adresleri: `/tr/icgoruler/<id>`)
- `src/content/practices.ts` → `practiceIds` (çıpa: `/tr/hizmetler#<id>`)

`articleIds` dizisinin **sırası listeleme sırasıdır** — en yeni yazı başa
eklenir; bir test bu sıranın tarihlerle tutarlı kalmasını doğrular.

Sözlükler bunları `Record<JobId, ...>` olarak tutar, yani bir ilanı tek dilde
tanımlamak derlemeyi kırar. Kimlikler dilden bağımsız olduğu için dil değiştirici
ilan detayında aynı ilanda kalabiliyor (`alternatePath` bölümü çevirir, alt
segmentleri korur). Bu tercihi bozma — ilan slug'ını dile göre değiştirirsen dil
değiştirici listeye düşer.

### `"use server"` dosyaları yalnızca async fonksiyon dışa aktarabilir

`src/lib/actions.ts` bu yüzden yalnızca `submitContactForm` dışa aktarır.
Formun paylaşılan tipleri ve başlangıç durumu `src/lib/contact.ts` içindedir.
Bu ayrımı bozarsan derleme geçer ama **çalışma zamanında 500 alırsın** — hata
yalnızca form gönderilince ortaya çıkar.

### İç içe dinamik rotalarda `generateStaticParams`

İlan detay sayfaları her iki segmenti de kendisi üretir (`{ locale, slug }`),
üst segmentten gelen `params`'a güvenmez. Yalnızca kendi dilinin adreslerini
döndürdüğü için `/en/kariyer/...` gibi karışık kombinasyonlar 404 olur.

## Testler

`tests/` altında Vitest. Kapsam bilinçli olarak kırılgan mantığa odaklı:

- `i18n.test.ts` — adres üretimi, dil eşleme, gidiş-dönüş tutarlılığı
- `content.test.ts` — iki sözlüğün ayrışmaması, boş metin olmaması, ilan ve yazı bütünlüğü
- `contact.test.ts` — doğrulama, bot tuzağı, e-posta yükü, gönderim hatası
- `seo.test.ts` — sitemap kapsamı, canonical/hreflang, Open Graph

Bileşen render testi yoktur; görsel doğrulama tarayıcıda yapılır.

## Ortam değişkenleri

`.env.example` dosyasına bak. `NEXT_PUBLIC_SITE_URL` canonical adresleri ve
sitemap'i belirler. `RESEND_API_KEY` / `CONTACT_INBOX` / `CONTACT_FROM` üçü
birden tanımlıysa iletişim formu e-posta gönderir; değilse talep sunucu
günlüğüne yazılır ve kullanıcıya yine onay gösterilir.

## Yer tutucular — yayına almadan önce değişmeli

- `contact.details` (e-posta, telefon, adres) ve `careers.labels.applyEmail`
- `NEXT_PUBLIC_SITE_URL`
- `src/content/jobs.ts` içindeki ilan tarihleri (JobPosting verisine gider)
- Kariyer sayfasındaki dört ilan örnek içeriktir
- `src/content/articles.ts` içindeki yayın tarihleri (Article verisine gider)
- Gizlilik/KVKK metni hukuki incelemeden geçmemiştir

## Dil

Kod yorumları, commit mesajları ve dokümantasyon Türkçedir. Kod tanımlayıcıları
(değişken, fonksiyon, tip adları) İngilizcedir.
