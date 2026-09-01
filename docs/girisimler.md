# Girişimler — hangi proje nerede yaşıyor

Bu belge **bu depo dışındaki** girişimlerin envanteridir. Amaç: hangi
ürünün hangi araçta/hesapta, hangi durumda olduğunu tek yerden görmek.
**Bu depo yalnızca QBLOGG'u geliştirir** — buradaki diğer girişimler bilgi
amaçlıdır, bu depoda kodları değişmez, dosyaları taşınmaz.

> **⚠ KRİTİK GÜNCELLEME (30.08.2026, gece) — bu kural `main`'de artık
> doğru değil, bu dalda hâlâ geçerli.** `origin/main`'i inceledim:
> `f4a95c4 "monorepo: tum projeler BETA-ART'ta birlestiriliyor"` commit'i
> (bugün, 15:09 UTC) ile `main` artık **gerçek bir monorepo** —
> kökte QBLOGG'un yanında `beta-art/`, `naviar/`, `agents/` dizinleri ve
> bir `MONOREPO.md` var. Bu depoda (`andersenbetul-alt/BETA-ART`) toplam
> **~45 dal** var, çoğu tamamen alakasız girişimler için (naviar-\*,
> cobban\*, coddan\*, hxi-\*…) — yani bu depo birden fazla paralel Claude
> Code oturumunun ortak çalışma alanı. **Benim dalım
> (`claude/beta-art-business-ckufpl`) main'den 25.08'de ayrıldı — bu
> monorepo birleşmesinden ÖNCE.** Şu an main'e göre 6 commit ileri, 21
> commit geride. `main`'in kendi `CLAUDE.md`/`README.md`'si hâlâ eski
> QBLOGG-only metnini taşıyor — yani dizin yapısı değişti ama belge
> güncellenmedi (main'in kendi belge borcu, benim düzeltebileceğim bir
> şey değil, kullanıcıya bildirildi). Detay ve kaynak alıntılar aşağıda
> "Ana kaynak bulundu" bölümünde. **Sonraki oturum bu çelişkiyi
> görmezden gelmesin:** bu dosyanın geri kalanı hâlâ "ayrı girişim, bu
> depoda geliştirilmez" varsayımıyla yazıldı, ama main artık aynı fikirde
> değil.

Veriler 26.08.2026'da Vercel MCP (`list_teams`, `list_projects`,
`list_deployments`) ve Lovable MCP (`list_workspaces`, `list_projects`)
araçlarıyla **doğrudan sorgulanarak** ölçüldü — uydurma yok. Erişilemeyen
bir şey varsa "doğrulanamadı" diye açıkça yazılıdır.

**Güncelleme (30.08.2026, akşam) — BAB-02 kapsamı kesinleşti: Dual
reconciliation.** Kullanıcı bu oturumda 44 dosya yükledi
(`/root/.claude/uploads/.../27474db6-...` — bu yolun kendisi oturuma
özel, kalıcı değil). Hepsi tek tek okundu, tekrarlar (bayt-bayt aynı
kopyalar) elendi. Sonuç, kullanıcının kendi yüklediği belgeler arasında
bugünün (30.08.2026) tarihini taşıyan doğrudan bir çelişkiydi:

- `PROJECTMANIFEST.md` (yüklendi ~19:32, kendi metninde *"Prepared 30
  August 2026"* yazıyor) genel pazaryeri dilini açıkça "eski" ilan
  ediyordu: *"The expert-board materials supersede earlier broad
  marketplace language for the Business project: construction-first,
  project-based archive..."*
- Buna rağmen kullanıcı ~20:04'te "Visual Infrastructure for Brands" B2B
  lisanslama taslağını yükledi ve sözlü olarak onayladı: *"Hayır,
  gerçekte bu genel lisanslama konsepti geçerli."*
- 21:13'te (günün en son yüklemesi) gelen dosyalar `dualbusinessprivate.zip`
  ile aynı **"Dual"** paketti: Business tekrar inşaat-öncelikli, ama
  Private (BAP-01) ile ayrı tutularak: *"Business is the Phase-1
  construction product. It does not expose the broader image
  marketplace..."* (`beta-art-dual/README.md`).

**Karar (kullanıcı onayı, 30.08.2026):** Dual reconciliation geçerli.
**BAB-02 Business = yalnızca inşaat-öncesi proje dokümantasyon arşivi.**
Genel B2B fotoğraf lisanslama ("Visual Infrastructure for Brands")
Business kapsamından çıktı; o konsept **Private (BAP-01)** altında
değerlendirilecek. `beta-art-business-v3` taslağı (scratchpad) bu kararla
artık **geçersiz/referans** — Business için bundan sonra üretilecek her
şey inşaat-arşivi konseptine (madde 2, aşağıda) dayanmalı.

## QBLOGG (bu depo)

- **Ne:** AI destekli çok dilli içerik stüdyosu sitesi
- **Nerede:** GitHub `andersenbetul-alt/beta-art` (bu depo) → Vercel takımı
  `bet-art` (`team_xNtowH7U0jXQrI53DFJFzH2o`), proje `qblogg`
  (`prj_hJ6RIlkwFzvMkWV9fOcmxic9VJSX`)
- **Durum:** canlı, `state: READY`, production
- **Not:** Depo adı "beta-art" tarihsel bir kalıntı (bkz. CLAUDE.md
  "Depo adı hakkında"). "Beta Art" markasıyla ilişkili değil.

## Beta Art Business — konsept değerlendirmesi (karar günlüğü, 31.08.2026)

Kullanıcının "Fikir ve Konsept Değerlendirme Ekibi" şablonu (19 bölüm, 100
puanlık rubrik) BAB-02 üzerinde çalıştırıldı. Tam rapor bu oturumun
sohbet kaydında; özet:

- **Puan: 56/100.** Rubriğin kendi bandı (50–64) "konsepti/hedef kitleyi
  önemli ölçüde değiştir" diyor — ama bu, fikrin kırık olduğu için değil,
  **hiç pazar-doğrulaması yapılmadığı** için (talep 6/15, ödeme 5/15).
  Zaten planlanan "3 ödeyen müşteri" pilot kapısı bu iki eksen için doğru
  ilaç.
- **Karar: Devam et — yalnızca doğrulama fazına.** Yazılım yok, yeni
  web sayfası yok (zaten var); keşif görüşmeleri + fiyat testi var.
- **Web araştırmasıyla doğrulanan yeni gerçekler** (uydurulmadı,
  kaynaklı): Norveç'te `bustadoppføringslova` **tüketici konutu** için
  5 yıllık kesin reklamasyon süresi veriyor (kaynak: svw.no, Codex
  Advokat) — **ticari NS 8405/8406/8407 sözleşmelerindeki süre bu
  oturumda doğrulanmadı**, satış diline girmeden önce avukata sorulmalı.
  En yakın kurumsal analog/rakip **Preservica for Construction**
  (dijital kayıt arşivleme) — Dalux/PlanRadar/Procore hâlâ proje-içi
  odaklı, kapanış-sonrası konumlandırma bulunamadı ama bu bağımsız
  doğrulanmadı, sadece bu üçünün birincil odağı doğrulandı. Pazar
  büyüklüğü için hiçbir birincil kaynak bulunamadı — açık boşluk.
- **Yeni alternatif, ciddiye alınmalı:** doğrudan entreprenör/byggherre
  satışı yerine **sigorta şirketi/büyük byggherre kanal modeli** —
  "kim ödüyor" sorusunu tek büyük alıcıya kilitleyerek çözer. Mevcut
  pilot fazında paralel test edilmeli, ayrı bir ürün değil.

## Beta Art — ana kaynak bulundu: `main`'in kendi `beta-art/BETA_ART_MASTER.md`'si (30.08.2026, gece)

Bu oturum boyunca (yukarıdaki bölüm) düzinelerce yüklenen dosyayı çapraz
okuyarak Beta Art konseptini yeniden inşa etmeye çalıştık. Sonra
`origin/main`'in artık monorepo olduğunu keşfettim ve orada
**`beta-art/BETA_ART_MASTER.md`** + **`beta-art/BETA_ART_SINGLE_SITE_ARCHITECTURE.md`**
diye iki belge buldum — bunlar tam olarak aradığımız "tek doğru kaynak."
Bizim parça parça çıkardığımız her şeyi doğruluyorlar, bire bir:

- **"Single website rule":** *"BETA ART is one brand, one website and one
  evolving concept... Do not create another Beta Art website when a new
  idea appears."* Üretim kod tabanı: `andersenbetul-alt/beta-art-archive`
  (ayrı bir repo — main'deki `beta-art/` muhtemelen bunun bir kopyası/
  vendor'ı, birebir aynı mı doğrulanmadı), production dalı `main`, hedef
  Vercel.
- **Business, tek sitenin bir bölümü olarak construction-first —
  Dual reconciliation kararımızı birebir doğruluyor:** *"Aug 25, 2026
  `BAB01_035 · BETA ART BUSINESS — MASTER BUSINESS MODEL v1.0` remains
  the highest-current Business decision set."* Norveç-öncelikli, inşaat
  odaklı: *"Dokumentasjon som overlever prosjektet."* Ticari ilke:
  *"Retrieval, not storage."* Doğrulama kapısı: *"Deliver three paying
  archive customers semi-manually before building a large software
  platform."*
- **Site mimarisi (9 bölüm, tek sayfa/site, ayrı domain'ler değil):**
  01 Hero (iki ana yolculuk: Archive/Photography ve For Business),
  02 What Beta Art protects, 03 Archive/Photography (`beta-art-v3`'ün
  müze-standardı görsel dilini koru, eski ticari varsayımlarını atma),
  04 For Business (tam olarak bizim yayınladığımız içerik: "Vurder ett
  avsluttet prosjekt" / "Book 20 minutter"), 05 How it works (**Source/
  original → Metadata → Verification/Exception → Rights → Retrieval →
  Retention → Export/Exit** — bizim "Source→Context→Verify→Rights→
  Retrieve→Export" zincirimizle neredeyse birebir), 06 Beta Art Verified,
  07 Assignments/Commissions, 08 Rights & AI (AI training varsayılan
  olarak verilmez — canlı sitenin SSS'siyle birebir), 09 Series/Editorial
  (Work, Craft, Land and Light, The Table, Rooms — BAP-01 için zaten
  kaydettiğimiz seri isimleriyle birebir aynı).
- **Kaynak değerlendirmesi** (`SINGLE_SITE_ARCHITECTURE.md`), bizim de
  bağımsız olarak vardığımız sonuçları teyit ediyor: GoDaddy Airo =
  "BASE EXPERIENCE" ama "authenticated Airo builder itself is not a
  production source-of-truth"; `beta-art-v3.html` = "STRONG VISUAL
  REFERENCE" ama "legacy pricing/payment claims, not aligned with
  current Business validation direction"; `beta-art-master-complete.html`
  = "BEST CONNECTED PRODUCT MODEL" ama "too broad for immediate
  commercial validation... risks becoming a platform before demand is
  proven." Yani bizim "hariç tutulan eski sürüm" tespitlerimiz doğruydu.
- **`main`'deki `beta-art/README.md`** (Lovable projesi, `lovable.dev/
  projects/9b7b3abe-43fc-4867-9f79-b1d22fb1a80c`) — build-prompt metni,
  kullanıcının bu oturuma yapıştırdığı **canlı `beta-art.com` ana sayfa
  içeriğiyle** (12 levha adı, "from kr 190", lisans katmanları, nav
  öğeleri) **birebir eşleşiyor.** Yani BAP-01 Private'ın gerçek kaynağı
  artık kesin: bu Lovable projesi, `main`'deki `beta-art/` altında.
  `docs/girisimler.md`'nin daha önce "muhtemelen `human-lens-archive`"
  dediği eşleştirme büyük ihtimalle doğruydu, artık daha güçlü kanıtla.

**Ne hâlâ doğrulanmadı:** `andersenbetul-alt/beta-art-archive` (ayrı repo)
ile main'deki `beta-art/`'ın aynı şey olup olmadığı; `project-hxi`
Vercel takımındaki dört projenin (`beta-art`, `beta-art-business`,
`beta-art-archive`, `beta-art-industry-archive`) bu monorepo yapısıyla
tam ilişkisi. Bu oturum `main`'e commit atmadı, yalnızca `origin/main`'i
salt-okunur inceledi (`git fetch` + `git show`) — kendi dalıma hiçbir
şey birleştirilmedi.

## Beta Art — üç mülklü sistem (kesinleşti, 30.08.2026) — main öncesi tahlil, aşağıda tarihsel kayıt olarak duruyor

Kullanıcı bu depoya Beta Art'ın kendi resmi proje belgelerini yükledi:
`PROJECTMANIFEST.md`, `BETAARTROUTEMAP.md`, `BETAARTPROJECTCODES.md`,
`CONTENTMAP.md`, `ASSETSTATUS.md` + gerçek HTML/JS kaynak dosyaları.
Bu üçü birbirini doğruluyor — aşağıdaki yapı **tahmin değil, kullanıcının
kendi proje sisteminin belgelenmiş hâli.**

**Ortak kimlik:** Roma profili + defne yaprağı aperture/seal işareti
(bordo/kırmızı `#8B1A1A`/`#C43A2E`), "BETA ART" serif logotype. Kırmızı
yalnızca güven/karar sinyali için kullanılır. Gerçek doğrulama olmadan
"Verified" iddiası yok. HXI'nin (ayrı bir marka) görselleri hiçbir Beta
Art mülkünde kullanılmaz (`ASSETSTATUS.md`, `PROJECTMANIFEST.md`).
**QBLOGG'un kimliğiyle (Midnight Navy/Electric Aqua) hiçbir ortak
belirteci yok** — iki ayrı marka, bilinçli.

| Kod | Mülk | Alt yol | Amaç |
|---|---|---|---|
| BAP-01 | **Privat** | `/privat/` | Doğrulanmış insan fotoğrafçılığı: eser, sınırlı edisyon, doğrudan lisans/satış. Müze-arşiv estetiği. |
| BAG-03 | **Galeri** (Galleri og Utstilling Event) | `/events/` | Sanatçı, eser, sergi, açılış, kültürel etkinlik programı. |
| BAB-02 | **Business** | `/business/` | **İnşaat/yapı sektöründe proje bittikten sonra da bulunabilir kalan proje dokümantasyonu** — B2B rights desk, Evidence Photos, kurumsal arşiv. |

Üçü de aynı logo ailesini paylaşır ama **kendi içerik, fiyat, kullanıcı ve
deployment akışını** yönetir — ortak "pazaryeri" navigasyonuna konulmazlar,
formlar tek bir genel gelen kutusuna yönlendirilmez (`BETAARTROUTEMAP.md`
"Do not do" listesi).

### Privat (BAP-01) — **CANLI (30.08.2026 akşamı doğrulandı)**

Önceki kayıt "DNS Draft, hiçbir kayıt yayınlanmadı" diyordu — bu artık
**yanlış**. Kullanıcı `beta-art.com` ana sayfasının tam metnini bu oturuma
yapıştırdı; site gerçekten yayında ve içerik "Final Work v2"/Dual
taslaklarından farklı, üretim (production) hâlinde:

- **Konsept:** "Verified Human Photography" — tek fotoğrafçı, fiziksel
  kamerayla çekilmiş orijinal fotoğraf arşivi. Kanıt zinciri: RAW dosya
  saklanır → çekim kaydı (kamera/lens/pozlama/yer/tarih) görselle birlikte
  taşınır → lisans doğrudan fotoğrafçı tarafından imzalanır. AI-üretim
  **açıkça reddediliyor** ("No AI training · Verified human photography"
  altbilgide sabit).
- **Koleksiyon:** "Volume I", 12 levha (`2026.0142`–`2026.0153` katalog
  numaraları — `combinedstrategy.md`/`corecanonical.html`'deki eski
  "2026.0142 Portrait in Amber, 240" örneğiyle aynı numaralandırma ailesi,
  fiyat güncellenmiş: **"from kr 190"**). **Sadece 2/12 levha "Available"**
  (Portrait in Amber, The Maker) — kalanı "Awaiting verified original".
  Bunu olduğu gibi koruyun, hepsini müsait gibi sunmayın.
- **Lisans katmanları:** Personal (kr 190'dan), Commercial/Extended/Custom
  & Exclusive (fiyat isteğe bağlı) — talep formu (levha + lisans seçimi)
  var, gerçek ödeme/checkout akışı bu metinde görünmüyor (kullanıcı `/cart`
  istedi ama yapıştırdığı içerik ana sayfaydı — `/cart`'a özgü içerik hâlâ
  doğrulanmadı).
  16 maddelik SSS: AI kullanılmıyor, "Human Verified" kanıt süreci,
  Norveç 14 günlük cayma hakkı (peşin teslime onay verilirse feragat
  ediliyor), fatura/KDV, 72 saatlik indirme linki, iade sınırlı (teknik
  hata/mükerrer ödeme dışında yok).
  İletişim: `hallo@beta-art.com` (önceki `hello@betaart.no` — Business/BAB-02
  ile karıştırmayın, iki ayrı e-posta/marka yazımı).
- **Sergiler:** Autumn 2026 Oslo (Volume I açılışı), Winter 2026 (Print &
  Provenance, grup sergisi), Spring 2027 (davetli, Volume II ön izleme).
- **Fotoğrafçı bio:** 2012'den beri 84.000+ kare, ağırlıklı Norveç/İskandinavya.
- Bu, `PROJECTMANIFEST.md`'nin "Final Work v2 → Lovable `human-lens-archive`"
  eşleşmesiyle **tutarlı** (aynı Supabase/RAW-provenance mimarisi
  betaartaudit.docx'te önerilmişti) ama artık bağımsız doğrulanabilir bir
  canlı sitesi var — Lovable/Vercel hesap eşleşmesi hâlâ kesinleşmedi.
- **Bu içerikten üretilen referans artifact** (30.08.2026, bu oturum):
  https://claude.ai/code/artifact/4891c4bd-69ae-4884-82eb-50153c1a91b5 —
  kullanıcının yapıştırdığı metin birebir kullanıldı; levha kategorileri
  (Landscape/City/Portrait filtre etiketleri) gerçek sitede görünmediği
  için **tahmin edildi**, gerçek veri değil. Ödeme/checkout akışı yok,
  yalnızca form önizlemesi.

### Galeri (BAG-03)
- Ayrı bir gelecek-odaklı kültürel mülk, Business'a katılmıyor. Bu
  depoda henüz somut bir kod tabanı gözlemlenmedi.

### Business (BAB-02) — **kesinleşti: Dual reconciliation, madde 2 + 5 geçerli**

Beş ayrı dosya grubu (yükleme saatine göre) beş farklı/örtüşen konsept
taşıyordu. Kullanıcı 30.08.2026'da **madde 2 + 5'i (inşaat-öncelikli
arşiv, Private'tan ayrı)** onayladı; madde 1, 3, 4 artık kapsam dışı/
referans. Kronolojik sırayla, kayıt için tümü:

1. **~19:26-19:30, genel dijital ajans:** `quote.html`, `resources.html`,
   `blog.html`, `dashboard.html`, `aistaff.html` vb. — sektör bağımsız
   içerik/SEO/CV/otomasyon hizmeti, 12 dilli, yazar "Betül Öner". Bu grup
   içindeki **tek bir dosya** (`index.html`, küçük, 3.7KB) ise başlığı
   "Prosjektet avsluttes. Dokumentasjonen skal ikke." olan inşaat-öncelikli
   sayfa — yani bu grubun kendi içinde bile tutarsızlık var (kardeş
   sayfalar genel ajans, index inşaat-öncelikli). Muhtemelen bu tek dosya
   sonradan taşınmış bir yetim kopya, grubun geri kalanı eski/kapsam dışı.
2. **~19:32-19:38, inşaat-öncelikli proje arşivi** (`BETAARTPROJECTCODES.md`,
   `BETAARTROUTEMAP.md`, `PROJECTMANIFEST.md`, `CONTENTMAP.md`): İnşaat/yapı
   sektöründe tamamlanmış bir projenin belgelerini/görsellerini gelecekte
   bulunabilir kılmak. Ortak yöntem: **Source → Context → Verify → Rights →
   Retrieve → Export**. `PROJECTMANIFEST.md` kendi metninde *"Prepared 30
   August 2026"* diyor ve genel pazaryeri dilini açıkça "eski" ilan ediyor
   (üstteki güncelleme notundaki alıntılara bakın). Pilot: platform inşa
   edilmeden önce üç ödeyen arşiv müşterisi, 20 dakikalık görüşme birincil
   CTA. **Kapsam dışı:** genel stok pazaryeri, açık yükleme, tüketici
   checkout, Galeri etkinlikleri.
3. **~19:34, "Beta Art MASTER" — bölünmeden önceki tek konsept**
   (`combinedstrategy.md`, `corecanonical.html`, `betaartaudit.docx`):
   Tek bir "doğrulanmış insan fotoğrafçılığı" pazaryeri/arşivi —
   Privat/Business/Galeri ayrımı henüz yokken yazılmış. `combinedstrategy.md`
   kendini *"Sürüm: 1.0 · Tarih: 16 Ağustos 2026 · Durum: Konsolide
   referans — tek kaynak"* olarak tanımlıyor; `betaartaudit.docx` "Dato:
   Juli 2026" ile bulunan en eski belge. Yani bu grup, 2 numaralı gruptan
   **iki hafta daha eski** — üç mülklü sisteme (BAP-01/BAG-03/BAB-02)
   bölünmeden önceki hâl. `PROJECTMANIFEST.md` bunu açıkça "kaynak/inceleme
   materyali" seviyesine indiriyor.
4. **~20:04, "Visual Infrastructure for Brands"** (`beta-art-business-v3`
   olarak scratchpad'e kaydedildi): Norveçli 30+ sektöre genel B2B fotoğraf
   lisanslama. **Kullanıcı bunu doğrudan sözlü onayladı** ("Hayır, gerçekte
   bu genel lisanslama konsepti geçerli") — ama bu onay 2 numaralı grubun
   "eski" ilan ettiği dille tam olarak aynı dili taşıyor.
5. **21:13, en son yükleme — "Dual" reconciliation** (`dualbusinessprivate.zip`
   ile aynı içerik): Business'ı tekrar inşaat-öncelikli yapıyor, ama Private
   (BAP-01) ile **açıkça ayırarak**: *"Business is the Phase-1 construction
   product. It does not expose the broader image marketplace, art sales,
   generic stock categories..."* Her sayfada *"Pilot / utviklingsversjon —
   juridiske dokumenter og priser må valideres før kommersiell lansering."*
   uyarısı var — yani bu da kendini "kesin" ilan etmiyor, taslak olduğunu
   söylüyor. Fiyat taslağı: kurulum+5 yıl saklama 15.000 kr, yıl 6-10
   2.500 kr/yıl, aracılı çekim günü 11.000 kr (hepsi "hipotez", garanti
   ticari şart değil). Metadata dosya adı standardı:
   `BA-{prosjektnr}-{ÅÅÅÅMMDD}-{sone}-{fase}-{løpenr}.{ext}`. İletişim:
   `hello@betaart.no`.

**Bu grupla aynı pakette gelen ama Business değil Privat'a ait olan bir
parça:** `finalworkv2.zip` (`beta-art-final-v2`, paket sürümü `2.0.0`) —
gerçek bir React+TypeScript+Vite+Supabase uygulaması, veri modeli "Plate"
(tek bir doğrulanmış fotoğraf kaydı: `catalogue`, `priceNok`, SHA-256
`provenanceHash`, Supabase Edge Function `verify-plate` ile sunucu
tarafında doğrulama). `PROJECTMANIFEST.md` bunu açıkça Privat'ın referans
uygulaması olarak dosyalıyor, Business ile ilgisi yok.

- **Açık üretim girdileri (henüz yok, uydurulmadı):** DPA, AB/EEA
  depolama, muhasebe, sigorta, paket/fiyat kararı, şirket bilgileri,
  başvuru uç noktası, pilot vakalar, gerçek fiyat testi.
- **Doğrulanmamış varsayımlar** (`CONTENTMAP.md` "Stress-test decision"):
  kapasite 60 değil ~35 gün/hafta 15-20 saat; fotoğrafçı→arşiv alıcısı
  devri kanıtlanmamış; birçok inşaat işinde arşiv hakları mevcut
  olmayabilir; mevcut araçlar proje-içi fotoğrafları zaten kapsıyor.
  **Yasaklı iddialar:** "yasal kanıt statüsü" vaadi, "otomatik atama→arşiv
  sözleşmesi dönüşümü" vaadi.
- **`beta-art-contact1-*-andersenbetul-9635s-projects.vercel.app`**
  (kullanıcının paylaştığı canlı önizleme) muhtemelen bu Business
  mülkünün bir dağıtımı — "Archive + Business" tek sayfa, aynı Source/
  Context/Verify/Rights/Retrieve/Export dili, aynı Norveççe başlık.
  Bu oturumdan **erişilemiyor** (ne `bet-art` Vercel takımında ne
  taranan Lovable çalışma alanlarında bulunuyor) — cross-tier `add_repo`
  kısıtlaması nedeniyle bu oturumda düzenlenemez de (bkz. aşağıdaki
  "Erişim sınırları").
- **DNS durumu:** `beta-art.com` bölgesi "Draft", 12 kayıttan 7'si
  doğrulanmış, hiçbir canlı değişiklik yapılmadı. Planlanan alt alan
  adları: `archive.beta-art.com`, `events.beta-art.com`,
  `business.beta-art.com` — ama `BETAARTROUTEMAP.md` bunun yerine
  **tek domain + alt yol** (`/privat/`, `/events/`, `/business/`) modelini
  tanımlıyor. İki belge arasında bu noktada küçük bir tutarsızlık var;
  DNS belgesi kendisi "planlı, yayınlanmadı" diyor, yani bu henüz karar
  değil.

### Erişim sınırları (bu oturumdan doğrulanan platform kısıtları)
- GitHub: bu oturum `andersenbetul-alt/beta-art` ile başladığı için
  başka hiçbir GitHub hesabından (`betulandersen-droid` dahil) depo
  eklenemiyor — "cross-tier adds are not supported" hatası, deponun
  var olup olmamasından bağımsız bir platform sınırı.
- Vercel: `andersenbetul-9635s-projects` hesabına bu oturumun Vercel
  bağlantısından erişim yok (`get_project`/`get_access_to_vercel_url`
  403 döndü).
- Lovable: `human-lens-archive` projesine tam erişim var (okuma +
  `send_message` ile düzenleme) ama workspace'in kredisi bitti
  (26.08.2026) — düzenleme mesajı gönderilemedi.
- **`beta-art.com` bu oturumdan erişilemiyor** (30.08.2026, doğrulandı):
  hem `WebFetch` hem doğrudan `curl` `CONNECT tunnel failed, response 403`
  / `connect_rejected (organization policy)` döndürdü — `vercel.app` ve
  `lovable.app` ile aynı türden kurumsal ağ engeli. İçerik yalnızca
  kullanıcının tarayıcıdan kopyalayıp yapıştırmasıyla elde edilebiliyor.

## HXI Phonk Studio

- **Ne:** Norveçli bir phonk müzisyeni (HXI, iddia edilen 43M+ Spotify
  dinlenmesi) için sanatçı sitesi — müzik, sync lisanslama, stem/mağaza,
  booking.
- **Nerede:** Lovable'da **beş ayrı deneme/remix** aynı çalışma alanında
  (`HXI Phonk Studio`, `HXI Phonk Studio (10)`, `Remix... (46)`,
  `hxi-nordic-pulse`, ve bir de "HXI" adında **boş** ikinci bir çalışma
  alanı — `workspace_01m0ysmsg1feht8t2v7s4h0f69`, 0 proje) + Vercel
  takımı `bet-art`'ta proje `hxi-music` (GitHub `betulandersen-droid/eve-slack-agent`)
- **Durum:** İki varyant yayında ve herkese açık: `hxi-nordic-pulse.lovable.app`,
  `human-lens-archive.lovable.app` (bu HXI değil, Beta Art Archive — karıştırmayın).
  `HXI Phonk Studio (10)` ve `HXI Phonk Studio` (ilk sürüm) yayında değil.
- **Not:** Beş ayrı deneme aynı fikrin tekrar tekrar üretildiğini gösteriyor —
  hangisinin "asıl" sürüm olduğu bu depodan belirlenemez, kullanıcıya sorulmalı.

## Naviar Consult / Naviar Care

İki farklı iz var, aynı marka ailesi (Naviar) altında:

- **Naviar Consult** — Vercel projesi `naviar-consult`, `bet-art` takımında,
  GitHub `betulandersen-droid/eve-slack-agent`e bağlı (dikkat: bu GitHub
  reposu `hxi-music` ile de aynı — muhtemelen tek bir monorepo/placeholder
  repo birden çok Vercel projesine bağlanmış).
- **Naviar Care** — Vercel projesi `naviar-care-1` (`bet-art` takımı,
  GitHub `betulandersen-droid/naviar-care-1`) + muhtemelen aynı konsept
  olan Lovable projesi **"Hjemmehjelp Norge"** (dahili ad: PårørendePilot /
  Nærhjelp) — Norveç'te yaşlılar ve aileleri için yerel yardım pazaryeri
  MVP'si (Senior/Family/Helper/Admin rol anahtarlı demo), 24.08.2026'da
  oluşturuldu, yayında değil.
- **Not:** `docs/test-mimarisi.md` ve `docs/ekip-modeli.md` NAVIAR Care'i
  zaten referans alıyor ve **"bu depoda geliştirilmiyor"** diyor — bu
  doğrulandı, tutarlı.

## Sistem/hesap haritası

| Araç | Hesap/Takım | İçerdiği |
|---|---|---|
| GitHub | `andersenbetul-alt` | bu depo (`beta-art` → QBLOGG) |
| GitHub | `betulandersen-droid` | `eve-slack-agent` (naviar-consult + hxi-music'in bağlı olduğu repo), `naviar-care-1` |
| Vercel | takım `bet-art` (`team_xNtowH7U0jXQrI53DFJFzH2o`) | qblogg, naviar-consult, naviar-care-1, hxi-music |
| Vercel | `andersenbetul-9635s-projects` (kişisel, bu oturumdan **erişilemiyor**) | `beta-art-contact1` (muhtemelen), `beta-id-verification` (muhtemelen) |
| Vercel | takım/hesap `project-hxi` (bu oturumdan **erişilemiyor**, 30.08.2026 doğrulandı: `get_project` dört proje için de `403 Forbidden`) | **dört proje kesinleşti:** `beta-art-archive` (muhtemelen BAP-01 Private/`beta-art.com`), `beta-art-business` (muhtemelen BAB-02), `beta-art` (muhtemelen ana/gateway site), `beta-art-industry-archive` (muhtemelen BAG-03 ya da sektör-bazlı bir varyant) — hepsi `/settings/git`'e sahip yani GitHub reposuna bağlı, hangi repo(lar) olduğu bu oturumdan görülemiyor. **Bu liste büyümeye devam edebilir** — her yeni proje adını tek tek doğrulamak yerine, gerçek ilerleme için kullanıcının bağlı GitHub repo adını veya bu Vercel takımına erişimi paylaşması gerekiyor. |
| Lovable | çalışma alanı "Betül's Lovable" (`92fe40bbf478c5479f16`) | human-lens-archive (Beta Art Archive, yayında), HXI Phonk Studio ×4 deneme, Hjemmehjelp Norge |
| Lovable | çalışma alanı "HXI" (`workspace_01m0ysmsg1feht8t2v7s4h0f69`) | 0 proje — boş |

## Açık sorular (kullanıcıya sorulmalı, uydurulmadı)

1. `beta-art-contact1` ve `beta-id-verification` gerçekten Beta Art Archive'a
   mı ait, yoksa bambaşka iki proje mi? Doğrulamak için o Vercel hesabına
   erişim (ya da ilgili GitHub reposu bu oturuma `add_repo` ile eklenmesi)
   gerekir.
2. HXI Phonk Studio'nun beş denemesinden hangisi güncel/asıl kabul
   ediliyor?
3. `naviar-consult` ve `hxi-music` Vercel projelerinin ikisi de aynı GitHub
   reposuna (`eve-slack-agent`) bağlı görünüyor — bu bilinçli bir
   placeholder mı, yoksa yanlış bağlanmış bir proje mi?
4. ~~BAB-02 Business kapsamı~~ — **çözüldü (30.08.2026):** Dual
   reconciliation onaylandı. Business = yalnızca inşaat-arşivi; genel B2B
   fotoğraf lisanslama Private'a (BAP-01) taşındı. Bkz. yukarıdaki
   "Business (BAB-02)" bölümü.
5. **(30.08.2026, yeni, en değerli açık soru)** Vercel takımı `project-hxi`
   altında **iki** proje doğrulandı: `beta-art-archive` ve
   `beta-art-business`. İkisi de bu oturumdan `403 Forbidden`.
   - Bu isim `betulandersen-droid/eve-slack-agent`'a bağlı `hxi-music`
     projesiyle (HXI Phonk Studio) mi ilişkili, yoksa yalnızca isim
     benzerliği mi?
   - `beta-art-archive` gerçekten `beta-art.com`'u mu dağıtıyor?
   - **En önemlisi:** `beta-art-business`'ın `/settings/git` sayfasında
     hangi GitHub reposu bağlı? Bu, BAB-02'nin belgelerden değil
     **doğrudan canlı kaynak kodundan** okunmasını sağlayabilir —
     `andersenbetul-alt` altındaysa bu oturuma `add_repo` ile eklenebilir.
   Kullanıcı bu Vercel takımına erişim tanımalı ya da bağlı repo adını
   doğrudan paylaşmalı; bu oturumdan tahmin edilemez.

## Bu belgeyi güncel tutma

Bu envanter tek seferlik bir tarama — kendini güncellemez. Yeni bir
proje/hesap ortaya çıktığında (yeni bir link paylaşıldığında, yeni bir
Vercel/Lovable projesi oluşturulduğunda) bu dosyaya bir satır daha
eklenmeli.
