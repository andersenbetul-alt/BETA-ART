/* QBLOGG — tek yapılandırma dosyası.
 *
 * Siteyi yayına almak için değiştirilmesi gereken her şey burada.
 * Başka hiçbir dosyaya dokunmanız gerekmiyor.
 */
window.QB_CONFIG = {
  /* Formların gideceği adres ve altbilgide görünen e-posta */
  mailTo: 'hello@qblogg.no',

  /* Yayına alınacak alan adı — paylaşım bağlantıları ve şemalar bunu kullanır */
  siteUrl: 'https://qblogg.no',

  /* Sosyal hesaplar. Boş bırakılan altbilgide gösterilmez (ölü bağlantı olmaz). */
  social: {
    linkedin: '',
    x: '',
    medium: '',
    substack: '',
    youtube: ''
  },

  /* Paket fiyatları. Buraya yazılan değer sözlükteki fiyatı ezer.
     Boş bırakılırsa i18n.js içindeki örnek fiyatlar kullanılır.
     Norveç pazarı için kron yazmak isterseniz: p1: '1.800 kr' gibi. */
  prices: {
    p1: '',   // Tek Makale
    p2: '',   // Büyüme
    p3: ''    // Stüdyo
  },

  /* Bültene kayıt karşılığında verilen indirilebilir dosya (lead magnet) */
  leadMagnet: 'assets/downloads/otomasyon-kesif-listesi.html'
};
