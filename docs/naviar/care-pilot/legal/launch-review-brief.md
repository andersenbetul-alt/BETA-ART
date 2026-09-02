# NAVIAR Care — Lansman öncesi hukuk/muhasebe inceleme brief'i

Kaynak: NAVIAR Care Pilot Implementation Plan, Task 1 Step 2.
**Bu belge bir hukuki/mali görüş değildir** — Norveç iş/gizlilik hukuku
danışmanına ve muhasebeciye teslim edilecek soru paketidir. Onların yazılı
cevapları bu belgeye değil, `docs/naviar/care-pilot/decisions/decision-log.md`'ye
**birebir alıntılanarak** işlenir (planın kendi talimatı: "Record their
conclusions verbatim in the decision log").

## Danışmana/muhasebeciye teslim edilecek paket

1. `docs/naviar/care-pilot/operations/service-boundary-matrix.md` — hizmet
   sınırları ve yasak görev tablosu
2. Müşteri şartları (henüz yazılmadı — Task 1 çıktısı, bu brief onaylandıktan
   sonra hazırlanır)
3. Yardımcı istihdam modeli kararı (aşağıda, madde 2)
4. Gizlilik bildirimi ve rıza tasarımı — `docs/naviar/care-pilot/product/
   consent-and-communication-model.md` (Task 4)
5. Hedeflenen fiyat — bkz. `docs/naviar/care-pilot/finance/pilot-unit-economics.xlsx`
6. Veri sağlayıcı listesi (CRM, ödeme işleme, bordro)

## Sorulacak sorular — tek tek, yazılı cevap istenerek

### 1. Şirket biçimi

- AS mı, ENK mi, yoksa başka bir yapı mı? Plan bunu **bilinçli olarak
  açık bırakıyor** ("the plan does not silently choose a form") —
  danışman/muhasebeci belirlemeden başlanmaz.

### 2. İstihdam modeli — zaten karar verildi, teyit isteniyor

Plan gerekçeli olarak **istihdam** modelini seçti (bkz. §0,
`docs/naviar/NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md`): NAVIAR fiyatı,
hizmeti, eşleştirmeyi ve programı kendisi belirlediği için Norveç iş hukuku
bunu bağımsız yüklenicilik değil istihdam sayma eğiliminde
(Arbeidstilsynet). **Soru danışmana:** bu gerekçe, NAVIAR'ın planladığı
tam operasyon modeliyle (esnek saatler, birden fazla aile, tercih edilen +
yedek yardımcı) tutarlı mı, yoksa ek bir risk var mı?

### 3. MVA (KDV) muamelesi — kritik ve muhtemelen olumsuz

`docs/naviar/NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` §7'nin bulgusu:
VAT Act §5b yalnızca **"helsetjenester"** (sağlık hizmetleri) muaf
tutuyor; NAVIAR üç hizmeti de kasıtlı olarak tıbbi/kişisel bakım dışı
tasarladı. **Bu, muafiyete girmeme ihtimalinin güçlü bir işareti** — soru
danışmana açık uçlu değil, doğrudan: *"Bu üç hizmet (Trygt besøk, Følge til
aktivitet, Digital hverdagsstøtte) VAT Act §5b kapsamında muaf mı, yoksa
standart %25 oranına mı tabi?"* 12 aylık 50.000 kr ciro eşiği pilotun ilk
birkaç ayında aşılacak, bu yüzden cevap ilk faturadan önce elde edilmeli.

### 4. İstihdam maliyeti kalemleri — tam liste isteniyor

`NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` §7'de tahmini oranlar var (AGA
%14,1 Oslo, feriepenger %10,2, OTP asgari %2, yrkesskadeforsikring
~%0,5-1) — **hepsi arama özetinden, doğrulanmadı.** Muhasebeciden istenen:
bu dört kalemin **kesin** oranları + gözden kaçan başka zorunlu kalem var mı
(örn. sykepengeansvar, HMS-kort gereksinimi bu sektörde geçerli mi).

### 5. Sigorta

Yrkesskadeforsikring zorunlu (plan ve genel bilgi bunu doğruluyor) —
**hangi sağlayıcı, hangi prim, hangi branş kodu** (bu iş "sosyal
destek/refakat" olarak mı yoksa başka bir kategoride mi sınıflandırılıyor,
prim oranını bu belirliyor).

### 6. DPIA (Veri Koruma Etki Değerlendirmesi)

Datatilsynet, yüksek riskli işlemeden önce DPIA zorunlu kılabiliyor.
**Soru:** NAVIAR Care'in veri işleme modeli (yaşlı/hassas grup + rıza
katmanları + aile güncellemeleri) bu eşiği geçiyor mu? Gizlilik
danışmanının yazılı, evet/hayır cevabı isteniyor — plan bunu "must
document" diye zorunlu tutuyor.

### 7. Polis kaydı (politiattest)

Plan açıkça uyarıyor: *"do not assume that a care-related certificate is
available for this exact non-medical role"* — yani NAVIAR'ın yardımcılar
için talep edebileceği polis kaydı türü **belirsiz**, varsayılmamalı.
Danışmandan istenen: bu tıbbi olmayan, refakat/sosyal destek rolü için
hangi tür (varsa) polis kaydı talep edilebilir, hangi kanundan dayanak
alınır.

## Karar kapısı (Task 1 Step 4)

60 dakikalık bir toplantıda (kurucu + danışman + muhasebeci) şu beş soru
**çelişkisiz** cevaplanabilmeli:

- [ ] Bu görev kapsam içinde mi? (service-boundary-matrix.md'ye göre)
- [ ] İşveren kim?
- [ ] Müşteri ne ödüyor? (MVA dahil mi hariç mi netleşmiş olmalı)
- [ ] Yükseltme rotası ne?
- [ ] Hangi kişisel veri tutuluyor?

Herhangi bir kırmızı madde varsa müşteri kabulü **başlamaz**.
