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

window.HXI_SHOP = [
  {
    id: 'stems-help-urself',
    kind: 'digital',
    name: 'HELP URSELF — Official Stems',
    desc: 'shop_d_stems',
    // Ücretsiz ama dosya henüz yok: kart, hero'nun söylediği yere — listeye — yollar.
    free: true,
    checkout: '',
    signup: true
  },
  {
    id: 'tee-norwegian-flag',
    kind: 'physical',
    name: 'Norwegian Flag Tee',
    desc: 'shop_d_tee',
    checkout: ''
  },
  {
    id: 'hoodie-norwegian-flag',
    kind: 'physical',
    name: 'Norwegian Flag Hoodie',
    desc: 'shop_d_hoodie',
    checkout: ''
  }
];
