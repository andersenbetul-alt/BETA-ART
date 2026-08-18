/* QBLOGG — tek yapılandırma dosyası.
 *
 * Siteyi yayına almak için değiştirilmesi gereken her şey burada.
 * Başka hiçbir dosyaya dokunmanız gerekmiyor.
 */
window.QB_CONFIG = {
  /* Formların gideceği adres ve altbilgide görünen e-posta */
  mailTo: 'hello@qblogg.com',

  /* Yayına alınacak alan adı — paylaşım bağlantıları ve şemalar bunu kullanır */
  siteUrl: 'https://qblogg.com',

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
  leadMagnet: 'assets/downloads/otomasyon-kesif-listesi.html',

  /* E-posta listesi. Boş bırakılırsa kayıt yalnızca tarayıcıda tutulur —
     yani liste aslında oluşmaz. Site tek varlığını (e-posta listesi) burası
     doldurulana kadar biriktiremez.

     Buraya e-posta servisinizin form/API adresini yazın. Çoğu servis
     (Mailchimp, ConvertKit, Buttondown, MailerLite, beehiiv) bir "form action"
     adresi verir; POST edilen alan adı genelde 'email'.

     Örnek: 'https://buttondown.com/api/emails/embed-subscribe/qblogg'   */
  newsletterEndpoint: '',
  newsletterField: 'email',

  /* Ortaklık (affiliate) bağlantıları.
     disclosure: true ise, ortaklık bağlantısı içeren her yazının başında
     otomatik bir bildirim kutusu çıkar. Bunu kapatmayın: AB tüketici
     mevzuatı ticari ilişkinin açıkça belirtilmesini istiyor ve Google
     ortaklık bağlantılarında rel="sponsored" bekliyor (ikisini de kod
     kendiliğinden uyguluyor). */
  affiliate: {
    disclosure: true
  }
};
