# HXI — small-business eklentisi şirket profili

**Amaç:** "small-business" eklentisini (knowledge-work-plugins) HXI'ye göre
özelleştirmek. Eklentinin özelleştirme yolu `smb-onboard` becerisiyle bir
şirket profili toplamaktır; bu belge o profildir. Eklenti kurulunca
`/small-business:smb-onboard`'a bu belgeyi verin — soruların çoğu yanıtlı gelir.

**Uydurma yok (CLAUDE.md / brand rule 0):** doğrulanmamış her alan
`[SAĞLANACAK]` ile işaretli. Tahmini gelir/ekip/banka bilgisi yazılmadı.

---

## 1. İşletme kimliği

| Alan | Değer |
|---|---|
| İş adı (marka) | HXI |
| Tür | Elektronik müzik sanatçısı / prodüktör (tek kişi + işbirlikleri) |
| Menşe | Oslo, Norveç · 59.91°N · 10.75°E |
| Aktiflik | 2021'den beri |
| Para birimi | **NOK** (birincil); streaming/sync gelirleri USD/EUR gelebilir |
| Resmî tüzel kişilik / org.nr | `[SAĞLANACAK]` — Norveç ENK/AS henüz doğrulanmadı |
| KDV (MVA) durumu | `[SAĞLANACAK]` |
| İletişim | booking@hximusic.com · site hximusic.com (hxi-nu.vercel.app) |

## 2. Gelir modeli (tipik KOBİ'den farklı — eşleme kritik)

HXI'nin geliri fatura kesen bir hizmet işletmesi gibi değil; dört kanaldan
gelir. Eklentinin varsayılan "invoice/QuickBooks" akışları buna göre
yeniden yorumlanmalı:

| HXI kanalı | Eklenti karşılığı | Not |
|---|---|---|
| **Streaming** (Spotify, Apple, YouTube) | gelir izleme — fatura DEĞİL | distribütör/aggregator ödeme raporlarından okunur |
| **Creator/NCS** (NCS yayınları) | lisanslı kullanım geliri | NCS ödeme dökümü kaynağı |
| **Sync/lisans** (film/oyun/reklam) | gerçek "fatura + sözleşme" akışı | tek yüksek-tutarlı B2B; `invoice-chase` + `contract-review` burada işler |
| **Booking** (performans/DJ) | hizmet faturası | düzensiz, sözleşmeli |

Öncelik: **sync ve booking** kanalları eklentinin fatura/sözleşme
akışlarına en iyi oturan kanallardır; streaming ve NCS "gelir görünümü"
akışlarıdır (fatura yok).

## 3. Doğrulanmış hesaplar / araçlar

| Alan | Değer |
|---|---|
| Spotify sanatçı | 3yRqd6IO6SamMAmnXwZKeU |
| Instagram | @prod.hxi |
| YouTube | @hximusic |
| NCS | ncs.io/artist/1169/hxi |
| Rezervasyon e-postası | booking@hximusic.com |

**Eklentinin beklediği ama HXI'de BAĞLI OLMAYAN araçlar** (akışlar bunlar
bağlanmadan canlı çalışmaz): QuickBooks, PayPal, HubSpot, Stripe, Square,
Docusign, Gsuite/O365. HXI'nin gerçek karşılıkları: distribütör paneli
(gelir), NCS paneli, e-posta (booking@), takvim (booking). Bunlar
bağlanana dek eklenti yalnız taslak/profil üretir.

## 4. Onay eşikleri (eklenti "para/müşteriye dokunan her adımı onaylat" der)

| Karar | Eşik |
|---|---|
| Sync/lisans teklifi kabulü | **her zaman kullanıcı onayı** (rakam + hak devri) |
| Booking sözleşmesi | **her zaman kullanıcı onayı** |
| Dışarı e-posta (booking@'dan) | gönderim öncesi onay |
| Sosyal paylaşım | marka kurallarına uygunluk + onay (bkz. hxi-yayin, ® yasağı) |
| Her para hareketi | `[SAĞLANACAK]` — tutar eşiği kullanıcıdan |

## 5. 30 iş akışının HXI'ye uygunluk haritası

**Doğrudan uygun (sync/booking B2B doğası):**
- `invoice-chase` — sync/booking faturaları için (streaming için değil)
- `contract-review` / `review-contract` — sync lisansı + booking sözleşmeleri
- `cash-flow-snapshot` — dört kanalın toplandığı nakit görünümü
- `lead-triage` — gelen sync/booking talepleri (booking@ kutusu)
- `friday-brief` / `monday-brief` — haftalık yayın+gelir özeti
- `content-strategy` / `run-campaign` — release kampanyaları (marka kurallarıyla)
- `price-check` / `margin-analyzer` — sync teklif fiyatlaması

**Kısmen uygun (uyarlama gerek):**
- `close-month` / `month-end-prep` — çok kanallı gelir; standart muhasebe değil
- `customer-pulse` — "müşteri" = süpervizör/marka + booking alan; fan değil
- `crm-cleanup` — sync/booking ilişkileri (HubSpot yok; e-posta/tablo tabanlı)

**Uygun değil (HXI'de karşılığı yok — çalıştırmayın):**
- `plan-payroll` — bordro yok (tek kişi) `[ekip varsa SAĞLANACAK]`
- `tax-season-organizer` / `tax-prep` — Norveç vergi; eklentinin ABD varsayımı uymaz
- `handle-complaint` / `ticket-deflector` — müşteri destek bileti yok

## 6. Marka kısıtları (eklentinin ürettiği HER çıktı bunlara uymalı)

- ® veya "korunmaktadır" dili YOK (tescil temiz değil — bkz. TESCIL-ARASTIRMASI.md).
- Çevrilmeyen öğeler: HXI, "THE SAME SPEED — COLDER.", UTGAVE, koordinatlar.
- Kampanya/sosyal çıktılar hxi-yayin becerisinin marka kurallarından geçer.
- Uydurma bağlantı/rakam yasak; yalnız doğrulanmış hesaplar (§3).

## 7. Eklenti kurulunca sıradaki adım

1. `/small-business:smb-onboard` çalıştır → bu belgeyi kaynak ver.
2. Gerçek çalıştırma için önce bağlanacak araç: **e-posta (booking@) + takvim**
   (booking/sync talep akışı), sonra distribütör geliri için ilgili panel.
3. İlk denenecek akış: `lead-triage` (booking@ gelen kutusu) — canlı araç
   gerektiren en düşük riskli, en yüksek değerli akış.
4. `[SAĞLANACAK]` alanları kullanıcıdan toplanınca profil tamamlanır.
