# Ajan kataloğu

## Önce roller, sonra ajanlar

Küçük işletme "Email Agent" satın almaz — **rol** satın alır. "Bir resepsiyonist lazım"
cümlesi kurulur, "bir e-posta sınıflandırma ajanı lazım" cümlesi kurulmaz. Bu yüzden
satış üç rol üzerinden yapılır; aşağıdaki yedi ajan bu rollerin içindeki teknik parçalardır.

| Rol | İçindeki ajanlar | Ne satın alıyor | Örnek fiyat |
|---|---|---|---|
| **AI Receptionist** | Email + Customer Service + Meeting | İlk teması kimse kaçırmıyor: her mesaj sınıflanıyor, yanıtlanıyor, toplantı kuruluyor | Kurulum €3.500 · €900/ay |
| **AI Sales Assistant** | Sales + Research | Gelen talep 10 dakikada nitelendirilmiş ve CRM'de; satışçı hazır brief'le konuşuyor | Kurulum €3.000 · €800/ay |
| **AI Office Assistant** | Admin + Meeting + Content | Belge, not ve rapor işi kendiliğinden dönüyor | Kurulum €2.500 · €700/ay |

**Neden bu üçü:** her biri bir insanın işini tarif ediyor, bu yüzden ROI hesabı basit —
"bu iş şu an haftada kaç saat alıyor?" sorusunun cevabı doğrudan fiyatla karşılaştırılıyor.
Teknik ajan isimleri sözleşmenin ekinde kalır, satış konuşmasında geçmez.

**Rol satmanın kuralı değişmiyor:** rolü satarsınız, ama **tek ajanla başlatırsınız.**
AI Receptionist'i satıp ilk iki hafta yalnızca e-posta sınıflandırmayı kurarsınız; müşteri
sonucu gördükten sonra müşteri hizmetleri ve toplantı parçaları eklenir. Üçünü aynı anda
açmak, projeyi ilk aksaklıkta kaybetmenin en hızlı yolu.

---

## Rollerin kapsamı

### AI Receptionist
İlk temas noktası. Gelen e-postayı sınıflandırır ve taslak yanıt hazırlar, sık sorulanları
bilgi tabanından yanıtlar, uygun olduğunda toplantı kurar, karmaşık olanı insana devreder.
Toplantı sonrası özet ve görev çıkarır.
**En uygun müşteri:** telefonla/e-postayla çok talep alan, resepsiyon veya ofis görevlisi
tutmayı düşünen 5–30 kişilik şirketler.
**İlk iki hafta:** yalnızca e-posta sınıflandırma + taslak yanıt.

### AI Sales Assistant
Gelen talebi nitelendirir (bütçe, kapsam, aciliyet), CRM kaydını açar, potansiyel müşteri
hakkında araştırma yapar ve satış temsilcisine tek sayfalık brief hazırlar; takipleri hatırlatır.
**En uygun müşteri:** talebi çok, satışçısı az olan şirketler; ajanslar, B2B hizmet firmaları.
**İlk iki hafta:** yalnızca gelen talep nitelendirme + CRM kaydı.
**Sınır:** fiyat vermez, indirim yapmaz, sözleşme konuşmaz.

### AI Office Assistant
Fatura ve fiş verisini çıkarıp sisteme işler, toplantı notlarını ve görevleri üretir,
haftalık raporu hazırlar, iç dokümanları düzenler.
**En uygun müşteri:** muhasebe yükü elle dönen, raporlaması gecikmiş küçük işletmeler.
**İlk iki hafta:** yalnızca belge verisi çıkarma + doğrulama.
**Sınır:** ödeme yapmaz, kayıt silmez, mutabakat kapatmaz.

---

## Teknik ajanlar (rollerin altındaki parçalar)

Yedi ajan. Her biri ayrı satılır. Sütunların anlamı:

- **Otonomi:** ajanın insan onayı olmadan ne yapabildiği. `öneri` = taslak üretir, insan
  gönderir · `onaylı` = insan tek tıkla onaylar · `otonom` = kendi başına yapar.
- **Risk:** yanlış çalıştığında maliyet. Bu, otonomi seviyesini belirler.
- **Kurulum:** ilk sürüm için gereken gerçekçi süre (keşif tamamlanmış varsayımıyla).

| # | Ajan | Ne yapar | Bağlandığı sistem | Otonomi | Risk | Kurulum |
|---|---|---|---|---|---|---|
| 1 | Email Agent | Gelen kutusunu sınıflandırır, taslak yanıt yazar, takip hatırlatır | Gmail / Outlook | öneri → onaylı | Orta | 2 hafta |
| 2 | Customer Service Agent | SSS'leri yanıtlar, bilet açar, karmaşık olanı insana devreder | Yardım masası, bilgi tabanı | onaylı | **Yüksek** | 3 hafta |
| 3 | Sales Agent | Gelen talebi nitelendirir, CRM'e işler, toplantı önerir | CRM, takvim | öneri | Orta | 2–3 hafta |
| 4 | Research Agent | Pazar/rakip/aday araştırması yapar, kaynaklı özet çıkarır | Web, iç dokümanlar | otonom | Düşük | 1 hafta |
| 5 | Content Agent | Araştırmadan blog, LinkedIn, sosyal ve newsletter üretir | CMS, sosyal araçlar | öneri | Düşük | 1–2 hafta |
| 6 | Meeting Agent | Toplantıyı özetler, kararları ve görevleri çıkarır, dağıtır | Takvim, kayıt, görev aracı | otonom (özet) | Düşük | 1 hafta |
| 7 | Admin Agent | Fatura/fiş verisi çıkarır, tabloya işler, eksikleri bildirir | Muhasebe, drive | onaylı | Orta | 2 hafta |

## Nereden başlamalı

**İlk pilot için en iyi ikisi: Research Agent ve Meeting Agent.** İkisi de düşük riskli,
hızlı kurulur, sonucu ilk haftada görülür ve yanlış çalıştığında kimse zarar görmez.
Müşteriye güveni bunlar kazandırır; e-posta ve müşteri hizmetleri ajanları ondan sonra
gelir.

**Customer Service Agent'ı asla ilk iş olarak satmayın.** Müşteriyle doğrudan konuşan,
markayı temsil eden ve yanlış cevabı doğrudan zarar veren tek ajan bu. Önce bilgi
tabanının derli toplu olması gerekir — çoğu KOBİ'de yoktur ve bu tek başına bir projedir.

---

## 1. Email Agent

**Sorun:** Gelen kutusunda günde 40–120 e-posta; çoğu beş kalıba giriyor ama her biri
elle okunuyor.

**Yaptığı iş:** Her e-postayı sınıflandırır (teklif talebi, destek, fatura, spam, kişisel),
kalıba giren yanıtlar için taslak hazırlar, cevapsız kalanları hatırlatır, haftalık özet
çıkarır.

**Yapmadığı iş:** İlk sürümde hiçbir e-postayı kendi başına göndermez. Taslak üretir,
insan gönderir. Gönderme yetkisi ancak dört haftalık isabet ölçümünden sonra ve yalnızca
seçilmiş kategorilerde açılır.

**Müşteriden gereken:** Posta kutusuna okuma izni, 200–500 geçmiş e-posta örneği
(sınıflandırmayı kalibre etmek için), marka sesi için 10 örnek yanıt.

**Ölçüm:** Doğru sınıflandırma oranı, taslağın düzenlenmeden gönderilme oranı, gelen
kutusunda geçen süre (öncesi/sonrası).

---

## 2. Customer Service Agent

**Sorun:** Aynı 20 soru her hafta tekrar ediyor; yanıt süresi uzadıkça memnuniyet düşüyor.

**Yaptığı iş:** Bilgi tabanından yanıt üretir, kaynağı gösterir, emin olmadığında
devreder. Her yanıt insan onayından geçer (ilk aşamada).

**Yapmadığı iş:** İade, iptal, fiyat istisnası, sözleşme yorumu gibi bağlayıcı konularda
karar vermez — bunlar kural listesiyle baştan devre dışı bırakılır.

**Müşteriden gereken:** Yazılı bilgi tabanı veya en az 100 geçmiş bilet-yanıt çifti,
devretme kuralları, eskalasyon sorumlusu.

**Ölçüm:** İlk yanıt süresi, otomatik çözülen bilet oranı, devretme doğruluğu, müşteri
memnuniyeti.

**Uyarı:** Bilgi tabanı yoksa proje bilgi tabanı kurmakla başlar. Bunu ayrı fiyatlayın.

---

## 3. Sales Agent

**Sorun:** Gelen talepler geç yanıtlanıyor, CRM eksik dolduruluyor, takip unutuluyor.

**Yaptığı iş:** Form/e-posta ile gelen talebi okur, nitelendirir (bütçe, kapsam, aciliyet),
CRM kaydını açar, satış temsilcisine brief hazırlar, uygun takvim aralığı önerir.

**Yapmadığı iş:** Fiyat vermez, indirim yapmaz, sözleşme konuşmaz. Nitelendirir ve
hazırlar; satışı insan yapar.

**Müşteriden gereken:** CRM erişimi, nitelendirme kriterleri, satış ekibinin takvimi.

**Ölçüm:** Talebe ilk yanıt süresi, CRM veri tamlığı, toplantıya dönüşme oranı.

---

## 4. Research Agent

**Sorun:** Her teklif, her içerik, her yatırım kararı öncesi saatler süren araştırma.

**Yaptığı iş:** Belirlenen konuda web araştırması yapar, kaynakları doğrular, çelişen
bilgileri işaretler, kaynaklı özet üretir. Rakip takibi için haftalık otomatik tarama
yapabilir.

**Neden ilk pilot için ideal:** Çıktı bir doküman; yanlışsa kimse zarar görmez, insan
okur ve düzeltir. Değeri ilk günden görünür.

**Müşteriden gereken:** Araştırma konuları ve hangi kaynaklara güvendikleri.

**Ölçüm:** Araştırma başına geçen süre (öncesi/sonrası), kaynak doğruluğu.

---

## 5. Content Agent

**Sorun:** Düzenli yayın yapmak isteniyor ama sıra hiç gelmiyor.

**Yaptığı iş:** Bir araştırmadan blog yazısı, LinkedIn serisi, sosyal içerik ve newsletter
üretir; marka sesine göre yazar; yayın takvimine yerleştirir. (QBLOGG içerik hattının
ajan hâli — mevcut işimizle doğrudan örtüşen ajan budur.)

**Yapmadığı iş:** Onaysız yayınlamaz. Her içerik insan editörlüğünden geçer.

**Müşteriden gereken:** Marka sesi örnekleri, konu havuzu, yayın kanalları erişimi.

**Ölçüm:** Yayın sıklığı, içerik başına insan düzenleme süresi, organik trafik.

---

## 6. Meeting Agent

**Sorun:** Toplantı kararları kayboluyor, kimse not tutmuyor, görevler takip edilmiyor.

**Yaptığı iş:** Toplantı kaydını/transkriptini okur, karar ve görevleri çıkarır,
sorumluları eşleştirir, katılımcılara özet gönderir, görev aracına işler.

**Müşteriden gereken:** Toplantı kaydı veya transkript kaynağı, görev aracı erişimi,
katılımcı listesi.

**Ölçüm:** Not tutmaya harcanan süre, karar takibi oranı.

**Uyarı:** Kayıt almak çalışan ve müşteri rızası gerektirir. Bunu proje başında yazılı
hâle getirin (bkz. teknik mimari → hukuki).

---

## 7. Admin Agent

**Sorun:** Fatura, fiş, sipariş formu gibi belgeler elle tabloya giriliyor.

**Yaptığı iş:** Belgeden veriyi çıkarır (tarih, tutar, KDV, satıcı, kalem), doğrular,
tabloya veya muhasebe yazılımına yazar, eksik/şüpheli olanları işaretler.

**Yapmadığı iş:** Ödeme yapmaz, kayıt silmez, mutabakat kapatmaz.

**Müşteriden gereken:** Belge örnekleri (en az 50), hedef sistem erişimi, doğrulama kuralları.

**Ölçüm:** Belge başına işlem süresi, veri doğruluğu, insan düzeltme oranı.

---

## Her ajanın ortak zorunlulukları

Bunlar pazarlık konusu değil; ajanı satılabilir kılan şeyler bunlar:

1. **Kapsam listesi.** Ajanın yapacağı işler yazılıdır; listede olmayan işi yapmaz.
2. **Yasak listesi.** Ajanın asla yapmayacağı işler yazılıdır (ödeme, silme, sözleşme).
3. **İnsan onay noktası.** Riskli her adımda bir insan onayı vardır.
4. **Geri alma yolu.** Yapılan her işlem geri alınabilir veya en azından iz bırakır.
5. **Kayıt.** Her karar, girdi ve çıktı loglanır — müşteri neyin neden olduğunu görebilir.
6. **Devretme.** Ajan emin değilse durur ve insana devreder; tahmin etmez.
