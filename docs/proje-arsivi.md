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

---

## Bilinen isim çakışmaları (birleştirme kararından önce çözülmeli)

- **"Privat"** üç farklı şeyde geçiyor: `beta-privat/` (madde 3, muhasebe), "BETA ART Privat" BAP-01 (madde 4, fotoğraf arşivi). Kullanıcı 30.08'de bunların ayrı olduğunu doğruladı.
- **Barındırma modeli çelişkisi**: madde 4/6/7'nin kendi belgeleri (`ROUTE-CONFIG.md`, `DEPLOYMENT.md`) yol-tabanlı (`/privat/`) diyor; madde 8 (DNS admin) alt-alan-adı-tabanlı (`archive.beta-art.com`) öneriyor. İkisi aynı anda doğru olamaz — birleştirme kararından önce hangisinin geçerli olduğu netleşmeli.
- **BETA ART Privat için üç ayrı kod tabanı var**: (1) statik HTML prototip, (2) React+Vite+Supabase "Final Work v2" (madde 5), (3) GoDaddy Airo App Builder (Vite+React+TS, kendi içerik eklentisi) — kullanıcı 30.08'de üçüncüsünü temel ilan etti. Diğer ikisinin akıbeti (tamamen bırakılıyor mu, referans mı kalıyor) henüz netleşmedi.

## Sıradaki adım

Kullanıcı talimatı: önce bu katalog (bu belge), **sonra** hangi projelerin
birleştirileceğine karar verilecek. 10 ve 11 numaralı satırlar 30.08'de
madde 4'e (BETA ART Privat) bağlandı — hepsi aynı GoDaddy Airo venture'ı.

**Açık engel:** madde 4 için "temel" ilan edilen GoDaddy Airo sayfasının
içeriği bu ortamdan görülemiyor (`EGRESS_BLOCKED`, oturum açma da gerekebilir).
Bu sayfayı gerçekten temel alabilmek için kullanıcının içeriği (ekran
görüntüsü veya kopyalanmış metin/HTML) paylaşması gerekiyor.
