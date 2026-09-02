---
name: qblogg-blog-yazisi
description: QBLOGG için tek odaklı, SEO'ya duyarlı blog yazısı yaz — tek konu, tek okur, tek çıkarım; görünürlük denetiminden geçecek biçimde.
owner: QBLOGG
---

# Blog yazısı yöntemi

Tek konuya ve tek okur niyetine oturan, arama tıklamasını hak eden ve son
satıra kadar okutan, yayına hazır bir yazı üret.

Temel: kullanıcının ilettiği Okara "blog-post" yöntem metni (23.08.2026),
QBLOGG'un değişmez kurallarına uyarlandı. Çelişkide CLAUDE.md kazanır.

## Ne zaman kullanılır
- Hedef bir anahtar kelime/soru var ve onun için sıralanacak yazı gerekiyor.
- Kaba bir fikri veya madde listesini bitmiş makaleye çevirmek gerekiyor.
- Düzenli üretim temposunda tutarlı, marka sesinde çıktı gerekiyor.

## Girdiler
- **Zorunlu:** konu veya birincil anahtar kelime + yazının kime yazıldığı.
- **İsteğe bağlı:** ton notları, ürün bağlantısı açısı, eklenecek iç bağlantılar
  (`{see:'slug'}`), hedef uzunluk.

## Yöntem
1. **İşi sabitle.** Bir anahtar kelime, bir okur, bir çıkarım. Yazı üç iş
   yapmaya çalışıyorsa üç yazıya böl.
2. **Niyeti oku.** Sorgu için ne sıralanıyor, okur gerçekte ne istiyor —
   nasıl-yapılır mı, karşılaştırma mı, tanım mı, görüş mü? Onu geçecek açıyı seç.
3. **İskelet.** Vaat eden giriş; sonra her biri TEK noktayı yapan ve okurun
   doğal sorularını izleyen `{h:'…'}` bölümleri.
4. **Taslak.** Kancayla aç (getiriyi baştan söyle), paragrafları kısa ve
   taranabilir tut, soyutlama yerine somut örnek, kapanışta çıkarım + tek net
   çağrı (brief formuna).
5. **Optimize et.** Anahtar kelimeyi başlıkta ve ilk 100 kelimede öne al;
   `e` (özet/meta) alanını 140–160 karakter hedefiyle yaz; başlıklar betimleyici;
   iç bağlantılar doğal yerde.
6. **Düzelt.** Dolgu cümleyi kes, her iddiayı doğrula, bir kez sesli okur gibi
   tara.

## QBLOGG'a özgü zorunluluklar (yöntemin üstünde)
- Yazı `assets/js/posts.js`'e girer: tr+en tam makale (30–55 blok), diğer 8 dil
  3 bloklu özet katmanı. Yeni kategori sözlükte `cat.<ad>` ister.
- `orig` — sayfanın özgün katkısı tek cümle (kendi verisi/testi/tablosu). Yoksa
  yazı yayınlanamaz.
- `src` — en az üç kaynak; adresi doğrulanmamış kaynak `u`suz, `nu` gerekçesiyle.
  Para/kariyer konusunda bu kural, öneri değil.
- Rakamlar örnek olarak işaretlenir; kesin vaat dili yasak. Uydurma yasak:
  doğrulanmamış istatistik, müşteri hikâyesi, kurum şartı yazılmaz.
- `**vurgu**` kaçırma-önce-çeviri-sonra düzenine tabidir; başına buyruk HTML yok.
- Bitince: `npm run check` + `node scripts/gorunurluk.mjs <slug>` yeşil olmadan
  yayın yok; `sitemap.xml` ve `npm run rss` (varsa) güncellenir.

## Çıktı biçimi
posts.js nesnesi: `slug`, `category`, `date`, `accent`, `icon`, `t/e/b` (10 dil),
`orig`, `src`. Başlık ≤60 karakter ve anahtar kelime önde; `e` meta açıklama
görevi görür.

## Kalite kuralları
- Tek yazı, tek iş — mega rehbere kaymaya direnç göster.
- Değerle aç; cevabı üç paragraf boğaz temizliğinin altına gömme.
- Özgül olan genel olanı yener — bir gerçek örnek, beş sıfattan iyidir.
- Anlam kaybetmeden kesilebilen cümle kesilir.

## Bilinen tuzaklar (02.09.2026 dersler)

### JavaScript'e giren metin içinde kesme işareti
`posts.js` tek tırnaklı string içinde typografik kesme işareti (`'`, U+2019)
`SyntaxError` üretir. Kural: posts.js'e yazarken **sadece ASCII kesme işareti
(`'`)** kullan; ya da o metni çift tırnak ile sar. Yapay zekâ çıktısı
typografik tırnak içerebilir — kontrol et.

Tespit: `node -e "require('./assets/js/posts.js')"` — eğer SyntaxError
verirse sorunlu satırı şununla bul:
```bash
python3 -c "
import ast, re, pathlib
src = pathlib.Path('assets/js/posts.js').read_text()
for i,l in enumerate(src.splitlines(),1):
    if '’' in l or '‘' in l:
        print(i, l[:80])
"
```

### `nu` alanı — adres doğrulanmamış kaynak
Kaynağın URL'si bulunamamışsa boş `u:''` bırakma; bunun yerine `nu` ile
gerekçe yaz:
```js
{ t: 'Kaynak başlığı', nu: 'adres doğrulanmadı; Firecrawl bu ortamda engelli' }
```
`nu` sayfada görünmez; `check.mjs` adressiz kaynağı kasıtsız unutulmuş
adresden bu yolla ayırır.

### Bölgeye özgü içerik (Norveç)
Norveç iş hukuku konularında (`jobs`, `hr` kategorisi) istatistik ve yasa
kaynakları `ssb.no`, `arbeidstilsynet.no`, `lovdata.no` domenlerinde. Bu
ortamda bu domenlere doğrudan erişim engelli olabilir; Firecrawl arama
sonucu açıklamaları yeterli alıntı taşıyorsa oradan kaydet, `nu` ile not düş.
