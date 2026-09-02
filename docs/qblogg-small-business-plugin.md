# QBLOGG × Small Business Plugin — Özelleştirme Kılavuzu

Plugin ID: `plugin_017zncz89kmhdPgdpZQZm5Dj`  
Durum: Yüklü değil — `small-business` pluginini etkinleştir, ardından bu kılavuzu kullan.

Bu belge, Small Business plugin'in her becerisini QBLOGG'un bağlamına göre
eşler; beceri çalıştırılmadan önce Claude'a ne söyleneceğini gösterir.

---

## QBLOGG Şirket Bağlamı (Tüm Beceriler İçin)

Bir beceri çalıştırmadan önce şu bağlamı ver:

```
Şirket: QBLOGG İçerik Stüdyosu
Tür: Tek kişilik AI destekli içerik üretim stüdyosu
Kurucu: Betül Andersen (andersen.betul@gmail.com)
Konum: Oslo, Norveç
Ürünler:
  - SEO blog yazısı (TR + EN tam makale; 8 dil özet katmanı)
  - LinkedIn içerik serisi
  - Sosyal medya içeriği
  - Newsletter (Buttondown)
  - Çok dilli yayın (10 dil)
Hedef müşteri: Kendi içerik ekibi olmayan KOBİ ve SaaS şirketleri
Fiyatlandırma: NOK cinsinden; Stripe ödemeleri (yurt içi kart %1,5 + 1,80 kr; yurt dışı +%3,25)
Araçlar: Gmail, Google Drive, Google Calendar, Canva, Stripe, Buttondown
Site: qblogg.vercel.app
Muhasebe yazılımı: Yok (Stripe + banka ekstresi)
CRM: Yok (Gmail + Drive klasörü)
Çalışan: Yok (serbest yazarlar proje bazında)
```

---

## Öncelikli Beceriler (Doğrudan Kullanılabilir)

### `/content-strategy`
**QBLOGG için ne yapar:** İçerik hattı planı — hangi blog konuları, hangi LinkedIn
serileri, hangi newsletter sayısı, hangi dillerde.  
**Ek bağlam:** "Kanallar: QBLOGG blogu (SEO odaklı), LinkedIn (kurucu), Buttondown
newsletter. Hedef: brief formu doldurmak. Kendi içerik ekibi olmayan KOBİ'ler."

---

### `/monday-brief`
**QBLOGG için ne yapar:** Haftanın başında: teslim bekleyen makaleler, gelen brief
formları, takvim.  
**Ek bağlam:** "Takip edilecek: Stripe'daki bekleyen ödemeler, Drive'daki taslak
klasörü, Buttondown gönderim tarihi. QuickBooks yok, muhasebe Stripe + banka."

---

### `/friday-brief`
**QBLOGG için ne yapar:** Hafta sonu özeti: teslim edilen içerikler, alınan brifler,
gelecek haftanın öncelikleri.  
**Ek bağlam:** Aynı araç seti. Haftalık içerik çıktısını (makale sayısı, dil sayısı)
ve yeni müşteri etkileşimlerini özetle.

---

### `/customer-pulse` ve `/customer-pulse-check`
**QBLOGG için ne yapar:** Aktif müşteri sağlığı — memnunlar mı, yeniliyorlar mı,
referans veriyorlar mı?  
**Ek bağlam:** "Müşteri iletişimi Gmail üzerinden. CRM yok; Drive'da müşteri başına
klasör var. Churn sinyali: brief vermiyor veya revizyon talepleri artıyor."

---

### `/lead-triage`
**QBLOGG için ne yapar:** Brief formundan gelen yeni potansiyel müşterileri önceliklendir.  
**Ek bağlam:** "Lead kaynağı: qblogg.vercel.app'teki brief formu (mailto: taslağı,
gelen kutusu). Nitelik kriterleri: bütçe >3.000 kr/ay, düzenli yayın isteği, belirli hedef."

---

### `/sales-brief`
**QBLOGG için ne yapar:** Aylık satış görünümü — aktif müşteriler, pipeline, hedef.  
**Ek bağlam:** "Gelir = Stripe tahsilatları. Hedef: aylık tekrarlayan gelir (MTR)
artışı. Pipeline = brief formu yanıt bekleyenler + teklif gönderilenler."

---

### `/invoice-chase`
**QBLOGG için ne yapar:** Ödenmemiş Stripe faturalarını takip et ve hatırlatma yaz.  
**Ek bağlam:** "Ödeme platformu: Stripe (Norveç). Para birimi: NOK. Vade: proje
tesliminde veya aylık abonelik için ay başında."

---

### `/run-campaign`
**QBLOGG için ne yapar:** QBLOGG'un kendi pazarlama kampanyasını planla ve çalıştır.  
**Ek bağlam:** "Kanallar: LinkedIn (kurucu hesabı), blog (qblogg.vercel.app),
Buttondown newsletter. Amaç: brief form doldurmak. Ücretli reklam yok."

---

### `/price-check`
**QBLOGG için ne yapar:** Paket fiyatlarını piyasayla karşılaştır.  
**Ek bağlam:** "Fiyatlar NOK, Norveç pazarı. Stripe maliyeti: %1,5 + 1,80 kr yurt içi.
Rakipler: Norveç ve İskandinav içerik ajansları. Fiyatlar tahmini/örnek işaretlenmeli."

---

### `/margin-analyzer`
**QBLOGG için ne yapar:** Makale üretim maliyeti vs. paket fiyatı — brüt marj analizi.  
**Ek bağlam:** "Maliyet = yazar ücreti (NOK/makale) + araç abonelikleri. Gelir =
müşteri paket bedeli. Stripe komisyonu düşüldükten sonra net marj hesapla."

---

### `/smb-onboard`
**QBLOGG için ne yapar:** Yeni müşteri başlangıç süreci.  
**Ek bağlam:** "Adımlar: (1) brief formu doldu, (2) keşif görüşmesi, (3) teklif +
sözleşme, (4) ilk makale brifing, (5) taslak, (6) teslim. Drive'da müşteri klasörü aç."

---

### `/job-post-builder`
**QBLOGG için ne yapar:** Serbest yazar iş ilanı oluştur.  
**Ek bağlam:** "İlan dili: TR veya EN. Aranan: SEO odaklı yazar, tercihen çift dilli
(TR+EN). Başvuru: e-posta ile. Ücret: proje bazında NOK veya EUR."

---

### `/handle-complaint`
**QBLOGG için ne yapar:** Müşteri şikayetine yanıt yaz.  
**Ek bağlam:** "Şikayet genellikle: ton uyumsuzluğu, gecikme, SEO performansı.
Yanıt tonu: sakin, çözüm odaklı. Revizyon politikası: teslimden sonra 7 gün, 2 tur."

---

### `/business-pulse`
**QBLOGG için ne yapar:** Aylık genel işletme sağlığı özeti.  
**Ek bağlam:** "Metrikler: aktif müşteri sayısı, aylık gelir (Stripe), teslim edilen
makale sayısı, ortalama yanıt süresi. Hedef: sürdürülebilir büyüme, kalite düşmesin."

---

### `/quarterly-review`
**QBLOGG için ne yapar:** Çeyrek dönem değerlendirmesi — neyin işe yaradığı, neyin yaramadığı.  
**Ek bağlam:** "Q bazında: gelir trendi, müşteri sürekliliği, içerik kalitesi (npm run
gorunurluk skoru), site trafiği (Vercel Analytics). Sonraki çeyrek için öncelik belirle."

---

### `/contract-review` ve `/review-contract`
**QBLOGG için ne yapar:** Müşteri veya yazar sözleşmesini incele.  
**Ek bağlam:** "Hukuki çerçeve: Norveç hukuku. Dil: Norveçce veya İngilizce.
Önemli maddeler: fikri mülkiyet devri, revizyon hakları, ödeme koşulları, fesih."

---

## Kısmen İlgili Beceriler

| Beceri | Durum | Not |
|---|---|---|
| `tax-prep` | Dikkatli kullan | Norveç bağlamı: MVA (VAT), næringsinntekt, Altinn |
| `month-end-prep` | Kısmen | Muhasebe yazılımı yok; Stripe raporu + banka ekstresi |
| `cash-flow-snapshot` | Kısmen | QuickBooks yok; Stripe + banka verisiyle çalış |

---

## Şimdilik İlgisiz Beceriler

| Beceri | Neden |
|---|---|
| `plan-payroll` | Çalışan yok (serbest yazar = proje bazında ödeme) |
| `close-month` | Muhasebe yazılımı yok |
| `crm-cleanup`, `crm-maintenance` | HubSpot yok |
| `ticket-deflector` | Destek sistemi yok |
| `smb-router` | Yönlendirme için büyük ekip gerekir |

---

## Kurulum Notu

Plugin henüz yüklü değil. Etkinleştirmek için:

1. claude.ai → Ayarlar → Pluginler
2. "Small Business" → Etkinleştir
3. Bağlı araçları onayla: Gmail, Google Drive, Google Calendar, Canva, Stripe

Stripe bağlantısı kurulunca `/invoice-chase` ve `/margin-analyzer` gerçek veriyle çalışır.
Gmail bağlantısıyla `/lead-triage` ve `/customer-pulse` gelen kutusunu tarar.
