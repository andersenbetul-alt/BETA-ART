# QBLOGG — yol haritası

Proje durumu tek yerde. Bir iş bittiğinde satırı **Bitti**'ye çekin ve tarih düşün;
yeni iş çıktığında uygun aşamaya ekleyin. Öncelik sırası: gelire yakınlık → hıza etkisi →
maliyet.

## İş modeli

| | |
|---|---|
| **Hedef** | Yazılı içerikten hem proje bazlı hem tekrarlayan gelir üretmek |
| **Müşteri** | İçerik ekibi olmayan KOBİ ve SaaS şirketleri; ikincil: stüdyoya katılacak yazarlar |
| **Teklif** | Tek araştırmadan beş çıktı: blog + LinkedIn + sosyal + newsletter + SEO makalesi |
| **Gelir** | Tek makale (€150) · Büyüme (€900/ay) · Stüdyo (€2.500/ay) — hepsi örnek başlangıç fiyatı |
| **Kanallar** | Kendi sitesi · Upwork/nDash/ProBlogger · Medium · Substack |
| **Sahip olunan varlık** | Site + e-posta listesi. Platformlar dağıtım kanalıdır, iş değil. |

## Aşamalar

### 1. Yayına alma (öncelik: yüksek — bunlar bitmeden site gelir üretemez)

| # | İş | Durum | Not |
|---|---|---|---|
| 1 | Depoya yazma izni ver, dalı push et | **Engelli** | git ve GitHub App 403; izin kullanıcıda |
| 2 | Alan adı bağla, GitHub Pages / Netlify yayını | Bekliyor | `robots.txt` + `sitemap.xml` içindeki `qblogg.com` güncellenecek |
| 3 | `MAIL_TO` ve altbilgideki e-postayı gerçek adresle değiştir | Bekliyor | `assets/js/app.js` |
| 4 | Paket fiyatlarını gerçek rakamlarla güncelle | Bekliyor | `i18n.js` → `p1/p2/p3.price` |
| 5 | Formu Formspree/Netlify Forms'a bağla | Bekliyor | `composeMail` içindeki `mailto` bloğu |
| 6 | Bülten kaydını e-posta servisine bağla | Bekliyor | `initForm`; Substack veya Buttondown |

### 2. Güvenilirlik (öncelik: yüksek — teklif almanın önündeki engel)

| # | İş | Durum | Not |
|---|---|---|---|
| 7 | 2–3 gerçek örnek iş / vaka çalışması ekle | Bekliyor | Yoksa kendi blog yazılarımız portföy olarak kullanılır |
| 8 | Hakkımızda bölümü (kim yazıyor, hangi deneyim) | Bekliyor | Anonim stüdyo dönüşümü düşürür |
| 9 | Gizlilik ve koşullar sayfaları | Bekliyor | Altbilgideki bağlantılar şu an boş |
| 10 | Örnek teslimat (bir makale + türetilmiş 5 içerik) PDF'i | Bekliyor | Brief formunda "örnek gör" olarak kullanılabilir |
| 20 | **Blog yazılarını gerçek uzunluğa çıkar** | *Sürüyor* | 1/6 bitti: platform karşılaştırması TR 1.030 / EN 1.313 kelime, kaynaklı. Kalan 5 yazı + bu yazının 8 dili |
| 21 | NOK fiyat gösterimi ve pazar konumu | Bekliyor | Norveç'te ajanslar 10–40 bin kr/ay, sabit abonelik 3–6 bin kr/ay; €900 ≈ 10.400 kr |

### 3. Trafik (öncelik: orta — gelir 1. ve 2. aşamadan sonra hızlanır)

| # | İş | Durum | Not |
|---|---|---|---|
| 11 | Her dili ayrı URL'de üreten ön-render adımı | Bekliyor | Çok dilli SEO'nun asıl kilidi |
| 12 | Blog yazılarına yapılandırılmış veri (Article/FAQ şeması) | **Bitti** 18.08 | BlogPosting + FAQPage + Organization/WebSite/Service; dil değişince şema da güncelleniyor |
| 13 | Ayda 2 yeni yazı (10 dilde) | Sürekli | Konu havuzu aşağıda |
| 14 | Her yazının sonuna ilgili pakete bağlantı | **Bitti** 18.08 | Yazı sonunda brief + paket köprüsü, 10 dilde |
| 15 | Analitik (gizlilik dostu) ve dönüşüm ölçümü | Bekliyor | Hangi yazı brief getiriyor? |
| 22 | Sayfa ağırlığını böl | Bekliyor | 236 KB'ın 183 KB'ı i18n+posts; ziyaretçi on dilin tamamını indiriyor |
| 23 | Sosyal paylaşım görseli (og:image) ve 404 sayfası | Bekliyor | Paylaşılan bağlantı şu an önizlemesiz görünüyor |

### 3.5. AI Workforce (yeni ürün hattı — bkz. `docs/ai-workforce/`)

| # | İş | Durum | Not |
|---|---|---|---|
| 24 | Ürün tanımı, rol kataloğu, fiyat merdiveni | **Bitti** 18.08 | Üç satılabilir rol: AI Receptionist, Sales Assistant, Office Assistant |
| 25 | İçerik türetme hattı (`scripts/repurpose.mjs`) | **Bitti** 18.08 | Opus 5 + yapılandırılmış çıktı; API anahtarı ile çalışır |
| 26 | Yazı sayfasında paylaşım satırı + sosyal yapılandırma | **Bitti** 18.08 | 5 kanal, dile duyarlı; ölü bağlantı kalmadı |
| 27 | Keşif formu ve ROI hesabı dokümanı | Bekliyor | `docs/ai-workforce/kesif-formu.md` yazılacak |
| 28 | Teknik mimari dokümanı (model, entegrasyon, güvenlik, maliyet) | Bekliyor | `docs/ai-workforce/teknik-mimari.md` |
| 29 | AI Workforce için site sayfası (10 dilde) | Bekliyor | Konumlandırma kararından sonra |
| 30 | İlk pilot: Research veya Meeting Agent referansı | Bekliyor | En düşük riskli giriş |

### 4. Ölçekleme (öncelik: düşük — talep oluştuktan sonra)

| # | İş | Durum | Not |
|---|---|---|---|
| 16 | Yazar ağı: başvuruları değerlendirme akışı | Bekliyor | `work.html` başvuruları geliyor |
| 17 | Fiyatlandırma sayfasında paket karşılaştırma tablosu | Bekliyor | |
| 18 | Müşteri paneli / teslim takibi | Fikir | Erken; önce 3 düzenli müşteri |
| 19 | Ücretli bülten katmanı (Substack) | Fikir | Kitle oluşmadan açılmaz |

## Konu havuzu (blog)

Yayınlanan 6 yazı: platform karşılaştırması, Upwork, nDash, Medium, Substack, AI içerik
stüdyosu. Sıradaki adaylar — hepsi ticari niyeti olan, aramada karşılığı olan konular:

- Şirketler içerik yazarına ne ödüyor: 2026 ücret aralıkları
- İçerik briefi nasıl yazılır (şablonla)
- AI ile yazılan içerik Google'da cezalandırılır mı?
- Bir blogun ilk 1.000 ziyaretçisi nereden gelir
- LinkedIn'de kurucu sesiyle yazmak
- KOBİ'ler için 90 günlük içerik takvimi
- Çok dilli içerikte hreflang hataları (mevcut SEO yazısının devamı)

## Başarı ölçütleri

| Ölçüt | Nasıl bakılır | Hedef |
|---|---|---|
| Brief formu gönderimi | Form/e-posta sayısı | Ayda 5 |
| Brief → teklif → müşteri | Elle takip | Ayda 1 yeni müşteri |
| Tekrarlayan gelir | Aylık paketler | 3 müşteri × €900 |
| Organik trafik | Analitik | 3 ayda 1.000 ziyaret/ay |
| Bülten listesi | Servis paneli | 3 ayda 200 abone |

## Karar günlüğü

- **Saf HTML/CSS/JS seçildi.** Site içerik ağırlıklı ve derleme adımı olmadan her yere
  yüklenebiliyor; çatı eklemenin maliyeti faydasından yüksek.
- **10 dil, istemci tarafında.** Hızlı kurulum için; SEO bedeli biliniyor (iş #11).
- **Formlar mailto ile.** Sunucusuz çalışsın diye; gerçek forma geçiş noktası hazır (iş #5).
- **AI kullanımı sayfada açıkça anlatılıyor.** Gizlemek yerine süreci göstermek
  (ilk taslak AI, doğrulama ve editörlük insan) güven kazandırıyor.
- **Yazı sayfasının hreflang'i JavaScript ile kuruluyor.** Slug'a bağlı olduğu için
  statik yazılamıyor; ön-render adımı (iş #11) gelince statiğe dönecek.
- **Drop-cap yalnızca Latin/Kiril yazılarda.** Arapça bitişik yazıldığı için ilk harfi
  büyütmek kelimeyi bozuyordu; Çince ve Devanagari'de de yanlış duruyor.
- **Yazı gövdeleri blok yapısında.** Düz metin dizisi yerine `{h:}`, `{ul:[]}`, `{note:}`
  blokları da kabul ediliyor; kısa sürümler bozulmadan uzun yazılar yazılabiliyor.
- **check.mjs 600 kelimenin altını uyarı olarak işaretliyor.** İçerik borcu görünür kalsın diye.
- **Yazı tipi kendi sunucumuzda.** Google Fonts CDN'i ziyaretçinin IP'sini Google'a
  gönderiyor; Münih Bölge Mahkemesi kararı (3 O 17493/20) sonrası AB'de riskli sayılıyor.
  Inter değişken sürümü yerelde (4 dosya, 188 KB); Arapça/Çince/Devanagari sistem
  yazı tiplerine düşüyor. Site artık hiçbir dış istek yapmıyor.
- **Koyu temada marka rengi üzerindeki metin koyu.** Beyaz metin 3.2:1 kontrastta
  kalıyordu (WCAG AA eşiği 4.5:1); `--on-brand` değişkeni eklendi.
- **Okuma süresi metinden hesaplanıyor.** Elle girilen değer yanlış kalıyordu
  (124 kelimelik yazı "8 dk okuma" diyordu).
- **Mobil menü eşiği 1180px.** Rusça ve Norveççe menü etiketleri uzun; daha düşük eşikte
  menü ya iki satıra kırılıyor ya da sayfayı yatay taşırıyordu.
