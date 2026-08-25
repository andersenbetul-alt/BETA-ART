---
name: qblogg-teklif-paketi
description: Finalist adaya (yazar, profesör/uzman veya her ikisi) teklif paketi hazırla — onaya sunulan teklif alanları tablosu, görüşmeye çağıran sıcak e-posta ve teklif görüşmesinde ekran paylaşılacak marka kimlikli HTML sunum (Artifact). Kullanıcı "teklif paketi", "offer package", "teklif hazırla", "adaya teklif", "offer call", "teklif sunumu", "işe alım teklifi" dediğinde ya da bir adaya teklif götürüleceği anlaşıldığında MUTLAKA bu beceriyi kullan; parçaları (yalnız e-posta, yalnız sunum) istese bile buradaki kurallar geçerlidir.
---

# QBLOGG teklif paketi

Bu beceri, 25.08.2026 oturumunda kurulan teklif akışını kalıcılaştırır. İç
beceridir. Üç çıktı üretir: **(1)** kullanıcının onayına sunulan teklif
alanları tablosu, **(2)** adayı görüşmeye çağıran sıcak e-posta,
**(3)** görüşmede ekran paylaşılacak sunum (Artifact).

## 1. Girdi protokolü — uydurma yasak

Aday adı, rakamlar ve tarih **kullanıcının kararıdır**; hiçbiri uydurulmaz.

- Eksikse `AskUserQuestion` ile sor: rol (yazar / profesör / her ikisi),
  ücret modeli, dil(ler). Aday adını "Other" ile yazabileceğini söyle.
- Cevap gelmezse veya "her ikisi/hepsi" gelirse: adı `[Aday Adı]` bırak,
  kapsamı genişlet (iki rol, üç dil) ve bunu teslimde açıkça söyle.
- Gmail'de gerçek başvuru aramak istersen konu kalıbı:
  `QBLOGG — <ww.title/wc.title> · <ad>` (app.js → composeMail). Bağlayıcı
  yetkisizse bunu söyle, akışı durdurma.

## 2. Rakam çapaları — hepsi taslak işaretli

CLAUDE.md kural 8 burada da geçerlidir: her rakam "taslak/örnek" etiketi taşır
ve kullanıcı onayına sunulur; kesin vaat gibi yazılmaz.

- **Yazar, makale başı:** Tek Makale örnek satış fiyatı €150
  (`config.js → prices` / ROADMAP). Taslak yazar ücreti bunun %40–60'ı:
  **€[60–90]/makale**. Aralığı tek sayıya kullanıcı çeker.
- **Profesör/uzman:** `docs/is-modeli.md` §6 tablosu, **[H] hipotez**
  etiketiyle: açık makale 7,5–12,5k · Q Brief 15–25k · canlı 20–40k NOK.
- Standart şartlar (taslak): ilk 2 makale ücretli deneme · 1 revizyon dahil ·
  ödeme teslim+denetim onayı sonrası [14] gün · görünürlük denetimi + ≥3
  kaynak şartı sözleşmeye girer.

## 3. Teklif alanları tablosu

Kullanıcıya markdown tabloyla sun; satırlar: Aday · Rol · Çalışma biçimi
(serbest, uzaktan, proje bazlı, fatura karşılığı) · Deneme · Ücret(ler) ·
Revizyon · Ödeme vadesi · Telif · Kalite şartı · Başlangıç/görüşme tarihi.
Doldurulamayan her hücre `[...]` köşeli parantezle görünür kalır.

**Telif satırı hukuk kontrolünden geçer:** yayın hakları QBLOGG'a; uzman
imzalı içerikte son onay adayda — AI Act m. 50(4) editoryal sorumluluk
modeliyle uyumlu (kosullar.html bu modele dayanır). Yeni bir tasarım/hukuk
sorusu doğarsa tasarım turu kontrol listesi uygulanır (25.08 muhtırası).

## 4. E-posta

Yapı: kişisel bir gözlemle aç ("başvurundaki X bizi heyecanlandırdı" —
somut yer tutucu bırak) → "bu bir mülakat değil, teklif görüşmesi" →
iki zaman önerisi + "sen de öner" → "her şey yazılı gelecek, acele yok".
**Rakam e-postaya yazılmaz** — rakamlar görüşmede ve yazılı özette.
İstenen dillerde üret (TR/EN/NO şablonları bu oturumda onaylandı);
gönderilmez, taslak olarak teslim edilir.

## 5. Sunum (Artifact)

`assets/sunum-sablonu.html` hazır şablondur — sıfırdan yazma, kopyalayıp
içeriği uyarla. Şablonun içerdiği ve korunması gereken özellikler:

- 5 sayfa: karşılama → rol → rakamlar (**"Taslak — görüşmede birlikte
  netleştireceğiz" rozetiyle**) → neden heyecanlıyız → sonraki adımlar.
- "Neden heyecanlıyız" üç kutusu bilerek boş şablondur; görüşme sahibi
  adaya özgü somut gözlemlerle doldurur. Genel övgüyle doldurma.
- QBLOGG kimliği: gerçek Q sembolü satır içi (halka temayla döner, aqua
  köprü sabit), marka renk değişkenleri, Inter, emoji yok, ikonlar SVG,
  yön bağımsız CSS. Açık/koyu tema üçlü desen (bare :root + media guard +
  data-theme) bozulmadan kalır.
- TR/EN/NO dil düğmesi (`I18N` nesnesi) ve ok tuşu/düğme navigasyonu.
- Yayınlamadan önce `artifact-design` becerisini yükle (Artifact kuralı).
  Yeni sürüm aynı dosya yoluna yayınlanır ki adres değişmesin.

## 6. Teslim öncesi kontrol

1. Uydurulmuş aday bilgisi/rakam yok; her boşluk `[...]` ile görünür.
2. Her rakamın yanında taslak/örnek/[H] etiketi var.
3. E-postada rakam yok; sunumda taslak rozeti duruyor.
4. Sunum üç dilde de dolu (I18N anahtar eşitliği) ve iki temada okunuyor.
5. Depo değişikliği varsa commit sahipliği kuralıyla (qblogg-operasyon §2)
   commit + push.
