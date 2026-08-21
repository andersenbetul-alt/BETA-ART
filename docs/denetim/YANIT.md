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

## R05 — Font lisans kanıtı yok · **AÇIK**

Haklı ve önemli. `assets/fonts/KAYNAK.md` eklendi: sürüm, telif, proje adresi
ve dört dosyanın SHA-256 özeti — hepsi **fontun kendi `name` tablosundan**
okundu, dışarıdan getirilmedi.

**Kapanmadı**, çünkü lisans metninin kendisi hâlâ depoda yok. OFL, yeniden
dağıtılan yazı tipiyle lisans metninin de dağıtılmasını şart koşuyor. Metni
ezberden yazmıyoruz: yanlış lisans metni, eksik olandan kötüdür. Bu ortamdan
dış ağa çıkılamadığı için indirilemedi.

Yapılacak: `github.com/rsms/inter` üzerinden `OFL.txt` indirilip
`assets/fonts/OFL.txt` olarak konacak.

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
