# NAVIAR — Kurumsal Web Sitesi

NAVIAR danışmanlık firmasının çift dilli (Türkçe / İngilizce) kurumsal web sitesi.
Yönetim & strateji danışmanlığı ile insan kaynakları & kurumsal eğitim uzmanlık
alanlarını tanıtır ve görüşme talebi toplar.

## Teknoloji

| Katman | Seçim |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 (CSS tabanlı `@theme` yapılandırması) |
| Yazı tipleri | Inter (metin) + Source Serif 4 (başlık), `next/font` ile |
| Form | React Server Action + sunucu tarafı doğrulama |

## Başlangıç

```bash
npm install
npm run dev      # http://localhost:3000
```

Diğer komutlar:

```bash
npm run build    # production derlemesi
npm start        # derlenmiş siteyi çalıştırır
npm run lint     # ESLint
npx tsc --noEmit # tip kontrolü
```

### Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | evet | Canonical adresler, `sitemap.xml` ve Open Graph bağlantıları bu değerden üretilir. Canlıya çıkmadan önce gerçek alan adıyla değiştirin. |
| `RESEND_API_KEY` | hayır | [Resend](https://resend.com) API anahtarı. Tanımlıysa görüşme talepleri e-posta ile iletilir. |
| `CONTACT_INBOX` | hayır | Taleplerin düşeceği e-posta adresi. |
| `CONTACT_FROM` | hayır | Gönderen adres. Resend'de doğrulanmış bir alan adına ait olmalıdır. |

Son üçü birlikte tanımlanmalıdır; biri eksikse e-posta gönderimi devre dışı kalır
ve talep yalnızca sunucu günlüğüne yazılır.

## Çok dillilik

Site iki dilde yayınlanır ve **her dilin kendi URL'leri** vardır:

| Sayfa | Türkçe | İngilizce |
| --- | --- | --- |
| Ana sayfa | `/tr` | `/en` |
| Hizmetler | `/tr/hizmetler` | `/en/services` |
| Yaklaşımımız | `/tr/yaklasim` | `/en/approach` |
| Hakkımızda | `/tr/hakkimizda` | `/en/about` |
| İletişim | `/tr/iletisim` | `/en/contact` |

- `/` adresi, tarayıcının `Accept-Language` başlığına göre `/tr` veya `/en` adresine
  yönlendirilir (`src/proxy.ts`). Desteklenmeyen bir dil gelirse varsayılan Türkçedir.
- Yanlış dilde açılan bir slug (örneğin `/en/hizmetler`) bilinçli olarak 404 döner;
  böylece her içeriğin tek bir canonical adresi olur.
- Dil değiştirici, bulunduğunuz sayfanın diğer dildeki karşılığına gider —
  ana sayfaya değil.
- Her sayfa `canonical` ve `hreflang` (`tr`, `en`, `x-default`) etiketlerini,
  `sitemap.xml` ise diller arası `alternate` bağlantılarını otomatik üretir.

## Klasör yapısı

```
src/
├── app/
│   ├── [locale]/            # Kök layout burada (dil segmenti kök parametredir)
│   │   ├── layout.tsx       # <html>, header/footer, metadata, JSON-LD
│   │   ├── page.tsx         # Ana sayfa (her iki dil)
│   │   ├── hizmetler/  services/    # Aynı içeriğin dile özel slug'ları
│   │   ├── yaklasim/   approach/
│   │   ├── hakkimizda/ about/
│   │   ├── iletisim/   contact/
│   │   └── not-found.tsx
│   ├── globals.css          # Tailwind teması ve temel stiller
│   ├── not-found.tsx        # Dil segmenti olmayan adresler için 404
│   ├── robots.ts
│   └── sitemap.ts
├── components/              # Header, footer, logo, iletişim formu, UI parçaları
├── content/                 # Tüm site metinleri (tr.ts / en.ts)
├── lib/                     # i18n yönlendirme tablosu, metadata, server action
├── views/                   # Sayfa gövdeleri (dil parametresi alır)
└── proxy.ts                 # Dil yönlendirmesi
```

## İçerik nasıl düzenlenir

Sitedeki **tüm metinler** `src/content/tr.ts` ve `src/content/en.ts` dosyalarındadır.
Bileşenlerin içinde sabit metin yoktur. Bir başlığı ya da hizmet açıklamasını
değiştirmek için yalnızca bu iki dosyayı düzenlemeniz yeterlidir.

İki dosya da `src/content/types.ts` içindeki `Dictionary` tipine uymak zorundadır;
bir dilde alan eklerken diğerini unutursanız `npx tsc --noEmit` hata verir.

Güncellenmesi gereken firma bilgileri (şu an yer tutucu):

- `contact.details` → e-posta, telefon, adres, çalışma saatleri
- `NEXT_PUBLIC_SITE_URL` → alan adı

Sosyal paylaşım görsellerindeki metin değişirse `public/og-tr.png` ve
`public/og-en.png` dosyalarının da yenilenmesi gerekir.

## Yeni sayfa ekleme

1. `src/lib/i18n.ts` içindeki `routes` tablosuna anahtarı ve iki dildeki slug'ı ekleyin.
   Menüde görünmesini istiyorsanız `navKeys` dizisine de ekleyin.
2. `src/content/types.ts` içine sayfanın içerik tipini, `tr.ts` ve `en.ts` içine
   metinleri yazın.
3. `src/views/` altına sayfa gövdesini oluşturun.
4. `src/app/[locale]/<tr-slug>/page.tsx` ve `src/app/[locale]/<en-slug>/page.tsx`
   dosyalarını mevcut sayfaları örnek alarak ekleyin.

Menü, dil değiştirici ve `sitemap.xml` `routes` tablosundan beslendiği için
ayrıca güncellenmeleri gerekmez.

## İletişim formu

Form, `src/lib/actions.ts` içindeki `submitContactForm` server action'ı ile çalışır.
Sunucu tarafında ad, e-posta ve mesaj doğrulanır; gizli bir alan ile basit bot
koruması yapılır.

Talep `deliverRequest` fonksiyonu ile iletilir:

- **Ortam değişkenleri tanımlıysa** Resend API'si üzerinden e-posta gönderilir.
  Gönderen kutusunda *yanıtla* dediğinizde doğrudan başvurana yanıt verilir
  (`reply_to` başvuranın adresine ayarlanır).
- **Tanımlı değilse** talep kaybolmasın diye sunucu günlüğüne yazılır ve
  konsola bir uyarı düşer.
- **Gönderim başarısız olursa** kullanıcıya sahte bir onay gösterilmez; hata
  mesajı görünür ve gerçek sebep sunucu günlüğüne yazılır.

Başka bir sağlayıcıya (SendGrid, Postmark, CRM vb.) geçmek için yalnızca
`deliverRequest` fonksiyonunun gövdesini değiştirmeniz yeterlidir; doğrulama ve
hata yönetimi çağıran tarafta durur.

> **Not:** `src/lib/actions.ts` dosyası `"use server"` işaretlidir ve yalnızca async
> fonksiyon dışa aktarabilir. Formun paylaşılan tipleri bu yüzden `src/lib/contact.ts`
> dosyasında durur.

## Erişilebilirlik ve SEO

- Klavye ile gezinme için "içeriğe atla" bağlantısı ve görünür odak halkası
- Form alanlarında `aria-invalid` / `aria-describedby` ile hata bildirimi
- Aktif menü bağlantısında `aria-current="page"`
- `prefers-reduced-motion` desteği
- Sayfa başına canonical, hreflang, Open Graph ve `ProfessionalService` JSON-LD
- Dile özel sosyal paylaşım görselleri (`public/og-tr.png`, `public/og-en.png`)
  ve markalı favicon (`src/app/icon.svg`)

## Yayınlama

Proje standart bir Next.js uygulamasıdır; Vercel'de ek yapılandırma gerektirmez.
Yalnızca `NEXT_PUBLIC_SITE_URL` ortam değişkenini tanımlayın.
