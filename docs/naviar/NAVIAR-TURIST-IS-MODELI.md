# NAVIAR TURIST — İş Modeli Analizi (/AUTOPROMPT)

Tarih: 25 Ağustos 2026 · Durum: TASLAK, kullanıcı tarafından iletildi
Kapsam: NAVIAR marka ailesi altında turizm dikeyi — QBLOGG'dan ayrı bir iş
(bkz. `docs/naviar/NAVIAR-LOGO-KARAR.md`, satır 6: "Kapsam dışı: QBLOGG").

Başlangıç varsayımı: Norveç merkezli, önce outbound turizm; ilk odak Avrupa +
Türkiye; düşük bütçeli MVP; amaç ilk 90 günde gerçek müşteriden gelir
doğrulamak.

Pazar büyüklüğü: Norveçliler 2025'te yaklaşık 6,97 milyon yurtdışı tatil
seyahati yaptı ve yurtdışı tatillerinde 89,5 milyar NOK harcadı. Ortalama
harcama seyahat başına 12.800 NOK'un üzerindeydi. 2026'nın ilk çeyreğinde
toplam seyahat sayısı yıllık %7,5 arttı.

> **Kaynak notu:** Bu belgedeki pazar, komisyon ve fiyat rakamları kullanıcı
> tarafından dış analiz olarak iletilmiştir; bu oturumda doğrulanmamıştır.
> Yayına/karara esas almadan önce birincil kaynaktan (istatistik kurumu,
> Booking/Viator ortaklık sayfaları) teyit edilmelidir — bkz. § 19 "garanti
> değildir" notu ve QBLOGG'un genel kuralı: rakamlar örnek/hipotez olarak
> işaretlenir, kesin vaat gibi sunulmaz.

---

## 1. İş fikrinin net hali

**Eski ve fazla geniş fikir:** NAVIAR her şeyi sunan global seyahat platformu
olsun. Bu yaklaşım başlangıç için yanlış.

**Yeni iş modeli:** NAVIAR TURIST, Norveç'teki gezginlere kişiselleştirilmiş
seyahat planı, doğrulanmış rezervasyon önerileri ve seyahat sırasında
insan + AI destekli concierge hizmeti satan dijital seyahat asistanıdır.

İlk aşamada NAVIAR TURIST:

- OTA olmayacak
- Otel sahibi olmayacak
- Tur operatörü olmayacak
- Uçak bileti sistemi geliştirmeyecek

Önce şu model doğrulanacak:

```
PLANLA → ÖNER → PARTNERE YÖNLENDİR → DESTEKLE → KOMİSYON + HİZMET ÜCRETİ KAZAN
```

## 2. Müşterinin gerçek problemi

| Problem | Bugünkü çözüm | NAVIAR fırsatı |
|---|---|---|
| Çok fazla seçenek | Booking/Google | Seçenekleri azalt |
| Seyahat planlamak zaman alıyor | ChatGPT/bloglar | Hazır kişisel plan |
| Bilgiler farklı sitelerde | Google/Tripadvisor | Tek seyahat merkezi |
| Nereye gidileceğine karar veremiyor | TikTok/Instagram | Kişisel öneri |
| Aile için uygun plan bulmak zor | Manuel araştırma | Family-ready plan |
| Seyahat sırasında problem çıkıyor | Otel/airline desteği | NAVIAR concierge |
| Turistik tuzaklardan korkuyor | Review siteleri | Doğrulanmış öneriler |
| Dil problemi | Google Translate | Çok dilli destek |
| Program değiştiğinde plan bozuluyor | Kendisi çözüyor | Dinamik itinerary |

Satın alma nedeni "bana daha fazla seçenek göster" değil, **"benim için doğru
seçenekleri bul ve seyahatimi kolaylaştır"**dır. Bu ayrım NAVIAR'ın temelidir.

## 3. Hedef müşteri önceliklendirmesi

Başlangıçta herkese satış yapılmayacak.

| Öncelik | Segment | Neden |
|---|---|---|
| 1 | Çiftler 30–55 | Ödeme isteği + kolay planlama |
| 1 | Çocuklu aileler | Problem büyük, destek değerli |
| 1 | Norveç → Türkiye/Avrupa seyahatleri | Başlangıç nişi oluşturur |
| 2 | 55+ gezginler | İnsan desteğine daha fazla değer verebilir |
| 2 | Premium gezgin | Yüksek sepet |
| 3 | Solo traveller | Güven önemli ancak fiyat hassasiyeti olabilir |
| Şimdilik değil | Business travel | Ayrı ürün ve operasyon gerekir |
| Şimdilik değil | Global tüm turistler | Fazla geniş |

**İlk ideal müşteri (örnek profil):** Oslo'da yaşayan bir çift, İstanbul'a
5 gün gidecek, 15–30 bin NOK bütçesi var ve araştırmaya saatler harcamak
istemiyor.

## 4. Rakip analizi

Rakipler çok güçlü; NAVIAR'ın "başka bir Booking" olması sürdürülebilir
değil.

| Rakip | Gücü | NAVIAR'ın saldıracağı boşluk |
|---|---|---|
| Booking.com | Dev konaklama envanteri | Kişisel plan + concierge |
| Tripadvisor | Reviews + AI planning | Uygulamalı seyahat desteği |
| Viator | Aktivite pazaryeri | Tüm seyahat yolculuğu |
| GetYourGuide | Deneyim/aktivite | Kişiselleştirilmiş plan |
| Expedia | Full booking ecosystem | İnsan dokunuşu |
| ChatGPT | Güçlü ücretsiz planlama | Gerçek partner/concierge katmanı |
| Google | Arama | Karar verme kolaylığı |
| Travel agent | İnsan desteği | Daha dijital ve düşük maliyetli model |

Booking.com'un affiliate programı milyonlarca konaklama seçeneği yanında
ulaşım ve aktiviteleri de kapsıyor. Tripadvisor'ın AI tabanlı seyahat
planlayıcısı var ve artık ChatGPT içinde de seyahat önerileri sunabiliyor.

Sonuç: **AI itinerary tek başına rekabet avantajı değildir.** NAVIAR'ın
avantajı AI + kürasyon + yerel bilgi + insan desteği + güven olmalıdır.

## 5. Değer önerisi

Önerilen ana slogan: **"Plan less. Travel better."**

Alt mesaj: NAVIAR seyahatini senin için planlar, güvenilir seçenekleri bulur
ve yolculuk boyunca yanında olur.

Üç temel vaat:

1. **SAVE TIME** — saatlerce araştırma yapma.
2. **TRAVEL WITH CONFIDENCE** — doğrulanmış ve seçilmiş seçeneklerden yararlan.
3. **GET HELP WHEN YOU NEED IT** — seyahatte sorun yaşadığında yalnız kalma.

## 6. Business Model Canvas

| Alan | NAVIAR TURIST |
|---|---|
| Müşteri segmentleri | Çiftler, aileler, 55+, premium gezginler |
| Değer önerisi | Kişisel seyahat planı + güvenilir öneri + seyahat desteği |
| Kanallar | SEO, Google, Instagram, TikTok, içerik, referrals |
| Müşteri ilişkileri | AI + WhatsApp/chat + insan travel concierge |
| Gelir | Planning fee, concierge, affiliate, partner commission |
| Temel faaliyetler | Seyahat planlama, içerik, partner seçme, destek |
| Temel kaynaklar | Marka, web platformu, AI, partner ağı, destination data |
| Temel ortaklar | Booking platformları, Viator, oteller, aktiviteler, transfer |
| Maliyetler | Yazılım, AI, ödeme, pazarlama, müşteri desteği |

## 7. Gelir modeli

Başlangıçta abonelik ana gelir modeli değil — insanlar her ay seyahat
etmiyor. Daha iyi model: **Transaction + Service + Affiliate**.

Önerilen MVP fiyatlandırması (test fiyatları, piyasa fiyatı iddiası değil):

| Ürün | Fiyat testi |
|---|---|
| NAVIAR Discover | Ücretsiz |
| Quick Trip Plan | 299 NOK |
| Smart Trip Plan | 599 NOK |
| Family Trip Plan | 899 NOK |
| Premium Personal Plan | 1.490 NOK |
| Trip Concierge | 990–1.990 NOK / seyahat |
| Emergency/priority support | Premium pakete dahil |

## 8. Affiliate geliri

Gerçek gelir potansiyeli burada. Örneğin Viator'ın affiliate programı
tamamlanan aktivitelerde %8 komisyon açıklıyor, cookie süresi 30 gün;
platform 300.000'den fazla deneyime erişim sunduğunu belirtiyor.

Örnek: müşteri 1.500 NOK değerinde aktivite alırsa, %8 ≈ **120 NOK** NAVIAR
geliri.

Kritik ders: **affiliate tek başına yeterli değil**, çünkü yüksek trafik
gerektirir. Bu nedenle planning fee + affiliate birlikte çalışmalı.

## 9. Önerilen gelir mimarisi (uzun vade)

| Gelir | Hedef pay |
|---|---|
| Personal travel planning | %30 |
| Concierge | %25 |
| Affiliate | %25 |
| Direct B2B partner commissions | %15 |
| Premium/add-ons | %5 |

İlk yılda bu dağılımın tam gerçekleşmesi beklenmiyor. İlk hedef: müşterinin
seyahat planı için para ödemeye hazır olup olmadığını kanıtlamak.

## 10. Hukuki karar — kritik

NAVIAR ilk aşamada kendi adına uçuş + otel + aktivite paketi satmaya
başlamamalı.

Norveç'teki *pakkereiseloven* kapsamında paket seyahat organizatörleri
reisegaranti yükümlülüğüne tabi; belirli "linked travel arrangement"
modellerinde ödeme alan aracı için de yükümlülük doğabilir. Ayrıca gerekli
garanti olmadan paket seyahatin pazarlanmasına ilişkin kısıtlamalar var.

Bu nedenle MVP tasarımı:

- NAVIAR → yalnızca **planlama hizmetini** satar
- Otel/uçak/aktivite → müşterinin **partner sağlayıcıyla yaptığı ayrı
  rezervasyon**

> Bu yapı dahi piyasaya çıkmadan önce Norveç'te seyahat hukuku bakımından
> kontrol edilmelidir; sadece ödeme akışını ayırmak otomatik hukuki muafiyet
> anlamına gelmez.

## 11. NAVIAR MVP — web sitesi (7 bölüm)

1. **Hero** — "Nereye gitmek istediğini söyle. Seyahatini biz planlayalım."
2. **Trip Builder** — destination, date, people, budget, interests
3. **AI Recommendation** — ücretsiz ön öneri
4. **Personal Travel Plan** — ücretli ürün
5. **Experiences** — affiliate aktiviteler
6. **Concierge** — yolculuk desteği
7. **Checkout** — sadece NAVIAR hizmetleri

## 12. Trip Builder kullanıcı akışı

```
NAVIAR
  ↓
Where do you want to go?
  ↓
When?
  ↓
Who is travelling?
  ↓
Budget?
  ↓
What do you like?
  ↓
FREE TRIP PREVIEW
  ↓
Get Full NAVIAR Plan (599 NOK)
  ↓
Personal Itinerary
  ↓
Hotel / Activities / Transfer
  ↓
Partner bookings
  ↓
NAVIAR Concierge
```

Bu akış ilk gerçek satış makinesi olabilir.

## 13. İlk 90 günlük MVP planı

| Dönem | Yapılacak | Amaç |
|---|---|---|
| Gün 1–15 | Landing page | Talebi test et |
| 1–15 | Trip questionnaire | Lead topla |
| 1–15 | 3 plan paketi | Fiyat testi |
| 15–30 | Manuel itinerary üret | Teknoloji yatırımı yapma |
| 15–30 | Affiliate partnerler | İlk ek gelir |
| 30–45 | İlk 10 müşteri | Problem doğrulaması |
| 45–60 | Review/referral sistemi | Güven oluştur |
| 60–75 | Concierge pilotu | Premium gelir testi |
| 75–90 | Otomasyon | Manuel işi azalt |

**Kritik prensip:** ilk 100 seyahatin AI platformu tarafından tamamen
otomatik üretilmesi istenmiyor. İlk başta AI + manuel kontrol kullanılacak,
çünkü önce müşterinin gerçekten ne istediğini öğrenmek gerekiyor.

## 14. İlk 90 gün hedefi

İlk hedef 10.000 kullanıcı değil. **Başarı kriteri: 30 ücretli seyahat
planı.**

Örnek: ortalama 700 NOK × 30 müşteri = 21.000 NOK planning geliri. Buna
concierge ve affiliate gelirleri eklenir.

21.000 NOK büyük bir şirket kurmaz, ama önemli bir şeyi kanıtlar:
**"İnsanlar NAVIAR'a gerçekten para ödüyor."**

## 15. Müşteri kazanma kanalları (öncelik sırası)

| # | Kanal | Maliyet |
|---|---|---|
| 1 | SEO destination pages | Düşük |
| 2 | TikTok/Reels | Düşük |
| 3 | Referral | Çok düşük |
| 4 | Facebook travel groups | Düşük |
| 5 | Diaspora/community partnerships | Düşük |
| 6 | Hotel/activity partners | Performans bazlı |
| 7 | Micro-influencers | Düşük/orta |
| 8 | Google Ads | Orta/yüksek |
| 9 | Meta Ads | Orta |

İlk gün Google Ads'e büyük bütçe harcanmayacak.

## 16. İçerik motoru

```
"Oslo'dan İstanbul'a 5 günlük gezi"
  ↓
Google
  ↓
NAVIAR guide
  ↓
Ücretsiz itinerary
  ↓
Email / account
  ↓
599 NOK personal plan
  ↓
Activity booking
  ↓
Concierge
```

Dönüşüm zinciri: **CONTENT → LEAD → PLAN → BOOKING → SUPPORT → REPEAT**.
Bu, NAVIAR'ın büyüme motoru olabilir.

## 17. En riskli varsayımlar

| Varsayım | Risk |
|---|---|
| İnsanlar itinerary için ödeme yapar | Yüksek |
| AI planlama farklılaşma yaratır | Çok yüksek |
| Affiliate ciddi gelir getirir | Yüksek |
| İnsanlar NAVIAR'a güvenecek | Yüksek |
| Concierge ölçeklenebilir | Orta-yüksek |
| İnsanlar platforma tekrar gelir | Orta |
| Partner bulmak kolay olur | Orta |
| SEO trafik getirir | Zaman alır |

En tehlikeli soru: **"İnsanlar ücretsiz ChatGPT varken neden 599 NOK
ödesin?"**

NAVIAR'ın cevabı net olmalı: ChatGPT sana fikir verir. NAVIAR seyahatini
organize eder ve yolculukta yanında olur.

## 18. Hızlı deneyler

**TEST 01 — Ödeme isteği:** Landing page "Personal Istanbul Plan – 599 NOK",
100–300 nitelikli ziyaretçi. Hedef: ≥%2 satın alma veya güçlü checkout
intent.

**TEST 02 — Fiyat:** A/B test 299 / 599 / 899 NOK. Amaç: en ucuzu değil, en
yüksek toplam geliri üreten fiyatı bulmak.

**TEST 03 — Concierge:** Plan satın alanlara "1.490 NOK karşılığında
seyahat boyunca NAVIAR desteği ister misiniz?" Hedef: %10+ attach rate
başlangıç için umut verici sinyal.

**TEST 04 — Destination:** Aynı ürün İstanbul / Barcelona / Rome —
hangisi daha fazla dönüşüyor? Kazanan destinasyon ilk dikey olur.

**TEST 05 — İnsan mı AI mı?** A: AI itinerary. B: AI + NAVIAR Travel Expert
reviewed. B seçeneği anlamlı biçimde daha yüksek conversion üretirse
NAVIAR'ın insan katmanı doğrulanır.

## 19. İlk finansal model (çalışma senaryosu, yatırımcı tahmini değil)

Örnek 12 aylık MVP senaryosu:

- 400 ücretli plan × ortalama 799 NOK = 319.600 NOK
- 80 concierge × 1.490 NOK = 119.200 NOK
- 1.000 aktivite rezervasyonu × ortalama 1.200 NOK × %8 örnek Viator
  komisyonu = 96.000 NOK
- **Toplam örnek brüt gelir ≈ 534.800 NOK**

Bu rakam garanti değildir. Test edilen soru: bir kişi/çok küçük ekip NAVIAR
TURIST'i 500K+ NOK yıllık gelir seviyesine getirebilir mi?

## 20. 12 aylık yol haritası

**Ay 1–3 — VALIDATE:** landing page, Trip Builder, manual itinerary,
payment, affiliate. Hedef: 30 ödeme yapan müşteri.

**Ay 4–6 — PRODUCTIZE:** AI itinerary engine, user accounts, saved trips,
partner database, reviews, referral. Hedef: 100 toplam ücretli müşteri.

**Ay 7–9 — SCALE:** 10+ destination, SEO engine, concierge workflow,
creator partnerships. Hedef: 30–50 yeni ücretli müşteri/ay.

**Ay 10–12 — PLATFORM:** dynamic itinerary, partner dashboard,
personalization, mobile/PWA, repeat customer engine. Hedef: 60+ yeni
ücretli müşteri/ay.

## 21. Ana KPI'lar

North Star: **Completed NAVIAR Trips.**

| KPI | Başlangıç hedefi |
|---|---|
| Visitor → lead | >%5 |
| Lead → paid | >%10 |
| Website → paid | %1–3 |
| Ortalama plan geliri | >600 NOK |
| Concierge attach | >%10 |
| Affiliate attach | >%20 |
| Refund | <%5 |
| Organik CAC | <150 NOK |
| Customer rating | >4,5/5 |
| Referral share | >%15 |
| Gross margin planning | >%70 |

Bunlar yönetim hedefleridir; gerçek veriler geldikçe güncellenmeli.

## 22. Uzun vadeli mimari

```
NAVIAR Travel Planner
  ↓
NAVIAR Concierge
  ↓
NAVIAR Marketplace
  ↓
NAVIAR Partner Network
  ↓
NAVIAR Travel OS
```

Nihai aşamada Discover + Plan + Book + Experience + Assist aynı hesap
altında birleşir.

## 23. Ne yapılmamalı

İlk yıl özellikle engellenecek hatalar:

- 100 ülkeyle başlamak
- Kendi hotel booking engine'ini geliştirmek
- Mobil uygulamayla başlamak
- Binlerce turu manuel sisteme eklemek
- Affiliate gelirine güvenmek
- "AI travel planner"ı tek USP yapmak
- Büyük ekip kurmak
- Yüksek reklam bütçesi yakmak
- Hukuki yapıyı çözmeden paket tur satmak

Bunun yerine: **bir destinasyon + bir müşteri tipi + bir problem + bir
ücretli ürün.**

## Şimdi yapılacak en önemli 5 adım

| # | İş | Neden |
|---|---|---|
| 1 | NAVIAR'ın ilk nişini seç: örn. Norway → Istanbul | Genel platform riskini ortadan kaldırır |
| 2 | 599 NOK Smart Trip Plan ürününü oluştur | Gerçek ödeme isteğini ölçer |
| 3 | NAVIAR Trip Builder landing page'i kur | Satış hunisinin başlangıcı |
| 4 | İlk 10 planı manuel + AI üret | Müşteri davranışını öğrenir |
| 5 | 30 ücretli müşteri olmadan büyük platform geliştirme | Gereksiz teknoloji maliyetini engeller |

## NAVIAR TURIST v1.0 — önerilen model

```
Ücretsiz seyahat keşfi
  → 599 NOK kişisel seyahat planı
  → affiliate rezervasyonlar
  → 1.490 NOK concierge
  → review + referral
  → aynı müşterinin sonraki seyahati
```

Bu model, önce "platform kurup müşteri beklemek" yerine **"müşteriden para
kazanıp platformu kanıtlanmış davranışların üzerine kurmak"** yaklaşımını
kullanıyor. NAVIAR TURIST için şu anda en kritik ürün booking engine değil;
ücretli Trip Builder + kişisel itinerary + concierge MVP'sidir.

---

*Not: Bu belge düzenli olarak KPI ve ilk müşteri hedeflerine karşı kontrol
edilebilir; sonraki oturumlarda güncellemeler bu dosyaya işlenmelidir.*
