---
name: small-business
description: Beta Art'ın küçük işletme operasyonu — nakit durumu, Norveç MVA (KDV) ve forskuddsskatt (peşin gelir vergisi) takibi, BAB/BAC/BAP hatlarına göre satış hattı ve sözleşme taslakları, Stripe'tan gelen ödeme/abonelik verisinin özeti. Şu isteklerde MUTLAKA bu beceriyi kullan: "kasada ne kadar var", "MVA ne zaman ödenecek", "forskuddsskatt hesapla", "Stripe'tan bu ayki geliri çek", "şu müşteriye sözleşme/teklif taslağı hazırla", "BAB/BAC/BAP durumu ne", "muhasebe dışa aktarımını işle", "faturayı taslakla" — hatta kullanıcı "muhasebe", "vergi", "nakit akışı" ya da bir ventür adını (BAB/BAC/BAP) geçirip QBLOGG kod tabanıyla ilgisiz bir şey sorduğunda da. Bu bir TASLAK ve HAZIRLIK aracıdır — parayı veya bir müşteriyi etkileyen hiçbir adımı (fatura gönderme, ödeme talebi, müşteriye mesaj) kullanıcı onayı olmadan göndermez/uygulamaz.
owner: Beta Art
version: 0.1.0
---

# Beta Art — küçük işletme operasyonu

Bu beceri, Beta Art'ın (bu deponun sahibi olan şirketin) günlük işletme
işlerini hazırlar: nakit durumu özeti, Norveç vergi takvimi (MVA,
forskuddsskatt), ventür bazlı satış hattı ve sözleşme taslakları. QBLOGG'un
kod/dağıtım operasyonundan (`qblogg-operasyon` becerisi) tamamen ayrı bir
alan — biri şirketin ürününü, biri şirketin kendi finans/satış işini
yönetir. İkisi aynı depoda yaşar ama karışmaz.

**Bu belge 25-26.08.2026 tarihli bir kullanıcı sohbetinden, dış bir
tanımdan (bkz. §7) türetilmiştir — ilk sürümdür, henüz gerçek Stripe/banka
verisiyle test edilmemiştir.** Aşağıda **TEYİT GEREKİYOR** işaretli her
madde, ilk gerçek kullanımdan önce kullanıcıyla netleştirilmeli.

## 0. Tek ve değişmez kural: onay olmadan gönderim yok

Bu beceri **taslak üretir, işlem yapmaz.** Aşağıdakilerin hiçbiri
kullanıcının açık "gönder" / "onaylıyorum" onayı olmadan gerçekleşmez:

- Bir faturanın veya ödeme talebinin gönderilmesi
- Bir müşteriye e-posta/mesaj gönderilmesi
- Bir sözleşmenin imzaya/onaya çıkarılması
- Stripe'ta bir ürün, fiyat veya ödeme bağlantısı oluşturulması
- Vergi dairesine (Skatteetaten/Altinn) herhangi bir beyan gönderilmesi

Neden bu kadar katı: burada gerçek para, gerçek vergi yükümlülüğü ve
gerçek müşteri ilişkileri var. Yanlış giden bir taslak düzeltilebilir;
yanlış gönderilen bir fatura veya yanlış giden bir vergi beyanı
düzeltilmesi zor/maliyetli bir hataya dönüşür. Bu yüzden akış her zaman
**topla → taslakla → kullanıcıya göster → onay bekle → (onaylanırsa)
kullanıcı kendisi gönderir veya açıkça "gönder" der** şeklindedir.
`docs/odeme-sistemi.md`'de zaten aynı ihtiyat var: bu oturumdaki Stripe
erişimi salt-okunur, ürün/fiyat/Payment Link oluşturma kullanıcıda kalıyor.

## 1. Şirket yapısı ve vergi takvimi (Norveç)

Beta Art bir **enkeltpersonforetak** (şahıs işletmesi) olarak işletiliyor.
İki tekrarlayan yükümlülük:

| Yükümlülük | Eşik/kural | Kaynak |
|---|---|---|
| **MVA (KDV) kaydı** | 12 aylık herhangi bir dönemde net satış 50.000 NOK'u geçince Merverdiavgiftsregisteret'e kayıt zorunlu; eşik aşılır aşılmaz KDV'li fatura kesme yükümlülüğü başlar | Skatteetaten/Altinn — bu oturumda WebSearch ile doğrulandı (26.08.2026), ayrıca `docs/beta-art-konsept.md`'de kayıtlı |
| **Forskuddsskatt** | Şahıs işletmesi sahibi, yıl içindeki tahmini kazanca göre peşin gelir vergisi taksitleri öder (genelde çeyreklik) | **TEYİT GEREKİYOR** — kesin taksit tarihleri ve oranı Skatteetaten hesabından (Altinn) alınmalı, bu beceri tahmin üretmez |

Bu beceri **vergi danışmanlığı yapmaz** — rakamları toplar, taslak
hazırlar, ama "ne kadar vergi öde" kararını kullanıcı (gerekirse
muhasebeci ile) verir. Herhangi bir vergi rakamı sunulurken "örnek/tahmin"
olduğu açıkça yazılır (bkz. proje CLAUDE.md kural 8 — rakamlar örnek
olarak işaretlenir).

## 2. Ventürler: BAP-01, BAG-03, BAB-02

**İkinci düzeltme (30.08.2026):** 26.08'deki eşleme (BAB=Beta Art
Business doğrulanmış, BAC/BAP teyit gerekiyor) kısmen bayatladı —
kullanıcının aynı gün yüklediği `BETA-ART-PROJECT-CODES.md` ve
`PROJECT-MANIFEST.md` (bkz. `beta-art/source-review/intake-2026-08-30/`)
daha yeni ve daha ayrıntılı bir kod seti veriyor: **üç proje, üç kod**,
"BAC" hiçbirinde geçmiyor:

| Kod | Proje | Alt yol | Dayanak |
|---|---|---|---|
| **BAP-01** | Beta Art **Privat** — doğrulanmış insan fotoğrafı, edisyon, doğrudan lisans | `/privat/` (veya `beta-art-privat/`) | `BETA-ART-PROJECT-CODES.md` — [V] |
| **BAG-03** | Beta Art **Galeri**/Utstilling Event — sanatçı, eser, sergi, açılış, kültürel etkinlik | `/events/` (veya `beta-art-gallery-event/`) | Aynı belge — [V] |
| **BAB-02** | Beta Art **Business** — inşaat sektörü proje-kapanışı dokümantasyonu (Completed Project Rescue) | `/business/` (veya `beta-art-business/`) | Aynı belge; `BETA_ART_MASTER.md`'deki BAB tanımıyla tutarlı — [V] |

**"BAC" hâlâ çözülmedi.** Orijinal beceri tanımındaki "BAC subscription
clients" hiçbir kaynakta (ne `BETA_ART_MASTER.md`'de ne bu son üç
belgede) karşılık bulmuyor. İki ihtimal: (a) eski/terk edilmiş bir kod,
(b) "BAG"in yanlış yazımı. Kullanıcıya sormadan hiçbirini varsayma.

**Yapısal çelişki (çözülmedi, kullanıcıya soruldu):** 26.08'de
`beta-art-archive`'ın tamamı (React/Vite/Supabase, tek uygulama) bu
depoya `beta-art/` altına göçürüldü. Ama 30.08 belgeleri (`PROJECT-MANIFEST.md`)
farklı bir hedef yapı tarif ediyor: **üç ayrı proje klasörü**
(`beta-art-privat/`, `beta-art-gallery-event/`, `beta-art-business/`),
ve o React/Vite/Supabase kodu bunların yalnızca `beta-art-privat/app-reference/`
altında bir **referans** olarak yer alması gerektiğini söylüyor — üretim
kodu olarak değil. Bu iki yapı şu an **uyuşmuyor**; hangisinin geçerli
olduğu netleşene kadar bu beceri her iki olası klasör adını da (`beta-art/`
eski göç ile `beta-art-privat/` vb. yeni model) kullanıcıya sorarak
netleştirmeli, birini varsaymamalı.

**Not:** `docs/beta-art-konsept.md`'deki "AI destekli görsel tasarım
stüdyosu" yönü hâlâ reddedilmiş durumda — bu değişmedi, 30.08 belgeleri
de onu doğrulamıyor.

## 3. Veri kaynakları

Üç kaynak var, üçü de **isteğe bağlı** — hangisi mevcutsa onunla çalış,
eksik olanı "bu veri yok, şunu istersen sağla" diye açıkça söyle, sessizce
atlamayın:

### 3a. Muhasebe / banka dışa aktarımı

**TEYİT GEREKİYOR — sabit bir dosya yolu yok.** İlk kullanımda kullanıcıya
dışa aktarım dosyasını (CSV/Excel, banka veya muhasebe yazılımından) nereye
koyduğunu sor. Bulunca formatını (tarih, açıklama, tutar, para birimi
sütunları) tek satırla doğrula, sonra işle. Sabit bir yol varsayıp
"bulunamadı" hatası vermek yerine her seferinde sor veya `Glob` ile ara.

### 3b. Stripe

Stripe MCP araçları bu depoda mevcut ama **yetkilendirme gerektirebilir**
(bu belge yazılırken tam da bu durumdaydı — oturum başında "Stripe
yetkilendirme bekliyor" uyarısı geldi ve o oturumda hiç Stripe aracı
yüklenemedi). Her kullanımda:

1. `ToolSearch` ile `stripe` araması yap.
2. Gerçek bir Stripe aracı (örn. ödeme/abonelik listeleme) dönerse kullan.
3. Dönmezse veya çağrı yetki hatası verirse: kullanıcıya söyle —
   "Stripe MCP'si yetkilendirilmemiş; claude.ai bağlayıcı ayarlarından
   veya `/mcp` ile bağlaman gerekiyor" — ve o veri olmadan devam edip
   edemeyeceğini sor (örn. banka dışa aktarımıyla kısmen tamamlanabilir mi).
4. **Asla** "Stripe'tan X NOK geldi" gibi bir rakamı Stripe çağrısı
   gerçekten başarılı olmadan yazma — yetkisiz bir çağrının hata mesajını
   veri sanıp uydurmak, bu becerinin var olma amacına doğrudan aykırıdır.

### 3c. Satış hattı (pipeline) dosyası

**TEYİT GEREKİYOR — henüz oluşturulmadı.** Öneri: `isletme/pipeline.md`
(depo kökünde yeni bir klasör — QBLOGG'un kendi dosyalarıyla karışmasın).
İlk kullanımda dosya yoksa kullanıcıya bu konumu öner, onaylarsa oluştur;
onaylamazsa istediği konumu kullan. Önerilen biçim (task-observer'ın kendi
günlüğünü nasıl kurduğuna benzer — bkz. `.claude/skills/task-observer/`):

```markdown
# Beta Art satış hattı

## BAB
| Müşteri | Aşama | Tutar (NOK) | Son güncelleme | Not |
|---|---|---|---|---|

## BAC
...

## BAP
...
```

Aşama sütunu için öneri: `İlk temas → Teklif gönderildi → Görüşme →
Kazanıldı/Kaybedildi`. Kullanıcı farklı bir aşama seti isterse onu kullan.

## 4. Diller

Kaynak tanım "Norveççe, Türkçe veya İngilizce, ventüre göre" diyor.
**TEYİT GEREKİYOR — hangi ventürün varsayılan dili ne olacak, henüz
belirtilmedi.** İlk kullanımda sor ve öğrenince bu tabloyu doldur:

| Ventür | Varsayılan dil | Not |
|---|---|---|
| BAB | ? | Müşteri Norveç'te KOBİ ise muhtemelen Norveççe |
| BAC | ? | |
| BAP | ? | Bireysel/uluslararası alıcıysa İngilizce olabilir |

Emin olmadan taslağı yanlış dilde yazıp sonradan çevirmek yerine, dil
belirsizse taslaktan önce sor.

## 5. Tipik akış

1. Kullanıcı bir istek getirir ("bu ayki nakit durumu ne", "şu müşteriye
   BAB için teklif taslağı yaz", "MVA eşiğine ne kadar kaldı").
2. Hangi veri kaynağı/kaynakları gerekiyor, belirle (§3). Eksik olanı sor,
   sessizce atlama.
3. Rakamları/olguları topla, **hiçbirini uydurmadan**. Bir sayı
   doğrulanamıyorsa "doğrulanamadı" yaz, tahmin etme.
4. Taslağı hazırla (fatura taslağı, e-posta taslağı, sözleşme taslağı,
   nakit özeti — istenen ne ise).
5. Taslağı kullanıcıya göster, **§0'daki onay kapısını** hatırlat: "Bunu
   gönderirsem/uygularsam diye onay istiyorum, yoksa burada taslak olarak
   kalır."
6. Onay gelirse ve gönderim gerçekten bir araçla yapılabiliyorsa
   (ör. Stripe'ta bir işlem, e-posta gönderimi), kullanıcı açıkça "gönder"
   demeden çağırma.

## 6. `qblogg-operasyon` ile ilişki

`qblogg-operasyon` bu depodaki **kod ve dağıtım** işlerinin kurallarıdır
(kaynak doğrulama, commit sahipliği, dağıtım kontrol listesi). Bu beceri
onun yerine geçmez — ikisi birlikte, farklı katmanlarda çalışır: biri
"siteyi doğru şekilde nasıl değiştiririm", diğeri "şirketin parasını ve
satışını nasıl takip ederim." Bir görev ikisini de gerektiriyorsa (ör.
"QBLOGG'un Stripe geliri ne kadar, site fiyatlarını buna göre güncelle")
ikisini birden uygula.

## 7. Kaynak ve durum notu

Bu beceri, kullanıcının ilettiği şu dış tanımdan türetildi (v0.4.0 olarak
anılıyordu ama bu depoda daha önce hiç yoktu — bu, o tanımın SIFIRDAN
yazılmış ilk uygulamasıdır, önceki bir sürümün kopyası değil):

> "Beta Art's own small-business workflows — cash, MVA and forskuddsskatt
> for a Norwegian enkeltpersonforetak, BAB pilot sales and contracts, BAC
> subscription clients, and BAP editions. Runs off accounting and bank
> exports, Stripe, and a pipeline file; drafts in Norwegian, Turkish or
> English by venture. You approve every step that touches money or a
> customer."

Açık noktalar (bu SKILL.md'de **TEYİT GEREKİYOR** ile işaretli, hepsi
kullanıcıdan netleşince buradan kaldırılmalı): BAB/BAC/BAP'ın tam anlamı
(§2), dışa aktarım dosyasının konumu (§3a), pipeline dosyasının konumu ve
biçimi (§3c), ventür başına varsayılan dil (§4), forskuddsskatt'ın kesin
taksit takvimi (§1).
