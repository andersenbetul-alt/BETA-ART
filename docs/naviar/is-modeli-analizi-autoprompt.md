# NAVIAR — İş modeli eleştirel analizi (AUTOPROMPT şablonu)

**Durum: TASLAK — analiz, karar değil.** Tarih: 26.08.2026.
İşaretler: [V] doğrulanmış (bu oturumda arandı) · [H] hipotez · [D] genel iş bilgisi (arama gerektirmeyen).

**Kapsam notu:** Kullanıcı, AUTOPROMPT şablonunun boş alanlarını doldurmak yerine
konuyu doğrudan **NAVIAR'ın bireysel + kamu sektörü fikrine** uygulamamı istedi
(bkz. `docs/naviar/is-modeli.md`). Şablonun altı girdi alanından üçü (pazar/ülke,
kaynaklar, öncelikli hedef) kullanıcı tarafından hiç belirtilmedi — bunlar
**varsayım** olarak işaretlenip aşağıda açıkça listelendi. Şablonun kendi kuralı
("varsayımları açıkça belirt") burada tam olarak bunu gerektiriyor.

## Varsayımlar (doğrulanmadı, kullanıcı onayı gerekir)

| Alan | Varsayım | Gerekçe |
|---|---|---|
| Pazar/ülke | Norveç (ilk pazar) | NAVIAR'ın tescil taraması Norveç+AB bağlamında yapıldı; kullanıcının diğer işi (QBLOGG) Norveç merkezli |
| Mevcut ürün/hizmet | Yok — konsept aşaması | `is-modeli.md` §5: "hiçbir marka varlığı, sayfa veya kod üretilmedi" |
| Kaynaklar | Tek kişi, düşük bütçe, teknik altyapı yok, kurumsal ağ bilinmiyor | Depoda ekip/bütçe bilgisi yok; QBLOGG deneyiminden örüntü |
| Öncelikli hedef | İlk ücretli müşteri / doğrulanmış MVP | Belirtilmedi; en düşük riskli varsayılan hedef |

Bu dört varsayımdan **herhangi biri yanlışsa aşağıdaki plan değişir** — özellikle
bütçe/ekip varsayımı (bkz. §8, §12).

---

## 1. İş fikri — tek cümle

> NAVIAR, bireylerin (özellikle bürokratik bir ihtiyacı olan) doğru hizmet
> sağlayıcısını bulmasını, süreci uçtan uca koordine etmesini ve kalitesini
> takip etmesini sağlayan ücretli bir yönlendirme + koordinasyon hizmetidir.

## 2. Müşterinin gerçek problemi

| Problem | Somut belirti | Satın alma nedeni |
|---|---|---|
| Hangi kuruma/hizmete başvuracağını bilmemek | Yanlış kapıda saatler kaybetme, "sizi X'e yönlendiriyoruz" pinpon'u | Zaman tasarrufu |
| Form/süreç karmaşıklığı | Eksik/yanlış başvuru, ret, yeniden başlama | Hata riskinin azalması |
| Dil/sistem bariyeri (göçmen, yeni gelen) | Resmi dili anlamama, dijital sistemi kullanamama | Erişilebilirlik |
| Duygusal yalnızlık (kriz anı: işsizlik, hastalık, boşanma) | "Bu işi tek başıma yapamıyorum" hissi | Güvence, sorumluluk paylaşımı |

## 3. Hedef müşteri segmentleri — önceliklendirme

| Segment | Acı yoğunluğu | Ödeme gücü | Ulaşılabilirlik | Öncelik |
|---|---|---|---|---|
| Yeni göçmen / expat bireyler | Yüksek | Orta | Orta (topluluk kanalları var) | **1 — başlangıç** |
| KOBİ sahipleri (kamu teşvik/izin/hibe süreçleri) | Orta | Yüksek | Yüksek (QBLOGG'un mevcut kitlesiyle örtüşüyor [H]) | **2 — hızlı takip** |
| Kriz anındaki bireyler (işsiz, hasta, boşanmış) | Çok yüksek | Düşük | Düşük (bulmak zor, ödeme direnci yüksek) | 3 — sosyal etki, gelir değil |
| Yaşlılar / düşük dijital okuryazarlık | Yüksek | Düşük–orta | Düşük (dijital kanaldan ulaşmak zor) | 4 — ikinci dalga |
| Belediyeler / kamu kurumları (B2G) | — (kurumsal ihtiyaç: vatandaş yükünü azaltma) | Yüksek | Düşük (uzun satış döngüsü, ihale) | 5 — 12 ay sonrası |

**Öneri:** MVP'yi **KOBİ sahipleri** üzerinden başlatın, göçmen bireyleri
ikinci dalgada ekleyin. Gerekçe: KOBİ segmenti hem ödeme gücü hem QBLOGG'un
zaten sahip olduğu kitleyle örtüşme taşıyor [H] — sıfırdan kitle bulma
maliyeti yok. Bireysel/kamu sektörü segmenti (kullanıcının orijinal fikri)
ikinci aşamaya kayıyor çünkü §4'teki bulgu bu segmenti riskli kılıyor.

## 4. Rakipler ve alternatif çözümler

| Alternatif | Ne sunuyor | NAVIAR'a karşı avantajı | NAVIAR'ın farkı |
|---|---|---|---|
| **Norge.no, MinSide, Altinn** [V] | Devletin resmi dijital hizmet rehberi ve tek-giriş portalı — **ücretsiz** | Resmi güven + sıfır maliyet | Aktif koordinasyon yok, formu sizin yerinize doldurmuyor, sorumluluk almıyor |
| Avukat / muhasebeci / göçmenlik danışmanı | Dar kapsamlı, uzman, ücretli | Hukuki sorumluluk taşıyor | Yalnız kendi alanına bakıyor, "hangi hizmete gideyim" genel sorusunu cevaplamıyor |
| STK / gönüllü rehberlik hatları | Ücretsiz, insan odaklı | Maliyet | Kapasite kısıtlı, SLA/kalite garantisi yok |
| Kurumsal concierge hizmetleri | Premium, kişiselleştirilmiş | Marka güveni (varsa) | Kamu sektörü/bürokrasi odaklı değil, pahalı |

**Kritik bulgu [V]:** Norveç'te vatandaşın "hangi kamu hizmetine gitmeli"
sorusuna cevap veren, devlet tarafından işletilen, **ücretsiz** ve resmi
güvene sahip kanallar zaten var (Norge.no, MinSide, Altinn). Bu, kullanıcının
orijinal fikrinin (bireyi kamu hizmetine yönlendirme) en zayıf noktası:
**bir vatandaş, devletin zaten ücretsiz sunduğu bir şey için neden özel bir
şirkete ödeme yapsın?** Bu soru cevaplanmadan bu segment üzerine gelir modeli
kurulamaz. (Kaynak: [Norge.no](https://en.wikipedia.org/wiki/Norge.no),
[Mypage/MinSide](https://interoperable-europe.ec.europa.eu/collection/egovernment/document/mypage-self-service-citizens-portal-mypage))

## 5. Değer önerisi

> "Doğru kapıyı bulmak sizin işiniz değil — biziz. [X] gün içinde doğru
> sağlayıcıya bağlanın, süreç boyunca biri sizinle, sonunda kalite bizim
> sorumluluğumuzda."

Farklılaşan nokta **bilgi değil, aktif koordinasyon + sorumluluk**: ücretsiz
kanallar "nereye gideceğini söyler", NAVIAR "gider, halleder, sonucu takip
eder". Bu fark yalnız ödeme gücü olan ve zamanı değerli olan segmentlerde
(KOBİ, üst-orta gelir) para eder — düşük gelirli bireysel segmentte bu fark
"güzel ama ödeyemem" olarak kalır [H].

## 6. Business Model Canvas

| Blok | İçerik |
|---|---|
| **Müşteri segmentleri** | KOBİ sahipleri (birincil) · göçmen/expat bireyler (ikincil) · belediyeler (B2G, 12+ ay) |
| **Değer önerisi** | Doğru hizmete hızlı erişim + uçtan uca koordinasyon + kalite sorumluluğu |
| **Kanallar** | LinkedIn/içerik (QBLOGG kitlesiyle çapraz), yerel işletme dernekleri, expat toplulukları (Facebook grupları, Internations vb. [H]) |
| **Müşteri ilişkileri** | Bire bir vaka yöneticisi (case manager) modeli — kişisel, düşük ölçek başlangıçta |
| **Gelir akışları** | Bkz. §7 — MVP'de **tek** akış (danışmanlık/koordinasyon ücreti), sonra genişler |
| **Temel faaliyetler** | Sağlayıcı doğrulama, vaka koordinasyonu, kalite takibi, müşteri desteği |
| **Temel kaynaklar** | Doğrulanmış sağlayıcı listesi (başlangıçta elle küratörlü, 10–20 sağlayıcı [H]) + kurucunun kendi ağı |
| **Temel ortaklar** | Yerel hizmet sağlayıcılar (muhasebeci, hukuk danışmanı, çeviri bürosu vb.) — komisyon değil, MVP'de sabit yönlendirme ücreti [H] |
| **Maliyet yapısı** | Kurucu zamanı (asıl maliyet) + basit web/form altyapısı + sağlayıcı doğrulama zamanı — düşük sabit maliyet |

## 7. Gelir modeli ve fiyatlandırma

Kullanıcının önerdiği 5 kaynaklı karma model (`is-modeli.md` §6) **MVP için
fazla karmaşık ve tarafsızlık riski taşıyor** (aynı anda hem müşteriden hem
sağlayıcıdan para almak, güven vaadiyle gerilim yaratıyor — bkz. §10).
**Öneri: MVP'de tek akışla başlayın, güven kurulduktan sonra genişletin.**

| Aşama | Gelir akışı | Örnek fiyat (NOK) | Neden |
|---|---|---|---|
| **MVP (0–90 gün)** | Vaka başı sabit danışmanlık/koordinasyon ücreti | 1.500–3.500 NOK / vaka [H] | Tek taraflı ücret = tarafsızlık iddiası inandırıcı; fiyatlandırma basit, anlaşılır |
| **Ay 4–9** | + Aylık abonelik (KOBİ'ler için sınırsız danışma) | 990–1.990 NOK/ay [H] | Tekrarlayan gelir, KOBİ'nin bütçe döngüsüne uyar |
| **Ay 10+** | + Sağlayıcıdan komisyon (yalnız **şeffaf** açıklamayla) | Vaka değerinin %5–10'u [H] | Ölçek geldiğinde ek gelir; şeffaflık şartı olmadan eklenmemeli |
| **12+ ay** | B2G sözleşmesi (belediye ile) | Proje bazlı, [H] rakamsız | Uzun satış döngüsü, ihale mevzuatı netleşmeden fiyat verilemez |

**Not:** Tüm rakamlar [H] — pazar araştırması yapılmadı, örnek/hipotezdir. Bu,
CLAUDE.md madde 8'in QBLOGG için koyduğu kuralla aynı disiplin: rakamlar kesin
vaat değil, örnektir.

## 8. İlk 90 gün — düşük bütçeli MVP planı

Varsayım: tek kişi, düşük bütçe, teknik altyapı yok (bkz. varsayımlar tablosu).

| Hafta | Faaliyet | Bütçe | Çıktı |
|---|---|---|---|
| 1–2 | 10 KOBİ sahibiyle problem-doğrulama görüşmesi (ücretsiz, keşif) | 0 | "Bu gerçek bir acı mı?" cevabı |
| 3–4 | 10–15 sağlayıcıyı elle küratörle (muhasebeci, hukuk, çeviri, izin danışmanlığı) | 0 (kurucu zamanı) | Doğrulanmış sağlayıcı listesi |
| 5–6 | Tek sayfalık basit form + `mailto:` teslim akışı (QBLOGG'un `work.html` desenine benzer — kod zaten var, kopyalanabilir [V]) | Düşük (mevcut altyapı yeniden kullanılır) | Çalışan başvuru kanalı |
| 7–8 | İlk 3 ücretli pilot vaka (indirimli fiyat, açık "pilot" etiketiyle) | 0 (zaman) | Gerçek ödeme kanıtı |
| 9–10 | Pilot geri bildirimini topla, süreci düzelt | 0 | Düzeltilmiş akış |
| 11–12 | Fiyatı normalleştir, 5 yeni müşteri hedefle | Düşük (içerik/LinkedIn) | İlk ay tekrarlanabilir gelir kanıtı |

**Kritik:** Bu plan bilinçli olarak **kamu sektörü/bireysel segmenti dışarıda
bırakıyor** — §4'teki ücretsiz-alternatif riski çözülmeden o segmente bütçe
harcanmaz.

## 9. Müşteri kazanma kanalları — öncelik sırası

| Kanal türü | Somut kanal | Öncelik | Maliyet |
|---|---|---|---|
| Organik | QBLOGG'un mevcut KOBİ kitlesine çapraz duyuru (aynı kurucu, örtüşen hedef kitle [H]) | 1 | Sıfıra yakın |
| Satış | Doğrudan 1:1 outreach — yerel işletme dernekleri, ticaret odası etkinlikleri | 2 | Zaman |
| Ortaklık | Muhasebeci/hukuk bürolarıyla karşılıklı yönlendirme anlaşması | 3 | Zaman + güven inşası |
| Reklam | LinkedIn/Meta hedefli reklam | 4 — **90 günde önerilmez** | Bütçe gerektirir, henüz kanıt yok |

## 10. Riskler, zayıf noktalar, başarısızlık ihtimali yüksek varsayımlar

| # | Risk | Neden kritik | Kanıt |
|---|---|---|---|
| 1 | **Bireysel/kamu segmentinde ücretsiz resmi alternatif var** | Norge.no/MinSide/Altinn zaten bu işi ücretsiz yapıyor — bir vatandaş neden özel şirkete ödesin, cevaplanmadı | [V] bu oturumda arandı |
| 2 | **Karma gelir modelinin tarafsızlık gerilimi** | Hem müşteriden hem sağlayıcıdan para almak, "güven" iddiasıyla çelişiyor | `is-modeli.md` §6, bu oturumda önceden işaretlendi |
| 3 | **Marka mimarisi netleşmemiş** | NAVIAR CONSULTING B2B/kurumsal konumlandırılmış; bu fikir B2C/bireysel — aynı marka mı ayrı descriptor mu belirsiz | `NAVIAR-LOGO-KARAR.md`, `is-modeli.md` §4 |
| 4 | **Kamu sektörü ihale mevzuatı** | B2G gelir akışı ihale usulüne tabi olabilir, doğrudan satışla örtüşmeyebilir | `is-modeli.md` §2, doğrulanmamış [H] |
| 5 | **Tek kişilik operasyon ölçeklenmiyor** | "Vaka yöneticisi" modeli kurucunun zamanıyla sınırlı; 90 gün sonrası büyüme kurucunun kapasitesine çarpar | Varsayım tablosu — kaynak bilgisi yok |
| 6 | **Hassas kişisel veri (KVKK/GDPR)** | "İhtiyacını anlatma" muhtemelen sağlık/sosyal yardım/hukuki durum içerir; QBLOGG'un `uye/` sisteminden daha ağır bir uyum yükü | `is-modeli.md` §2 |
| 7 | **Sorumluluk/SLA belirsizliği** | Bir sağlayıcı hizmeti aksatırsa sorumluluk NAVIAR'da mı sağlayıcıda mı, sözleşme yok | `is-modeli.md` §2 |

**En yüksek öncelikli varsayım (test edilmeden ilerlenmemeli):** Risk #1 —
KOBİ segmentinde bile "bunun için neden ücret ödeyeyim" sorusu doğrulanmalı;
bireysel/kamu segmentinde bu soru muhtemelen olumsuz cevaplanır.

## 11. Hızlı deneyler — varsayımları test etme

| Test edilecek varsayım | Deney | Başarı ölçütü | Maliyet |
|---|---|---|---|
| KOBİ'ler bu hizmete gerçekten ödeme yapar mı? | 10 problem-doğrulama görüşmesi + 3 ücretli pilot teklifi | En az 2/10 "evet, öderim" + 1 gerçek ödeme | 0, yalnız zaman |
| Bireysel/kamu segmenti ücretsiz alternatife rağmen öder mi? | 5 bireyle görüşme: "Norge.no/MinSide'ı biliyor musunuz, neden kullanmıyorsunuz/kullanıyorsunuz?" | Net bir boşluk (ör. "çok karmaşık", "dilim yetmiyor") ortaya çıkarsa segment canlanır | 0 |
| Sağlayıcılar komisyon modeline razı mı? | 5 potansiyel sağlayıcıyla görüşme | En az 3/5 ilkesel olarak kabul | 0 |
| Tek sayfalık form akışı yeterli mi? | QBLOGG'un `work.html` desenini kopyala, 3 gerçek başvuru topla | 3 başvuru sorunsuz tamamlanır | Düşük (mevcut kod yeniden kullanılır) |

## 12. 12 aylık büyüme yol haritası ve KPI'lar

| Dönem | Odak | Ana KPI | Hedef [H] |
|---|---|---|---|
| Ay 1–3 (MVP) | KOBİ pilotu | Ücretli vaka sayısı | ≥3 |
| Ay 4–6 | Tekrarlanabilirlik | Aylık tekrar eden gelir (abonelik) | ≥5 abone KOBİ |
| Ay 7–9 | Segment genişletme | Göçmen/expat segmentinde ilk ücretli vaka | ≥5 |
| Ay 10–12 | Ortaklık + komisyon testi | Şeffaf komisyonlu sağlayıcı sayısı | ≥3 sağlayıcı |
| 12+ | B2G keşif | İlk belediye görüşmesi (satış değil, keşif) | ≥1 görüşme |

**Not:** Bu yol haritası kasıtlı olarak **bireysel/kamu sektörü B2C
segmentini erteliyor** — §10 Risk #1 çözülmeden bütçe/zaman oraya
harcanmıyor. B2G (kuruma satış) yolu, aynı fikri riski daha düşük bir
biçimde test eder (kurum, vatandaşın ödemediği bir hizmete kendi bütçesinden
öder — bu, Risk #1'i baştan ortadan kaldırır).

## 13. Şimdi yapılacak en önemli 5 adım

1. **10 KOBİ sahibiyle problem-doğrulama görüşmesi yap** (§8, hafta 1–2) —
   maliyet sıfır, en yüksek bilgi/maliyet oranı.
2. **Risk #1'i doğrudan test et:** 5 bireye "Norge.no/MinSide'ı neden
   kullanmıyorsunuz" sorusunu sor — bireysel segmentin canlı olup olmadığını
   3 gün içinde öğren.
3. **Marka mimarisi kararını ver** (`is-modeli.md` §4, soru 1) — aynı NAVIAR
   CONSULTING hattı mı, ayrı descriptor mı; bu, pazarlama materyali
   yazılmadan önce gerekli.
4. **Gelir modelini MVP için tek akışa indir** (§7) — karma modeli şimdilik
   bırak, tarafsızlık riskini erken aşamada taşıma.
5. **10–15 sağlayıcıyı elle küratörle** (§8, hafta 3–4) — ücretli ilk pilot
   vaka için önkoşul, bütçe gerektirmez.

---

## Şablonun kendi kuralına karşı öz-denetim

AUTOPROMPT şablonu şunu yasaklıyordu: "Genel, boş veya motivasyon odaklı
cevap verme." Bu analizin bunu karşıladığını doğrulayan üç nokta: (1) §4'teki
rakip bulgusu somut ve aramayla doğrulandı, genel bir "rekabet var" cümlesi
değil; (2) §10 riskleri bu projenin kendi belgelerinden (`is-modeli.md`,
`NAVIAR-LOGO-KARAR.md`) alındı, jenerik girişimcilik riskleri değil; (3) §13
somut, sıfır maliyetli, bu hafta başlatılabilir eylemler içeriyor.
