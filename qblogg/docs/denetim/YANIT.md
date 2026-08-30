# Kaynak kod denetimi v0.3 — madde madde yanıt

Denetim: `QBLOGG-001-kaynak-kod-denetimi-v0.3.md` (22.08.2026)
Yanıt tarihi: 22.08.2026 · durum: **6 madde kapandı, 3 madde açık**

Açık kalanlar kod kusuru değil; insan kararı, dış ağ ya da gerçek katılımcı
gerektiriyor. Hiçbiri uydurulmadı.

## R01 — PNG ile app ikonu geometrisi uyuşmuyor · **KAPANDI**

Denetim haklı ve bu bizim hatamızdı. `_ikon_uret` 86u'luk `SYM_AQUA` köprüsünü
kullanıyordu; `qblogg-icon-app.svg` ise 100u'luk `ICON_AQUA`'yı. Üstelik commit
mesajında "kompozisyon app ikonu SVG'siyle birebir aynı" yazmıştık — yanlış bir
iddiaydı.

Düzeltme: `_ikon_uret` artık `ICON_AQUA` kullanıyor, iki PNG yeniden üretildi.

Doğrulama, iddiaya güvenmeden: app ikonu SVG'si tarayıcıda 32 ve 180 px'e
çizdirildi, üretilen PNG'lerle piksel piksel karşılaştırıldı.

| Boyut | Aqua alanı (bizim) | Aqua alanı (SVG) | Fark |
|---|---:|---:|---:|
| 32 px | 21 px | 21 px | **0** |
| 180 px | 650 px | 648 px | **2 px (%0,3)** |

Kalan piksel farkları yalnızca kenar yumuşatmasında (bizim tarama
rasterleştiricimiz ile Chromium'un antialiasing'i aynı değil); şekil aynı.

## R02 — `currentColor` yok · **KAPANDI (kısmen yanlış anlaşılma)**

Denetim doğru: **teslim edilen SVG dosyaları** sabit renk kullanıyor
(`#082C54`, `#00D8C2`, `#000000`, `#FFFFFF`). Bu bilinçli — başvuru ve dağıtım
masterı sabit renkli olmalı.

`currentColor` iddiası bu dosyalar için değil, **sitenin HTML'ine gömülü satır
içi SVG** için yapılmıştı: `.logo-mark` içindeki halka `fill="currentColor"`
kullanır ve `--logo-ink` ile temaya göre döner, aqua köprü sabit kalır. İki
farklı şey aynı cümlede anılınca karışmış.

Düzeltme: belgede ayrım açıkça yazıldı (bkz. `docs/logo-sistemi.md`). Dosyalara
dokunulmadı — dokunmak başvuru masterını bozardı.

## R03 — Paket komutları ve yolları eskimiş · **KAPANDI**

Doğru. `qblogg-marka-kaynak.zip` içindeki `logo-sistemi.md` depo yollarını
(`scripts/`, `assets/brand/`, `docs/gorseller/`) anlatıyordu ama paket
`uretici/`, `varliklar/`, `kanit/` kullanıyor.

Düzeltme: paket üretimi `scripts/marka-paket.mjs`'ye alındı; belgeyi paket
düzenine göre yeniden yazıyor ve `OKUBENI.txt`'yi tek kaynaktan üretiyor.
Artık elle kopyalanmıyor, yani bir daha ayrışamaz.

## R04 — Birebir yeniden üretim kanıtlanmadı · **KAPANDI (bizim tarafta)**

Denetim ortamında `brotli` yoktu, WOFF2 açılamadı. Bizim tarafta kanıtlandı:
paket tamamen boşaltılıp betik çalıştırıldı, 13 dosyanın hepsi üretildi ve
`diff -rq` ile depodakiyle **bayt bayt aynı** çıktı.

Ayrıca `scripts/requirements.txt` eklendi — sürümler sabitlendi
(`fonttools==4.63.0`, `brotli>=1.1.0`). Denetim ortamı bunu kurup tekrarlayabilir.

Çıktı özetleri `tescil/` üretiminde ve `assets/fonts/KAYNAK.md`'de kayıtlı.

## R05 — Font lisans kanıtı yok · **KAPANDI (22.08.2026)**

Haklı ve önemli. `assets/fonts/KAYNAK.md` eklendi: sürüm, telif, proje adresi
ve dosyaların SHA-256 özeti — hepsi **fontun kendi `name` tablosundan**
okundu, dışarıdan getirilmedi.

Kapatan adım: Inter dağıtımının kendi `LICENSE.txt` dosyası sağlandı ve
`assets/fonts/OFL.txt` olarak depoya kondu (4.380 bayt, SHA-256
`262481e844521b32`). Metnin gerçekten OFL-1.1 olduğu bölüm bölüm doğrulandı ve
telif satırının fontun kendi kaydıyla eşleştiği görüldü. **Ezberden
yazılmadı** — bu maddede tuttuğumuz tavır buydu ve bozulmadı.

Ayrıca soy zinciri de kapandı: resmi `InterVariable.ttf` ile depo alt kümesi
`wght=700`'de harf harf karşılaştırıldı; `Q B L O G` ana hatları — ilerleme ve
sol kenar dahil — aynı çıktı. Wordmark resmi dağıtımdan geliyor, yolda
değişmemiş. Ölçüler ve iki küçük fark (yapım kimliği, `opsz` ekseni)
`assets/fonts/KAYNAK.md`'de.

Sürekli denetim: `npm run marka-dogrula` artık OFL.txt'nin varlığını, zorunlu
bölümlerini ve her yazı tipi dosyasının özetinin `KAYNAK.md` ile eşleştiğini
kontrol ediyor. Kayıt güncellenmeden bir font değişirse çıkış kodu 1.

**Doğrulanmadı:** `openfontlicense.org` / `scripts.sil.org/OFL` adreslerinin
bugün hangi sürümü sunduğu — bu ortamdan dış ağa çıkılamıyor.

## R06 — Küçük boyutta aqua ayrımı zayıf · **KAPANDI (kural olarak)**

Denetimin ölçtüğü kontrastlar bizim ölçümümüzle aynı: navy/beyaz 14,01:1 ·
aqua/navy 7,74:1 · aqua/beyaz 1,81:1.

Kural zaten belgede yazılıydı; artık kodda da zorunlu: site 16–32 px'te
`qblogg-icon-small.svg` (köprü 100u) kullanıyor, favicon da aynı geometriden
üretiliyor (R01). Yeniden üretilen 32/180 px PNG'ler gözle kontrol edildi.

**Gerçek ekran testi yapılmadı** — bu bir insan işi, uydurulmuyor.

## R07 — Tanınırlık kanıtı eksik · **AÇIK**

Doğru. Beş saniyelik hafıza testi protokolü yazılı
(`docs/marka-testleri.md`) ama **uygulanmadı**. Katılımcı sonucu üretilmedi ve
üretilmeyecek. Denetimin "Q terminali navigasyon ölçeğinde noktalama gibi
görünebiliyor" gözlemi kayda geçti; test yapılmadan doğrulanamaz da
çürütülemez de.

## R08 — Üretim ve hukuk kapıları açık · **AÇIK**

Doğru. Faks/tek renk baskı, nakış, gravür, büyük format testleri yapılmadı.
Patentstyret, EUIPO/TMview, WIPO, şirket adı ve alan adı araştırmaları boş.

Yeni: `docs/marka-tescili.md` — EUIPO başvuru kapısı yazıldı ve
`scripts/marka-tescil.mjs` başvuru biçimine uygun dosyaları üretiyor. Ama bu
yalnızca **biçim**; ayırt edicilik, önceki haklar ve sınıf kapsamı hukuki
değerlendirmedir ve yapılmadı.

**Proje tescil beklemesinde kalıyor.** Denetimin nihai kararına katılıyoruz:
`FINAL` / `LOCKED` / `TESCİLE HAZIR` etiketi hak edilmedi.

## Çıktı-entegrasyon denetimi v0.2 hakkında

`QBLOGG-001-cikti-entegrasyon-denetimi-v0.2.md` **başka bir depoyu** denetlemiş:
raporda sayfa başlığı `Multi-Timezone Digital Clock`, görünen başlık
`Global Digital Clock` yazıyor. Bu depoda böyle bir sayfa yok.

Raporun kendi kararı da bunu söylüyor: `TARGET REPOSITORY MISMATCH`. Kayıt için
saklandı; bulguları bu depoya uygulanmaz. Doğru depoda 13 varlığın hepsi
mevcut, favicon ve apple-touch-icon bağlı, eski mor kare kaldırılmış durumda.


---

# Çıktı-entegrasyon denetimi v0.2 — kabul kontrolleri

Rapor başka bir depoyu denetlemiş olsa da listelediği sekiz kabul kontrolü
bu depoya karşı tek tek çalıştırıldı.

| # | Kontrol | Sonuç |
|---|---|---|
| 1 | Başlık doğru yatay kilidi kullanıyor | **Bilinçli fark** — aşağıya bakın |
| 2 | Koyu/açık tema doğru varyantı, kontrast düşmeden | ✓ `--logo-ink` ile döner; navy/beyaz 14,01:1 |
| 3 | favicon-32 ve apple-touch-icon HTTP 200 | ✓ ikisi de 200 |
| 4 | App ikonu ile küçük ikon birbirinin yerine geçmiyor | ✓ sayfalar yalnızca `icon-small`, `favicon-32`, `apple-touch-icon` kullanıyor; `icon-app` referans verilmiyor |
| 5 | Erişilebilir marka adı var | ✓ SVG `aria-hidden`, ad "QBLOGG" metninden geliyor |
| 6 | Logo boyutu düzen kaymasına yol açmıyor | ✓ `.logo-mark` 30×30 sabit, `flex: 0 0 auto` |
| 7 | Önbellek sürümleme tanımlı | **Kapatıldı** — aşağıya bakın |
| 8 | Her dosya mevcut ve özeti kayıtlı | **Kapatıldı** — `assets/brand/MANIFEST.md` |

## Kontrol 1 — başlık kilidi kullanmıyor, bilinçli

Başlıkta `qblogg-lockup-horizontal.svg` dosyası değil, **satır içi SVG sembol +
metin** var. Üç gerekçe:

1. **Tema.** Satır içi SVG `currentColor` kullanabiliyor; halka `--logo-ink`
   ile dönüyor, aqua köprü sabit kalıyor. `<img>` ile gelen kilit dosyası
   dönemez — koyu temada ayrı dosya yüklemek gerekirdi.
2. **İstek sayısı.** Site hiçbir dış isteğe çıkmıyor; logoyu ayrı dosya
   yapmak her sayfaya bir istek daha eklerdi.
3. **Wordmark metin olarak kalıyor.** Ekran okuyucu "QBLOGG" okuyor;
   ana hatlaştırılmış kilit dosyasında bu ancak `alt` ile taklit edilir.

Kilit dosyaları duruyor ve rolleri var: sunum, imza, basılı iş, üçüncü
tarafa gönderilen marka paketi. Sitede kullanılmıyor olmaları eksiklik değil.

## Kontrol 7 — kapatıldı

Önceden `assets/brand/` için ne önbellek kuralı ne sürüm parametresi vardı;
favicon iki kez değişti ve tarayıcılar favicon'u agresif önbellekler.

- `vercel.json` → `/assets/brand/(.*)` için `max-age=31536000, immutable`
- Altı sayfadaki üç ikon bağlantısına `?v=2026-08-22` eklendi

Uzun önbellek ancak sürümle birlikte güvenlidir: dosya değişip adres
değişmezse tarayıcı eskisini göstermeye devam eder. İkon değiştiğinde bu
tarih güncellenir.

`check.mjs`'in kırık bağlantı denetimi sorgu dizesiyle de çalışıyor — kasten
bozuk bir `?v=` bağlantısı konup sınandı, yakaladı (çıkış kodu 1).

## Kontrol 8 — kapatıldı

`assets/brand/MANIFEST.md`: 13 varlığın adı, rolü, boyutu ve SHA-256 özeti.
`marka-uret.py` üretiyor, elle düzenlenmiyor. Manifesto dışı dosya varsa
ayrıca listeliyor.

## OUT-011 — "on birinci SVG" kimdi

Denetim on SVG rolü sayıp on bir SVG olduğunu söylüyordu ve on birincinin
kim olduğunu soruyordu. Cevap: **`qblogg-symbol.svg`** — tam renkli ana
sembol. Denetim `-navy`, `-white`, `-black`, `-reverse` varyantlarını saymış
ama varyantsız aslını atlamış. MANIFEST.md'de "birincil varlık" olarak
işaretli.
