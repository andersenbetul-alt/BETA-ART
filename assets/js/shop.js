/* HXI — mağaza kataloğu.
 *
 * Ürün eklemek buraya bir nesne eklemektir; HTML'e dokunulmaz.
 *
 * `checkout` dolduğunda kart satın alma butonu gösterir. Boşken kart "yakında" olarak
 * çizilir ve ziyaretçiyi haber listesine yollar — çalışmayan bir satın alma butonu
 * göstermek, hiç göstermemekten kötüdür.
 *
 * `checkout` bir barındırılmış ödeme bağlantısıdır (Stripe Payment Link, Lemon Squeezy,
 * Gumroad). Kart bilgisi hiçbir zaman bu siteye gelmez; hangi sağlayıcının seçileceği
 * docs/SHOP.md içinde — dijital ve fiziksel ürün için cevap aynı değil.
 *
 * Ürün adları çevrilmez (parça adları gibi). Açıklamalar `desc` anahtarıyla i18n'den gelir.
 */

/* Sıra üretim maliyetine göre: dosyalar önce, kâğıt sonra, kumaş en sonda.
 *
 *   Sıfır marjinal maliyet — HXI'nın zaten sahip olduğu dosyalar. Stok yok, baskı yok,
 *   kargo yok, beden yok. Bir kere hazırlanır, sonsuz kere satılır.
 *
 *   Talep üzerine baskı, kâğıt — sticker ve poster. Birim maliyeti düşük, beden sorunu yok,
 *   kargosu ucuz, iade oranı neredeyse sıfır: yanlış beden diye iade edilmiyor.
 *
 *   Talep üzerine baskı, kumaş — tişört, hoodie. Yine stok riski yok ama beden var, ve
 *   iadelerin çoğu bedenden geliyor. Beden tablosu olmadan `checkout` doldurulmaz.
 *
 * Fiyatlar Ağustos 2026 pazar araştırmasından; kaynaklar ve gerekçe docs/SHOP.md içinde.
 * KDV dahil düşünülmeli (Norveç %25 MVA) — ilan edilen fiyat tüketicinin ödediği fiyattır.
 *
 * Saat, yüzük, kargo pantolon gibi kalemler bilerek yok: stok bağlar, birim maliyeti yüksek,
 * ve henüz satış geçmişi olmayan bir markada parayı rafta bekletirler.
 */

window.HXI_SHOP = [
  {
    id: 'stems-help-urself',
    kind: 'digital',
    name: 'HELP URSELF — Official Stems',
    desc: 'shop_d_stems',
    // Ücretsiz ama dosya henüz yok: kart ziyaretçiyi listeye yollar; stem'ler çıktığında
    // listedekiler önce haber alır.
    free: true,
    checkout: '',
    signup: true
  },
  {
    // Mağazanın ilk gerçek ürünü. Dijital olması tesadüf değil: baskı yok, kargo yok, beden
    // yok — bir prodüktörün bugün teslim edebileceği tek ürün türü, çünkü dosya zaten var.
    // `checkout` bir Merchant of Record bağlantısı olacak (Gumroad / Lemon Squeezy): dosyayı
    // onlar teslim eder ve AB KDV'sini yasal satıcı olarak üstlenir. Stripe ikisini de yapmaz.
    id: 'drumkit-01',
    kind: 'digital',
    name: 'HXI Drum Kit Vol. 1',
    desc: 'shop_d_kit',
    price: { amount: 149, currency: 'NOK' },
    checkout: ''
  },
  {
    id: 'wallpapers-01',
    kind: 'digital',
    name: 'HXI Wallpaper Pack',
    desc: 'shop_d_wallpaper',
    price: { amount: 49, currency: 'NOK' },
    checkout: ''
  },
  {
    // "Dijital poster": alıcı kendi bastırır. Baskıcı yok, kargo yok, iade yok — numaralı
    // fiziksel baskının sıfır maliyetli kardeşi.
    id: 'poster-digital-01',
    kind: 'digital',
    name: 'HXI Poster — Print at Home',
    desc: 'shop_d_poster',
    price: { amount: 79, currency: 'NOK' },
    checkout: ''
  },
  {
    // Fırça paketinin prodüktördeki tam karşılığı: illüstratöre fırça neyse, prodüktöre
    // preset odur — sanatçının sesini kendi işinde kullanmanın aracı.
    id: 'presets-01',
    kind: 'digital',
    name: 'HXI Serum Presets',
    desc: 'shop_d_presets',
    price: { amount: 199, currency: 'NOK' },
    checkout: ''
  },
  {
    // Bu kitlenin asıl "fırça paketi" bu. HXI'yı bulan insanlar video kuruyordu; onların
    // aleti LUT ve overlay. Müzik değil ama tam olarak aynı topluluğa satılıyor.
    id: 'editpack-01',
    kind: 'digital',
    name: 'HXI Edit Pack — LUTs & Overlays',
    desc: 'shop_d_editpack',
    price: { amount: 149, currency: 'NOK' },
    checkout: ''
  },
  {
    // Kâğıt: en ucuz talep üzerine baskı. Beden yok, iade yok, zarfla gidiyor.
    id: 'sticker-pack-01',
    kind: 'physical',
    name: 'X Mark Sticker Pack',
    desc: 'shop_d_stickers',
    price: { amount: 99, currency: 'NOK' },
    checkout: ''
  },
  {
    // Numaralı, imzasız. Kimlik yüzsüz; imza her nüshada tutulması gereken fiziksel bir söz.
    id: 'print-help-urself',
    kind: 'physical',
    name: 'HELP URSELF — Numbered Print',
    desc: 'shop_d_print',
    price: { amount: 299, currency: 'NOK' },
    checkout: ''
  },
  {
    id: 'tee-norwegian-flag',
    kind: 'physical',
    name: 'Norwegian Flag Tee',
    desc: 'shop_d_tee',
    price: { amount: 399, currency: 'NOK' },
    checkout: ''
  },
  {
    id: 'hoodie-norwegian-flag',
    kind: 'physical',
    name: 'Norwegian Flag Hoodie',
    desc: 'shop_d_hoodie',
    price: { amount: 799, currency: 'NOK' },
    checkout: ''
  },

  /* ---- Üyelik ve deneyimler: tek seferlik bir şey değil ----
   *
   * Üyelik, düzenli gelirin tek kaynağı. Tek kişilik bir operasyonda asıl maliyeti para
   * değil, söz: her ay teslim edilecek bir şey olmalı. `checkout` dolmadan önce cevaplanması
   * gereken soru fiyat değil, "bu ay ne göndereceğim". Boş bir ay, iptal edilen abonelik.
   *
   * Deneyimler yüksek gelirli ama ölçeklenmez: satılan şey saat. Özel yayın ölçeklenebilir
   * olanı — bir kere yapılır, çok kişi izler. Stüdyo ziyareti ölçeklenmez ve internetten
   * tanımadığın birine adres vermek demektir; onu satışa açmadan önce nerede, kiminle ve
   * hangi koşulda sorularının cevabı olmalı. O yüzden katalogda yok.
   */
  {
    id: 'membership-01',
    kind: 'digital',
    name: 'HXI Frequency',
    desc: 'shop_d_membership',
    price: { amount: 99, currency: 'NOK' },
    per: 'month',
    checkout: ''
  },
  {
    id: 'listening-stream',
    kind: 'digital',
    name: 'Private Listening Stream',
    desc: 'shop_d_stream',
    price: { amount: 249, currency: 'NOK' },
    checkout: ''
  }
];
