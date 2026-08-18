# 03 — İki Ülkeli Model: Türkiye Tedarik → Norveç Satış

COBBAN'ın yapısı: **Türkiye'de tedarik/üretim → Norveç'te satış ve müşteri ilişkisi.**
Bu doküman malın ve paranın nasıl hareket edeceğini anlatır.

## 1. Üç olası akış modeli

### Model A — Toplu ithalat (önerilen, hacim varken)
```
TR tedarikçi → COBBAN TR (ihracat faturası, KDV %0)
    → konteyner/hava kargo → Norveç gümrüğü
    → COBBAN NO ithalat MVA öder (sonra indirir)
    → Norveç deposu → müşteriye 1-2 günde teslim
```
**Artı:** En düşük birim kargo, hızlı teslimat, kolay iade.
**Eksi:** Stok riski, peşin sermaye, depo maliyeti.
**Ne zaman:** Ayda 100+ sipariş.

### Model B — Sipariş bazlı doğrudan gönderim (başlangıç için)
```
Müşteri sipariş → COBBAN NO satar
    → COBBAN TR mikro ihracat (ETGB) ile doğrudan müşteriye gönderir
```
**Artı:** Sıfır stok riski, sermaye gerektirmez.
**Eksi:** 5–10 gün teslimat, gümrük sürprizleri, iade zor, müşteri deneyimi zayıf.
**Ne zaman:** İlk 3–6 ay, ürün-pazar uyumu testi.

### Model C — Hibrit (12. aydan sonra hedef)
En çok satan 20 ürün Norveç deposunda, uzun kuyruk Türkiye'den doğrudan.

## 2. Türkiye'den ihracat: Mikro İhracat (ETGB)

**ETGB = Elektronik Ticaret Gümrük Beyannamesi.** Küçük gönderiler için basitleştirilmiş ihracat.

| Konu | Detay |
|---|---|
| Kimler | Kargo/posta ile yurt dışına mal gönderen tüm firmalar |
| Sınır | Gönderi başına değer ve ağırlık sınırı var (**güncel limitleri gümrük müşavirinden teyit et** — sık değişir) |
| Nasıl | PTT, DHL, UPS, FedEx, Shipentegra gibi yetkili operatörler ETGB'yi senin adına düzenler |
| Gümrük müşaviri | Mikro ihracatta **gerekmez** — operatör hallediyor |
| Fatura | İhracat faturası, **KDV %0**, döviz cinsinden düzenlenir |
| Avantaj | ETGB, ihracat sayıldığı için **KDV iadesi** hakkı doğurur |

### KDV İadesi (Türkiye)
- Yurt dışına sattığın malın **alışında ödediğin KDV'yi geri alabilirsin.**
- ETGB veya normal gümrük beyannamesi ile belgelenir.
- **Nakden iade** (para) veya **mahsuben iade** (diğer vergi borçlarından düşme).
- Belirli tutarın altındaki iadeler YMM raporu olmadan alınabilir — SMMM'ne sor.
- ⚠️ Bu, marjın için ciddi bir kalem: %20 KDV geri geliyor. **Mutlaka takip et.**

### Gerekli belgeler
- [ ] İhracat faturası (İngilizce, döviz cinsinden, Incoterms belirtilmiş)
- [ ] Çeki listesi (packing list)
- [ ] ETGB (operatör düzenler)
- [ ] Menşe şehadetnamesi / A.TR (gerekirse — bkz. aşağı)

## 3. Norveç tarafında ithalat

### Norveç AB üyesi DEĞİL — ama EFTA/EEA üyesi
- **Türkiye–EFTA Serbest Ticaret Anlaşması** yürürlükte.
- Türkiye menşeli sanayi ürünlerinde **gümrük vergisi çoğunlukla %0**,
  şartı: **EUR.1 dolaşım belgesi** veya **fatura beyanı** ile menşe ispatı.
- ⚠️ Menşe belgesi olmadan gönderirsen normal gümrük tarifesi uygulanır — marj kaybı.
- Tarım/gıda ürünlerinde istisnalar ve kotalar var, ayrıca kontrol et.

### İthalat MVA
- Norveç'e giren malda **%25 ithalat MVA** hesaplanır (mal değeri + kargo + gümrük vergisi üzerinden).
- MVA'ya kayıtlı isen bunu **beyanında indirirsin** → net maliyet sıfır, sadece nakit akışı etkisi.
- MVA'ya kayıtlı **değilsen gerçek maliyet olur** → bu yüzden ithalat yapacaksan
  50.000 NOK eşiğini beklemeden **gönüllü MVA kaydı** düşün (koşullar için Skatteetaten'a sor).

### VOEC (VAT On E-Commerce) — dikkat!
- Norveç dışından Norveç'teki **tüketiciye** doğrudan satılan, değeri **3.000 NOK altındaki** mallar için
  satıcı VOEC'e kayıt olup satış anında %25 MVA tahsil eder.
- **Model B'yi (TR'den doğrudan Norveçli müşteriye) kullanıyorsan bu seni ilgilendirir.**
- VOEC olmadan gönderirsen paket gümrükte takılır, müşteri kapıda MVA + ~150 NOK gümrükleme ücreti öder
  → **iade ve şikâyet patlaması.** Bu, Norveç'e satan Türk mağazalarının 1 numaralı hatasıdır.
- Gıda, alkol, tütün VOEC kapsamı dışında.
- Kayıt: `skatteetaten.no/voec`

> **Pratik kural:** Norveçli müşteriye satıyorsan ya **Norveç'ten (yerel stok)** gönder,
> ya da **VOEC'e kayıt ol.** Üçüncü seçenek yok.

## 4. Norveç'ten AB'ye ve dünyaya satış

| Hedef | MVA/KDV | Not |
|---|---|---|
| Norveç içi | %25 tahsil et | Standart |
| AB ülkeleri | **%0** (ihracat) | Alıcı kendi ülkesinde ithalat KDV'si öder. AB'de 150 EUR altı için **IOSS** kaydı yaparsan sen tahsil edip müşteriyi gümrükten kurtarırsın — dönüşüm için önemli |
| İngiltere | %0 | 135 GBP altı satışta UK VAT kaydı gerekebilir |
| ABD | %0 | Eyalet bazlı sales tax nexus eşikleri (genelde 100k USD / 200 işlem) |
| Türkiye | %0 (Norveç'ten ihracat) | Alıcı TR'de gümrük öder |

**Öneri:** AB satışları büyürse **IOSS** kaydı yaptır (bir AB ülkesinde aracı üzerinden).
Müşteri "gizli maliyet" görmeyince iade oranı ciddi düşer.

## 5. Transfer fiyatlandırması ve şirketler arası fatura

COBBAN TR ile COBBAN NO **ilişkili taraflar** olacak. Bu ciddi bir vergi konusudur:

- Şirketler arası satış **emsallere uygun fiyatla** (arm's length) yapılmalı.
- TR şirketi NO şirketine çok ucuza satarsa → Türkiye'de **transfer fiyatlandırması yoluyla
  örtülü kazanç dağıtımı** eleştirisi gelir.
- Çok pahalıya satarsa → Norveç'te kâr azalır, Skatteetaten inceler.
- **Basit ve savunulabilir yöntem:** maliyet + makul kâr marjı (cost plus, ör. %8–15).
- Yıllık şirketler arası hacim büyüdüğünde **transfer fiyatlandırması raporu** hazırlaman gerekir.

> Bu konuyu **kurulumun ilk ayında** iki ülkedeki müşavirlerle birlikte netleştir.
> Sonradan düzeltmek pahalı.

## 6. Kur riski

- Gelir NOK/EUR, maliyet TRY → TL'nin değer kaybı **lehine** çalışır, ama tersi de olabilir.
- Fiyatları TL'ye endeksleme; NOK bazlı fiyat listesi tut, maliyeti çeyreklik gözden geçir.
- Büyük tedarik siparişlerinde ödeme vadesini kısa tut veya forward düşün.

## 7. Kontrol listesi

- [ ] Model seç (A / B / C) ve ilk 6 ay için yaz
- [ ] Gümrük müşaviri ile ETGB limitlerini teyit et
- [ ] EUR.1 / menşe beyanı sürecini tedarikçiyle kur
- [ ] VOEC gerekiyor mu? Gerekiyorsa kaydı yap
- [ ] KDV iadesi sürecini SMMM ile başlat
- [ ] Transfer fiyatlandırma politikasını yazılı hale getir
- [ ] Incoterms belirle (öneri: **DAP** — müşteriye teslim, gümrük alıcıda değil)
