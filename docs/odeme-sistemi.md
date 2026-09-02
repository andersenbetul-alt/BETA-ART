# Ödeme bağlantıları (Stripe Payment Link) — panel kılavuzu

Site tarafı hazır: `config.js → payLinks` içine bir Payment Link adresi
yapıştırdığınızda ilgili paket kartında otomatik olarak "Kartla öde" düğmesi
çıkar (bkz. aşağıda "Site tarafında ne oluyor"). Bu belge, o adresi Stripe
panelinden nasıl üreteceğinizi anlatır — adım adım, buton adlarıyla.

Bu oturumdaki Stripe MCP anahtarının ürün/Payment Link **oluşturma** izni
yok (yalnızca okuma). O yüzden üç adımı — ürün oluşturma, fiyat oluşturma,
Payment Link oluşturma — panelde siz yapacaksınız. Yetki genişletilirse bu
üç adımı Claude da MCP üzerinden yapabilir; aşağıda ilgili yerde not var.

## 1. Panele giriş

1. https://dashboard.stripe.com adresine gidin, BETA ART hesabınızla giriş
   yapın.
2. Sağ üstte **canlı mod / test modu** anahtarı var. Hesap yalnız canlı
   modda çalıştığı için bu anahtar zaten canlıda olacak — gerçek kart
   bilgisiyle gerçek tahsilat yapılır. Test önerisi (madde 4) bu yüzden
   önemli.

## 2. Üç ürünü oluşturun (Product catalog)

Sol menüden **Product catalog** sayfasına gidin (veya adres çubuğuna
`dashboard.stripe.com/products` yazın).

Her paket için ayrı ayrı:

1. **Add product** düğmesine tıklayın.
2. Ürün tipini seçin: **Tek Makale** için **One-time product**; **Büyüme**
   ve **Stüdyo** için **Recurring product** (yinelenen).
3. **Name** alanına paket adını yazın, fiyatı girin:

   | Paket | Ürün adı | Fiyat | Tip |
   |---|---|---|---|
   | p1 | Tek Makale | €150 | tek sefer |
   | p2 | Büyüme | €900 | aylık yinelenen |
   | p3 | Stüdyo | €2.500 | aylık yinelenen |

   Yinelenen üründe **Billing period** alanını **Monthly** olarak
   ayarlayın.
4. **Save product** (veya **Add product**, panelin gösterdiği düğme adı
   sürüme göre değişebilir — "kaydet/ekle" anlamına gelen düğmeye
   basmanız yeterli).
5. Ne göreceksiniz: ürün, Product catalog listesinde bir fiyatla birlikte
   görünür. Hata gelirse: en sık neden fiyat alanının boş bırakılması —
   geri dönüp fiyatı girin ve tekrar kaydedin.

Bu adımı üç paket için tekrarlayın; sonunda listede üç ürün olmalı.

## 3. Her ürün için Payment Link oluşturun

Sol menüden **Payment Links** sayfasına gidin
(`dashboard.stripe.com/payment-links`).

Her ürün için ayrı ayrı:

1. **+New** düğmesine tıklayın (bazı sürümlerde önce **+** işaretine,
   sonra açılan menüde **Payment link** seçeneğine tıklanır).
2. **Select an existing product** ile bir önceki adımda oluşturduğunuz
   ürünü seçin (yeniden ürün eklemeyin — az önce oluşturduğunuz zaten
   listede olacak).
3. Ek ayar gerekmiyor; miktar/adres toplama gibi seçenekleri
   varsayılanında bırakabilirsiniz.
4. **Create link** düğmesine tıklayın.
5. Ne göreceksiniz: `https://buy.stripe.com/...` biçiminde bir adres.
   Panelin kopyalama ikonuyla (sayfanın veya bağlantı satırının yanındaki
   kopyala simgesi) panonuza kopyalayın.
6. Hata gelirse: "Create link" düğmesi tıklanamıyorsa genelde ürün seçimi
   eksiktir — 2. adımı tekrar kontrol edin.

Üç ürün için üç ayrı Payment Link adresi elde edeceksiniz.

## 4. Adresleri siteye yapıştırın

`assets/js/config.js` içinde şu bloğu bulun:

```js
payLinks: { p1: '', p2: '', p3: '' },
```

Üç boş dizeyi kopyaladığınız üç adresle değiştirin:

```js
payLinks: {
  p1: 'https://buy.stripe.com/xxxxxxxxxxxx',   // Tek Makale
  p2: 'https://buy.stripe.com/yyyyyyyyyyyy',   // Büyüme
  p3: 'https://buy.stripe.com/zzzzzzzzzzzz'    // Stüdyo
},
```

Yalnızca doldurduğunuz paketlerde "Kartla öde" düğmesi çıkar — üçünü
birden doldurmanız gerekmez, boş bırakılan pakette hiçbir şey değişmez
(site tarafı `applySocial` ile aynı desende: adres yoksa öğe hiç
görünmez, ölü bağlantı kalmaz).

## 5. Yayına almadan önce test edin

Hesap yalnız canlı modda olduğu için panelde ayrı bir test kartı
akışı yok; önerilen yol:

1. Adresi `config.js`'e yapıştırdıktan sonra `npm run dev` ile siteyi
   yerelde açın, ilgili paket kartındaki **Kartla öde** düğmesine
   tıklayın — Stripe'ın barındırdığı ödeme sayfasının doğru ürün adı ve
   tutarla açıldığını doğrulayın, **ödemeyi tamamlamadan** sekmeyi kapatın.
2. Gerçek bir küçük tutarı kendiniz ödeyip (ör. Tek Makale, €150) Stripe
   panelinde **Payments** sayfasında tahsilatın göründüğünü kontrol etmek
   isterseniz, iade (**Refund**) düğmesiyle geri alabilirsiniz —
   Stripe Norveç için iade işlem ücretini geri vermez (aşağıdaki not).
3. Yayına aldıktan sonra siteyi canlı adresten açıp aynı düğmeyi bir kez
   daha deneyin; CDN/derleme adımı adresi değiştirmez ama yine de görsel
   doğrulama önerilir.

## 6. Site tarafında ne oluyor (bilgi amaçlı, değiştirmeniz gerekmiyor)

- `config.js → payLinks` boşsa hiçbir ek düğme eklenmez; kartlarda yalnız
  mevcut brief akışı (`work.html`'e giden CTA) kalır.
- Dolu olan pakette, mevcut CTA düğmesinin altına ikinci bir düğme
  (`Kartla öde` / `pay.card`) eklenir; bu düğme `target="_blank"`
  **kullanmaz** — ödeme aynı sekmede tamamlanır, `rel="noopener"`
  zararsız bir ek önlemdir.
- En az bir paket doluysa paketler bölümünde küçük bir açıklama satırı
  görünür: *"Ödeme, Stripe'ın güvenli sayfasında tamamlanır."*
  (`pay.note`, on dilde çevrili).
- Bu davranış `assets/js/app.js` içindeki `applyPayLinks()` fonksiyonunda;
  dil değiştiğinde veya sayfa yeniden çizildiğinde otomatik tekrar
  çalışır.

## 7. CSP (vercel.json) neden değişmiyor

`assets/js/config.js` içindeki `newsletterEndpoint` ve `formEndpoint` gibi
alanlar `fetch()` ile çağrılıyor — bu yüzden `vercel.json`'daki CSP
`connect-src` listesine eklenmeleri gerekiyor, yoksa tarayıcı isteği
sessizce engelliyor (`npm run guvenlik` bunu denetliyor).

`payLinks` farklı: buton, `<a href="https://buy.stripe.com/...">`
şeklinde düz bir gezinme (navigation) bağlantısıdır — tarayıcı sayfayı
terk edip Stripe'ın kendi sayfasına gider, `fetch`/`XHR` çağırmaz.
`connect-src` yalnız sayfa **kendi içinde kalıp** arka planda istek
attığında devreye girer; düz bağlantı tıklaması CSP'nin kapsamına
girmez. Bu yüzden `vercel.json` bu görev kapsamında **değiştirilmedi** —
değiştirilmesi gerekmiyor.

## 8. Ücret notu

CLAUDE.md'deki kayıt aynen: **Stripe Norveç ücreti: yurt içi kart %1,5 +
1,80 kr (yurt dışı +%3,25, döviz +%2). Fiyatlandırma bu rakamla
yapılmalı; stripe.com bu ortamda engelli, karar öncesi kaynağı kendiniz
doğrulayın.**

Yani €150'lik Tek Makale ürününde, kart yurt dışından geliyorsa (çoğu
AB/dünya müşterisi için beklenen durum) toplam kesinti kabaca
%1,5 + %3,25 + sabit ücret olacaktır — kesin rakamı panelinizdeki
**Balance → ilgili tahsilat** kaydından veya Stripe'ın kendi ücret
sayfasından (bu ortamdan erişilemedi) doğrulayın.

## 9. MCP yetkisi genişlerse

Bu oturumdaki Stripe MCP anahtarı yalnız okuma yapabiliyor. Yazma izni
verilirse (hesap panelinden API anahtarına ürün/Payment Link oluşturma
yetkisi eklenirse) Claude bu üç ürünü ve üç Payment Link'i doğrudan API
üzerinden de oluşturabilir — bu durumda 2. ve 3. adımları elle yapmanıza
gerek kalmaz, yalnız 4. adımdaki (adresleri `config.js`'e yapıştırma)
onayı siz verirsiniz.

## 10. Norveç yerel ödeme yöntemleri — Vipps ve Klarna (02.09.2026)

"Vipps, DNB, ödeme sistemi, Klarna" talebi üzerine araştırıldı. Üç ayrı
bulgu — biri düzeltme gerektiriyor, dashboard.stripe.com bu ortamdan
erişilemediği için hiçbiri elle doğrulanamadı, hepsi Stripe'ın kendi
belgelerinden alıntı:

- **"DNB" diye ayrı bir ödeme yöntemi yok.** DNB bir banka; Vipps
  uygulaması aslen DNB tarafından çıkarıldı ama artık tüm Norveç
  bankalarının müşterileri kullanıyor (Vipps MobilePay). Stripe'ta "DNB"
  adında ayrı bir ödeme yöntemi bulunamadı — kastedilen muhtemelen
  Vipps'in kendisi.
  ([DNB Bank — Wikipedia](https://en.wikipedia.org/wiki/DNB_Bank),
  [Vipps — Wikipedia](https://en.wikipedia.org/wiki/Vipps))

- **Klarna: hazır, ekstra kurulum yok.** Stripe ile Klarna arasında
  doğrudan ortaklık var; Payment Links'te ek bir başvuru/onay süreci
  gerektirmiyor, uygun müşterilere konum/para birimi/sepet tutarına göre
  otomatik gösteriliyor. Norveç'teki satıcılar için açık.
  ([Klarna on Stripe](https://stripe.com/en-no/payments/klarna),
  [How to accept payments in Norway](https://stripe.com/en-no/resources/more/payments-in-norway))

- **Vipps: destekleniyor ama "private preview" (kapalı önizleme)
  aşamasında** — yani hesabınızda otomatik açık olmayabilir, Stripe'tan
  önizleme erişimi istemeniz gerekebilir. Yalnızca **NOK** para biriminde
  çalışıyor.
  ([Vipps payments — Stripe Docs](https://docs.stripe.com/payments/vipps))

  **Bunun gerçek bir sonucu var:** şu anki üç paket EUR fiyatlı (§2).
  Vipps'i açmak için o ürünlerin **NOK fiyatlı bir kopyasını** (ya da
  `config.js`'teki yorumda zaten önerilen "Norveç pazarı için kron
  yazmak isterseniz" seçeneğini) oluşturmanız gerekir — mevcut EUR
  ürünlerine Vipps eklenemez, para birimi uyuşmuyor.

**Sizin adımınız (bu ortamdan yapılamaz, panel erişilemiyor):**

1. dashboard.stripe.com → **Settings → Payment methods** açın, Klarna'yı
   ve (görünüyorsa) Vipps'i etkinleştirin.
2. Vipps görünmüyorsa Stripe destek/satış ekibinden "Vipps private
   preview" erişimi isteyin.
3. Vipps için: 2. adımdaki ürünlerin NOK fiyatlı bir sürümünü oluşturun
   (aynı isim, `kr` fiyat), o ürünle yeni bir Payment Link üretin, `config.js`'e
   ayrı bir alan olarak eklemek isterseniz bana söyleyin — şu an
   `payLinks` tek bir para birimi varsayıyor, iki para birimli (EUR/NOK)
   seçenek sunmak site tarafında küçük bir değişiklik gerektirir.
4. Klarna için ek bir adım yok — Payment Link zaten oluşturduğunuz EUR
   ürünlerle çalışır, method listesinde otomatik belirir.
