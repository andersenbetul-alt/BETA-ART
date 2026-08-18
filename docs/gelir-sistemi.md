# Gelir sistemi — beş katman, gerçek sayılarla

Blog bir yazı sitesi değil, bir gelir sistemidir. Sistem şu zinciri kurar:

```
Google / sosyal → blog yazısı → ücretsiz değer → e-posta → teklif → tekrar satış
```

Bu belge o zinciri QBLOGG için somutlaştırır: hangi katman kurulu, hangisi
değil, hangi sırayla kurulmalı ve **rakamlar gerçekte ne veriyor**.

## Önce huni matematiğini düzeltelim

Yaygın örnek şöyle kurulur:

> 10.000 ziyaretçi → 1.000 e-posta abonesi → 100 satın alma → 30 € = **3.000 €**

Bu, ziyaretçinin %10'unun abone olduğunu ve abonenin %10'unun satın aldığını
varsayar. İkisi de gerçekçi değil. Soğuk arama trafiğinde iyi bir lead magnet
ile ziyaretçi→abone oranı tipik olarak **%1–3**; soğuk bir listede 30 €'luk bir
ürüne dönüşüm de **%1–3** bandındadır. Aynı 10.000 ziyaretçi:

> 10.000 ziyaretçi → ~200 abone → ~4 satın alma → 30 € = **~120 €**

Yani iyimser tablo gerçeğin **yaklaşık 25 katı**. Bu, planı çöpe atmak için bir
sebep değil; **hangi ürünü sattığınızı değiştirmek** için bir sebep.

### Aynı trafiğin bizim işimizdeki karşılığı

QBLOGG düşük fiyatlı dijital ürün satmıyor; hizmet satıyor. Aynı huni:

> 10.000 ziyaretçi → ~200 abone → ~2 keşif görüşmesi → 1 müşteri × 900 €/ay

Bir müşteri, yıllık **10.800 €**. Aynı trafik, 90 kat fark. Sebep basit:
düşük fiyatlı üründe kâr hacimden gelir, hizmette işlem başına değerden.
**Trafiğimiz azken hizmet satmak; trafiğimiz büyüdüğünde ürün eklemek** doğru
sıra. Tersi, hacim olmadan hacim işine girmek olur.

> Bu oranlar sektör bandıdır, bizim ölçümümüz değil. İlk 90 günde kendi
> ziyaretçi→abone ve abone→görüşme oranımızı ölçüp bu belgeyi güncelleyeceğiz.
> O zamana kadar buradaki her sayı bir plan varsayımıdır, bir vaat değil.

## Beş katman: durum tablosu

| # | Katman | Durum | Sıradaki iş |
|---|---|---|---|
| 1 | **SEO blog yazıları** | Kurulu, içerik eksik | 30 temel sayfadan 3'ü yazıldı. İlk dalga: 10 temel + 40 destek |
| 2 | **Ortaklık (affiliate)** | **Altyapı kuruldu**, ilişki yok | `{aff:}` bloğu, otomatik bildirim, `rel="sponsored"` hazır. Program başvurusu gerekiyor |
| 3 | **E-posta listesi** | **Yarım — kritik** | Form var ama servise bağlı değil. `config.js → newsletterEndpoint` |
| 4 | **Kendi ürünlerimiz** | Yok | Hizmet merdiveni var (900 € keşif / 2.500 € pilot). Dijital ürün için erken |
| 5 | **Reklam ve sponsor** | Yok | Aylık 10.000 oturuma kadar açılmamalı |

### En pahalı eksik: 3. katman

Site şu anda e-posta topluyor **gibi görünüyor** ama toplamıyor: kayıt sadece
ziyaretçinin kendi tarayıcısında duruyor. Yani her ziyaretçi, siteyi kapattığı
anda kayboluyor. Diğer dört katmanın hepsi bu listenin üzerine kurulu.

Bu tek satırlık bir iş: `assets/js/config.js` içindeki `newsletterEndpoint`
alanına e-posta servisinizin form adresini yazın. Alan boşken tarayıcı
konsoluna uyarı düşüyor ki bu durum sessizce sürmesin.

## Katman 2: ortaklık altyapısı nasıl çalışıyor

Yazı gövdesine blok olarak eklenir:

```js
{aff: {
  t: 'Ürün adı',
  u: 'https://ortak-baglanti',
  why: 'Neden öneriyoruz — tek cümle, somut'
}}
```

Kod üç şeyi kendiliğinden yapıyor:

1. **Bildirim.** Ortaklık bağlantısı içeren yazının başına bildirim kutusu
   koyar. AB tüketici mevzuatı ticari ilişkinin açıkça belirtilmesini istiyor.
   `config.js → affiliate.disclosure` ile kapatılabilir — **kapatmayın**.
2. **`rel="sponsored nofollow noopener"`.** Google ortaklık bağlantılarında
   `sponsored` bekliyor; işaretlemezseniz bu bir bağlantı şeması ihlalidir.
3. **Gerekçe zorunluluğu.** `why` boşsa `npm run check` uyarı verir.
   Gerekçesiz öneri reklamdır ve okur bunu ilk paragrafta anlar.

Bildirim metni on dilde `posts.affDisclosure` anahtarında ve şunu söylüyor:
*"Komisyon ödemeyen bir ürün daha iyiyse onu yazarız."* Bu cümleyi yazdıysanız
uymak zorundasınız; ortaklık gelirinin uzun vadede tek koruması budur.

## Kurulum sırası

Sıra tesadüfi değil: her adım bir öncekinin üzerine gelir kurar.

1. **E-posta servisini bağla.** Tek satır. Bunsuz diğer her şey delik kova.
2. **İlk dalgayı yaz.** 10 temel + 40 destek sayfa (`docs/icerik-mimarisi.md`).
   Katman 1 olmadan huninin girişi yok.
3. **İkinci lead magnet.** Elimizde otomasyon keşif listesi var; içerik
   tarafına da bir tane gerekiyor (brief şablonu güçlü aday).
4. **Ortaklık programlarına başvur.** Ama yalnızca gerçekten kullandığımız
   araçlara. Kullanmadığımız bir aracı önermek, katman 2'nin bildirim
   cümlesini yalan yapar.
5. **Ölç ve bu belgeyi güncelle.** 90. günde gerçek oranlar buraya yazılır.
6. **Dijital ürün.** Aylık 5.000 oturum ve 500 abone eşiğinden sonra.
7. **Reklam.** En son. Erken açılan reklam, hizmet satışının önüne geçer:
   sayfa başına birkaç kuruş için, 900 €'luk keşif görüşmesine giden okuru
   dışarı yönlendirmiş olursunuz.

## Ölçülecek dört sayı

Gelir sistemini yöneten kişi haftada bir bunlara bakar:

| Sayı | Nereden | Sağlıklı yön |
|---|---|---|
| Organik oturum | Search Console | Yukarı, ay bazında |
| Ziyaretçi → abone | E-posta servisi ÷ oturum | %1'in altındaysa lead magnet zayıf |
| Abone → keşif görüşmesi | Form gönderimi ÷ abone | %1 bile iyidir |
| Görüşme → müşteri | CRM veya not defteri | %20'nin altındaysa yanlış kitle |

Dördünden biri ölçülmüyorsa sistem yönetilmiyor demektir; sadece içerik
üretiliyordur.
