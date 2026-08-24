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

## Web sayfası nasıl planlandı

**Tek dönüşüm hedefi.** Site trafik toplamak için değil, ziyaretçiye **brief
formunu doldurtmak** için planlandı. Her sayfanın bu hedefe giden yolda bir
rolü var; hedefe hizmet etmeyen özellik eklenmedi ("önce sadelik" ilkesi).

**Bilgi mimarisi — 7 sayfa, 7 rol:**

| Sayfa | Rolü |
|---|---|
| `index` | İkna hattı: hero (vaat) → hizmetler → "tek araştırmadan yedi çıktı" akışı → paketler → son yazılar (kanıt) → bülten |
| `work` | Dönüşüm noktası: marka briefi + yazar başvurusu, süreç, SSS |
| `blog` | Trafik ve güven: arama + kategori filtresiyle yazı listesi |
| `post` | Derinlik: tek yazı, kaynakça, benzer yazılar, yazı sonu teklif köprüsü |
| `gizlilik` / `kosullar` | Güven ve hukuk (TR + EN) |
| `404` | Kaybolan ziyaretçiyi ana sayfaya döndürür |

Ana sayfadaki sıralama bilinçli: önce vaat, sonra somut hizmetler, sonra
işleyiş kanıtı, en son fiyat — ziyaretçi fiyatı gördüğünde değeri zaten
görmüş oluyor.

**Teknik plan — neden çatısız?** Saf HTML+CSS+JS, sıfır bağımlılık:
site her statik sunucuya olduğu gibi yüklenir, kırılacak derleme zinciri
yok, bakım maliyeti sıfıra yakın, sayfa yükü küçük (ana sayfa tel üzerinden
~170 KB). Ödünleşim de bilinçli kabul edildi: dil değişimi istemcide
kaldığı için çok dilli SEO tam verim vermiyor; kalıcı çözüm (ön-render)
ROADMAP'te.

**Çok dillilik planı.** 10 dil; görünen her metin sözlükten (`data-i18n`),
HTML'deki Türkçe yalnızca JavaScript kapalıyken görünen yedek. İki katmanlı
içerik: tr/en tam makale, kalan sekiz dil özet katmanı — bu bir eksik değil
tasarım; on dilde tam makale bakım yükü kaliteyi düşürürdü. Arapça için tam
RTL: yön bağımlı CSS yazılmaz (`margin-inline-start` gibi mantıksal
özellikler).

**Tasarım sistemi planı.** Renkler ve yazı boyutları tek yerden
(`:root` değişkenleri) — koyu tema kendiliğinden çalışır. Emoji yasak, her
ikon satır içi SVG (marka üç işletim sisteminde aynı görünür). Kontrast
kuralları ölçülüdür: aqua beyaz üzerinde metin olamaz (1,8:1), metin için
koyulaştırılmış ton var. Ayrıntı: `docs/tasarim-sistemi.md`.

**Güven katmanı planı.** İddia varsa kaynak görünür (yazı başına en az üç
kaynak zorunlu), her yazının özgün katkısı tek cümleyle işaretli, fiyatlar
"örnek" ibaresiyle sunulur — abartılı iddia bu işte en pahalı hata sayıldı.
Ortaklık bağlantıları bildirimli ve gerekçeli.

**Doğrulanabilirlik planın parçası.** "Çalışıyor" demek yetmez; her kural
bir betikle denetlenir (`check`, `guvenlik`, `gorunurluk`, `marka-dogrula`).
Kural betiğe girmeden iş bitmiş sayılmaz — bugünkü 56 marka ölçüsü ve
8+14 site kontrolü bu planın sonucu.

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

## 23.08.2026 — Profesyonelleştirme paketi (SDD ile 8 görev)

Kullanıcının onayladığı 7 fikirlik liste, alt-ajan güdümlü geliştirmeyle
(her görev: taze uygulayıcı → bağımsız inceleme → onay) tamamlandı;
kapanışta en güçlü modelle tüm-dal incelemesi CLEAN verdi.

1. **security.txt + yazdırma CSS'i** — RFC 9116 dosyası; makale sayfaları
   temiz yazdırılıyor (başlık/altbilgi/düğmeler gizli, dış bağlantı adresleri
   dipnot).
2. **İçindekiler (TOC)** — 3+ ara başlıklı yazılarda otomatik; özet katmanı
   dilleri bilinçli muaf; `posts.toc` 10 dilde.
3. **Paket karşılaştırma tablosu** — 8 satır, hücre verileri yalnız mevcut
   paket metinlerinden; kümülatif kapsam tek dipnotla (uydurma hücre yok);
   SVG onay işaretleri, sr-only erişilebilirlik, RTL/390px doğrulandı.
   13 yeni `cmp.*` anahtarı × 10 dil.
4. **RSS** — `npm run rss` → deterministik `feed.xml` (10 öğe); üç sayfada
   autodiscovery; dağıtım kopyasına eklendi.
5. **kalite.html** — kalite güvencesi sayfası (TR+EN): 16 kural, orig/kaynak
   zorunluluğu, iki katmanlı dil modeli, revizyon; her iddia depoya izlenebilir.
6. **ornek.html** — örnek teslimat sayfası: gerçek üretimden 7 türevin birebir
   alıntıları (alıntı sadakati programatik + bağımsız incelemeyle doğrulandı).
7. **Ödeme (site tarafı)** — `config.js → payLinks` doldurulunca paket
   kartlarında "Kartla öde" (Stripe Payment Link) düğmesi; gizlilik metnine
   ödeme paragrafı; kullanıcı için `docs/odeme-sistemi.md` panel kılavuzu.
   Not: Stripe MCP anahtarı salt-okunur — ürün/bağlantı oluşturma kullanıcıda.
8. **Arayüz denetimi düzeltmeleri** — marka adına `translate="no"`, form
   `name` öznitelikleri, paylaşım düğmeleri satır içi SVG'ye, hata mesajı
   `aria-describedby`+`aria-live`, fetch yolunda düğme kilidi, tabular-nums,
   safe-area payları, EN bloklarına `lang="en" dir="ltr"` (dört sayfa),
   `guvenlik.mjs` kapsamına kosullar/kalite/ornek.

Ayrıca: proje konsept belgesi yazıldı (`docs/konsept.md`, okur testinden
geçti; Word kopyası kullanıcıya verildi), Figma tasarım kuralları belgesi
(`docs/figma-tasarim-kurallari.md`), blog yazım yöntemi becerisi
(`.claude/skills/qblogg-blog-yazisi/`), beceri gözlem günlüğü
(`skill-observations/`). Alan adında ilerleme: kullanıcı TXT kayıtlarını
GoDaddy'ye ekledi, DNS'e yayıldı — Vercel'de "Verify & Claim" bekliyor.

Gün sonu denetim durumu: check 8/8 (10 dil × 233 anahtar, 9 sayfa,
sitemap 17 URL), güvenlik 13/13, görünürlük 10/10, marka 56 ölçü,
RSS determinizmi, Playwright akış testleri — hepsi yeşil. Dal:
`claude/qblogg-web-sayfasi-upcarm`; yayına alma kullanıcı onayı bekliyor.

## 23.08.2026 (akşam) — Yeni iş modeli çalışması başladı

Kullanıcı üç ayrı yapay zekâ analizini iletti (Norveç fagblog temaları;
gelir sistemi; TIGER 21/Campden/Long Angle/Oxford Analytica/GLG/HBR/Project
Syndicate kıyaslaması ve "Q Private Intelligence" taslağı) ve QBLOGG için
yeni iş modelinin birlikte kurulacağını bildirdi. İlk sentez `docs/is-modeli.md`
(v1 taslak) olarak yazıldı: çift katlı model (Studio bugünü öder,
Intelligence yarını kurar), B0–B4 güven merdiveni ve geçiş eşikleri,
ürün formatları (Q Answer/Brief/Risk Radar/Decision Defense…), profesör
ücret modeli, üyelik kabul çerçevesi, hukuk sınırları. Belgede her rakam
kanıt sınıfıyla işaretli: [V] doğrulanmış / [H] hipotez / [D] dış iddia —
dış araçlardan gelen rakip verileri teyit edilmeden karar dayanağı
yapılmayacak. Altı açık karar kullanıcıya listelendi (§13).

## 23.08.2026 (gece) — Vercel projesi silinmiş bulundu, site geri kuruldu

Alan adı kontrolü sırasında `qblogg` Vercel projesinin takım listesinde
olmadığı görüldü (panelde aynı gün başka projeler oluşturulurken silinmiş
olmalı; eski adresler qblogg-bet-art/qblogg-flame öldü). Kurulum tek
dosyalık olduğu için site aynı adla dakikalar içinde geri kuruldu:
yeni üretim adresi **qblogg.vercel.app** (yeni proje id). Yeni projede
kendiliğinden açılan Deployment Protection yine kapatıldı; kalite.html
canlıdan 200 + güncel içerikle doğrulandı. GoDaddy tarafı hazır
(apex/www A kayıtları Vercel'i gösteriyor, _vercel TXT yayılmış);
kalan adım: Vercel panelinde qblogg projesine qblogg.com + www ekleyip
doğrulamak — eski claim akışı silinen projeye bağlıydı, panel yeni kod
üretirse GoDaddy'deki TXT değeri onunla değiştirilecek.

## 24.08.2026 — Üye sistemi v1 (Supabase auth) kuruldu

Kullanıcı kararıyla (AskUserQuestion: ayrı uygulama · Q Brief Pro kapsamı ·
magic link) kimlik doğrulama sistemi yazıldı: `uye/` klasörü (tek dosyalık
istemci + config + kendi vercel.json'u + `schema.sql`), ana siteden tamamen
ayrı Vercel projesi olarak dağıtılacak — sitenin sıfır bağımlılık vaadi
bozulmadı. Veri modeli `engine/schema-billing.sql`'in dört tasarım kararına
referansla sadeleştirildi (entitlement ayrımı v2'ye bilinçli devir,
belgede kayıtlı). RLS: aktif olmayan üye yalnız örnek brief'leri görür.
Kurulum kılavuzu `docs/uye-sistemi.md`; kullanıcı adımı: Supabase projesi
açıp URL + anon anahtarını iletmek. Ayrıca task-observer becerisi
`.claude/skills/task-observer/` olarak depoya kalıcılaştırıldı (CC BY 4.0,
atıf korunarak).

## 24.08.2026 (devam) — Üye uygulaması canlıya çıktı (iskelet)

supabase-js CDN yerine depoya vendor'landı (2.112.4, lisans+sha256 kayıtlı) —
hem konteynerden test edilebilirlik hem CSP daralması. Playwright 7/7.
`qblogg-uye` Vercel projesi kuruldu: https://qblogg-uye.vercel.app (ayrı
proje; koruma kapatıldı; noindex). İlk dağıtım "cp: No such file" ile düştü —
neden: vendor dosyası henüz push'lanmamıştı; klon-tabanlı dağıtım çalışma
ağacını değil depoyu dağıtır (gözlem #8). Push sonrası yeşil. Örnek tohum
brief'i hazır (seed.sql, yayınlanmış yazıdan türetilmiş). Bekleyen: kullanıcı
Supabase projesi + URL/anon anahtar.

## 24.08.2026 (devam) — Yazar platformu fikri değerlendirildi (taslak)

Kullanıcı yeni yön verdi: QBLOGG, insanların kendi bloglarını yayınlayıp
kitaplarını tanıtabilecekleri bir platform olsun. Kod yazılmadan önce
değerlendirme + v1 tasarımı `docs/yazar-platformu.md`'ye yazıldı: üç model
seçeneği (öneri: davetli/küratörlü), mevcut Supabase üye sistemi üstüne
şema genişlemesi (authors/books/author_posts + niyet temelli keşif —
kullanıcının paylaştığı filtre kodu okur tarafının prototipi), gelir
seçenekleri rakamsız [H], hukuk kapıları (tanıtım işareti, koşullar
güncellemesi, avukat teyidi) ve eşikli pilot planı. Marka çelişkisi ve
"bir haftada üçüncü yön" riski belgede açıkça kayıtlı. Model + öncelik
kararı kullanıcıya soruldu; P0 inşası karar sonrası.
