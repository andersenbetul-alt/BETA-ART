# AI Workforce — Kurulum Playbook'u

BETA WORK'ün ilk ürünü. Bu doküman ürünün nasıl satılacağını ve bir müşteride
nasıl kurulacağını adım adım tarif eder.

**Müşteriye verilen söz:** "Şirketinizde tekrar eden işleri analiz ediyoruz ve
bunları AI çalışanlarıyla otomatikleştiriyoruz."

**Satılan şey:** yazılım lisansı değil, **kurulmuş ve çalışır durumda AI
çalışanları**. Müşteri yeni bir araç öğrenmez; kendi e-postası, CRM'i ve
dosyaları içinde çalışan bir ekip devralır.

---

## 1. Kime satılır

En iyi eşleşme:

- 5-50 çalışanlı işletme
- Sahibi veya birkaç kişi "her işi kendi yapıyor"
- Gelen talep var ama takip düşüyor
- Aynı sorulara her gün aynı cevaplar yazılıyor
- Arka ofis (fatura, evrak, takip) bir kişinin sırtında

Kötü eşleşme: süreçleri hiç tanımlı olmayan çok yeni şirketler, tek seferlik
proje işleri, veri paylaşımına kapalı yapılar.

---

## 2. Satış akışı

| Adım | Süre | Amaç | Çıktı |
| --- | --- | --- | --- |
| Keşif görüşmesi | 30-45 dk | Tekrar eden işleri duymak | Not + ilk hipotez |
| Analiz | 3-5 gün | İş envanterini çıkarmak | Analiz raporu |
| Sunum | 45 dk | Kazanılacak saati göstermek | Teklif |
| Kurulum | 1-3 hafta | AI çalışanlarını devreye almak | Çalışır sistem |
| Bakım | aylık | Doğruluğu artırmak | Aylık rapor |

**Analiz ücretlidir ve teklife mahsup edilir.** Ücretsiz analiz, müşterinin
süreci ciddiye almamasına yol açar.

### Keşif görüşmesi soruları

1. Haftada en çok zamanınızı ne alıyor?
2. Aynı cevabı kaç kez yazıyorsunuz? Nerede?
3. Hangi iş unutulduğunda size para kaybettiriyor?
4. Gelen talep nereye düşüyor, kim bakıyor?
5. Bir kişi işten ayrılsa hangi iş durur?
6. Bugün hangi araçları kullanıyorsunuz? (e-posta, CRM, muhasebe, mesajlaşma)
7. Hangi işin yanlış yapılması kabul edilemez? (→ bu işler insanda kalır)

---

## 3. Analiz: iş envanteri

Her tekrar eden iş için tek satır:

| İş | Yapan | Sıklık | Süre (dk) | Aylık saat | Kural netliği (1-5) | Hata riski (1-5) | Skor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Teklif hazırlama | Satış | günde 3 | 25 | 25 | 4 | 2 | yüksek |

**Skor = (aylık saat × kural netliği) ÷ hata riski**

Skoru yüksek olan iş ilk fazda otomatikleştirilir. Kural netliği düşük işler
(her seferinde farklı karar gerektiren) otomatikleştirilmez; önce süreç
netleştirilir.

Analiz raporunda müşteriye üç sayı verilir:

1. Tekrar eden işlere giden **aylık toplam saat**
2. İlk fazda **devralınabilir saat**
3. Bu saatin **parasal karşılığı** (saatlik maliyet × saat)

---

## 4. Kurulacak AI çalışanları

Tam ekip yedi çalışandan oluşur. Detaylı tanımlar: `data/workforce.json`.

| Çalışan | Devraldığı iş | Kurulum |
| --- | --- | --- |
| Email Agent | Gelen kutusu, taslak yanıt, takip | 1-3 gün |
| Customer Service Agent | Müşteri soruları, durum sorguları | 3-5 gün |
| Sales Agent | Talep niteleme, takip, teklif taslağı | 5-7 gün |
| Research Agent | Pazar, rakip, müşteri araştırması | 2-4 gün |
| Content Agent | Sosyal medya, blog, bülten | 3-5 gün |
| Meeting Agent | Gündem, özet, aksiyon takibi | 2-3 gün |
| Admin Agent | Evrak, son tarihler, veri girişi | 3-5 gün |

**Küçük işletmede önerilen ilk üçlü:** Email + Customer Service + Sales.
Bu üçü doğrudan gelire ve müşteri memnuniyetine dokunur; kazanç ilk haftada
görünür. Admin Agent ikinci fazda, arka ofis düzene girince eklenir.

---

## 5. Kurulum kontrol listesi

Her AI çalışanı için aynı altı adım uygulanır:

- [ ] **Kapsam yazılır.** Bu çalışan neyi yapar, neyi yapmaz — tek sayfa.
- [ ] **Kaynak bağlanır.** Erişim izinleri (e-posta, CRM, klasör) müşteri tarafından verilir.
- [ ] **Bilgi yüklenir.** SSS, fiyat listesi, şablonlar, ton rehberi, geçmiş örnekler.
- [ ] **Devir kuralı tanımlanır.** Hangi durumda insana aktarır. (Bkz. bölüm 6)
- [ ] **Test edilir.** Geçmiş 20 gerçek vaka üzerinde çalıştırılır, çıktı karşılaştırılır.
- [ ] **Gözetimli moda alınır.** İki hafta boyunca hazırlar, insan onaylar.

Kurulum, çıktı doğruluğu **iki hafta üst üste hedefin üzerinde** kalmadan
"tamamlandı" sayılmaz.

---

## 6. Yetki seviyeleri

Hiçbir AI çalışanı ilk günden serbest çalışmaz. Yetki üç kademede açılır:

| Seviye | Ne yapar | Geçiş koşulu |
| --- | --- | --- |
| **1 — Gözetimli** | Hazırlar, insan onaylar ve gönderir | Varsayılan başlangıç |
| **2 — Kısmi yetki** | Tanımlı konularda kendisi gönderir, gerisi onaya düşer | 2 hafta, ≥%90 onaysız geçen taslak |
| **3 — Devredilmiş** | Kapsamı içinde tek başına yürütür, rapor eder | 1 ay, ölçülen hata oranı hedefin altında |

**Her seviyede insana devredilen konular sabittir:** ödeme ve fiyat taahhüdü,
sözleşme, iade ve ödeme itirazı, şikâyet ve memnuniyetsizlik sinyali, resmî
beyan ve imza, personel konuları.

---

## 7. Fiyatlama yapısı

İki kalemden oluşur:

- **Kurulum ücreti** — tek seferlik, çalışan sayısına ve entegrasyon
  karmaşıklığına göre.
- **Aylık bakım** — izleme, iyileştirme, raporlama ve destek.

| Paket | Çalışan | Kimin için |
| --- | --- | --- |
| Başlangıç | 1 | Tek bir darboğazı olan işletme |
| Çekirdek | 3 | Müşteri iletişimi + satış |
| Tam Ekip | 7 | Arka ofis dahil tüm operasyon |

Rakam yerine **kazanılan saat** üzerinden konuşulur: "Ayda 40 saat geri
kazandırıyoruz, bunun size maliyeti şu" — teklif bu karşılaştırmayla sunulur.
Fiyat rakamları müşteri segmentine göre belirlenir ve bu dokümanda tutulmaz.

---

## 8. Aylık rapor

Her ay müşteriye tek sayfa gider:

1. Devralınan iş hacmi (işlenen e-posta, yanıtlanan talep, hazırlanan teklif)
2. Kazanılan saat ve parasal karşılığı
3. Doğruluk: onaysız geçen çıktı oranı, düzeltme sayısı
4. İnsana devredilen vakalar ve nedenleri
5. Sonraki ay için öneri (yeni çalışan veya kapsam genişletme)

Bu rapor hem bakım bedelinin karşılığıdır hem de bir sonraki paketin satış
aracıdır.

---

## 9. Riskler ve sınırlar

- **Veri.** Şirket verisi yalnızca kurulan çalışanın işi için kullanılır;
  erişim kapsamı yazılı olarak sınırlandırılır ve iş bitiminde kaldırılır.
- **Halüsinasyon.** Fiyat, stok ve taahhüt içeren bilgiler kaynak dokümandan
  okunur; çalışan kendi bilgisinden fiyat üretmez.
- **Süreç olgunluğu.** Tanımsız süreç otomatikleştirilmez. Önce süreç yazılır.
- **Aşırı vaat.** "İnsan gerekmeyecek" denmez. Söz: tekrar eden işin
  devralınması, insanın karar işine dönmesi.
- **Bağımlılık.** Müşteriye kapsam, kurallar ve şablonlar teslim edilir;
  sistem BETA olmadan da anlaşılabilir durumda bırakılır.
