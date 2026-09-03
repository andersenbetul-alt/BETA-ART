import type { HomeDict } from "./home.en";

export const uiTr: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Köken",
  "ui.prov.heading": "Doğrulama kaydı",
  "ui.prov.intro": "Bu kayıt henüz doğrulanmadı. Bir plaka, ancak RAW orijinali ve çekim kaydı dosyalanmışsa İnsan Doğrulamalı olarak tanımlanır.",
  "ui.prov.footer": "Köken belgesi, lisanslamadan önce talep edilebilir. Katalog numarasını isteyin, o dosya için mevcut olan her kaydı alırsınız.",
  "ui.prov.r.status": "Doğrulama durumu",
  "ui.prov.r.raw": "RAW orijinali arşivlendi",
  "ui.prov.r.capture": "Çekim kaydı korundu",
  "ui.prov.r.signed": "Fotoğrafçı imzalı lisans",
  "ui.prov.r.cat": "Katalog numarası",
  "ui.prov.r.c2pa": "C2PA içerik kimlik bilgileri",

  // Capture metadata table
  "ui.cap.heading": "Çekim üstverisi",
  "ui.cap.date": "Çekim tarihi",
  "ui.cap.location": "Konum",
  "ui.cap.camera": "Kamera",
  "ui.cap.lens": "Objektif",
  "ui.cap.exposure": "Pozlama",

  // Shared placeholder value
  "ui.cap.placeholder": "Yer tutucu görsel",
  "ui.val.tbd": "Sonradan sağlanacak",

  // Recommendation strip
  "ui.foryou.default": "Arşivde devam et",
  "ui.foryou.next": "Sırada lisanslamak isteyebilirsiniz",
  "ui.foryou.note": "Burada açtığınıza göre. Yalnızca cihazınızda tutulur — hiçbir şey gönderilmez veya izlenmez.",

  // Breadcrumbs
  "ui.crumb.home": "Ana sayfa",
  "ui.crumb.collection": "Koleksiyon",

  // Plate detail page chrome
  "ui.skip": "İçeriğe geç",
  "ui.detail.priceNote": "Taslak fiyatlandırma — yalnızca gösterge niteliğinde, onaylanmış lisans koşulları değil.",
  "ui.detail.licHeading": "Lisanslama seçenekleri",
  "ui.detail.licIntro": "Kullanımınıza uyan kapsamı seçin. Aşağıdaki özet sade bir dille yazılmıştır; bağlayıcı belge imzalı sözleşmedir.",
  "ui.detail.selectLic": "Bir lisans seçin",
  "ui.detail.draftPrice": "Taslak fiyat — yalnızca gösterge niteliğinde",
  "ui.detail.mayDo": "yapabilecekleriniz",
  "ui.detail.notIncluded": "Dahil değil",
  "ui.detail.delivery": "Teslim",
  "ui.detail.orderHeading": "Sipariş nasıl işler",

  // Licence request form
  "ui.form.label": "Lisans talebi",
  "ui.form.heading": "Bir plaka için koşul isteyin",
  "ui.form.intro": "Şimdilik yalnızca ön yüz — gönderim ve teslim entegrasyonu yayına almadan önce bağlanmalıdır. Buraya girdiğiniz hiçbir şey iletilmez veya saklanmaz.",
  "ui.form.plate": "Plaka",
  "ui.form.selectPlate": "Bir plaka seçin",
  "ui.form.licenceType": "Lisans türü",
  "ui.form.selectLicence": "Bir lisans seçin",
  "ui.form.name": "Ad",
  "ui.form.email": "E-posta",
  "ui.form.company": "Şirket",
  "ui.form.territory": "Bölge",
  "ui.form.duration": "Süre",
  "ui.form.use": "Kullanım amacı",
  "ui.form.notes": "Notlar",
  "ui.form.optional": "(isteğe bağlı)",
  "ui.form.submit": "Talebi hazırla",

  // Form — recorded state
  "ui.form.rec.label": "Talep bu tarayıcıya kaydedildi",
  "ui.form.rec.heading": "Talebiniz hazırlandı",
  "ui.form.rec.body": "Henüz hiçbir şey gönderilmedi. Bu sitenin bağlı bir gönderim arka ucu yok, bu yüzden girdiğiniz ayrıntılar yalnızca bu tarayıcı oturumunda kalır. Gönderim ve teslim yayına almadan önce bağlanmalıdır.",
  "ui.form.rec.plate": "Plaka",
  "ui.form.rec.licence": "Lisans",
  "ui.form.rec.again": "Yeni bir talep başlat",

  // Form — validation
  "ui.form.v.plate": "Bir plaka seçin.",
  "ui.form.v.licence": "Bir lisans türü seçin.",
  "ui.form.v.name": "Adınızı girin.",
  "ui.form.v.nameLong": "Ad 100 karakterden az olmalı.",
  "ui.form.v.email": "E-posta adresinizi girin.",
  "ui.form.v.emailBad": "Geçerli bir e-posta adresi girin.",
  "ui.form.v.company": "Şirket 120 karakterden az olmalı.",
  "ui.form.v.use": "Görselin nasıl kullanılacağını açıklayın.",
  "ui.form.v.useLong": "Kullanım amacı 1000 karakterden az olmalı.",
  "ui.form.v.notes": "Notlar 1000 karakterden az olmalı.",
};
