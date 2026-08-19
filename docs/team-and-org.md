# Ürün ve Web Ekibi — Organizasyon ve İşe Alım Sırası

21 rol, 7 fonksiyon grubu, 5 işe alım dalgası.
Görsel karşılığı: `team.html` · veri: `data/team.json`

**Temel ilke:** rol sayısı kişi sayısı değildir. Rol bir *fonksiyondur*.
Aşağıdaki 21 rolün tamamı, 7-9 kişilik bir çekirdek ekiple karşılanabilir —
bazıları tek kişide birleşir, bazıları danışman olarak dışarıdan alınır.

---

## 1. Çekirdek ekip (7-9 kişi)

| Kişi | Taşıdığı roller |
| --- | --- |
| Kurucu | Product Manager + Business Strategist (danışman desteğiyle) |
| Service Designer | Service Design + UX Research (başlangıçta) |
| UX/UI Designer | UX Designer + UI Designer |
| UX Writer | Copywriter + içerik tasarımı |
| Technical Lead | Full-Stack + Frontend + mimari |
| Backend Developer | Backend + entegrasyonlar |
| Growth / SEO | SEO + dijital pazarlama |
| QA | Test + temel erişilebilirlik kontrolü |
| Danışmanlar | Güvenlik · GDPR · Erişilebilirlik · Marka kimliği |

---

## 2. İşe alım sırası — takvime değil, tetikleyiciye bağlı

Tarih vermek yerine "şu olduğunda şu alınır" demek daha sağlam: erken alım
maaş yakar, geç alım büyümeyi durdurur.

| Dalga | Tetikleyici | Alınanlar |
| --- | --- | --- |
| **0** | Bugün | Kurucu PM rolünde. Business Strategist çeyreklik danışman. |
| **1** | Ürün fikri doğrulandığında | Technical Lead · Service Designer · UX/UI Designer · UX Writer<br>*GDPR ve erişilebilirlik danışmanı bu aşamada masaya oturur.* |
| **2** | İlk ürün satışa hazır olduğunda | Backend Developer · QA · Growth/SEO · Trust & Safety<br>*Güvenlik denetimi ödeme canlıya çıkmadan yapılır.* |
| **3** | Anlamlı trafik ve tekrar eden gelir oluştuğunda | Data Analyst · CRO · UX Researcher · Frontend Developer |
| **4** | Mobil ihtiyacı veriyle kanıtlandığında | Mobile Developer · ayrı Brand Designer · ikinci Backend |

**İlk teknik işe alım Technical Lead'dir, PM değil.** Kurucunun kendisi PM'dir;
erken PM alımı kurucuyla çakışır ve ikisi de aynı işi yapar.

---

## 3. Sıralamadaki risk: bu bir şelale olamaz

Önerdiğiniz akış şuydu:

```
Strateji → UX/Service → UI/Brand → Development → Safety/Legal → Marketing → Data
```

Fonksiyonların *bağımlılık* sırası olarak doğru. Ama **işe alım veya çalışma
sırası** olarak okunursa iki yerde pahalıya patlar:

**Safety/Legal beşinci sırada olamaz.** GDPR ve erişilebilirlik sonradan
denetlenen şeyler değil, gün 0 kısıtlarıdır. Veri modeli çizilirken GDPR
masada değilse, uyum sonradan *şema değişikliği* demektir — `db/schema.sql`
zaten kişisel veri tutuyor (e-posta, org.nr, fatura adresi, ödeme geçmişi).
Erişilebilirlik de aynı: yaşlı kullanıcı için tasarlanmış bir arayüzü sonradan
erişilebilir yapmak, baştan öyle tasarlamaktan kat kat pahalı.

**Data yedinci sırada olamaz.** Data Analyst'i geç almak doğru; ama *ölçümü*
geç kurmak veriyi kalıcı olarak kaybettirir. Analist dalga 3'te gelir,
ölçüm altyapısı dalga 1'de kurulur. Analist geldiğinde bakacak geçmiş veri
olmalı.

Doğrusu: strateji → UX → UI → development sırası akış olarak kalır;
safety, legal ve ölçüm ise **her dalgada paralel yürüyen kısıtlardır**.

---

## 4. Listede eksik olan rol: Trust & Safety

Yazınızın metninde geçiyor ama numaralı listede yoktu. Yaşlıları, aile
üyelerini ve hizmet sağlayıcıları buluşturan bir platformda **en yüksek
riskli alan burasıdır** ve Cybersecurity'den farklı bir iştir:

- Cybersecurity: sistemi *dışarıdan* saldırıya karşı korur.
- Trust & Safety: sistemi *içindeki kullanıcılara* karşı korur.

Somut olarak: hizmet sağlayıcı doğrulama (kim eve giriyor?), kötüye kullanım
ve dolandırıcılık tespiti, şikâyet ve olay müdahale süreci, hesap ele
geçirme, savunmasız kullanıcıya yönelik manipülasyon.

Bu, ürün canlıya çıkmadan tanımlanması gereken bir süreçtir — kişi tam
zamanlı olmasa bile **süreç sahibi belli olmalı**. Yaşlı bir kullanıcı
dolandırıldığında "bunu kim ele alıyor?" sorusunun cevabı o gün aranmaz.

---

## 5. Yaşlı kullanıcıya hizmet veren platformun ek yükü

Klasik bir web ekibinden farklı olarak kritikleşen dört alan:

**Erişilebilirlik yasal bir yükümlülük.** Norveç'te dijital çözümler için
evrensel tasarım (universell utforming) düzenlemesi var ve WCAG uyumu
zorunlu tutuluyor. Kapsamın sizin ürününüze tam olarak nasıl uygulandığı
hukukçuyla doğrulanmalı — ama "sonra bakarız" kalemi değil.

**Metin, tasarımdan önemli.** Yaşlı kullanıcıda kafa karışıklığının kaynağı
genelde görsel değil, dildir. UX Writer'ı çekirdek ekibe koymamın nedeni bu.

**Hata toleransı düşük.** Genç kullanıcı hatalı bir akışı tekrar dener;
yaşlı kullanıcı bir kez başarısız olursa sistemi bir daha açmaz ve çoğu
zaman geri bildirim de vermez. QA'in dalga 2'de olması bu yüzden.

**Üç ayrı kullanıcı, üç ayrı ihtiyaç.** Yaşlı, aile üyesi ve hizmet
sağlayıcı aynı platformda ama beklentileri çelişebilir (özerklik ↔ gözetim).
Bu çelişkiyi ekran tasarımı çözemez; **hizmet tasarımı** çözer. Service
Designer'ın ilk dalgada olmasının nedeni budur.

---

## 6. Kendi ürününüzü kendi ekibinizde kullanın

BETA WORK'ün sattığı şey "tekrar eden işleri AI çalışanlarına devretmek".
Aynı mantık bu ekibe de uygulanmalı — hem maliyet düşer hem ürün gerçek
kullanımda test edilir:

| Fonksiyon | AI'ın devralabildiği kısım | İnsanda kalan |
| --- | --- | --- |
| İçerik / SEO | Taslak üretimi, anahtar kelime analizi, meta veri | Editoryal karar, marka sesi |
| UX Research | Görüşme özeti, tema çıkarma | Görüşmeyi yapmak, yorumlamak |
| QA | Regresyon senaryoları, cihaz matrisi kontrolü | Keşif testi, kullanıcıyla test |
| Data | Rapor derleme, anomali bildirimi | Hangi soruyu soracağına karar vermek |
| Admin | Evrak, takip, toplantı özeti | — |

Bu, rolleri iptal etmez; **her rolün daha az kişiyle taşınmasını** sağlar.
7-9 kişilik çekirdek ekibin 20 kişilik iş çıkarabilmesinin yolu da bu.

---

## 7. Açık kararlar

1. Service Designer ilk mi, Technical Lead ilk mi? *(Öneri: ürün fikri
   doğrulanmadıysa Service Designer; doğrulandıysa Technical Lead.)*
2. Trust & Safety süreç sahibi kim — kurucu mu, ayrı rol mü?
3. Erişilebilirlik hedefi hangi seviye ve kim doğrulayacak?
4. Danışmanlar (güvenlik, GDPR) proje bazlı mı, aylık retainer mı?
5. İlk işe alımlar tam zamanlı mı, yoksa freelance/parça zamanlı mı
   başlayacak?
