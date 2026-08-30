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
