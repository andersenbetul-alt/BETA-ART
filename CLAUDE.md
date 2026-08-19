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
npm run audit:a11y   # erişilebilirlik (önce npm run build; tarayıcı gerekir)
```

`audit:a11y` `npm run check` içinde **değildir** — tarayıcı gerektirir. Arayüzde
renk veya işaretleme değiştiren her değişiklikten sonra ayrıca çalıştır.
Ortamda hazır Chromium varsa `PLAYWRIGHT_CHROMIUM_EXECUTABLE` ile yolunu ver.

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

### Ölçüm — onay gerektirmeyecek şekilde tasarlandı

`src/lib/analytics.ts` olay sözleşmesini tanımlar; `src/components/track.tsx`
sunucu görünümleriyle tarayıcı arasındaki köprüdür (`TrackedLink`,
`TrackedAnchor`, `TrackView`, `TrackVisible`).

Yük tipi bilinçli olarak dar: `where` kapalı bir yüzey kümesi, `id` yalnızca
`ArticleId | JobId`, `locale` iki değer. `id` alanı `string` olsaydı bir gün
oraya kullanıcıdan gelen bir değer sızabilirdi — birleşim tipi bunu derleme
zamanında engelliyor, `tests/analytics.test.ts` de çalışma zamanında doğruluyor.
Çerez, kalıcı kimlik ve serbest metin olmadığı için onay bandına gerek yok;
bant hem dönüşümü düşürür hem de kullanıcıdan gereksiz bir karar ister.

`NEXT_PUBLIC_ANALYTICS` tanımlı değilse hiçbir olay gönderilmez. Sağlayıcı
takıldığında yalnızca `resolveSink()` değişir; olay sözleşmesi aynı kalır.
**Gizlilik metnindeki çerez bölümü bu tasarımı anlatıyor** — çerez kullanan
veya kullanıcıyı oturumlar arası eşleştiren bir sağlayıcı seçilirse o metin de
güncellenmek zorundadır (bir test bölümün varlığını kontrol eder, içeriğin
doğruluğunu değil).

`funnelQuestions` her olayın hangi soruya cevap verdiğini tutar. Soru
yazılamayan olay eklenmez; sorusu olmayan ölçüm birikir ama karar üretmez.

### Güvenlik notları

`<script type="application/ld+json">` içine gömülen her şey `src/lib/json-ld.ts`
içindeki `jsonLd()` ile kaçırılır — `JSON.stringify` doğrudan kullanılırsa
sözlüğe girecek bir `</script>` dizisi etiketi kapatır.

İletişim formunda dakikada üç talep sınırı vardır ve **doğrulamadan sonra**
çalışır; korunan şey e-posta gönderimidir, formu düzelte düzelte dolduran
kullanıcı kilitlenmemelidir. Sınır bellekte tutulur, yani sunucu örneği başına
geçerlidir; ciddi bir kötüye kullanım olursa kalıcı bir depoya taşınmalı.

### `"use server"` dosyaları yalnızca async fonksiyon dışa aktarabilir

`src/lib/actions.ts` bu yüzden yalnızca `submitContactForm` dışa aktarır.
Formun paylaşılan tipleri ve başlangıç durumu `src/lib/contact.ts` içindedir.
Bu ayrımı bozarsan derleme geçer ama **çalışma zamanında 500 alırsın** — hata
yalnızca form gönderilince ortaya çıkar.

### İç içe dinamik rotalarda `generateStaticParams`

İlan detay sayfaları her iki segmenti de kendisi üretir (`{ locale, slug }`),
üst segmentten gelen `params`'a güvenmez. Yalnızca kendi dilinin adreslerini
döndürdüğü için `/en/kariyer/...` gibi karışık kombinasyonlar 404 olur.

### Artımlı derleme bayat HTML bırakabiliyor

Turbopack artımlı derlemesi, CSS chunk adı değiştiğinde önceden üretilmiş HTML'i
yenilemeyebiliyor; sayfa var olmayan bir stil dosyası isteyip stilsiz açılıyor.
Bu oturumda iki kez yaşandı. Görsel bir değişikliği doğrulamadan önce
`rm -rf .next && npm run build` yap. Vercel her dağıtımda temiz derlediği için
üretimi etkilemiyor.

## Ürün: AI Workforce

`/tr/ai-workforce` ve `/en/ai-workforce` (slug iki dilde de aynı, tek rota
dosyası her ikisini karşılıyor). Ajan kimlikleri `src/content/agents.ts`
içinde sabit birleşim tipi; bağlandıkları sistemler ürün adı olduğu için
sözlükte değil orada durur. Sözlükler `Record<AgentId, Agent>` tuttuğu için
bir ajanı tek dilde tanımlamak derlemeyi kırar.

Sayfanın yapısı bilinçli: **önce ne olmadığı**, sonra kurulum süreci, sonra
roller, sonra sizden gerekenler, sonra nerede önermediğimiz. Bu ürün aşırı
vaade en açık kategori; "nerede önermiyoruz" bölümünü zayıflatma.

## Metin ilkeleri

Site metinleri beş maddelik bir kontrolden geçer. Kurallar
`tests/copy-principles.test.ts` içinde zorunlu kılınmıştır, çünkü belge olarak
kalan bir ilke üçüncü düzenlemede unutulur.

1. **Bir istisnayla yanlışlanabilecek mutlak ifade kullanma.** Ne olduğunu
   yaz, ne olmadığını değil.
2. **Olgu sıfattan önce gelir.** NAVIAR yeni bir firma; uydurulabilecek
   müşteri sayısı yok. Bunun yerine doğrulanabilir yapısal olgular gösterilir
   (`home.hero.facts`).
3. **Mümkün olan en kısa hâl.** İddia metinleri iki cümleyi geçmez.
4. **Gelecek hakkında garanti verilmez.** "İki iş günü içinde döneceğiz"
   yerine "genellikle iki iş günü içinde". Süre bildiren her cümlede bir
   koşul belirteci bulunmalıdır.
5. **Doğrulanmamış iddia yazılmaz.** Deneyim firmaya değil kurucuya
   atfedilir; belirsiz olan hiç yazılmaz.

Testin kapsamı bilinçli olarak **kurumun kendi hakkındaki iddialarıdır**.
İçgörü yazılarının ve ilanların gövde metni kapsam dışıdır — orada
"her zaman" bir gözlemi anlatır, kurumsal taahhüdü değil.

## Renk ve kontrast

Masaüstü menü eşiği `xl` (1280px) — yedi başlık 1024px'te sığmıyordu.
Menüye yeni başlık eklerken taşmayı ölç.

Açık zeminlerde metin opaklığı **`/70`'in altına inmemeli** — `ink-800/65` ve
altı WCAG AA eşiğinin (4.5:1) altında kalıyor. Küçük metinde vurgu rengi olarak
`accent-700` kullan; `accent-600` yalnızca büyük metin ve ikonlar için yeterli.
Bu değerler `sand-100` (en koyu açık zemin) üzerinde hesaplanmıştır.

## Testler

`tests/` altında Vitest. Kapsam bilinçli olarak kırılgan mantığa odaklı:

- `i18n.test.ts` — adres üretimi, dil eşleme, gidiş-dönüş tutarlılığı
- `content.test.ts` — iki sözlüğün ayrışmaması, boş metin olmaması, ilan ve yazı bütünlüğü
- `contact.test.ts` — doğrulama, bot tuzağı, hız sınırı, e-posta yükü, gönderim hatası
- `analytics.test.ts` — olay sözleşmesi, yükün kişisel veri taşımaması
- `seo.test.ts` — sitemap kapsamı, canonical/hreflang, Open Graph
- `copy-principles.test.ts` — metin ilkeleri (mutlak ifade, garanti dili,
  cümle sayısı, kanıt bloğu)

Kontrast ve işaretleme hataları testlerle değil `npm run audit:a11y` ile yakalanır.

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
- `NEXT_PUBLIC_ANALYTICS` — sağlayıcı seçilmedi; site şu an ölçümsüz çalışıyor

## Dil

Kod yorumları, commit mesajları ve dokümantasyon Türkçedir. Kod tanımlayıcıları
(değişken, fonksiyon, tip adları) İngilizcedir.
