# Sosyal medya kanalları — strateji ve kurulum rehberi

02.09.2026 tarihinde, kullanıcının "sosyal medya kanallarını geliştir" talebi
üzerine yazıldı. Kapsam: hangi kanallar, hangi sırayla, nasıl kurulur, ne
paylaşılır. `config.js`'deki `social: {}` alanı hâlâ boş — bu belge o alanı
doldurmak için gereken adımları da içeriyor.

## Neden bu beş kanal (ve başkası değil)

`config.js` beş platform için alan ayırıyor: `linkedin`, `x`, `medium`,
`substack`, `youtube`. Bunlar rastgele değil — QBLOGG'un kendi ürününün
(SEO blog + LinkedIn serisi + sosyal içerik + newsletter, bkz. `qblogg-turev`)
dağıtım kanallarıyla birebir örtüşüyor. Instagram/TikTok gibi görsel-ağırlıklı
kanallar bilinçli olarak yok: QBLOGG'un ürünü metin ve araştırma, kısa video
üretimi türev listesinde var ama birincil format değil.

**Öncelik sırası** (hedef kitleye göre — KOBİ/SaaS karar vericileri,
ikincil: stüdyoya katılmak isteyen yazarlar):

1. **LinkedIn** — birincil kanal. Karar vericiler burada, `qblogg-turev`
   zaten haftalık bir seri üretiyor (bkz. aşağıdaki "İlk içerik" bölümü).
2. **X** — ikincil. Düşük emek, yüksek sıklık; tek cümlelik doğrulanmış
   olgular için uygun (`sosyal.md` çıktısı doğrudan buraya gider).
3. **YouTube** — üçüncül, daha yüksek emek. Kısa video senaryoları hazır
   ama prodüksiyon (kayıt, kurgu) burada ayrı bir iş — kanalı açmak ücretsiz,
   düzenli yayın bir sonraki aşama kararı.
4. **Medium / Substack** — dağıtım/yeniden-yayın kanalı, birincil değil.
   Asıl makale her zaman qblogg.com'da; Medium/Substack SEO için değil,
   platformun kendi okuyucu kitlesine erişim için var. İkisini birden açmak
   şart değil — biri yeterli, Substack newsletter formatına daha yakın.

## Kurulum — adım adım

Her platform için: hesabı siz açarsınız (kimlik/e-posta doğrulaması
gerektiriyor, bunu sizin yerinize yapamam), sonra adresi bana ya da
doğrudan `assets/js/config.js` dosyasına yazarsınız.

### 1. LinkedIn (şirket sayfası, kişisel profil değil)

1. linkedin.com/company/setup/new/ adresine gidin (kişisel hesabınızla
   giriş yapmış olmalısınız).
2. "Şirket sayfası" seçin, sayfa adı: `QBLOGG`.
3. Web sitesi: `https://qblogg.com`, sektör: "İçerik pazarlaması" ya da
   "Yazılım/SaaS hizmetleri", şirket boyutu: gerçek sayınızı girin.
4. Logo olarak `assets/brand/qblogg-favicon.svg`'yi PNG'ye çevirip yükleyin
   (LinkedIn SVG kabul etmiyor — `scripts/marka-uret.py` zaten
   `favicon-32.png` üretiyor, o dosyayı 300×300'e büyütüp kullanabilirsiniz
   ya da isterseniz benden yeni bir kare PNG üretmemi isteyin).
5. Sayfa URL'si genelde `linkedin.com/company/qblogg` olur; alınmışsa
   `linkedin.com/company/qblogg-studio` gibi bir alternatif önerir.
6. Sayfa URL'sini bana verin — `config.js`'deki `social.linkedin` alanına
   yazarım (bkz. aşağıdaki "config.js'e bağlama").

**İlk gönderi:** `content/ai-arac-yigini-maliyeti/tr/linkedin.md` — 7
gönderilik seri hazır, haftada bir yayınlanacak şekilde yazıldı.

### 2. X (eski Twitter)

1. x.com/i/flow/signup — e-posta veya telefonla kayıt.
2. Kullanıcı adı: `@qblogg` (alınmışsa `@qbloggstudio`).
3. Profil fotoğrafı: aynı favicon PNG'si; kapak fotoğrafı isteğe bağlı,
   isterseniz brand renklerinden (`--brand` #082C54 → `--brand-2` #00D8C2
   gradyanı) bir kapak üretebilirim.
4. Bio'ya `https://qblogg.com` linkini ve kısa bir açıklama ekleyin
   (örnek: "SEO blog, LinkedIn serisi, sosyal içerik ve newsletter — tek
   araştırmadan." — İngilizce/Türkçe karışık kullanıcı kitlenize göre).

**İlk içerik:** `content/ai-arac-yigini-maliyeti/tr/sosyal.md` — 10 kısa
gönderi, doğrudan kopyala-yapıştır kullanılabilir.

### 3. YouTube

1. Bir Google hesabıyla youtube.com/create_channel.
2. Kanal adı: `QBLOGG`. Kanal simgesi ve banner için brand varlıkları
   kullanılabilir (banner boyutu 2560×1440 — isterseniz üretirim).
3. Kanal açıklamasına qblogg.com linkini ekleyin.
4. İlk video için taslak hazır: `content/ai-arac-yigini-maliyeti/tr/youtube.md`
   (bölüm başlıkları + açıklama metni + etiketler) — kayıt ve kurgu ayrı bir
   üretim adımı, bu belge yalnız senaryo/iskelet sağlıyor.

### 4. Substack (Medium yerine önerilir)

1. substack.com → "Start writing".
2. Yayın adı: `QBLOGG`, adres: `qblogg.substack.com`.
3. Bu, **ayrı bir newsletter değil** — asıl bülten kaydı zaten
   `config.js → newsletterEndpoint` üzerinden Buttondown'a gidiyor
   (bkz. `docs/gelir-sistemi.md`). Substack burada yalnız platformun kendi
   keşif/öneri trafiğine erişmek için — `content/.../tr/newsletter.md`
   içeriğini haftalık olarak hem Buttondown'a hem Substack'e
   yayınlayabilirsiniz.

## config.js'e bağlama

Hesap adresleri elinize geçince `assets/js/config.js` içindeki `social`
nesnesini doldurun (ya da bana adresleri verin, ben yaparım):

```js
social: {
  linkedin: 'https://linkedin.com/company/qblogg',
  x: 'https://x.com/qblogg',
  medium: '',       // kullanılmıyorsa boş kalsın
  substack: 'https://qblogg.substack.com',
  youtube: 'https://youtube.com/@qblogg'
},
```

Kod tarafı zaten hazır: `applySocial()` (`assets/js/app.js`) yalnızca dolu
alanları altbilgide gösterir, boş kalanlar (başlık dahil) tamamen gizlenir
— 02.09.2026'da düzeltilen bir kusurdu (`git log` — "Profesyonellik
geçişi" commiti). Doldurduktan sonra `npm run check` çalıştırmanız yeterli,
başka bir dosyaya dokunmanız gerekmiyor.

## Yayın ritmi (öneri)

| Kanal | Sıklık | Kaynak |
|---|---|---|
| LinkedIn | Haftada 1 | `linkedin.md` serisi, sırayla |
| X | Haftada 2-3 | `sosyal.md`, dağıtarak |
| Newsletter (Buttondown + Substack) | 2 haftada 1 | `newsletter.md` |
| YouTube | Ayda 1 (kayıt/kurgu emeği yüksek) | `youtube.md` + `kisa-videolar.md` |

## İlk içerik partisi — hazır

`content/ai-arac-yigini-maliyeti/tr/` altında yedi dosya, en yeni yazıdan
(`ai-arac-yigini-maliyeti` — "AI araç yığınınız gerçekten karşılığını
veriyor mu?") `qblogg-turev` becerisiyle üretildi: `linkedin.md` (7
gönderi), `sosyal.md` (12 gönderi), `newsletter.md`, `kisa-videolar.md`
(4 senaryo), `youtube.md`, `podcast.md`, `devam-yazilari.md`. Tüm rakamlar
kaynak yazıdaki Zylo verisiyle birebir eşleşiyor, emoji taraması temiz.
Hesaplar açıldıkça doğrudan kullanılabilir.

## Bilinçli dışarıda bırakılanlar

- **Instagram/TikTok/Facebook:** `config.js`'de alan yok, ürün formatına
  uymuyor (görsel-ağırlıklı, QBLOGG metin/araştırma satıyor). İsterseniz
  ayrı bir karar olarak eklenebilir ama bu rehberin kapsamı dışında.
- **Otomatik çapraz-yayın (Zapier/Buffer vb.):** yeni bir dış bağımlılık;
  CLAUDE.md'nin "yeni bağımlılık eklemeden önce gerçekten gerekli
  olduğunu doğrulayın" kuralına takılıyor — elle paylaşım başlangıç için
  yeterli, hacim artarsa ayrı bir karar.
