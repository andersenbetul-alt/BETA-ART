# NAVIAR Care — İş modeli kritik analizi ve yeniden inşa

Tarih: 26.08.2026
Girdi: kullanıcının bu oturumda paylaştığı tam "NAVIAR Care Pilot Implementation
Plan" (İngilizce, ChatGPT kaynaklı görünüyor — Arbeidstilsynet/Oslo
kommune/Skatteetaten/Datatilsynet atıflı) + bu depodaki önceki
`docs/naviar/NAVIAR-CARE-HIZMET-TARAMA.md` (25.08.2026).

**Bu belge bir hukuki/mali danışmanlık değildir.** Norveç resmî kaynakları
(Skatteetaten, Arbeidstilsynet, Datatilsynet, Lovdata) bu ortamda erişilemiyor
(`EGRESS_BLOCKED` — `seniorsupport.no` dahil tüm dış siteler); aşağıdaki
rakamlar arama motoru özetinden derlendi, **birebir okunmadı**. Muhasebeci ve
Norveç iş/gizlilik hukuku danışmanı onayı olmadan hiçbir rakam ya da hukuki
iddia kesin sayılmamalı — bu zaten pilot planının kendi "Stop Condition"ı.

---

## 0. Kritik çelişki kaydı — önce bu

Bu depoda dün (25.08.2026) yazılan `docs/naviar/NAVIAR-CARE-HIZMET-TARAMA.md`,
kullanıcının o anki beyanına dayanarak NAVIAR CARE'i **"doğrulanmış bağımsız
sağlayıcılarla pazar yeri / eşleştirme modeli"** olarak tanımlamıştı (istihdam
değil, eşleştirme). Bugün paylaşılan pilot planı bunun **tam tersini**
söylüyor ve gerekçesini de veriyor:

> "Helpers are designed as employees for the pilot. NAVIAR sets the service,
> price, matching, quality standard and schedule, so contractor status would
> be difficult to defend without clear evidence of genuine independence.
> Norwegian law presumes employee status unless the client makes it highly
> probable that an independent relationship exists."

Bu, dün bıraktığım açık soruyu ("NAVIAR bakım personelini kendisi mi
istihdam ediyor yoksa eşleştiriyor mu?") **doğrudan ve gerekçeli biçimde**
cevaplıyor — ve gerekçe sağlam: NAVIAR fiyatı, hizmeti, eşleştirmeyi ve
programı NAVIAR belirliyorsa, Norveç iş hukuku bunu bağımsız yüklenicilik
değil istihdam sayma eğiliminde. **Bu belge, eski varsayımı geçersiz kabul
edip yeni (istihdam) modelini esas alıyor.** Sonuç olarak dünkü belgedeki
Nice sınıf okuması (45/42/35 ağırlıklı, 44'ten uzak) da yeniden gözden
geçirilmeli — bir işveren olarak doğrudan hizmet veren NAVIAR, "aracı/
yönlendirme" değil "doğrudan sağlayıcı" konumuna daha yakın duruyor. Bu,
ayrı bir not olarak §10'da tekrar ele alınıyor.

**Neden sessizce düzeltmedim:** iki belge birbirine doğrudan zıt bir kurucu
varsayım taşıyordu; biri diğerini geçersiz kılıyor ama ikisi de aynı depoda
duruyor. Kaydı burada bırakmak, ileride "hangi model esas alındı" sorusuna
kimsenin tahminle cevap vermesini engelliyor.

---

## 1. İş fikri — tek cümle

> Aile yakınları uzakta veya yetersizken, NAVIAR Care iç Oslo'da yaşayan
> yaşlı/yalnız bireylere **istihdam ettiği, eğitilmiş yardımcılar** aracılığıyla
> **tıbbi olmayan** sosyal ziyaret, aktivite refakati ve dijital gündelik
> destek sağlayan; her talebi insan koordinatörün onayından geçiren, kapsamı
> bilinçli olarak dar tutulmuş bir hizmettir.

Bu netleştirmede kritik olan üç sınırlama — **istihdam**, **tıbbi olmayan**,
**insan onaylı** — pazarlama metninde de kaybolmamalı; planın kendisi de bunu
vurguluyor ("Do not sell or imply municipal health, home-care ... services").

---

## 2. Müşterinin gerçek problemi, ihtiyacı, satın alma nedeni

Plan müşteriyi doğru şekilde **üç taraflı** tanımlamış (alıcı, ödeyen aile,
yardımcı). Tablo, planın kendi çerçevesi + eklenen satın alma tetikleyicileri:

| Rol | Gerçek problem | Korunması gereken şey | Satın alma tetikleyicisi |
|---|---|---|---|
| Hizmet alan (yaşlı birey) | Yalnızlık, bağımsızlığını kaybetme korkusu | Özerklik, rıza, mahremiyet | Genellikle **kendisi başlatmaz** — aile başlatır; bu bir satış riski (aşağıya bkz.) |
| Ödeyen aile üyesi | Uzakta/yetersiz olma suçluluğu, "bir şey olursa haberim olsun" ihtiyacı | Öngörülebilirlik, tek muhatap, sürpriz olmama | Bir sağlık korkusu, bir yalnızlık itirafı veya bir aile toplantısı sonrası "birine ihtiyacı var" kararı |
| Yardımcı (çalışan) | Anlamlı, sınırları net, güvenli iş | Eğitim, ödenen zaman, net kaçış yolu | İstihdam güvencesi arayan, bakım/sosyal hizmet ilgili kişi |

**Eksik olan bir şey:** plan, hizmeti *kimin* satın aldığını doğru tanımlamış
ama **hizmet alanın satın alma sürecine rızasının ne zaman ve nasıl
alınacağını** ticari huniye yerleştirmemiş. "Recipient must be willing and
able to consent" diyor ama satış hunisinde bu adım aile ile görüşmeden mi
önce mi sonra mı geliyor belirsiz — bu, §10'da bir risk olarak işaretlendi.

---

## 3. Hedef müşteri segmentleri — öncelik sırası

| Öncelik | Segment | Neden ilk/sonra |
|---|---|---|
| 1 | Uzakta yaşayan yetişkin çocuk, ebeveyni iç Oslo'da bağımsız yaşıyor, düzenli ama hafif destek istiyor | Plan bunu doğru şekilde "birincil erken müşteri" seçmiş — en az kriz, en yüksek planlanabilirlik |
| 2 | Şehir içinde yaşayan ama zaman kısıtlı yetişkin çocuk | Aynı motivasyon, daha kolay ulaşılır (yüz yüze satış/tanıtım mümkün), ama "neden ben gitmiyorum" suçluluğu farklı çerçevelenmeli |
| 3 (bilinçli olarak DIŞLANMIŞ) | Kriz sonrası taburcu, yoğun/günlük bakım ihtiyacı olan aileler | Plan doğru şekilde reddediyor — bu segment kapsam dışı hizmetleri (tıbbi, kişisel bakım) tetikler, ilk 90 günde alınmamalı |
| 4 (ayrı, gelecek) | Kurumsal/belediye (B2B2G) | Plan doğru şekilde "sonraki B2B2C track" diyor, pilotu kirletmesin |

Segment 3'ün **dışlanması** kadar önemli olan, satış sürecinin bunu nasıl
elediği: plan "qualified-lead-to-paid-start" ve "%20 üstü kapsam-dışı red
oranı = mesaj tamiri" ölçütünü koymuş — bu iyi bir tasarım, korunmalı.

---

## 4. Rakipler ve alternatif çözümler

Bu, planın **en zayıf noktalarından biri** — rakip analizi plan metninde
neredeyse hiç yok, yalnız Oslo belediyesine değiniliyor. Kısa bir aramada
**doğrudan rakipler** bulundu (arama motoru özeti, sayfalar bu ortamda
doğrudan okunamadı — `EGRESS_BLOCKED`):

| Alternatif | Tür | Bulunan bilgi | NAVIAR'a tehdit |
|---|---|---|---|
| **SeniorSupport** — "Besøksvenn – Oslo", "Følgetjenester" | Doğrudan rakip, özel şirket | Besøksvenn'e saat başı **270 kr honorar** ödendiği bulundu; hizmet alan sabit/düşük saatlik ücret ödüyor | **Yüksek.** Neredeyse birebir aynı iki hizmeti (besøksvenn + følge) zaten Oslo'da sunuyor. "Kategori sahipliği" iddiası bu yüzden kırılgan |
| **VilMer — "Hverdagsvenn"** | Doğrudan rakip | Sabit/düşük saatlik müşteri ücreti (tutar bulunamadı) | Orta-yüksek — aynı kategori adı ("hverdagsvenn" ~ "hverdagsstøtte") |
| **Oslo kommune — behovsprøvd hjemmehjelp** | Kamu, ücretsiz/düşük maliyetli ama ihtiyaç testi şart | Plan bunu doğru tanımlamış, kendini "tamamlayıcı" konumluyor | Fiyat rakibi değil ama "neden ücret ödeyeyim, belediye zaten var" itirazını güçlendirir |
| **Røde Kors / Kirkens Bymisjon Besøkstjeneste** (gönüllü) | Gönüllü, ücretsiz | Aramada doğrulanmadı ama Norveç'te yaygın bilinen bir model | Fiyat baskısı: "neden ücretli, komşu/gönüllü zaten var" sorusu — pazarlamada doğrudan cevaplanmalı |
| Aile/komşu gayriresmî çözüm | Ücretsiz, gayriresmî | — | En büyük gerçek "rakip" — çoğu aile önce bunu dener, NAVIAR'a ancak bu yetmediğinde gelir |

**Sonuç:** Plan "defansif farklılaşma" iddiasını (insan taramalı eşleştirme,
rıza modeli, tek koordinatör) beş maddede sıralamış ama **SeniorSupport'un
zaten aynı iki hizmeti sunuyor olması**, bu beş maddenin en az ikisinin
(insan onaylı süreç, tek koordinatör) kopyalanabilir olduğunu gösteriyor.
Gerçek savunulabilir fark, iddia değil **ölçülmüş sonuç** olmalı: örneğin
"devamlılık oranı", "aile memnuniyeti", "olay sıfırı" gibi rakamlarla
kanıtlanan bir izlenebilirlik/güven kaydı — bunlar pilot bittiğinde
pazarlamaya girmeli, şimdiden iddia edilmemeli.

---

## 5. Değer önerisi — eleştirel okuma

Planın "defansif fark" tablosu (executive design, §"The defensible
difference") beş madde veriyor. Her birinin gerçekten savunulabilir olup
olmadığı:

| İddia | Gerçekten zor mu kopyalamak? | Not |
|---|---|---|
| Her yeni ilişkide insan kapsam kararı | **Hayır, kolay** | SeniorSupport da muhtemelen bunu yapıyor (küçük ölçekli özel hizmetlerin standardı) |
| Onur-öncelikli rıza modeli | **Kısmen** | Yazılı/somut bir süreç olarak nadiren pazarlanıyor — burada gerçek fark olabilir, ama kanıtlanmalı |
| Dar hizmet sözü + net dışlamalar | **Kolay kopyalanır** ama şu an pazarda net biçimde bunu söyleyen yok gibi görünüyor — **konumlandırma avantajı**, mühendislik avantajı değil |
| Devamlılık (tercih edilen + yedek yardımcı) | **Kısmen zor** — operasyonel disiplin gerektirir, küçük rakipler bunu tutarlı yapamayabilir |
| Tek sorumlu koordinatör | **Kolay kopyalanır** — küçük hizmetlerin çoğu zaten tek kişi/küçük ekiple yönetiliyor |

**Net değerlendirme:** Gerçek fark bugün bir **mühendislik/süreç üstünlüğü**
değil, bir **konumlandırma ve disiplin iddiası**. Bu, ilk 90 günde kanıtlanması
gereken bir hipotez olarak ele alınmalı (bkz. §11), "zaten farklıyız" diye
pazarlanmamalı.

---

## 6. Business Model Canvas

| Blok | İçerik |
|---|---|
| **Müşteri segmentleri** | (1) Uzaktaki/zaman kısıtlı yetişkin çocuk (ödeyen), (2) İç Oslo'da bağımsız yaşayan yaşlı/yalnız birey (alıcı, ayrı rıza sahibi), (3) İşe alınacak yardımcılar (iki taraflı pazar değil ama işgücü kaynağı) |
| **Değer önerisi** | "Sen orada olamadığında, NAVIAR güvenli, tıbbi olmayan gündelik desteği rızayla ve bilgilendirilmiş bir aile temasıyla organize eder" — dar kapsam + insan onaylı eşleştirme + tek koordinatör |
| **Kanallar** | Web sitesi (talep formu, anlık eşleştirme YOK) → koordinatör telefon görüşmesi; arama motoru + güven odaklı topluluk/yönlendirme kanalları (bkz. §9) |
| **Müşteri ilişkileri** | Tek atanmış koordinatör, insan onaylı kurulum görüşmesi, kademeli rıza (ziyaret güncellemesi düzeyi), yardımcı sürekliliği |
| **Gelir akışları** | Aylık plan (peşin faturalı), 90 dakikalık minimum ziyaret + 4 ziyaretlik başlangıç taahhüdü; abonelik katmanı ancak 10+ aileden sonra değerlendirilecek |
| **Temel faaliyetler** | Talep tarama/risk değerlendirmesi, yardımcı işe alım+eğitim, haftalık kalite/risk toplantısı, olay yönetimi, rıza/gizlilik süreç yönetimi |
| **Temel kaynaklar** | Eğitimli yardımcı havuzu (5-8, pilotta), koordinatör (kurucu olabilir), gizlilik-uyumlu CRM, muhasebe/bordro ortağı, hukuk/gizlilik danışmanı |
| **Temel ortaklar** | Muhasebeci/bordro sağlayıcı, iş hukuku + gizlilik danışmanı, sigorta sağlayıcı (yrkesskadeforsikring), (ileride) topluluk/yönlendirme ortakları — belediye/sigorta DEĞİL, pilotta |
| **Maliyet yapısı** | Yardımcı brüt maaş + zorunlu işveren yükleri (AGA, feriepenger, OTP, sigorta) + koordinasyon zamanı + seyahat + ödeme işleme + CRM/hukuk/muhasebe sabit maliyeti — bkz. §7 için somut rakamlar |

---

## 7. Gelir modeli, fiyatlandırma ve birim ekonomisi — somut rakamlarla

Planın fiyat hipotezi: **895-995 kr/saat**, 90 dakika minimum, aylık plan.
Bu makul bir başlangıç ama planın "employer costs" satırı **rakamsız**
bırakılmış ("Model each visit with helper gross pay, employer costs...").
Aşağıda, arama motoru özetinden derlenen (birebir doğrulanmamış, genel bilgi
düzeyinde) Norveç zorunlu işveren yükleri ile **örnek** bir hesap:

| Kalem | Oran (bulunan/genel bilgi) | Kaynak/güven |
|---|---|---|
| Arbeidsgiveravgift (AGA), Oslo = Sone 1 | **%14,1** | Arama özeti (Skatteetaten 2026) — doğrudan okunmadı |
| Feriepenger (yasal asgari) | **%10,2** (60 yaş üstü %12,5) | Genel bilgi (Ferieloven §10) — doğrudan okunmadı |
| OTP (zorunlu mesleki emeklilik, asgari) | **%2** (1G-12G bandı) | Genel bilgi (OTP-loven) — doğrudan okunmadı |
| Yrkesskadeforsikring (zorunlu iş kazası sigortası) | ~%0,5-1 (branşa göre değişir) | Genel bilgi, oran doğrulanmadı |

**Örnek — tamamen illüstratif, gerçek rakam değil:**

```
Yardımcı brüt saat ücreti:           250 kr
+ Feriepenger (%10,2 üzerine):        25,5 kr
= Feriepengeli brüt:                 275,5 kr
+ AGA (%14,1, feriepengeli brüt üzerinden): ~38,9 kr
+ OTP (%2, brüt üzerinden):           ~5 kr
+ Yrkesskadeforsikring (~%0,75):      ~2 kr
≈ Toplam "yüklü" işveren maliyeti:   ~320-330 kr/saat
```

Yani brüt ücretin üzerine **~%28-32 ek yük** biniyor — plan bu çarpanı hiç
vermiyor, "employer costs" diye tek satırda geçiştiriyor. Bu, 90 günlük
maliyet modelinin (Task 1, Step 3) **ilk günden** bu çarpanla kurulması
gerektiği anlamına geliyor, sonradan eklenecek bir düzeltme değil.

**MVA riski — plan bunu "teyit edilmeli" diye bırakıyor, ben daha kesin bir
uyarı ekliyorum:** VAT Act §5b yalnızca **"helsetjenester"** (sağlık
hizmetleri) MVA'dan muaf tutuyor (arama özetinden doğrulandı). NAVIAR Care'in
tüm tasarımı — kendi planının kendi ifadesiyle — **tıbbi/kişisel bakımı
kasıtlı olarak dışlıyor**. Bu, hizmetin sağlık hizmeti muafiyetine
girmeyeceğinin güçlü bir işareti: **%25 tam oranlı MVA'yı "olası" değil
"varsayılan" senaryo olarak fiyatlandırmaya koyun.** MVA kaydı eşiği
(12 ayda 50.000 kr ciro) pilotun ilk birkaç ayında zaten aşılacak.

**895 kr/saat fiyat üzerinden kaba marj testi (tamamen illüstratif):**

```
Müşteri fiyatı (KDV dahil varsayımıyla): 895 kr
- MVA (%25 varsayımıyla, fiyat KDV dahilse net = 895/1,25): 716 kr
- Yardımcının yüklü maliyeti:            ~325 kr
= Kalan (koordinasyon+seyahat+satış+ödeme öncesi): ~391 kr
```

%30 katkı marjı hedefi (~268 kr, 895 üzerinden) bu senaryoda **teorik olarak
ulaşılabilir görünüyor** — ama seyahat süresi (ödenmeyen değil, plan
"paid travel/time between visits" diyor — yani bu da yardımcıya ödenen bir
kalem, yukarıdaki hesaba dahil değil) ve düşük yoğunluklu rotalar bu marjı
hızla eritebilir. Planın kendi uyarısı ("Do not use an averaged helper cost
to hide uneconomic travel") doğru ve bu hesaplamayla birlikte okunmalı.

---

## 8. İlk 90 gün MVP planı — plan zaten var, üç ekleme öneriliyor

Planın 6 görevli, 90 günlük takvimi (Task 1-6, Days 1-90) zaten ayrıntılı ve
kapı (gate) mantığı sağlam. Yeniden yazmak yerine üç somut ekleme:

1. **Kapılarda imza sahibi netleşmeli.** Her "acceptance test" bir soru
   listesi ama kimin "geç/kal" dediği yazmıyor. Öneri: her kapıda tek bir
   isim (muhtemelen kurucu + güvenlik danışmanı ortak imzası) ve karar
   tarihi `docs/decisions/decision-log.md`'ye düşülsün — plan zaten bu
   dosyayı öneriyor, sadece imza zorunluluğu eklenmeli.
2. **Rıza görüşmesinin huni içindeki yeri belirsiz (§2'de not edildi).**
   Task 4 Step 3 rızayı ayrıntılı tanımlıyor ama Task 3'teki satış
   sürecinde *ne zaman* alındığı belirsiz. Öneri: ilk ödeme öncesi zorunlu
   adım olarak sıraya konsun, aksi hâlde "aile ödedi ama alıcı rıza
   göstermedi" senaryosu ilk haftada yaşanabilir.
3. **MVA varsayımı Task 1 Step 3'e (costed visit model) şimdiden %25 olarak
   girilmeli** (yukarı bkz.), "teyit edilecek" diye boş bırakılmamalı —
   teyit gecikirse fiyatlandırma yanlış temelde ilerler.

---

## 9. Müşteri kazanma kanalları — öncelik sırası

| Sıra | Kanal | Neden bu sırada |
|---|---|---|
| 1 — **Organik/güven ağı** | Topluluk/yönlendirme konuşmaları (plan Task 3 Step 3'te "trusted community/referral" diyor) | Bu iş güvene dayalı; ilk 10-20 aile muhtemelen soğuk reklamdan değil tavsiyeden gelecek |
| 2 — **Arama niyeti (SEO/SEM, düşük bütçe)** | "hjemmehjelp alternativ Oslo", "følgetjeneste eldre Oslo" gibi niyet temelli aramalar | Plan zaten bunu ikinci kanal deneyi olarak öneriyor — doğru sıralama |
| 3 — **Ortaklık (dikkatli)** | Aile hekimi, fizyoterapi, cenaze/emeklilik danışmanlığı gibi "aynı aileye ulaşan ama rakip olmayan" aktörler | Plan bunu bilerek "B2B2C, sonra" diye erteliyor — bu doğru, pilotta karmaşıklık eklemeyin |
| 4 — **Ücretli reklam (genel)** | Facebook/Instagram genel hedefleme | En düşük öncelik — bu segment güven ister, soğuk reklam trafiği muhtemelen yüksek "kapsam dışı" red oranı üretir (plan'ın kendi %20 eşiği bunu yakalar) |

---

## 10. Riskler, zayıf noktalar, başarısız olma ihtimali yüksek varsayımlar

| # | Varsayım/Risk | Neden kırılgan | Etki |
|---|---|---|---|
| R1 | MVA muaf/belirsiz sayılabilir | Hizmet kasıtlı olarak sağlık kapsamı dışında tasarlandı → muafiyet olası değil (§7) | Fiyatlandırma %20+ yanlış hesaplanabilir |
| R2 | "İşveren maliyeti" tek satır, oransız | AGA+feriepenger+OTP+sigorta gerçek rakamı görülmeden marj hedefi kurulmuş (§7) | %30 marj hedefi kağıt üzerinde tutar, gerçekte tutmayabilir |
| R3 | Kategori sahipliği iddiası | SeniorSupport zaten aynı iki hizmeti Oslo'da sunuyor (§4) | Pazarlama "biz farklıyız" derken müşteri "bu zaten var" diyebilir |
| R4 | Rıza noktası satış hunisinde tanımsız | Aile ödüyor ama alıcı rıza göstermeyebilir, huni bunu ne zaman yakalayacağını söylemiyor (§2, §8) | İlk vakalarda iade/güven krizi riski |
| R5 | Koordinatör/kurucu tek nokta arıza | "Founder may initially be the coordinator" — nöbet yükü, hastalık/tatil senaryosu planda yok | Operasyon 1 kişiye bağlı, ölçekleme öncesi kırılgan |
| R6 | 5-8 güvenilir yardımcı bulmak "kolay" varsayılıyor | Plan kendisi de polis kaydı belirsizliğini kabul ediyor ("do not assume a care-related certificate is available") — işe alım süresi hafife alınmış olabilir | 90 günlük takvim gecikebilir |
| R7 | Gönüllü/ücretsiz alternatiflerin fiyat baskısı | Røde Kors/Kirkens Bymisjon gibi ücretsiz seçenekler "neden ödeyeyim" itirazını güçlendirir | Dönüşüm oranı beklenenden düşük olabilir |
| R8 | "Düşük bütçeli MVP" ile "muhasebeci+hukuk danışmanı+DPIA" gereksinimi gerilimi | Plan haklı olarak bunları zorunlu tutuyor ama bunlar küçük bir pilot için önemli sabit maliyet — bütçe satırında görünmüyor | Nakit akışı 90 gün dolmadan tükenebilir |
| R9 | Nice sınıf/marka tescili varsayımı eskidi | Dünkü analiz "eşleştirme" (45/42) varsayıyordu; bugünkü model "doğrudan istihdamlı sağlayıcı" — sınıf 44 ihtimali yeniden güçlendi (§0) | Marka tescil başvurusu yanlış sınıfla yapılabilir |

---

## 11. Bu varsayımları test edecek hızlı deneyler

| Varsayım | Deney | Başarı ölçütü | Süre/Maliyet |
|---|---|---|---|
| R1 (MVA) | Muhasebeciye tek soruluk yazılı görüş: "bu üç hizmet MVA'dan muaf mı?" | Yazılı, tarihli cevap | 1 gün, düşük maliyet |
| R2 (işveren maliyeti) | Gerçek 1 yardımcı için resmi bordro simülasyonu (bordro sağlayıcı aracılığıyla) | Saat başı gerçek yüklü maliyet ±%5 hassasiyetle bilinir | 1 hafta, düşük maliyet |
| R3 (kategori sahipliği) | SeniorSupport/VilMer'e "gizli müşteri" olarak başvurup fiyat/süreç öğrenmek | Rakip fiyat/süreç kanıtlanmış veri hâline gelir | 1-2 gün, sıfır maliyet |
| R4 (rıza huni yeri) | İlk 5 aile ile rızayı ödeme ÖNCESİ zorunlu adım olarak dene | 5/5 vakada alıcı rızası ödemeden önce alınmış olmalı | Pilotun ilk haftası |
| R7 (fiyat baskısı) | 20 keşif görüşmesinde (plan zaten öneriyor) doğrudan sor: "Kızılhaç/gönüllü seçenekleri denediniz mi, neden yetmedi?" | Ücretli hizmete geçiş nedeni somut biçimde toplanır | Plan'ın kendi Task 3 Step 1'i içinde, ek maliyet yok |
| R6 (işe alım süresi) | 8-12 aday havuzunu ilk 2 haftada gerçekten toplamayı dene, gerçek süreyi ölç | Gerçek süre planın 15 günlük varsayımıyla karşılaştırılır | 2 hafta |

---

## 12. 12 aylık büyüme yol haritası ve KPI'lar

| Dönem | Odak | Ana KPI hedefi |
|---|---|---|
| Ay 1-3 (pilot) | Task 1-5, güvenlik+birim ekonomisi kanıtı | 15+ aktif aile, %70+ 4 haftalık devam, %90+ zamanında ziyaret, sıfır çözülmemiş ciddi olay, %30+ katkı marjı |
| Ay 4-6 | Ölçekleme kapısı geçildiyse: koordinatör işe alımı (kurucu 4 hafta üst üste 20+ saat koordinasyon harcarsa), 2. bölge (Oslo içi yoğunluk) | Koordinatör başına sürdürülebilir nöbet yükü, aynı marj korunuyor mu |
| Ay 7-9 | Güvenlik/kalite lideri (25+ aktif aile eşiğinde), otomasyon YALNIZ hatırlatma/uygunluk toplama düzeyinde | 40-55 aktif aile, olay oranı sabit/düşüyor |
| Ay 10-12 | Yıl-1 operasyon planı onayı, yeni şehir/bölge kontrol listesi hazırlığı (henüz açılış değil) | Yıl sonu 55 aile hedefi (planın kendi Yıl-1 rakamı), iki çeyrek üst üste ölçekleme kapısını geçme |

**Not:** planın "Yıl 3: 400 aile" rakamı kendi ifadesiyle "yön, taahhüt değil"
— bu belge de aynı çekinceyi taşıyor, KPI değil senaryo olarak okunmalı.

---

## 13. Şimdi yapılacak en önemli 5 adım

1. **Muhasebeciden yazılı MVA görüşü al** (R1) — fiyatlandırmanın temeli bu
   tek cevaba bağlı, en ucuz ve en hızlı doğrulama.
2. **Bir yardımcı için gerçek bordro simülasyonu çalıştır** (R2) — %30 marj
   hedefinin gerçek olup olmadığını 1 haftada, düşük maliyetle öğren.
3. **SeniorSupport ve VilMer'i gizli müşteri olarak ara** (R3, R4 §4) —
   "kategori sahipliği" iddiasını rakamla değiştir, iddiayla değil.
4. **Rıza adımını satış hunisinde ödeme öncesine sabitle** (R4) — hukuk/
   gizlilik danışmanına tek soru olarak sor: "ödeme rızadan önce mi sonra
   mı alınmalı?"
5. **20 keşif görüşmesini başlat (plan zaten öneriyor) ve doğrudan gönüllü/
   belediye alternatiflerini sor** (R7) — fiyat direncinin gerçek kaynağını
   varsaymadan önce ölç.

Bu beşi, plan'ın kendi 90 günlük takvimini **değiştirmiyor**, ilk iki
haftasına (Days 1-14, "Task 1: legal/commercial perimeter") **somut, ucuz ve
hızlı doğrulama adımları** olarak ekliyor.
