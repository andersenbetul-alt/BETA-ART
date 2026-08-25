---
name: offer-package
description: İş teklifi paketi hazırlar — teklif alanları formu, adaya sıcak e-posta ve teklif görüşmesinde ekran paylaşılacak HTML sunum. Kullan — "teklif paketi hazırla", "adaya teklif yapacağız", "offer letter", "teklif görüşmesi sunumu", "finaliste teklif" dendiğinde. Rakam uydurmaz; doldurulmamış alan varken sunum bitmiş görünmez.
---

# Teklif paketi

Üç parça, hepsi birbirine bağlı:

```
templates/fields.md    → senin inceleyeceğin alan formu
templates/email.md     → adaya giden e-posta (görüşme ayarlar)
templates/deck.html    → görüşmede ekran paylaşılan sunum
templates/fill-in.md   → tek blok: kullanıcı doldurur, geri gönderir
```

Akış: şablonları kopyala → `fill-in.md`'yi kullanıcıya ver → dolu değerlerle
üçünü tamamla → sunumun uyarı bandının kalktığını **doğrula**.

## Kural 1 — rakam uydurulmaz

Maaş, oran ve tarih tahmin edilmez. Bilinmeyen her değer `⟨BÜYÜK_HARF⟩`
olarak kalır. Sebep: teklif görüşmesinde ekran paylaşılan bir sunumda
uydurma rakam, düzeltilmesi en pahalı hata türüdür — aday onu duyduktan
sonra geri alınamaz.

## Kural 2 — sunum bitmiş görünmeyecek

`deck.html` içindeki script `<ph>` etiketlerini sayar; bir tane bile varsa
üstte kırmızı **TASLAK — N alan doldurulmadı** bandı açılır ve kapanmaz.

```js
const n = document.querySelectorAll('ph').length;
if (n) { /* bandı göster */ }
```

Bu bandı asla elle kaldırma. Alanlar dolduğunda kendiliğinden kaybolur.
Teslim etmeden önce tarayıcıda açıp bandın gerçekten kalktığını gör.

## Kural 3 — hukuki alanlar boş bırakılır

Şu alanların değerini **yazma**: tatil parası oranı (feriepenger), pensiyon
(OTP), deneme süresi (prøvetid), ihbar süresi (oppsigelsestid).

Bunlar iş hukukuna tabi ve doğrulanmadan yazılırsa "araştırılmış" görünür.
Formda dururlar, `⚠ Hukuki kontrol` başlığı altında işaretli; değerlerini
muhasebeci veya hukuk danışmanı verir. Erişilebilir bir birincil kaynak
(ör. `lovdata.no`) yoksa bunu açıkça söyle.

## Kural 4 — rakam e-postada olmaz

E-postanın tek işi görüşmeyi ayarlamaktır. Rakam yazılı gelirse aday onu
bağlamsız, tek başına okur. Tutar görüşmede konuşulur.

## Kural 5 — genel övgü sunumu ters çevirir

"Neden sen" slaytı üç **somut an** ister. Ölçüt şu: cümle başka bir adaya da
söylenebiliyorsa at.

| At | Tut |
| --- | --- |
| "Çok etkilendik" | "Görüşmede şu akışı sadeleştirme biçimin" |
| "Güçlü bir profil" | "Portföyündeki X kararını savunma şeklin" |

## Rol metnini yeniden yazma

Rol bu projenin ekip modelinde varsa sorumluluk metnini `data/team.json`'dan
al:

```bash
python3 -c "
import json;d=json.load(open('data/team.json'))
print([r['responsibility'] for r in d['roles'] if r['name']=='<ROL>'])"
```

## Teslimden önce

```bash
# sunumda kalan bos alan
grep -o '⟨[^⟩]*⟩' deck.html | sort -u

# tarayicida bandin kalktigini dogrula (bu projede)
node .claude/skills/run-beta-art/driver.mjs   # ornek surucu; deck icin uyarla
```

Banda bakmadan teslim etme. Dosyanın var olması sunumun doğru olduğu
anlamına gelmez.

## Dil

Aday Norveççe konuşuyorsa e-posta ve sunum **çeviri değil, baştan Norveççe**
yazılır. Teklif metninde çeviri kokusu güven kaybettirir.
