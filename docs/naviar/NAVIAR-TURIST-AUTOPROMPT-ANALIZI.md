# NAVIAR TURIST — Eleştirel İş Modeli Analizi (/AUTOPROMPT)

Tarih: 27 Ağustos 2026 · Girdi: `docs/naviar/NAVIAR-TURIST-IS-MODELI.md`
(25.08.2026, kullanıcının kendi hazırladığı ilk analiz) + kullanıcının
gönderdiği genel /AUTOPROMPT şablonu.

Bu belge o ilk analizi tekrar anlatmaz — onu **sınar**. Her bölümde önce
mevcut plan ne diyor, sonra bunun neden yetersiz/riskli/test edilmemiş
olduğu, sonra ne yapılması gerektiği yazılır. Rakam kaynağı gösterilmeyen
hiçbir iddia burada kesinmiş gibi tekrarlanmaz.

> **Varsayım kaydı:** Marka adı = NAVIAR TURIST, pazar = Norveç → Türkiye/
> Avrupa outbound, hedef kitle = çiftler 30–55 ve çocuklu aileler, mevcut
> kaynak = "bir kişi/çok küçük ekip, düşük bütçe" (ilk belgede açık yazılı),
> öncelikli hedef = ilk 90 günde gerçek müşteriden ödeme doğrulamak. Bunların
> hiçbiri bu oturumda yeniden doğrulanmadı; ilk belgeden aynen devralındı.

---

## 1. İş fikrinin tek cümlesi

**Mevcut:** "NAVIAR TURIST, Norveç'teki gezginlere kişiselleştirilmiş seyahat
planı, doğrulanmış rezervasyon önerileri ve seyahat sırasında insan + AI
destekli concierge hizmeti satan dijital seyahat asistanıdır."

**Sorun:** Cümle üç farklı ürünü ("plan", "öneri", "concierge") tek cümlede
topluyor — bu netlik değil, kapsam genişliği. İlk 90 gün için satılan **tek**
şey nedir? § 7 ve § 11'e bakıldığında asıl satılan şey **Smart Trip Plan
(599 NOK)**; concierge ve affiliate bu ürünün üzerine binen ek katmanlar.

**Daraltılmış hâli (önerilen):** *"NAVIAR, Norveç'ten Türkiye'ye giden çift
ve ailelere 599 NOK karşılığında kişisel bir 5 günlük seyahat planı satar."*
Bu cümle test edilebilir — "insanlar 599 NOK'a itinerary alır mı?" sorusuna
indirger. Geniş cümle test edilemez.

## 2. Müşteri problemleri ve satın alma nedeni

Mevcut § 2 tablosu (9 problem/çözüm satırı) doğru gözlem düzeyinde ama
**önceliksiz** — dokuz problem eşit ağırlıkta sunulmuş. AUTOPROMPT kuralı
"satın alma nedenini belirle" diyor, dokuz nedeni sıralamak değil.

| Sıra | Problem | Neden #1 aday | Kanıt durumu |
|---|---|---|---|
| 1 | Seyahat planlamak zaman alıyor | Zaman, parası olan/olmayan herkeste kısıtlı — çift/aile segmentinde en evrensel motivasyon | [H] test edilmedi |
| 2 | Aile için uygun plan bulmak zor | Aile segmentinde spesifik acı — tek kişilik "genel" tavsiye işe yaramıyor | [H] test edilmedi |
| 3 | Turistik tuzaklardan korkuyor | Güven eksikliği, ama bunu ChatGPT de kısmen çözüyor — farklılaştırıcı değil | [D] zayıf |

**Eksik olan:** hangi problemin **ödeme tetikleyicisi** olduğuna dair hiçbir
kanıt yok — hepsi varsayım. § 18 TEST 01 bunu test etmeyi öneriyor ama bu
30. maddeye kadar hiç doğrulanmamış bir öncül üzerine 20 sayfalık plan
kuruluyor. **Doğru sıra tersine çevrilmeli: önce TEST 01, sonra geri kalan
her şey.**

## 3. Hedef müşteri önceliklendirmesi

Mevcut önceliklendirme (çiftler 30–55, aileler, Norveç→Türkiye) niş olarak
doğru — CLAUDE.md'nin kendi "önce sadelik" ilkesiyle de tutarlı: geniş
segment yerine dar segment. Buraya itiraz yok.

**Eksik olan tek şey:** aile ve çift segmentleri **aynı ürünü** mü alacak?
Family Trip Plan (899 NOK) ile Smart Trip Plan (599 NOK) arasındaki fark
yalnız fiyatta — ürün, itinerary mantığı, concierge kapsamı ayrı
tanımlanmamış. İki segment + tek ürün karışımı, MVP'de hangi itinerary
şablonunun önce yazılacağını belirsiz bırakıyor.

## 4. Rakip analizi — eksik rakip sınıfı

Mevcut § 4 sekiz rakip listeliyor (Booking, Tripadvisor, Viator, GetYourGuide,
Expedia, ChatGPT, Google, travel agent). **Eksik olan üç sınıf:**

| Eksik rakip sınıfı | Neden önemli |
|---|---|
| Norveççe/İskandinav niş seyahat blogları ve Facebook grupları | § 15'te "Facebook travel groups" kanal olarak listelenmiş ama bu gruplar aynı zamanda ücretsiz tavsiye kaynağı — NAVIAR'ın müşterisini çalan da onlar |
| TikTok/Instagram "trip planner" hesapları (yaratıcı ekonomisi) | Genç-orta yaş segmentin gerçek alışkanlığı; ücretsiz itinerary paylaşan mikro-influencer'lar doğrudan ikame |
| Kurumsal Norveç seyahat acenteleri (Ving, Apollo, Star Tour) | "Travel agent" tek satırla geçiştirilmiş ama bunlar paket-tur + garanti sunan, hukuken NAVIAR'ın MVP'de kaçındığı tam o yapıya sahip kurulu oyuncular — fiyat karşılaştırması yapılmadı |

En büyük gözden kaçan risk: **Viator aynı zamanda ortak.** NAVIAR affiliate
geliri için Viator'a bağımlı (§ 8) ama Viator'ın kendi AI planlayıcısı da
var (§ 4). Ortağın rakip olması riski belgede hiç adlandırılmamış.

## 5. Değer önerisi — test edilmemiş slogan

"Plan less. Travel better." iddialı ama İngilizce — hedef kitle Norveççe
konuşan bir pazar. Norveççe/Türkçe karşılık üretilmemiş, A/B test edilmemiş.
Üç vaat (Save Time / Confidence / Help) jenerik; Booking ve Tripadvisor da
aynı üç vaadi kullanıyor (bkz. onların kendi ana sayfaları). **Fark
yaratmayan bir değer önerisi, § 17'deki en riskli varsayımı
("İnsanlar neden 599 NOK ödesin?") çözmüyor — aynı soruyu tekrar açıyor.**

## 6. Business Model Canvas — değişiklik yok, ama bir hücre çelişkili

Mevcut canvas (§ 6) yapısal olarak sağlam. Tek çelişki: "Temel ortaklar"
hücresinde Booking ve Viator var, ama "Rakipler" (§ 4) tablosunda aynı iki
şirket rakip olarak listelenmiş. Bu çelişki yanlış değil (ortak-rakip aynı
anda olabilir, "coopetition" yaygın) ama belge bunu **hiç tartışmıyor** —
Viator'ın komisyon şartlarını istediği zaman değiştirebileceği veya NAVIAR'ı
öncelik dışı bırakabileceği bağımlılık riski eksik.

## 7. Gelir modeli ve fiyatlandırma — dayanaksız yüzdeler

Mevcut § 9 gelir mimarisi (Planning %30 / Concierge %25 / Affiliate %25 /
B2B %15 / Premium %5) **hiçbir hesaba dayanmıyor** — beş sayı toplamı 100
olacak şekilde seçilmiş görünüyor, gerekçe yok.

Fiyat testleri (§ 7, 299/599/899/1.490 NOK) mantıklı bir aralık ama
**referans noktası verilmemiş**: bir Norveçli travel agent'ın 5 günlük
İstanbul planı için ne kadar aldığı, ya da bir freelance seyahat
danışmanının saatlik ücreti gibi bir karşılaştırma yok. 599 NOK'un "doğru"
göründüğü tek kaynak, kullanıcının kendi sezgisi.

**Öneri:** Fiyat testinden önce üç karşılaştırma noktası toplanmalı (rakip
paket-tur fiyatı, freelance danışman ücreti, ChatGPT Plus aylık ücreti/30 —
günlük eşdeğeri). Bu üçü olmadan 299 vs 599 vs 899 testi kör atış olur.

## 8. İlk 90 gün planı — sıralama hatası

Mevcut § 13 planı Gün 1–15'te "3 plan paketi" oluşturmayı, Gün 30–45'te
"ilk 10 müşteri"yi hedefliyor. **Ama § 18 TEST 01 (ödeme isteği testi)
tarihsiz** — plana hiç yerleştirilmemiş. En riskli varsayım (§ 17'nin
kendi ifadesiyle "🔴 Çok yüksek") test edilmeden üç paket, landing page ve
trip questionnaire'e 15 gün harcanıyor.

**Düzeltilmiş sıra:**

| Gün | Mevcut planda | Önerilen değişiklik |
|---|---|---|
| 1–7 | Landing page + questionnaire + 3 paket | Yalnız TEST 01: tek sayfa, tek fiyat (599 NOK), 100–300 ziyaretçi |
| 8–14 | (yok) | TEST 01 sonucu ≥%2 değilse dur, fiyatı/mesajı değiştir, tekrar test et — 3 paket bu sonuca göre kurulur |
| 15–30 | Manuel itinerary + affiliate partner | değişmedi, ama artık doğrulanmış bir fiyat üzerine kurulu |

Mevcut planın geri kalanı (30–90 gün) doğrulama sonrasına ertelenmeli;
şu anki hâliyle doğrulanmamış bir varsayım üzerine 90 günlük yürütme
inşa ediyor.

## 9. Müşteri kazanma kanalları — CAC hedefiyle çelişki

Mevcut § 15 sıralaması (SEO > TikTok > Referral > Facebook grupları >
diaspora > partner > influencer > Google Ads > Meta Ads) mantıklı ama
§ 21'deki "Organik CAC <150 NOK" hedefiyle **hiç bağlanmamış**. SEO'nun
sonuç vermesi aylar sürer (bkz. QBLOGG'un kendi CLAUDE.md'sindeki SEO
gerçekçiliği); 90 günlük MVP'de SEO'dan gelen trafik pratikte sıfıra
yakındır. İlk 30 müşteri hedefi (§ 14) gerçekte **kanal 3 (referral) ve
kanal 4 (Facebook grupları)**'ndan gelecek — ama bunlar listede SEO'nun
altında.

**Kanal öncelik + kanal tipi çapraz tablosu (eksik, eklenmesi gereken):**

| Kanal | Tip (organik/satış/ortaklık/reklam) | 90 günde gerçekçi mi? |
|---|---|---|
| SEO destination pages | Organik | Hayır — sonuç 6+ ay |
| TikTok/Reels | Organik | Kısmen — içerik üretim hızına bağlı |
| Referral | Organik | Hayır — önce ödeyen müşteri lazım (soğuk başlangıç) |
| Facebook travel groups | Organik/topluluk | **Evet** — en hızlı, en ucuz ilk 10 müşteri kaynağı |
| Diaspora/community partnerships | Ortaklık | Evet, ama partner bulmak zaman alır |
| Hotel/activity partners | Ortaklık | Hayır — 90 günde partner sözleşmesi kurmak yavaş |
| Google/Meta Ads | Reklam | Evet ama bütçeyle sınırlı; "büyük bütçe yakma" yasağıyla (§ 23) çelişir |

Sonuç: **90 günlük plan asıl kanalı (Facebook grupları) yeterince
vurgulamıyor**, SEO'yu gereğinden fazla öne çıkarıyor.

## 10. Riskler — belgenin kendi listesi eksik, iki risk hiç yok

Mevcut § 17 sekiz varsayım listeliyor ve en riski doğru teşhis ediyor
("İnsanlar ücretsiz ChatGPT varken neden ödesin?"). **Ama iki risk sınıfı
belgede hiç yok:**

1. **Mevsimsellik.** Norveç'ten Türkiye/Avrupa'ya seyahat talebi yıl
   içinde düz değil (yaz + kış tatili yoğun, sonbahar/ilkbahar zayıf).
   90 günlük MVP hangi ayda başlıyor — bu, ilk 30 müşteri hedefinin
   gerçekçiliğini doğrudan belirler ama plan tarih vermiyor.
2. **Concierge operasyonel kapasitesi.** "1.490 NOK karşılığında seyahat
   boyunca destek" (§ 18 TEST 03) kimin tarafından, hangi saatlerde
   veriliyor? Bir kişilik ekip + gece saati Türkiye-Norveç saat farkı +
   birden fazla eşzamanlı müşteri = operasyonel olarak tanımsız. Bu,
   "concierge ölçeklenebilir mi" (§ 17'de zaten "Orta-yüksek risk" diye
   işaretli) sorusunun **cevabı** olması gereken kısım, ama plan bu soruyu
   sormakla yetinip cevaplamıyor.

## 11. Hızlı deneyler — sıra ve eksik ölçüt

Mevcut § 18'deki beş test (ödeme isteği, fiyat, concierge, destinasyon,
insan-mı-AI-mı) doğru testler ama **paralel değil sıralı olmalı**: TEST 02
(fiyat) ve TEST 04 (destinasyon), TEST 01 (ödeme isteği) pozitif çıkmadan
anlamsız — negatif bir "ödeme isteği yok" sonucunda fiyat/destinasyon
farkı test etmenin bir önemi kalmaz.

Eksik olan: her testin **durdurma eşiği** yok. "≥%2 satın alma" hedefi var
ama %1 çıkarsa ne olacak — model değişir mi, pes mi edilir, mesaj mı
değişir? AUTOPROMPT'un kendi kuralı ("gerekirse iş modelini tamamen
değiştir") burada uygulanmamış; testin başarısızlık dalı tanımsız.

## 12. 12 aylık yol haritası ve KPI — kapasite/hedef uyumsuzluğu

Mevcut § 20 planı Ay 4–6'da "AI itinerary engine" + "user accounts" +
"partner database" + "reviews" + "referral" istiyor — beş ayrı yapım kalemi,
"bir kişi/çok küçük ekip" varsayımıyla (§ önsöz) çelişiyor. Ay 1–3'te
manuel itinerary üretmek doğru bir MVP kararıyken, Ay 4–6'nın kapsamı
aniden bir 3-4 kişilik mühendislik ekibinin işine dönüşüyor.

KPI tablosu (§ 21) da aynı sorunu taşıyor: "SEO trafik >%5 visitor→lead"
gibi hedefler, § 9'da "SEO sonuç vermesi zaman alır" diye zaten kabul edilen
gerçekle çelişiyor.

**Öneri:** Ay 4–6 hedefi tek kaleme indirilmeli — "AI itinerary engine"
YA DA "partner database", ikisi birden değil; hangisi seçilirse KPI de ona
göre daraltılmalı.

## 13. Şimdi yapılacak en önemli 5 adım (revize)

Mevcut listeyle (§ "Şimdi Yapılacak En Önemli 5 Adım") büyük ölçüde aynı
fikirde — sıra değişti, iki madde somutlaştırıldı:

| # | İş | Değişiklik gerekçesi |
|---|---|---|
| 1 | Tek sayfa + tek fiyat (599 NOK) ile TEST 01'i **90 günlük plandan önce, izole** çalıştır | § 8'in düzeltmesi — en riskli varsayım en başa alınmalı |
| 2 | Üç referans fiyat noktası topla (rakip paket-tur, freelance danışman, ChatGPT Plus/gün) | § 7'nin düzeltmesi — fiyat testi referanssız kör |
| 3 | Facebook seyahat gruplarını (Norveç-Türkiye diasporası dahil) ilk kanal olarak çalıştır, SEO'yu 90 günden çıkar | § 9'un düzeltmesi |
| 4 | Concierge'in operasyonel modelini yaz (kim, hangi saat, kaç eşzamanlı müşteri) — TEST 03'ten önce | § 10'un düzeltmesi |
| 5 | MVP başlangıç ayını sabitle, mevsimsellik etkisini 90 günlük hedefe göre ayarla | § 10'un düzeltmesi |

---

## Genel değerlendirme

İlk belge (`NAVIAR-TURIST-IS-MODELI.md`) bir iş fikrini olgunlaştırma
egzersizi olarak sağlam: segment daraltma, hukuki uyarı, "OTA olmayacağız"
sınırı hep doğru refleksler. Ama belge **kendi riskli varsayımlarını
doğru adlandırıp sonra onları test etmeden yürütme planına geçiyor** —
90 günlük takvim, fiyatlandırma ve kanal sıralaması hep TEST 01'in
sonucunu önceden varsaymış gibi yazılmış. Bu analizin tek net önerisi:
**plandaki her şeyi durdurup önce TEST 01'i, izole ve ucuz biçimde
çalıştırın; geri kalan 12 bölüm o sonuca göre yeniden sıralanır.**
