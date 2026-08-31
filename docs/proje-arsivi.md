# Proje arşivi — bilinen tüm web sayfası projeleri

Bu belge, bu oturumda karşılaşılan **her web sayfası/proje**yi tek yerde
kataloglar. Amaç: önce ne olduğunu netleştirmek, **sonra** hangilerinin
birleştirileceğine karar vermek (kullanıcı talimatı, 30.08.2026). Hiçbir
satır tahminle doldurulmadı — kaynağı olmayan alan `bilinmiyor` yazar.

**Durum sütunu kodları:** `aktif` (bu oturumda üzerinde çalışılıyor) ·
`referans` (dosyaları paylaşıldı, kod tabanı burada değil) · `bilinmiyor`
(içerik görülemedi, yalnızca URL var).

---

## 1. QBLOGG

| Alan | Değer |
|---|---|
| Konum | bu depo (`BETA-ART`, GitHub `andersenbetul-alt/beta-art`) |
| Canlı adres | qblogg.vercel.app (kişisel Vercel hesabı, `andersenbetul-9635s-projects`) |
| Amaç | İçerik hattı stüdyosu — SEO blog, LinkedIn serisi, sosyal içerik, newsletter, çok dilli yayın |
| Teknik | Saf HTML/CSS/JS, derleme yok |
| Durum | **aktif** |

## 2. Naviar

| Alan | Değer |
|---|---|
| Konum | Marka çalışması bu depoda: `brand/naviar/`, `docs/naviar/`. Sitesi ayrı depo(lar)da (`betulandersen-droid` hesabı) |
| Vercel projeleri | `naviar-care-1`, `naviar-consult` (takım: BET - ART, `team_xNtowH7U0jXQrI53DFJFzH2o`) |
| Amaç | İkinci marka/kimlik — bu depoda yalnızca logo/marka tasarım çalışması |
| Durum | **referans** (sitesi bu oturumun kapsamı dışında) |

## 3. Beta Privat (muhasebe/vergi katmanı)

| Alan | Değer |
|---|---|
| Konum | `beta-privat/` bu depoda |
| Kaynak | Oturum başında paylaşılan `package.json` ("small-business", BAB/BAC/BAP, MVA, forskuddsskatt) |
| Amaç | Beta Art'ın iç nakit/vergi/abonelik iş akışı — bir web sitesi değil |
| Durum | **aktif** (yalnızca iskelet + kapsam belgesi var) |
| Not | Aşağıdaki "BETA ART Privat" (madde 4) ile **isim çakışması var, aynı şey değil** — kullanıcı 30.08'de bunları ayrı doğruladı |

## 4. BETA ART Privat — BAP-01

| Alan | Değer |
|---|---|
| Alt yol | `/privat/` (bazı belgelerde `archive.beta-art.com` alt alan adı önerisi) |
| Klasör (kaynak sistemde) | `beta-art-privat/` |
| Amaç | Doğrulanmış insan fotoğrafçılığı arşivi, katalog plakaları, köken kaydı, doğrudan lisanslama, edisyonlar |
| Kaynak | Statik prototip dosyaları paylaşıldı: `index.html`, `i18n.js`, `404.html`, `styles.css`, `script.js`, `tools.js`, `release.js`, `README.md`, `CONTENTMAP.md`, `DEPLOYMENT.md`, `ROUTE-CONFIG.md`, `sitemap.xml`, `vercel.json` |
| Canlı önizlemeler | `beta-art-archive-five.vercel.app` (erken, yalnızca Archive), `beta-art-contact1-9jsgs8q95-andersenbetul-9635s-projects.vercel.app` (Archive+Business birlikte, daha yeni) |
| Fotoğrafçı | Betül Öner (site içeriğinde adı geçiyor) |
| GoDaddy Airo venture | `7fb63a87-ebcb-45cc-b31e-98897df478c7` — kullanıcı 30.08'de doğruladı: madde 10 ve 11'deki Airo linkleri de bu venture'a ait, aynı proje |
| **Temel alınan sayfa** | Kullanıcı 30.08'de bu GoDaddy Airo venture sayfasını (`dashboard.godaddy.com/venture/website?ventureId=7fb63a87-...`) BETA ART Privat için **temel** ilan etti — statik prototip (yukarıdaki dosyalar) ve Final Work v2 (madde 5) değil. Sayfanın kendisi (görsel içerik) bu ortamdan hâlâ görülemiyor (`EGRESS_BLOCKED`); ama **altyapı kaynak dosyaları** paylaşıldı (aşağıya bakın). |
| **Üçüncü teknik implementasyon (GoDaddy Airo App Builder)** | 30.08'de paylaşılan dosyalar (`AiroErrorBoundary.tsx`, `PageNotFound.tsx`, `airo-secrets.ts`, `frontmatter.ts`, `index.ts`) gösteriyor ki bu, statik prototip ve Final Work v2/Supabase'den **ayrı, üçüncü bir kod tabanı**: Vite + React + TypeScript, GoDaddy'nin kendi "AAB" (Airo App Builder) iskeletiyle. İçerik `src/content/pages/*.json` ve `src/content/data/<koleksiyon>/*.json\|md` altında tutuluyor, `schemas.ts`'teki Zod şemalarıyla derleme anında doğrulanıyor, bileşenlere yalnızca `virtual:content` sanal modülü üzerinden geliyor (doğrudan JSON import'u derleme hatası veriyor). Sırlar (`getSecret`) dışa aktarılmış/bağımsız projelerde ortam değişkenlerinden okunuyor (`#airo/secrets` stub'ı). |
| Durum | **referans** (görsel içerik hâlâ görülemiyor; altyapı kaynak kodu doğrulandı) |

## 5. BETA ART Final Work v2 (Privat'ın üretim uygulaması)

| Alan | Değer |
|---|---|
| İlişki | BAP-01'in (madde 4) üretim-hedefli uygulama referansı, `beta-art-privat/app-reference/final-work-v2/` altında saklanıyor (kaynak sistemde) |
| Teknik | React + Vite + TypeScript + Supabase (Auth, Storage, Edge Functions, RLS) |
| Kaynak | `README.md`, `package.json`, `.env.example` paylaşıldı — `src/`, migration veya Edge Function kaynak kodu paylaşılmadı |
| Durum | **referans**, çalıştırılamaz/doğrulanamaz durumda (kaynak kod eksik) |

## 6. BETA ART Business — BAB-02

| Alan | Değer |
|---|---|
| Alt yol | `/business/` (`business.beta-art.com` alt alan adı önerisi de var) |
| Klasör (kaynak sistemde) | `beta-art-business/` |
| Amaç | İnşaat/yapı sektöründe proje kapanışı sonrası belge/kurtarılabilirlik hizmeti — "Prosjektet avsluttes. Dokumentasjonen skal ikke." |
| Kaynak | `PROJECTMANIFEST.md`, `PROJECT-CODES.md`, `ROUTE-MAP.md` üzerinden biliniyor; kendi kod dosyaları bu oturumda paylaşılmadı |
| Durum | **referans** (yalnızca üst-belgeler görüldü) |

## 7. BETA ART Galleri og Utstilling Event — BAG-03

| Alan | Değer |
|---|---|
| Alt yol | `/events/` (`events.beta-art.com` alt alan adı önerisi de var) |
| Klasör (kaynak sistemde) | `beta-art-gallery-event/` |
| Amaç | Sanatçılar, eserler, seriler, sergiler, açılışlar, kültürel etkinlik programı |
| Kaynak | Yalnızca üst-belgelerde (`PROJECTMANIFEST.md` vb.) geçiyor; kendi kod dosyaları paylaşılmadı |
| Durum | **referans**, içerik büyük ölçüde eksik (belgede "event-specific names, dates, venues... still required" diyor) |

## 8. BETA ART DNS-administrasjon

| Alan | Değer |
|---|---|
| Ne olduğu | Üç mülkün (4/6/7) DNS/domain planlamasını gösteren tek sayfalık statik araç |
| Önemli | Sayfanın kendisi açıkça belirtiyor: **canlı DNS değişikliği yapmıyor**, yalnızca taslak/kontrol listesi |
| Domain önerisi | `beta-art.com` kökü + `archive.`/`events.`/`business.` alt alan adları — bu, madde 4/6/7'deki `/privat/`+`/events/`+`/business/` yol-tabanlı modelle **çelişiyor** (aynı kaynak sistemde iki farklı barındırma modeli önerilmiş, henüz kesinleşmemiş) |
| Durum | **referans** |

## 9. BETA ART — Three Properties (giriş/kapı sayfası)

| Alan | Değer |
|---|---|
| Ne olduğu | 4/6/7'yi `beta-art-privat/`, `beta-art-gallery-event/`, `beta-art-business/` göreli bağlantılarıyla listeleyen tek sayfalık hub |
| Durum | **referans** |

## 10. GoDaddy Airo Builder — çözüldü, madde 4'e ait

| Alan | Değer |
|---|---|
| URL | `airo-builder.godaddy.com/develop/68v0scym3h?itc=account.products.vt_aab` |
| Erişim | Bu ortamdan **erişilemiyor** (`EGRESS_BLOCKED`) — muhtemelen oturum açma da gerektiriyor |
| Hangi projeye ait | **BETA ART Privat (madde 4)** — kullanıcı 30.08'de doğruladı, aynı GoDaddy venture (`7fb63a87-...`) |

## 11. airo.ai paylaşım linki — çözüldü, madde 4'e ait

| Alan | Değer |
|---|---|
| URL | `airo.ai/share/Njh2MHNjeW0zaDpjNDA6WG56T2RRenYyNHNj` |
| Erişim | Bu ortamdan **erişilemiyor** (`EGRESS_BLOCKED`) |
| Hangi projeye ait | **BETA ART Privat (madde 4)** — kullanıcı 30.08'de doğruladı, aynı GoDaddy venture (`7fb63a87-...`) |

## 12. Field Notes — The Beta Art Journal

| Alan | Değer |
|---|---|
| Canlı adres | `betaart.no/field-notes/` — **dikkat: `beta-art.com` değil, farklı bir domain** (`betaart.no`) |
| Kaynak | `index.html`, `post.html`, `script.js`, `styles.css` paylaşıldı (30.08.2026) |
| Amaç | Beta Art'ın dergi/blog'u — köken, yöntem, Norveç'te ışık, lisanslama ekonomisi üzerine denemeler |
| Bağlantı verdiği kardeş sayfalar | `../beta-art/index.html` ("the archive"), `../beta-art-business/index.html` ("Business") — yani bu üçlüde klasör adları `beta-art/` ve `beta-art-business/`, madde 4/6/7'nin `beta-art-privat/`/`beta-art-gallery-event/`/`beta-art-business/` adlandırmasından **farklı** |
| PROJECTMANIFEST.md'deki durumu | Manifesto bunu zaten biliyor ve **kaynak-inceleme malzemesi** olarak işaretlemiş: "üç proje adlandırmasıyla tam eşleşmiyor çünkü üçüncü mülk Galeri değil Journal... `source-review/intake-2026-08-30/three-sites-latest/` altında saklanıyor, üretim klasörlerine karıştırılmadı" |
| Durum | **referans**, kaynak sistemde zaten "üretime alınmadı" diye işaretli — yine de üçüncü bir domain (`betaart.no`) ortaya çıkardığı için not edildi |

## 13. BETA ART Private (dördüncü kod tabanı, "Privat" değil "Private")

| Alan | Değer |
|---|---|
| Kaynak | `index.html` (madde 4/12'den bağımsız, `../assets/styles.css` + `../assets/app.js` kullanıyor) + `verify/index.html` (BETA-ID doğrulama alt sayfası) — 30.08.2026 paylaşıldı |
| Yazım farkı | **"Private"**, madde 4'teki "Privat" değil — başlıkta, `<title>`'da, footer'da tutarlı biçimde "Private" yazıyor |
| Klasör yapısı | `private/index.html`, `private/verify/index.html`, kardeşi `business/`, paylaşılan `assets/styles.css`+`assets/app.js` — madde 4'ün `beta-art-privat/` veya madde 12'nin `beta-art/` adlandırmasından **farklı, dördüncü bir klasör şeması** |
| Doğrulama kapısı | **Sekiz** adım: Original, Identity, Capture, Rights, AI disclosure, Conflict gate, Provenance, C2PA — `ASSETSTATUS.md`'nin "beş kontrol"ünden ve "Beta proof chain"in altı adımından **farklı, üçüncü bir sayı** |
| BETA-ID doğrulama | `verify/` sayfası bir demo kayıt numarası (`BETA-PHOTO-DEMO-0001`) sorgulatıyor; sayfa `noindex`, "no production certificates are issued from this prototype" diyor |
| Durum | **referans** — hiçbir üst-belgede (`PROJECTMANIFEST.md` dahil) bu spesifik varyanttan söz edilmiyor, kaynağı/tarihi bilinmiyor |

## 14. `beta-art.com` kök alan adı — gerçek canlı içerik (30.08.2026 akşamı)

| Alan | Değer |
|---|---|
| Ne olduğu | Kullanıcının **birebir yapıştırdığı**, gerçek `https://beta-art.com/` kök sayfasının metni — ilk kez bir önizleme değil, kök alan adının kendisi. `EGRESS_BLOCKED` yüzünden bu ortamdan hâlâ doğrudan görülemiyor; yalnızca kullanıcının yapıştırdığı kadarı biliniyor. |
| Ayrıca gelen alt sayfalar | `/categories` (35 kategori, 5 bölüm: Global 16, Norveç-özel 5, Norveç sektörleri 5, Editoryal 5, Özel/Yeni 4), FAQ referans belgesi ("16 ENTRIES · HUMAN AUTHORED"), `/request-a-shoot` (özel çekim brief formu), sepet sayfası (Norveççe: "Handlekurv") |
| Yapı | **Tek, bütünleşik bir sayfa** — Hero → Verification (3 yöntem) → Collection (Volume I, 12 plaka) → Exhibitions & Events (3 sergi) → Photographer bio → Licensing (4 katman) → Request form → FAQ (16 soru) → Footer |
| **Önemli bulgu** | Bu sayfanın nav/footer'ında **"Business" veya "Galeri" bağlantısı yok** — yalnızca Archive (Collection/Verification/Photographer/Categories/Industries) ve Licensing var. Madde 9'daki "üç mülk hub" modelinin **kök alan adında karşılığı yok**; "Exhibitions & Events" madde 7'nin (Galeri) ayrı bir mülk olması varsayımının aksine kök sayfanın kendi içine gömülü bir bölümü. |
| Fiyatlandırma (kesinleşti) | Personal kr190'dan (sabit sayı — tutarlı). Commercial/Extended/Custom & Exclusive: **"Price on request"** (sayı yok — üç önceki varyanttan farklı, muhtemelen kasıtlı) |
| Doğrulama (kesinleşti) | **3 yöntem** (Method I/II/III: RAW arşivi → capture kaydı+C2PA → fotoğrafçı imzalı lisans) — madde 4'teki statik "Privat" prototipiyle **birebir örtüşüyor** |
| Plaka isimleri (kesinleşti) | First Light (2026.0142), Into the Pines (2026.0143), Sea of Fog (2026.0144), Still Water (2026.0145), PALM (2026.0146), Blue Hour Grid (2026.0147), Night Crossing (2026.0148), Golden Hour (2026.0149), Portrait in Amber (2026.0150, *Available*), The Maker (2026.0151, *Available*), Slow Morning (2026.0152), Low Tide (2026.0153) — 12'sinden yalnızca 2'si "Available", kalanı "Awaiting verified original" |
| Fotoğrafçı biyografisi | "84,000+ frames captured since 2012", teslimat 24 saat içinde, RAW dosya talep üzerine gösteriliyor |
| Rota listesi (kesinleşti) | `/#collection`, `/#verification`, `/#photographer`, `/categories`, `/industries`, `/#licensing`, `/#request`, `/privacy`, `/cookie-settings`, `/license-terms` (İngilizce) **ve** `/lisensbetingelser` (Norveççe — aynı sayfaya mı gidiyor belirsiz), `/kontakt` (footer'da "Angrerett og refusjon" etiketiyle — isim/URL uyuşmazlığı not edildi), `/request-a-shoot` |
| Detaylı karşılaştırma | `docs/beta-art/privat-icerik-analizi.md` — bu madde eklendiğinde o belge de güncellendi |
| Durum | **En yetkili kaynak.** Madde 4'ün (BETA ART Privat statik prototip) canlıdaki en yakın karşılığı bu — birleştirme kararında "son söz" bu olmalı. |

**Vercel proje ipucu (30.08.2026, henüz erişilemedi):** kullanıcı
`https://vercel.com/project-hxi/<proje>` biçiminde üç bağlantı paylaştı:
`beta-art`, `beta-art-archive`, `beta-art-private` — üçü de aynı takım
slug'ında (`project-hxi`), üçü de bir dağıtım URL'si değil, **Vercel proje
adı**. Bu oturuma bağlı Vercel hesabı yalnızca "BET - ART" takımını görüyor
(`team_xNtowH7U0jXQrI53DFJFzH2o`); `project-hxi` bu listede yok, üçü için
de `get_project` 403 Forbidden döndü, paylaşılabilir bağlantı oluşturma
da başarısız oldu, tahmini dağıtım adresi (`beta-art-archive.vercel.app`)
`WebFetch` ile de `EGRESS_BLOCKED`. Yani üçü de **bu hesabın erişimi
olmayan başka bir Vercel hesabı/takımında**. Kod kaynağı hâlâ
doğrulanamadı ama artık üç proje adı var — kullanıcı panelde
Settings → Git'e bakıp bağlı GitHub deposu adını (`owner/repo`) paylaşırsa
`add_repo` ile doğrudan koda bakılabilir; bu Vercel MCP bağlantısından
tekrar deneme aynı sonucu verir.

## 15. Bu oturumda yayınlanmış artifact'ler — 30.08.2026 envanteri

Bu depoyla ilgisiz görünse de, bu Claude Code oturumu boyunca (özetlemeden
önceki kısımda) `Artifact` aracıyla 8 Beta Art ile ilgili sayfa yayınlanmış
ve `docs/`e hiç işlenmemiş. `@ARTIFACTS` ile listelenip okundu, önemli
bulgular:

**"BETA ART — Project Catalogue"** (yayınlanmış artifact, 30.08.2026) — bu
oturumun kendi ürettiği, madde 1-14'ten daha düzenli bir 12-proje kataloğu,
kod sistemiyle (`BA · 2026 P · 001` gibi):

| Kod | Proje | Durum | Konum |
|---|---|---|---|
| P·001 | Beta Art Privat | ● Yayında (beta-art.com) | React+Vite+Supabase+C2PA |
| P·002 | Beta Art Privat — Statik | ◐ Geliştirme | `beta-art-static/beta-art/` (yerelde yok, aşağı bkz.) |
| F·001 | Beta Photo | ◐ Geliştirme (MVP) | `project-hxi` |
| B·001 | Beta Art Business | ◐ Geliştirme (ön lansman) | `beta-art-static/beta-art-business/`, 9 makale, 36 doküman (yerelde yok) |
| G·001 | Galleri og Utstilling Event | ○ Planlandı, Sonbahar 2026 Oslo | `beta-art-static/beta-art-gallery-event/` (yerelde yok) |
| J·001 | Field Notes — The Beta Art Journal | ● Yayında | `project-hxi` |
| N·001 | Beta Art Norway Archive | ◐ Geliştirme | `project-hxi` |
| N·002 | Beta Art Industry Archive | ◐ Geliştirme | `project-hxi` |
| Q·001 | Beta Art QR (v3) | ● Yayında | `project-hxi` |
| A·001 | Beta Art Archive Platform (dahili, noindex) | ● Yayında | `project-hxi` |
| A·002 | Beta Art Platform (iş ortağı arayüzü) | ● Yayında | `project-hxi` |
| T·001 | Beta Art v8 — Airo SSR | ◎ Spesifikasyon | React+Airo SSR+Tailwind+shadcn, 42 Radix bileşeni |
| T·002 | Beta Art v3 — Referans | ◎ Referans | beta-art.com'un önceki tasarım iterasyonu |

**Bu, `project-hxi`'nin (madde 14'teki Vercel ipucu) yalnızca `beta-art`/
`beta-art-archive`/`beta-art-private` değil, en az 8 ayrı Beta Art
projesini barındıran ana hesap olduğunu doğruluyor** — F·001, J·001,
N·001, N·002, Q·001, A·001, A·002 hepsi aynı hesapta. Erişim durumu
değişmedi (hâlâ 403/erişilemez), ama kapsamın büyüklüğü artık netleşti.

**Kayıp yerel dosyalar:** kataloğun P·002/B·001/G·001 satırlarındaki
`beta-art-static/…` yol adları bu konteynerin dosya sisteminde **yok**
(`find /` ile arandı, sonuç yok). Ya bu bir konteyner/oturum sıfırlamasında
kayboldu, ya da bu yollar hiç dosya üretilmeden yalnızca planlanan konum
olarak yazıldı — hangisi olduğu belirsiz. Yayınlanmış artifact'lerin
kendisi (aşağıda) sunucu tarafında hâlâ duruyor, o yüzden içerik tamamen
kayıp değil, ama yerel kaynak dosyaları (varsa) geri getirilemez.

**Logo/mark tutarsızlığı — "TEK LOGO" kuralına aykırı bir bulgu:** iki ayrı
artifact iki farklı "mark" gösteriyor:
- **"Beta Art Brand"** kanonik bir birincil mark tanımlıyor: halka (r=44) +
  4 kiriş "blade" + merkez nokta (`#8B1515`), gerçek dosya yollarıyla
  (`brand/beta-art/master/`, `beta-art/public/assets/brand/`) — kesinleşmiş
  gibi sunulmuş.
- **"Beta Art Logos"** ise dört **kararsız** konsept sunuyor (Plate/Field/
  Glyph/Horizon) — "Studio draft" etiketli, henüz seçim yapılmamış.
- Bu oturumun kendi ürettiği `beta-art-privat.html`/`beta-art-hub.html`
  (madde 10/11, React Privat artifact) ise **üçüncü, farklı bir mark**
  kullanıyor: halka + 6 kollu pusula gülü (asterisk) deseni + merkez nokta.

Üçü aynı anda doğru olamaz — kullanıcının "TEK LOGO KULLANIYORUZ BUTUN
BETA ART PROJELERINDE" talimatı bu üç mark'tan **hangisinin gerçekten
kanonik olduğu** netleşmeden karşılanmış sayılamaz. Şu an elde üç aday var,
sıfır kesinleşmiş karar.

**Doğrulanan iyi haber:** **"Beta Art Archive"** (4891c4bd) ve **"BETA ART
Business"** (be610802) artifact'leri incelendi — ikisi de React uygulaması.
"Beta Art Archive"nin metni madde 14'teki gerçek `beta-art.com` yapıştırmasıyla
**birebir eşleşiyor** ("Price on request", "Portrait in Amber", FAQ soruları
vs.) — yani "BU SAYFAYI GELISTIRIYORUZ" talebi bu oturumda zaten bir React
yeniden-üretimiyle karşılanmış, `beta-art-hub.html` taslağı gereksiz kalmış.
"BETA ART Business" ise CLAUDE.md'deki mevcut Business tanımıyla tutarlı,
ek detaylar taşıyor: "Databehandleravtale" (veri işleyen sözleşmesi), faz/
bölge/durum filtreli demo arşiv, ve fiyatlandırma notu — "Tallene er
hypoteser for kundesamtaler, ikke endelig prisliste" (rakamlar müşteri
görüşmesi için hipotez, kesin fiyat listesi değil) — CLAUDE.md'nin "rakamlar
örnek" ilkesiyle birebir örtüşüyor.

**30.08.2026, gece — "Beta Art Archive" güncellendi, logo çakışması bu
artifact için çözüldü.** Kullanıcı `@BET ART LOGOLARINI KULLAN` dedi ve
kardeş bir oturuma (`session_01VJ9qrepAV3P4ZV9fVFxovR`, "Beta art logo
tasarımları", dal `claude/beta-art-logo-designs-vnxhwn`) işaret etti — o
oturum tam olarak "Beta Art Logos" ve "Beta Art Brand" artifact'lerini
üretmiş ve şu an "Herhangi birini güncellememi veya birleştirmemi ister
misin?" diye kullanıcı girdisi bekliyor (durum: SESSION_STATUS_BUCKET_BLOCKED).
Bu, üç mark adayından **"Beta Art Brand"**'ı (halka r=44 + 4 kiriş + merkez
nokta `#8B1515`) kanonik ilan ediyor. Buna göre "Beta Art Archive" artifact'i
sıfırdan (React kaynağı da kayıptı) yeniden kuruldu:
- `src/components/SealMark.tsx`'e "Beta Art Brand" artifact'inin gerçek
  SVG'si birebir kopyalandı (kaynak dosyadan `grep`lendi, elle çizilmedi).
- Kök sayfaya ek olarak dört yeni sayfa eklendi — hepsi madde 14'teki
  birebir yapıştırılan metinden: `/categories` (35 kategori, 5 bölüm),
  FAQ referans belgesi (16 soru, kategori filtreli sekmeler), `/request-a-shoot`
  (brief formu), sepet sayfası (Norveççe metin korunarak).
- Plaka `category` (landscape/city/portrait) etiketleri gerçek sayfanın
  düz metninde görünmüyordu (yalnızca filtre düğmeleri görünüyordu) — bu
  yüzden statik "Privat" prototipinden (madde 4) yeniden kullanıldı, kod
  içi yorumla kaynağı işaretlendi; uydurulmadı.
- `Select`/`Accordion`/`Checkbox`/`Sheet` yerine düz `<select>`/`<details>`/
  `<input type=checkbox>` kullanıldı — Privat React inşasında (madde 10/11)
  aynı Parcel sürümünün Radix `@radix-ui/primitive` bundling hatasına daha
  önce çarpılmıştı, bu bilgiyle önceden kaçınıldı.
- Güncellenmiş artifact aynı URL'e yayınlandı:
  https://claude.ai/code/artifact/4891c4bd-69ae-4884-82eb-50153c1a91b5

**Aynı gece, hemen ardından — mark kararı geri alındı.** Kullanıcı üç
**gerçek üretilmiş** OG/sosyal görsel paylaştı — Business, Field Notes ve
"Three Properties" hub sayfaları için, hepsi `beta-art.com` filigranlı.
Üçü de **6 kollu pusula/diyafram deseni** kullanıyor (halka + altı kısa
açılı çubuk + kırmızı merkez nokta) — **"Beta Art Brand" artifact'inin
4-kirişli mark'ı DEĞİL**. Bu, o artifact'in kendi "kanonik" etiketinden
daha güçlü bir kanıt: üç ayrı gerçek çıktıda fiilen kullanılan mark bu.

Karar geri alındı: `SealMark.tsx` bu oturumun kendi `beta-art-privat.html`/
`beta-art-hub.html` taslaklarında zaten kullandığı 6 kollu deseni geri
aldı (aynı path verisi, birebir) — dolayısıyla üç mark adayından biri artık
**gerçek üretim kanıtıyla doğrulanmış**: halka (r=46, sw=4) + altı kısa
çubuk (`M50 30 75.81 11.92M67.32 40 84.99 47.86…`) + merkez nokta
(`#8B1A1A`, r=7). "Beta Art Brand" ve "Beta Art Logos" artifact'leri
(madde 15 üstü) artık **kullanılmayan keşif** olarak okunmalı, kanonik
değil. Güncellenmiş artifact yine aynı URL'e yayınlandı.

---

## Bilinen isim çakışmaları (birleştirme kararından önce çözülmeli)

- **"Privat"** üç farklı şeyde geçiyor: `beta-privat/` (madde 3, muhasebe), "BETA ART Privat" BAP-01 (madde 4, fotoğraf arşivi). Kullanıcı 30.08'de bunların ayrı olduğunu doğruladı.
- **Barındırma modeli çelişkisi — kısmen çözüldü**: madde 4/6/7'nin kendi belgeleri (`ROUTE-CONFIG.md`, `DEPLOYMENT.md`) yol-tabanlı (`/privat/`) diyor; madde 8 (DNS admin) alt-alan-adı-tabanlı (`archive.beta-art.com`) öneriyor. **Madde 14'te görülen gerçek kök alan adı ikisini de kullanmıyor** — Archive/Privat içeriği doğrudan `beta-art.com` kökünde, yol/alt-alan-adı ön eki olmadan yayında. Business/Galeri'nin nerede olduğu (ayrı alan adı mı, hiç yayında değil mi) hâlâ bilinmiyor.
- **BETA ART Privat/Private için dört ayrı kod tabanı var**: (1) statik HTML prototip "Privat" (madde 4) — **madde 14'teki canlı kök alan adıyla fiyatlandırma hariç neredeyse birebir örtüşüyor, en güçlü aday**, (2) React+Vite+Supabase "Final Work v2" (madde 5), (3) GoDaddy Airo App Builder (Vite+React+TS, kendi içerik eklentisi, madde 4'e bağlı — kullanıcı 30.08'de bunu temel ilan etti), (4) statik HTML "Private" — `assets/app.js` (madde 13, kaynağı bilinmiyor). Diğer üçünün akıbeti (tamamen bırakılıyor mu, referans mı kalıyor) henüz netleşmedi.
- **İki farklı domain aynı markayı taşıyor**: `beta-art.com` (madde 4/6/7/8/9/**14 — artık canlı içeriğiyle doğrulandı**) ve `betaart.no` (madde 12, Field Notes). `beta-art.com` artık gerçek, çalışan bir üretim sitesi olduğu doğrulandı; `betaart.no`'nun hâlâ yayında olup olmadığı bilinmiyor.
- **Doğrulama kapısındaki adım sayısı — kök alan adı 3'ü doğruladı**: `ASSETSTATUS.md` "beş doğrulama kontrolü" diyor, önizleme sitesindeki "Beta proof chain" altı adım (Human→Camera→RAW→Edit→Rights→Licence), madde 13'teki kapı sekiz adım (Original/Identity/Capture/Rights/AI disclosure/Conflict gate/Provenance/C2PA). **Madde 14'teki gerçek kök alan adı 3 adım kullanıyor (Method I/II/III), madde 4'ün statik prototipiyle birebir aynı.** Bu artık en yetkili sayı — 5/6/8 adımlı listeler farklı taslak aşamalarına ait olmalı.
- **"Üç mülk" modeli kök alan adında görünmüyor**: madde 9'daki hub sayfası Privat/Galeri/Business'ı ayrı mülkler olarak listeliyordu. Madde 14'teki gerçek `beta-art.com` kökü bunun yerine **tek, bütünleşik bir Archive/Privat sayfası** — Business veya Galeri'ye nav/footer'da hiç bağlantı yok, "Exhibitions & Events" ayrı bir mülk değil kök sayfanın bir bölümü. Business ve Galeri'nin gerçekte nerede/yayında olup olmadığı hâlâ **bilinmiyor**.

## Sıradaki adım

Kullanıcı talimatı: önce bu katalog (bu belge), **sonra** hangi projelerin
birleştirileceğine karar verilecek. 10 ve 11 numaralı satırlar 30.08'de
madde 4'e (BETA ART Privat) bağlandı — hepsi aynı GoDaddy Airo venture'ı.
**30.08 akşamı madde 14 eklendi**: kullanıcının birebir yapıştırdığı gerçek
`beta-art.com` kök içeriği, madde 4'ün (statik "Privat" prototip) en yakın
canlı karşılığı olduğunu gösterdi — fiyatlandırma (Personal sabit, üstü
"Price on request") ve doğrulama adım sayısı (3) artık bu kaynaktan
kesinleşti. Kalan açık soru: Business (madde 6) ve Galeri (madde 7) gerçek
kök alan adında hiç görünmüyor — bunlar yayında mı, hiç mi yayınlanmadı,
yoksa ayrı bir alan adında mı, bilinmiyor.

**Açık engel:** madde 4 için "temel" ilan edilen GoDaddy Airo sayfasının
içeriği bu ortamdan görülemiyor (`EGRESS_BLOCKED`, oturum açma da gerekebilir).
Kök alan adının kendisi de aynı sebeple doğrudan görülemiyor — yalnızca
kullanıcının yapıştırdığı kadarı biliniyor (madde 14).
