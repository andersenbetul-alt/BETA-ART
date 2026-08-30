# Girişimler — hangi proje nerede yaşıyor

Bu belge **bu depo dışındaki** girişimlerin envanteridir. Amaç: hangi
ürünün hangi araçta/hesapta, hangi durumda olduğunu tek yerden görmek.
**Bu depo yalnızca QBLOGG'u geliştirir** — buradaki diğer girişimler bilgi
amaçlıdır, bu depoda kodları değişmez, dosyaları taşınmaz.

Veriler 26.08.2026'da Vercel MCP (`list_teams`, `list_projects`,
`list_deployments`) ve Lovable MCP (`list_workspaces`, `list_projects`)
araçlarıyla **doğrudan sorgulanarak** ölçüldü — uydurma yok. Erişilemeyen
bir şey varsa "doğrulanamadı" diye açıkça yazılıdır.

**Güncelleme (30.08.2026) — BAB-02 kapsamı düzeltildi:** Aşağıdaki BAB-02
Business bölümü, `PROJECTMANIFEST.md`/`BETAARTPROJECTCODES.md`'nin
"inşaat-öncelikli proje arşivi" kararını temel alıyordu. Kullanıcı bunu
doğrudan yalanladı: geçerli konsept **"Norway's Visual Infrastructure for
Brands"** — Norveçli 30+ sektöre (reklam ajansları, e-ticaret, kamu,
petrol/offshore, medya, turizm...) abonelik/çerçeve anlaşması/sipariş
üzerine çekimle genel fotoğraf lisanslama hizmeti (`betaart.no/business/`).
`PROJECTMANIFEST.md`'nin "eski/geçersiz" dediği dil aslında **güncel**
karar — yani o belge de eskimiş. Bu, aynı gün içinde ikinci kez konseptin
değiştiği anlamına geliyor; bir sonraki oturum başka bir sürümle
karşılaşırsa şaşırmasın, önce kullanıcıya doğrulatsın.

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

### Business (BAB-02) — **inşaat-öncelikli proje arşivi**
- **Kesin kapsam** (`BETAARTPROJECTCODES.md`, `CONTENTMAP.md`,
  `PROJECTMANIFEST.md` — üçü de aynı şeyi söylüyor): inşaat/yapı
  sektöründe tamamlanmış bir projenin belgelerini/görsellerini gelecekte
  bulunabilir kılmak. Norveççe başlık: **"Prosjektet avsluttes.
  Dokumentasjonen skal ikke."** (Proje bitiyor, dokümantasyon bitmemeli.)
  Ortak yöntem: **Source → Context → Verify → Rights → Retrieve → Export**.
  "Beta Art Verified" yalnızca neyin kontrol edildiğini belirtir, hukuki/
  mutlak doğruluk iddia etmez. Pilot: platform inşa edilmeden önce üç
  ödeyen arşiv müşterisi, 20 dakikalık görüşme birincil CTA.
  **Kapsam dışı:** genel stok pazaryeri, açık yükleme, tüketici checkout,
  Galeri etkinlikleri.
- **Hariç tutulan/eski sürüm:** Aynı proje klasöründe İngilizce, genel
  bir dijital ajans sürümü de vardı (web sitesi/SEO/CV/AI-otomasyon
  hizmetleri, `business.beta-art.com`, yazar Betül Öner, çok olgun ve
  yayına hazır görünen içerik). `CONTENTMAP.md` ve `PROJECTMANIFEST.md`
  bunu **açıkça "eski/referans, güncel kapsam değil"** olarak
  işaretliyor: *"the older platform/public-clean files are retained as
  references only and are not the Business product source of truth"*
  ve *"Its Business page uses the older broad 'visual infrastructure
  for brands' language; it must not override the newer construction-first
  project-archive positioning."* Yani bu **çelişki kullanıcının kendi
  belgesinde zaten çözülmüş** — sormaya gerek yok.
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

## Bu belgeyi güncel tutma

Bu envanter tek seferlik bir tarama — kendini güncellemez. Yeni bir
proje/hesap ortaya çıktığında (yeni bir link paylaşıldığında, yeni bir
Vercel/Lovable projesi oluşturulduğunda) bu dosyaya bir satır daha
eklenmeli.
