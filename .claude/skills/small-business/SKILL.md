---
name: small-business
description: BETA ART'ın kendi küçük işletme işleri — nakit takibi, Norveç şahıs şirketi (enkeltpersonforetak) için MVA ve forskuddsskatt, üç mülkün (BAP-01 Privat / BAG-03 Galleri / BAB-02 Business) satış ve müşteri kaydı. Kullanıcı "MVA", "forskuddsskatt", "muhasebe", "banka ekstresi", "fatura", "nakit durumu", "BAP/BAG/BAB" ya da BETA ART'ın parasal/müşteri işleriyle ilgili bir şey sorduğunda MUTLAKA bu beceriyi kullan. Para veya müşteriye giden HER adım kullanıcı onayı gerektirir — bu beceri hiçbir ödeme, fatura veya mesajı kullanıcı onayı olmadan göndermez.
owner: BETA ART
---

# small-business — BETA ART nakit, MVA ve müşteri kaydı

**Zorunlu kural, istisnasız:** Para veya bir müşteriye ulaşan **her adım** kullanıcı
onayı ister — fatura göndermek, ödeme talep etmek, MVA beyanı hazırlamak,
bir müşteriye e-posta taslağı dışında bir şey yollamak. Bu beceri hiçbir
zaman kendi başına harekete geçmez; taslak hazırlar, onay bekler.

---

## 1. Üç mülk — doğrulanmış kodlar

Kaynak: `beta-art/docs/BETA-ART-PROJECT-CODES.md` + `PROJECT-MANIFEST.md`

| Kod | Mülk | Ne satar | Dil | Fiyat bandı |
|---|---|---|---|---|
| **BAP-01** | Privat | Doğrulanmış fotoğraf, edisyon, doğrudan lisanslama | İngilizce | kr 190 / 890 / 2 900 |
| **BAG-03** | Galleri og Utstilling | Sergi, etkinlik, sanatçı/eser programı | İngilizce | *(henüz fiyatlanmadı)* |
| **BAB-02** | Business | İnşaat sektörüne proje arşivi ve dokümantasyon | Norveççe öncelikli | kr 490 – 39 000 (25 hizmet) |

**BAC çözümü:** Önceki bir oturumda geçen "BAC subscription clients" kodu hiçbir
resmi BETA ART belgesinde yer almıyor. Üçüncü mülk BAG-03'tür (Galleri og
Utstilling). BAC ya Galleri resmileşmeden önceki çalışma koduydu ya da BETA ART
dışındaki bir girişime aitti. Bu beceri BAC varsayımıyla çalışmaz; bir BAC
müşterisi veya geliri ortaya çıkarsa kullanıcı hangi mülke ait olduğunu söylemeli.

---

## 2. Ödeme altyapısı — doğrulanmış kararlar

Kaynak: `beta-art/docs/05paymentarchitecture.md` (karar tarihi: 2026-08-20)

- **Tek ödeme katmanı:** Stripe. Tüm mülkler (BAP/BAG/BAB) aynı Stripe hesabından
  işlem yapıyor. Lemon Squeezy, Paddle veya bölünmüş hesap yok.
- **Tek seferlik ödemeler (Norveç):** Vipps — ama Stripe Vipps desteği hâlâ *private
  preview* aşamasında; önce preview erişimi gelmeli.
- **Abonelik/retainer:** Kart zorunlu — Stripe üzerinden Vipps aboneliği desteklenmiyor.
- **Sunucu:** Ödeme servisi Render'da, Frankfurt (AB bölgesi). Siteler Vercel'de.
- **Kayıt tutulması gereken:** Stripe webhook → erişim verildi mi değil; `access`
  bir webhook onayıyla verilir, yönlendirmeyle değil.

---

## 3. MVA (Merverdiavgift) — çerçeve

Kaynak: `05paymentarchitecture.md`

| Kural | Değer |
|---|---|
| Norveç MVA eşiği | kr 50 000 kümülatif ciro (rolling) |
| AB'ye dijital tüketici satışı | Eşiksiz non-Union OSS — ilk satıştan itibaren |
| Hesap / beyan | Altinn + muhasebeci onayı gerekli; bu beceri taslak üretir |
| Beyan dönemi | ⚠️ **EKSİK — kullanıcı doğrultmalı:** aylık mı, çift aylık mı? |

**Forskuddsskatt taksit tarihleri** da kullanıcı/muhasebeci onaylı değil;
bu beceri taslak hazırlar, sayıları kullanıcı teyit etmeden gönderilmez.

---

## 4. Fiyat referansı

Kaynak: `beta-art/docs/18ismodeli.md`

### BAP-01 Privat — arşiv lisansı

| Tier | Fiyat |
|---|---|
| Kişisel | kr 190 |
| Ticari | kr 890 |
| Genişletilmiş | kr 2 900 |

### BAB-02 Business — proje hizmetleri

| Hizmet | Fiyat bandı |
|---|---|
| Tek proje (küçük) | kr 490 – |
| Tek proje (büyük) | – kr 39 000 |
| Retainer / aylık | (ayrıca fiyatlandırılacak) |

BAG-03 (Galleri) için henüz onaylı fiyat yok; gelir kaydında kod olarak tutulur,
gerçek tutar üzerinde konuşulana kadar tahmin edilmez.

**Mülkler arası fiyat/lisans geçişi yasak:** BAP şartları BAG veya BAB'a
uygulanamaz (`BETA-ART-ROUTE-MAP.md` açık kural).

---

## 5. Dil kuralı

| Mülk | Müşteri dili |
|---|---|
| BAB-02 Business | Norveççe öncelikli |
| BAP-01 Privat | İngilizce |
| BAG-03 Galleri | İngilizce |
| Kullanıcıyla iç yazışma | Türkçe (bu beceri Türkçe yanıt verir) |

---

## 6. Doldurulması gereken operasyonel veri ⚠️

Bunlar hâlâ eksik — **tahmin edilmez, kullanıcıdan beklenir:**

| Alan | Neden gerekli | Ne sorulacak |
|---|---|---|
| **Banka adı + export formatı** | Nakit özeti için banka ekstresini ayrıştırmak gerekiyor | "Hangi bankayı kullanıyorsun, CSV/PDF formatında mı iniyor?" |
| **MVA beyan dönemi** | Dönem sonu taslağı ve Altinn takvimleri için | "Norveç MVA'nı aylık mı, çift aylık mı (termin) beyan ediyorsun?" |
| **Org.nr** | Fatura ve resmi belgeler için | "ENK kaydı tamamlandı mı? Org.nr kaç?" |
| **Pipeline dosyası** | Müşteri ve potansiyel müşteri takibi için | "Müşterileri nerede tutuyorsun — Notion/Google Sheet/JSON?" |
| **Stripe canlı mı?** | Gerçek işlem vs. test mode için | "Stripe hesabı live moda geçti mi, yoksa test modunda mı?" |

Bir görev bu alanlardan birini gerektiriyorsa ve kullanıcı vermemişse:
**tahmin etme, doğrudan sor.**

---

## 7. Bu becerinin yaptıkları

### 7a. Nakit durumu özeti

Kullanıcı banka/muhasebe export'unu paylaştığında:
1. Satırları üç mülke ayır (BAP / BAG / BAB) — gelir ve gider
2. Dönem toplamlarını çıkar
3. MVA eşiğine ne kadar kaldığını hesapla
4. Özet tabloyu göster, kullanıcı onayı iste

### 7b. Fatura / tahsilat taslağı

Bir satış veya Stripe kaydı geldiğinde:
1. Mülkü (BAP/BAG/BAB) ve fiyat seviyesini tespit et
2. Fatura taslağını hazırla: alıcı, tutar, MVA (eğer kayıtlıysa), tarih, referans
3. Onay iste — gönderme

Fatura şablonu (taslak, org.nr gerçek değil):

```
FATURA / FAKTURA
Satıcı: BETA ART — [Ad Soyad]
Org.nr: ⚠️ DOLDURULMADI
Tarih: YYYY-MM-DD
Fatura no: BAP-YYYY-NNN / BAB-YYYY-NNN

Alıcı: [isim, adres]

Hizmet: [açıklama]
Tutar (eks. MVA): kr ___
MVA %25: kr ___  ← yalnızca kayıtlı olduğunda
Toplam: kr ___

Ödeme: [banka/Stripe]
Vade: [tarih]
```

### 7c. MVA beyan taslağı

Dönem bittikten sonra kullanıcı "MVA hazırla" dediğinde:
1. Dönem gelirlerini listele (BAP/BAG/BAB ayrı)
2. Vergiye tabi tutarları hesapla
3. Non-Union OSS'e tabi AB satışları ayrı işaretle
4. Taslak beyan tablosunu göster
5. **Altinn'e göndermez** — kullanıcı ve/veya muhasebeci görev alır

### 7d. Müşteri kaydı

| Mülk | Ne kaydedilir |
|---|---|
| BAB-02 | Pilot görüşme talebi, şirket, temas kişisi, proje tipi, durum (ilk görüşme/teklif/pilot/aktif) |
| BAP-01 | Lisans talebi, amaç, mülk, tier, durum |
| BAG-03 | Sergi/etkinlik kaydı, sanatçı, katılımcı, durum |

Pipeline dosyası formatı netleşmeden taslak format Markdown tablosu olarak çıkar;
kullanıcı onayladıktan sonra hedef dosyaya işlenir.

---

## 8. Sınırlar — bu beceri neyi yapmaz

- **Canlı Stripe, DNS, Altinn, Render işlemi yapmaz.** Taslak hazırlar, göndermez.
- **Vergi/hukuk tavsiyesi vermez.** MVA eşikleri, OSS kuralları ve forskuddsskatt
  taksitleri referans olarak verilir; muhasebeci/regnskapsfører teyidi gerekir.
- **Org.nr'siz resmi belge üretmez.** Taslağa ⚠️ işareti koyar.
- **Bir mülkün şartını diğerine uygulamaz.**
- **"Pipeline dosyası"nı tahmin etmez** — hangi sistemde tutulduğunu bilmeden
  kayıt ekleyemez.
