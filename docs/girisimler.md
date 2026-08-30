# Girişimler — hangi proje nerede yaşıyor

Bu belge **bu depo dışındaki** girişimlerin envanteridir. Amaç: hangi
ürünün hangi araçta/hesapta, hangi durumda olduğunu tek yerden görmek.
**Bu depo yalnızca QBLOGG'u geliştirir** — buradaki diğer girişimler bilgi
amaçlıdır, bu depoda kodları değişmez, dosyaları taşınmaz.

Veriler 26.08.2026'da Vercel MCP (`list_teams`, `list_projects`,
`list_deployments`) ve Lovable MCP (`list_workspaces`, `list_projects`)
araçlarıyla **doğrudan sorgulanarak** ölçüldü — uydurma yok. Erişilemeyen
bir şey varsa "doğrulanamadı" diye açıkça yazılıdır.

## QBLOGG (bu depo)

- **Ne:** AI destekli çok dilli içerik stüdyosu sitesi
- **Nerede:** GitHub `andersenbetul-alt/beta-art` (bu depo) → Vercel takımı
  `bet-art` (`team_xNtowH7U0jXQrI53DFJFzH2o`), proje `qblogg`
  (`prj_hJ6RIlkwFzvMkWV9fOcmxic9VJSX`)
- **Durum:** canlı, `state: READY`, production
- **Not:** Depo adı "beta-art" tarihsel bir kalıntı (bkz. CLAUDE.md
  "Depo adı hakkında"). "Beta Art" markasıyla ilişkili değil.

## Beta Art Archive

- **Ne:** Doğrulanmış insan fotoğrafçılığı lisanslama sitesi — RAW
  orijinal saklama, çekim kaynağı/provenance kaydı, doğrudan fotoğrafçı
  lisansı. Koleksiyon, Doğrulama, Fotoğrafçı, Lisanslama (Personal/
  Commercial/Extended/Custom), SSS bölümleri.
- **Nerede:** Lovable, çalışma alanı "Betül's Lovable"
  (`92fe40bbf478c5479f16`), proje `human-lens-archive`
- **Durum:** **yayında** (`is_published: true`, `publish_visibility:
  public`) → `https://human-lens-archive.lovable.app`. Hedef alan adı
  `beta-art.com` (proje açıklamasında canonical olarak geçiyor, alan adı
  bağlantısı doğrulanmadı).
- **Not:** "Beta Art" adının gerçek sahibi bu proje.
- **Doğrulanamadı:** `beta-art-contact1-git-beta-070b86-andersenbetul-9635s-projects.vercel.app`
  ve `beta-id-verification.vercel.app` adlı iki ayrı adres bu görüşmede
  paylaşıldı; içerik/isimlendirme örtüşmesinden bu projeyle ilgili
  olabilecekleri düşünülüyor ama ne bu oturumun Vercel hesabından
  (`bet-art` takımı) ne Lovable'dan eşleşen bir kayıt bulundu — muhtemelen
  farklı bir Vercel hesabında (`andersenbetul-9635s-projects`) barınıyorlar,
  bu oturumdan erişilemiyor.

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
