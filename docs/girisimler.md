# Girişimler — hangi proje nerede yaşıyor

Bu belge **bu depo dışındaki** girişimlerin envanteridir. Amaç: hangi
ürünün hangi araçta/hesapta, hangi durumda olduğunu tek yerden görmek.
**Bu depo yalnızca QBLOGG'u geliştirir** — buradaki diğer girişimler bilgi
amaçlıdır, bu depoda kodları değişmez, dosyaları taşınmaz.

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

## Beta Art — üç mülklü sistem (kesinleşti, 30.08.2026)

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

### Privat (BAP-01)
- **Nerede (muhtemelen):** Lovable, çalışma alanı "Betül's Lovable"
  (`92fe40bbf478c5479f16`), proje `human-lens-archive` — **yayında**
  (`is_published: true`) → `https://human-lens-archive.lovable.app`.
  `PROJECTMANIFEST.md`'deki "Final Work v2" (React + Supabase migrations
  + Edge Functions) tanımı, bu Lovable projesinin dosya listesiyle
  (`ProvenancePanel.tsx`, `TrustStrip.tsx`, Supabase entegrasyonu) örtüşüyor
  — ama bu eşleşme kesin doğrulanmadı.
  Hedef alan adı: `archive.beta-art.com` (DNS taslağında) ya da
  `beta-art.com` kökü (eski referanslarda) — **DNS henüz "Draft", hiçbir
  kayıt yayınlanmadı** (`betaartdnsadministrasjon.html`: "Ingen poster
  endres eller publiseres fra denne siden").
- Yedi küratöryel seri (Work, Craft, Land and Light, The Table, Rooms,
  The Unseen, Weather), en az 24 lisanslı orijinal gerekli (launch gate),
  "100% verified" gibi iddialar henüz doğrulanmamış/canlı değil.

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

## Bu belgeyi güncel tutma

Bu envanter tek seferlik bir tarama — kendini güncellemez. Yeni bir
proje/hesap ortaya çıktığında (yeni bir link paylaşıldığında, yeni bir
Vercel/Lovable projesi oluşturulduğunda) bu dosyaya bir satır daha
eklenmeli.
