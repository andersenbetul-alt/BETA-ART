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
