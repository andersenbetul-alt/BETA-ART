# QBLOGG — proje günlüğü

Projenin her aşaması ve yapılanlar bu dosyaya işlenir (kullanıcı talimatı,
22.08.2026). Yeni bir aşama kapandığında buraya tarihle eklenir; ayrıntılı iş
listesi `ROADMAP.md`'de, teknik kararların gerekçeleri `docs/` altındaki ilgili
belgelerde durur. Bu dosya hikâyeyi anlatır: ne yapıldı, neden, ne durumda.

## Konsept — QBLOGG nedir

Şirketlere içerik hattı satan bir stüdyo: tek araştırmadan yedi çıktı
(blog yazısı, LinkedIn serisi, sosyal içerik, newsletter, SEO makalesi, kısa
video senaryosu, YouTube taslağı) — on dilde. Hedef müşteri, içerik ekibi
olmayan KOBİ ve SaaS şirketleri; ikincil kitle stüdyoya katılacak yazarlar.
Sitenin tek işi ziyaretçiye **brief formunu doldurtmak**. Gelir modeli: proje
bazlı (tek makale) + tekrarlayan (aylık paketler) + ortaklık bağlantıları.
Paket fiyatları örnek başlangıç fiyatıdır ve sitede böyle işaretlenir.

## Aşama kayıtları

### 1. Temel site (önceki oturumlar)

- Saf HTML + CSS + JavaScript; **derleme adımı ve bağımlılık yok** — bilinçli
  tercih, site her statik sunucuya olduğu gibi yüklenir.
- 7 sayfa: tanıtım, bizimle çalışın (brief + yazar başvurusu), blog listesi,
  yazı detayı, gizlilik, koşullar, 404.
- **10 dil** (tr, en, zh, hi, es, ar, fr, pt, ru, no): tüm görünen metin
  sözlükten (`data-i18n`), Arapça tam RTL. İki katmanlı içerik modeli:
  tr/en tam makale, kalan sekiz dil özet katmanı.
- 10 blog yazısı × 10 dil; her yazıda özgün katkı cümlesi (`orig`) ve en az
  üç kaynak (`src`) zorunlu.
- Formlar sunucusuz çalışır (mailto taslağı); bülten Buttondown'a bağlı.

### 2. Denetim altyapısı (önceki oturumlar)

Her iş doğrulanabilir olsun diye betikler yazıldı; commit öncesi zorunlu:

- `check` — i18n eşitliği, yazı bütünlüğü, kırık bağlantı, sitemap uyumu
- `guvenlik` — XSS, KVKK, CSP, tabnabbing, mailto enjeksiyonu (14 kontrol)
- `gorunurluk` — yazıları 16 maddelik görünürlük kuralına karşı denetler
- `onizleme` — tüm siteyi tek tıklanabilir HTML dosyasına gömer
- Tarayıcı testleri Playwright ile (RTL, formlar, tema, URL durumu)

### 3. Marka kimliği (önceki oturumlar + 22.08.2026)

- Q sembolü: supercircle kâse + 45° aqua kuyruk. 22.08'de kuyruk yeniden
  tasarlandı — eski kiriş Ø (Norveççe harf!) okunuyordu; kuyruk artık
  siluetin parçası, harf renkten değil biçimden okunur.
- Renkler: Midnight Navy `#082C54` + Electric Aqua `#00D8C2`; aqua metinde
  kullanılmaz (kontrast), koyu tema değişkenlerle kendiliğinden çalışır.
- **14 kimlik varlığının tamamı betikten üretilir** (`marka-uret.py`,
  bayt bayt tekrarlanabilir): 11 SVG + favicon-32 + apple-touch-icon +
  og-image. Elle çizim yok.
- `marka-dogrula` belgedeki her ölçüyü varlıklardan yeniden ölçer (56 ölçü);
  EUIPO şekil markası zarfı hazır (`marka-tescil`), üretim testleri yapıldı.
  Fiziksel testler (nakış, gravür) ve tanınırlık testi kullanıcıda.

### 4. Gelir katmanı (önceki oturumlar; bülten 21.08.2026)

- Üç paket (örnek fiyatlarla) + brief formu + yazar başvurusu.
- Ortaklık bağlantısı altyapısı: bildirim kutusu, `rel="sponsored"`,
  gerekçe zorunluluğu (`docs/gelir-sistemi.md`).
- Bülten Buttondown'a bağlandı (21.08); kayıt karşılığı indirilebilir
  "Otomasyon Keşif Kontrol Listesi". Kullanıcı adı henüz `tatil` —
  `qblogg` hesabı açılınca değişecek (açık iş).

### 5. Curiosity Engine (önceki oturumlar)

Site değil, üretim hattının temeli: sinyal → konu → makale şeması,
ödeme/kredi şeması (`schema-billing.sql`, `billing.mjs`), 16 maddelik
görünürlük kuralının çalışan denetimi (`visibility.mjs`). Motorun taslaklara
uyguladığı ölçüt sitenin kendi yazılarına da uygulanıyor.

### 6. Yayın günü — 22.08.2026

Tek oturumda yayına giden zincir:

1. **Push engeli kalktı** — kullanıcı GitHub App'i kurdu; günlerdir yerelde
   bekleyen 80+ commit uzak depoya çıktı.
2. **`main` QBLOGG'a çevrildi** — kullanıcının açık izniyle, eski saat
   uygulamasının geçmişi korunarak (`-s ours` merge).
3. **Vercel kurulumu** — proje `qblogg`; dağıtıma tek dosya gider
   (`vercel.json`), derleme public depoyu klonlayıp siteyi `dist/`e kopyalar.
   Yani siteyi güncellemek = main'e push + dağıtımı yeniden tetiklemek.
4. **Arayüz kılavuzu düzeltmeleri** — RTL toast merkezleme (0,0 px sapma),
   `color-scheme`, `touch-action`, `text-wrap: balance`, form alanlarına
   `autocomplete`, alan yanı hata mesajları (10 dilde iki yeni anahtar),
   `beforeunload` koruması, blog filtresinin URL'ye yazılması.
5. **og:image + 404** — 1200×630 paylaşım kartı üreticiye 14. varlık olarak
   eklendi (metinsiz: on dilde tek görsel); 10 dilde markalı 404 sayfası.
6. **Alan adı süreci** — qblogg.com kullanıcıda (GoDaddy), DNS kayıtları
   doğru kuruldu ve doğrulandı. Alan adı yanlışlıkla ikinci bir Vercel
   hesabına eklendiği için sahiplik doğrulaması gerekiyor: TXT kaydı
   (`_vercel` / `vc-domain-verify=qblogg.com,589b6db6e7db7463d672`) +
   "Verify & Claim". **Bu adım açık** — kayıt henüz DNS'te görünmüyor.

Gün sonu durumu: site **yayında ve güncel** (qblogg-bet-art.vercel.app,
6/6 dağıtım başarılı), tüm denetimler yeşil; qblogg.com bağlantısı TXT
adımını bekliyor.

## Açık işler (anahtar kullanıcıda)

1. TXT kaydını GoDaddy'ye ekle → Vercel'de "Verify & Claim" → qblogg.com açılır
2. Yasal metinlerdeki 7 `[DOLDURULACAK]` alanının bilgileri
3. Buttondown'da `qblogg` hesabı
4. hello@qblogg.com posta kutusu (GoDaddy)
5. Sosyal hesap adresleri (`config.js`)

Teknik sıradaki büyük iş: her dili ayrı URL'de üreten ön-render (ROADMAP).
