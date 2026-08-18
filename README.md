# HXI — resmî web sitesi (statik)

HXI (Christoffer Andersen) için bağımlılığı olmayan, tek sayfalık statik web sitesi.
Saf HTML + CSS + JavaScript — build adımı, paket kurulumu, framework yok.
`index.html` dosyasını çift tıklayıp tarayıcıda açabilirsiniz.

## Dosya yapısı

```
index.html                  Tüm sayfa (bölümler: hero, künye şeridi, müzik, videolar, NCS,
                            hakkında, "HXI ile çalışın", bülten + topluluk, basın/EPK, booking)
assets/css/style.css        Tasarım: siyah zemin, tek kırmızı vurgu (#ef2b2d), condensed başlıklar
assets/js/i18n.js           12 dilin çevirileri (100 anahtar × 12 dil)
assets/js/app.js            Dil değiştirme, mobil menü, video oynatıcı, scroll animasyonu, form
assets/favicon.svg          Sekme ikonu
assets/apple-touch-icon.png iOS ana ekran ikonu
assets/og-image.png         Sosyal medyada paylaşım görseli (1200×630)
robots.txt                  Arama motorları + yapay zekâ tarayıcı engeli (TDM opt-out)
sitemap.xml                 Tek sayfalık site haritası
.well-known/tdmrep.json     Metin ve veri madenciliği rezervasyonu (EU DSM Direktifi 2019/790 Md. 4)
```

Sayfa bir **sanatçı tanıtım sayfası**: müzik, videolar, hikâye, iş birliği daveti ve
iletişim. Lisans satışı / fiyat listesi gibi B2B içerik bilinçli olarak yok.

## Diller

İstenen **en çok konuşulan on dil** çekirdek olarak eklendi:

| Kod | Dil | Kod | Dil |
|-----|-----|-----|-----|
| `en` | English | `fr` | Français |
| `zh` | 中文 (Mandarin) | `bn` | বাংলা |
| `hi` | हिन्दी | `pt` | Português |
| `es` | Español | `ru` | Русский |
| `ar` | العربية | `ur` | اردو |

Bunlara ek olarak **Norveççe (`no`)** — HXI'nın kendi pazarı, eski sitede de vardı — ve
**Türkçe (`tr`)** eklendi. Toplam 12 dil, dil başına 100 metin. İstemezseniz `assets/js/i18n.js` içindeki
`HXI_LANGS` listesinden ilgili satırı silmek yeterli.

Dil nasıl seçilir:
1. URL'de `?lang=xx` varsa o dil,
2. yoksa daha önce seçilip `localStorage`'a yazılan dil,
3. yoksa tarayıcı dili (`navigator.languages`),
4. hiçbiri tutmazsa İngilizce.

Arapça ve Urduca için sayfa otomatik olarak `dir="rtl"` moduna geçer; fiyat, sayı ve
Latin harfli isimler (`unicode-bidi: plaintext`) kendi yönünü korur.

### Yeni dil eklemek

1. `assets/js/i18n.js` sonuna `window.HXI_I18N.xx = { ... }` bloğu ekleyin
   (mevcut `en` bloğunu kopyalayıp çevirin — tüm anahtarlar bulunmalı).
2. Aynı dosyanın başındaki `HXI_LANGS` dizisine `{ code: 'xx', flag: '🏳️', label: 'Dil adı' }` ekleyin.
3. Sağdan sola yazılan bir dilse `assets/js/app.js` içindeki `RTL` nesnesine `xx: 1` ekleyin.

Eksik anahtar kalırsa site o metni İngilizceye düşürür (çökmez).

### Metin düzenlemek

Tüm çeviriler `assets/js/i18n.js` içinde; HTML'de `data-i18n="anahtar"` taşıyan her
öğe seçili dile göre doldurulur. Parça adları, e-postalar, sayılar ve hukuki kurum
adları (TONO, GRAMO, NCB, Berne, DMCA) kasıtlı olarak çevrilmez.

## Yerelde çalıştırma

En basiti: `index.html` dosyasına çift tıklayın. Yerel sunucu isterseniz (Node 18+):

```bash
npm run dev
# http://localhost:8000        (varsayılan dil)
# http://localhost:8000/?lang=ar   (sağdan sola bir dili denemek için)
```

## Değişiklikten sonra kontrol

```bash
npm run check
```

Bağımlılık gerektirmez. Şunları yakalar: bir dilde eksik kalan çeviri anahtarı,
hiçbir yerde kullanılmayan anahtar, olmayan bir bölüme giden bağlantı, repoda
bulunmayan bir dosyaya referans, eksik `hreflang`, RTL listesine eklenmemiş
sağdan sola dil ve söz dizimi hatası. GitHub'a her push'ta aynı kontrol
Actions üzerinde de çalışır (`.github/workflows/ci.yml`).

Projenin çalışma kuralları (yeni dil ekleme, yeni bölüm ekleme, güncellenmesi
gereken sayılar) `CLAUDE.md` dosyasında.

## Yayına alma

Statik olduğu için her yerde çalışır:

- **GitHub Pages** — Settings → Pages → Source: `main` (veya bu branch) / root.
- **Vercel / Netlify** — repoyu bağlayın, build komutu yok, output dizini kök.
- **Kendi hosting'iniz** — dosyaları FTP ile atın.

Alan adı `hximusic.com`'a bağlandığında `index.html` içindeki `og:` etiketleri ve
`sitemap.xml` zaten bu adresi işaret ediyor.

## İçerik kaynağı

Metinler ve veriler, paylaştığınız mevcut `index.html` build'inden ve hximusic.com'un
yayınlanan içeriğinden alındı: 43.394.947 Spotify dinlenmesi (“help urself”), X-PIRATA,
MONTAGEM HYSTERIA EP, NCS çıkışları (Lock n' Load, Round Around feat. Nateki),
Fast & Furious / BODYCAM OST / 310babii künyeleri, 251.000 aylık dinleyici,
Scar Scheme Records, TONO · GRAMO · NCB.

Yayına almadan önce gözden geçirmeniz iyi olur:

- Aylık dinleyici ve dinlenme sayıları (zamanla değişiyor).
- `discord.gg/hximusic` daveti aktif mi (eski sitede “yakında” notu vardı).
- İş birliği ve genel mesajlar `hello@hximusic.com` adresine gidiyor; başka bir
  adres isterseniz `index.html` içindeki `mailto:` bağlantılarını değiştirin.
- Basın/EPK bağlantıları şu an e-posta talebi olarak çalışıyor; dosya linki
  verilecekse yine aynı `mailto:` adreslerini değiştirmeniz yeterli.

## Gizlilik ve performans

- **YouTube videoları tıklanana kadar yüklenmez.** Sayfa açıldığında Google'a hiçbir
  istek gitmez; ziyaretçi oynat'a bastığında video `youtube-nocookie.com` üzerinden
  yüklenir. Hem sayfa ağırlığı hem de GDPR açısından doğru olan davranış bu.
- Spotify gömüsü `loading="lazy"` ile yükleniyor (tek parça, 152 piksel).
- `robots.txt` + `.well-known/tdmrep.json` yapay zekâ eğitimi için veri toplanmasına
  itiraz kaydını taşıyor.

## Erişilebilirlik

- Tüm metinler en az 10 piksel; gri tonlar WCAG AA kontrastını sağlayacak şekilde açıldı.
- Klavye ile gezilebilir: "içeriğe geç" bağlantısı, görünür odak halkası, `aria-expanded`
  ile çalışan mobil menü.
- `prefers-reduced-motion` açıksa animasyonlar kapanır.
- JavaScript kapalıysa menü ve içerik yine erişilebilir kalır (`<noscript>` yedeği).

## Bilinen sınırlar

- Bülten formunun sunucusu yok: gönderilen adres, ziyaretçinin e-posta uygulamasında
  `hello@hximusic.com`'a giden bir taslak olarak açılır. Gerçek bir liste isterseniz
  Mailchimp/Resend gibi bir servisin form `action`'ı ile değiştirilebilir.
- `i18n.js` 12 dilin tamamını tek dosyada taşıyor (~90 KB, gzip'te ~20 KB). Statik
  hosting için sadeliği kazanç sayıldı; dil başına dosyaya bölmek isterseniz
  `HXI_I18N` nesnesini parçalayıp `app.js` içinde seçili dili `fetch` etmek yeterli.
- Başlık fontu Google Fonts'tan gelir (Barlow Condensed / Space Mono / Inter);
  erişilemezse sistem fontlarına düşer.
