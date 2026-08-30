# NAVIAR — iş modeli değerlendirmesi (bireysel + kamu sektörü segmenti)

**Durum: TASLAK — segment ve kapsam kararı kullanıcıda (bkz. §4).**
Tarih: 25.08.2026. İşaretler: [V] doğrulanmış · [H] hipotez · [D] dış iddia.

## 1. Kullanıcının ilettiği parçalar (aynen)

İki ayrı mesajda geldi, burada birleştirildi:

- **Hedef kitle / kullanım senaryosu:** "Genel hizmet arayan bireyler.
  Doğru hizmete yönlendirme ve koordinasyon **kamu sektöründe**."
- **Merkezi değerler:** güven · kolaylık · insan odaklı hizmet.
- **Akış:** müşteri yalnızca bir hizmet satın almaz — ihtiyacını anlatır,
  NAVIAR uygun çözümü bulur, süreci koordine eder, kaliteyi takip eder.

Bu, bir **eşleştirme + koordinasyon + kalite takibi** modeli tarif ediyor —
klasik "hizmet sat" değil, "doğru hizmete ulaştır ve süreci sahiplen"
(concierge / broker / case management yakını).

## 2. Dürüst değerlendirme

**Mevcut konumlandırmayla gerilim [V]:** `docs/naviar/NAVIAR-LOGO-KARAR.md`
ve `brand/naviar/README.md`'de NAVIAR CONSULTING şu ana kadar **B2B/kurumsal**
konumlandırılmıştı — "McKinsey tarzı kurumsallık + modern teknoloji şirketi +
butik strateji firması", onaylı mimaride de servis seviyesi CONSULTING
(kurumlara danışmanlık). Bu mesaj ise **bireysel vatandaşı** ve **kamu
sektörünü** işaret ediyor. İkisi aynı marka altında durabilir (descriptor
farkıyla) ama **aynı ürün değildir**: biri kurumlara stratejik danışmanlık
satar, diğeri bireyleri doğru kamu/özel hizmete yönlendirip süreci koordine
eder. Bu ayrım netleşmeden tek bir konumlandırma cümlesi yazılamaz.

**Kamu sektörü segmentinin kendine özgü kısıtları [H] — doğrulanmamış,
uzman/hukuk teyidi gerekir:**

- **İhale/tedarik mevzuatı.** Kamu kurumlarına hizmet/yönlendirme sağlamak
  çoğu ülkede kamu ihale usulüne tabidir; doğrudan satış modeliyle
  örtüşmeyebilir.
- **Tarafsızlık riski.** "Doğru hizmete yönlendirme" iddiası, yönlendirilen
  sağlayıcılardan komisyon alınıyorsa çıkar çatışması doğurur — bu, güven
  değerini (kullanıcının kendi belirttiği ilk değer) doğrudan zedeler.
  Gelir modeli (kullanıcıdan ücret mi, sağlayıcıdan komisyon mu, kamudan
  sözleşme mi) bu yüzden erken netleşmeli.
- **Kişisel veri.** Bireyin "ihtiyacını anlatması" muhtemelen hassas veri
  içerir (sağlık, sosyal yardım, hukuki durum vb.). KVKK/GDPR kapsamı,
  QBLOGG'un `uye/` sisteminde zaten ele alınan modelden daha ağırdır.
- **Sorumluluk.** "Süreci koordine eder, kaliteyi takip eder" — bir hizmet
  aksarsa sorumluluk NAVIAR'da mı, sağlayıcıda mı? Sözleşme/SLA modeli
  gerektirir.

**Güçlü yan [H]:** "Güven + kolaylık + insan odaklı" üçlüsü, NAVIAR'ın zaten
kabul edilmiş renk/algı diliyle (lacivert = güven/kurumsallık) tutarlı;
yeni bir marka dili icat etmeye gerek yok, mevcut sistem bu değerleri
zaten taşıyor.

## 3. Bu, ayrı bir descriptor mu gerektirir?

Onaylı mimaride (`NAVIAR-LOGO-KARAR.md` §1) şu an: CONSULTING (kurumsal
danışmanlık), AI, PLATFORM, RESEARCH INSTITUTE, ACADEMY, LABS. **Bireysel +
kamu sektörü yönlendirme/koordinasyon hizmeti bu listede yok** ve
CONSULTING'in kapsamına da tam oturmuyor (CONSULTING kurumlara danışmanlık,
bu ise bireye doğrudan hizmet). Yeni bir descriptor (örn. bir "erişim/
yönlendirme" katmanı) mimariye eklenecekse bu, CARE'in aldığı yolu izlemeli:
iş onayı + descriptor tasarımı + gerekirse ek Nice sınıfı taraması
(muhtemelen sınıf 35/45 — kamu/idari hizmetler danışmanlığı; kesin sınıf
tayini hukuk teyidi gerektirir).

## 4. Açık sorular — karar kullanıcıda

Önceki AskUserQuestion turunda "tercih yok" cevabı geldi; bu yüzden karar
zorlanmadı. Soru 2 kullanıcının sonraki mesajıyla cevaplandı (bkz. §6),
diğerleri açık:

1. Bu, **NAVIAR CONSULTING'in bir hizmet hattı** mı (kurumlar için değil
   ama aynı marka), yoksa **ayrı bir descriptor/alt marka** mı olacak?
2. ~~Gelir modeli ne~~ — cevaplandı: **karma model**, bkz. §6. Ama karma
   modelin kendi içindeki gerilim (§6'daki tarafsızlık notu) hâlâ açık.
3. "Kamu sektöründe" ifadesi, kamu kurumlarının **müşterisi** olması mı
   (B2G — kuruma satış), yoksa bireylerin kamu hizmetlerine **erişiminin
   kolaylaştırılması** mı (vatandaşa yönelik, kamu üçüncü taraf)? İkisi çok
   farklı ürün ve mevzuat rejimi doğurur. §6'daki "belediyelerle B2B/B2G
   iş birlikleri" her ikisini de içerebilir — hangisi birincil, netleşmedi.
4. Bu, mevcut NAVIAR kapsamına mı giriyor yoksa QBLOGG/uye sistemindeki gibi
   ayrı bir teknik uygulama mı olacak?

## 6. Gelir modeli ve operasyon (kullanıcı tarafından netleştirildi)

**Gelir kaynakları — karma model, beşi bir arada:**

1. Hizmet başına komisyon (sağlayıcıdan)
2. Danışmanlık ve koordinasyon ücreti (müşteriden)
3. Aylık üyelik / abonelik paketleri (müşteriden)
4. Kurumlar ve belediyelerle B2B/B2G iş birlikleri
5. Premium / hızlı / kişiselleştirilmiş hizmet paketleri

**Operasyon:** doğrulanmış hizmet sağlayıcıları ağı + müşteri destek
sistemi + dijital rezervasyon/yönlendirme altyapısı + kalite kontrol
süreçleri. Amaç: müşteri güveni korunur, sağlayıcı düzenli iş fırsatına
ulaşır.

**Not edilmesi gereken gerilim [H]:** Madde 1 (sağlayıcıdan komisyon) ile
madde 2/3 (müşteriden ücret) **aynı anda** varsa, "doğru hizmete
yönlendirme" iddiası hem müşteriden hem sağlayıcıdan para alan bir taraf
tarafından yapılmış olur. Bu, §2'de işaretlenen tarafsızlık riskini
gidermiyor, tam tersine iki kaynaktan geliyor. Bu, modelin çalışmayacağı
anlamına gelmez — sigorta acenteliği, emlak, seyahat acenteliği gibi
yerleşik sektörler aynı çift taraflı komisyon yapısını kullanır — ama
**açıklık şartı** doğurur: hangi sağlayıcıdan komisyon alındığı müşteriye
görünür olmalı, yoksa güven vaadiyle çelişir. Bu, ürün tasarımına (kod
yazılacaksa) girmesi gereken bir kural, şimdiden not edildi.

## 5. Yapılmadı, bilinçli olarak

Bu turda **hiçbir marka varlığı, sayfa veya kod üretilmedi.** Sebep: §4'teki
sorular cevaplanmadan bir descriptor adı, renk kuralı veya sayfa iskeleti
yazmak, `NAVIAR-LOGO-KARAR.md`'nin kendi kabul kuralını (Acceptance Rule —
governance ve iş onayı önce) ihlal eder. CARE'de izlenen sıra (önce iş
onayı, sonra tasarım) burada da izlenmeli.

## 7. Hukuki risk sınırları (kullanıcı tarafından iletildi, 30.08.2026)

Kullanıcının aynen ilettiği kısıt listesi — bu, işyeri/sykefravær (hastalık
izni) takibi ve NAV ile temas eden bir kullanım senaryosuna işaret ediyor;
§4'teki "kamu sektörü" sorusunu daraltıyor ama kapatmıyor (aşağıya bkz.):

> **Hukuki riski azaltan temel sınırlar**
> - Teşhis, tedavi ve tıbbi rapor yok.
> - NAV veya belediye adına karar verme yok.
> - Bireysel yardım, AAP veya sosyal hak sonucu garantisi yok.
> - İlk sürümde sağlık verisi ve teşhis bilgisi toplanmayacak.
> - Bireysel vakalarda yalnız gerekli çalışma işlevi ve uyarlama bilgisi
>   kullanılacak.
> - Çalışan notları işverene otomatik olarak paylaşılmayacak.
> - Çatışma, taciz ve whistleblowing vakaları ayrı bağımsız uzman yoluna
>   aktarılacak.
> - AI, çalışanlara risk puanı vermeyecek ve otomatik karar almayacak.
> - "Sykefraværet yüzde 30 azalır" gibi kanıtsız vaatler kullanılmayacak.
> - Marka iletişiminde mutlaka: **"NAVIAR Consult er en privat og uavhengig
>   rådgiver – ikke NAV."**

Kullanıcının eklediği gerekçe (aynen): Datatilsynet, sağlık bilgilerinin
özel nitelikli veri olduğunu ve yüksek riskli işlemlerde DPIA gerekebileceğini
belirtiyor; bu nedenle veri-minimumlu model NAVIAR için hem daha güvenli hem
de daha kolay satılabilir. Kaynaklar (kullanıcı tarafından verildi, **bu
ortamda doğrulanmadı** — başvuru/uygulama öncesi elle teyit edilmeli, bkz.
`docs/marka-tescili.md`'deki aynı ihtiyat kaydı):
- Datatilsynet — özel nitelikli veri: https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/om-behandlingsgrunnlag/spesielt-om-sarlige-kategorier-av-personopplysninger/
- Datatilsynet — DPIA rehberi: https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/vurdering-av-personvernkonsekvenser/nar-ma-man-gjennomfore-en-vurdering-av-personvernkonsekvenser/

**Bunun §4 ile ilişkisi:** Bu liste "işveren ↔ çalışan ↔ NAV" üçgenindeki bir
işyeri takip/uyarlama aracını tarif ediyor — §4 soru 3'teki "bireyin kamu
hizmetlerine erişiminin kolaylaştırılması" ucuna daha yakın, kurumlara
(B2G/belediye) doğrudan satıştan farklı bir ürün şekli. Yani segment sorusu
**daralıyor** (muhtemelen: işverenlere satılan, çalışanı NAV süreçlerinde
yönlendiren bir SaaS/danışmanlık katmanı) ama hâlâ açık: bu B2B (işverene
satış) mı, yoksa B2C (çalışana doğrudan) mı? Bu netleşmeden ürün/sayfa
üretilmeyecek — §5'teki gerekçe burada da geçerli.

**Not:** Bu sınırlar zaten NAVIAR CONSULTING'in genel "otomatik karar almama,
kanıtsız vaat kullanmama" duruşuyla tutarlı (bkz. `brand/naviar/README.md` —
marka dili, gösterişsiz/kurumsal ton). Yeni bir çelişki doğurmuyor, mevcut
sese ek bir somut uygulama kuralı ekliyor.

## 8. En kârlı hizmet paketi (kullanıcı tarafından iletildi, 30.08.2026)

**NAVIAR Offentlig Workforce & Work-Ability Program** — kullanıcının aynen
ilettiği altı bileşen:

1. Kurumun sykefravær ve arbeidsmiljø süreçlerinin incelenmesi
2. Yönetici ve HR eğitimleri
3. Tilrettelegging, dialogmøte ve işe dönüş prosedürlerinin kurulması
4. Çalışan ve işveren için ayrı görüşme akışları
5. Zor vakalarda bağımsız uzman yönlendirmesi
6. Üç aylık anonim kurum raporu ve gelişim planı

Kullanıcının eklediği gerekçe (aynen): kamu sektöründe personel açığı,
yetkinlik ihtiyacı ve sykefravær azaltma baskısı artıyor; bu nedenle
özellikle belediye sağlık/bakım hizmetleri ve büyük kamu kurumları güçlü
müşteri segmentleri olabilir. Kaynak (kullanıcı tarafından verildi, **bu
ortamda doğrulanmadı**): Helsepersonellplan 2040 —
https://www.regjeringen.no/no/dokumenter/meld.-st.-11-20252026/id3164917/

**Bunun §4/§7 ile ilişkisi — segment sorusu bu paketle netleşiyor:**
Bu paket açıkça **B2B/B2G'dir** — müşteri kurum/işveren (belediye, kamu
kurumu), çalışan değil. §4 soru 3'ün cevabı bu yönde daralıyor: "bireyin
kamu hizmetine erişimi" değil, "**kurumun** işgücü/sykefravær sürecine satılan
danışmanlık + eğitim + raporlama programı" — yani NAVIAR CONSULTING'in zaten
onaylı B2B kurumsal danışmanlık kimliğine (bkz. §2'deki gerilim notu) aslında
**yakınsıyor**, ayrı bir descriptor gerektirmeyebilir. §7'deki "işveren ↔
çalışan ↔ NAV üçgeni" burada somutlaşıyor: madde 4 ("çalışan ve işveren için
ayrı görüşme akışları") ve madde 5 ("bağımsız uzman yönlendirmesi") §7'nin
whistleblowing/çatışma ayrımı kuralıyla birebir örtüşüyor.

Hâlâ açık: §4 soru 1 (ayrı descriptor mı, CONSULTING'in bir hizmet hattı mı)
— bu paket CONSULTING kapsamına girecekse muhtemel cevap "hizmet hattı"
yönünde, ama descriptor onayı için kesin karar hâlâ kullanıcıda. Ayrıca §6'daki
komisyon/tarafsızlık gerilimi bu pakette **yok** — burada gelir tamamen
kurumdan alınan danışmanlık/program ücreti, sağlayıcıya çift taraflı komisyon
söz konusu değil. Bu, §6'daki açıklık şartını bu paket için gereksiz kılıyor.

## 9. Üç (dört) modelin karşılaştırması — segment kararı kapandı (30.08.2026)

Kullanıcının ilettiği karşılaştırma, aynen:

| Model | Hukuki risk | Gelir potansiyeli | Karar |
|---|---|---|---|
| Kurumlara işgücü ve arbeidsnærvær danışmanlığı | Düşük–orta | Yüksek | **Önerilen** |
| Çalışanlara bireysel vaka desteği | Orta–yüksek | Orta–yüksek | Kontrollü ek hizmet |
| Vatandaşlara NAV/belediye süreçleri rehberliği | Yüksek | Düşük–orta | **İlk aşamada yapılmamalı** |
| Her iki tarafı aynı anda kapsayan sistem | Yüksek | Teorik olarak çok yüksek | Sonraki faz |

**Bu, §4/§7/§8'de açık bırakılan segment sorusunu kapatıyor:**

- **Birincil/başlangıç ürünü:** §8'deki *Workforce & Work-Ability Program* —
  yani **kurumlara** (işveren, belediye) satılan B2B danışmanlık. Hukuki risk
  düşük–orta, gelir potansiyeli yüksek olarak değerlendirilmiş; NAVIAR
  CONSULTING'in mevcut onaylı B2B kimliğiyle örtüşüyor.
- **Kontrollü ek hizmet:** Çalışana bireysel vaka desteği — kurumsal
  programın bir uzantısı olarak düşünülüyor, bağımsız bir ilk ürün değil.
  §7'deki sınırlar (teşhis yok, otomatik karar yok, notlar işverenle otomatik
  paylaşılmaz) tam olarak bu hizmeti güvenli kılmak için var — karşılaştırma
  tablosunun "orta–yüksek hukuki risk" değerlendirmesi bu sınırlarla birlikte
  okunmalı.
- **Sonraki faz:** İki tarafı birden kapsayan birleşik sistem — teorik üst
  sınır yüksek ama hem hukuki risk hem karmaşıklık en yüksek kombinasyon;
  şimdi tasarlanmıyor.

**Sonuç — §4 soru 1'in cevabı:** Ayrı bir descriptor değil, **CONSULTING'in
bir hizmet hattı.** Vatandaşa doğrudan kamu-süreç-rehberliği kolu (bu
belgenin başlangıç noktası olan "genel hizmet arayan bireyler / kamu
sektöründe yönlendirme" fikri) **kullanıcının kendi kararıyla ilk aşamadan
çıkarıldı.** Bu belgenin durumu artık TASLAK değil — segment ve kapsam net;
tasarım/kod üretimi öncesi kalan tek adım, bu hizmet hattının CONSULTING
descriptor'ı altında nasıl adlandırılıp sunulacağına karar vermek (bkz. §3'teki
Nice sınıfı notu, muhtemelen 35/41 — kurumsal danışmanlık/eğitim, kesin sınıf
hukuk teyidi gerektirir).
