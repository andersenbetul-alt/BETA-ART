# NaviarCare — Uyum Çerçevesi

Son güncelleme: 2026-09-01  
Kapsam: `naviar/care/` — pilot MVP  
Durum: **Tasarım aşaması — yayın öncesi iç belge**

---

## 1. Sağlık Verisi Minimizasyonu (GDPR Madde 9 / Norveç kişisel sağlık verileri kanunu)

Sağlık bilgileri "özel kategori veri" sayılır; gereksiz yere toplanmamalıdır.

### Mevcut tasarımda durum

| Alan | Toplanan mı? | Zorunlu mu? | Saklama |
|---|---|---|---|
| Şikayet serbest metin (`triage.html`) | Evet | Evet — yönlendirme için | Randevu süresince; sonra silinmeli |
| Kronik hastalık / ilaç bilgisi | Hayır — henüz form yok | - | - |
| Doktor görüşme notu | Hayır — MVP kapsam dışı | - | - |

### Gerekli teknik önlemler (tasarıma yansıtılacak)

- [ ] Serbest metin şikayeti yalnızca seçilen doktorla paylaşılır, üçüncü tarafa iletilmez
- [ ] Randevu iptal edilirse veya 30 gün geçerse şikayet metni otomatik silinir
- [ ] Kullanıcı "verilerimi sil" talebini doğrudan yapabilmeli (GDPR Madde 17)
- [ ] Gizlilik bildirimi: hangi veri, neden, ne kadar süre, kimin göreceği — randevu öncesi onay alınmalı

---

## 2. Yapay Zekâ ile Otomatik Karar Yasağı (EU AI Act Madde 6; GDPR Madde 22)

Yüksek riskli yapay zekâ sistemleri insan denetimi olmaksızın bireyi etkileyen kararlar alamaz. Sağlık bağlamındaki triage sistemleri EU AI Act Ek III kapsamında **yüksek riskli** sayılabilir.

### Mevcut tasarımda durum

NaviarCare triage akışı **öneri verir, karar vermez**:
1. Kullanıcı şikayeti yazar → sistem eşleşen doktorları sıralar
2. **Kullanıcı nihai seçimi yapar** (`booking.html`)
3. Doktor randevuyu kabul/reddeder

Bu yapı GDPR Madde 22'yi karşılıyor. Belgelenecek.

### Gerekli önlemler

- [ ] Arayüzde açık uyarı: "Bu öneri listesi; nihai karar size aittir."
- [ ] Hangi kriterlerin doktoru önerdiği kullanıcıya gösterilmeli (açıklanabilirlik)
- [ ] Triage modeli varsa: teknik dokümantasyon, doğruluk metrikleri, önyargı testi — EU AI Act Madde 13–17
- [ ] Pilot aşamada: tam otomasyon yok, her randevu doktor onayı gerektiriyor

---

## 3. Kurumsal Veri Yönetimi: Erişim, Silme, Denetim

### Gerekli tasarım kararları (henüz uygulanmadı)

| Gereksinim | Açıklama |
|---|---|
| **Rol tabanlı erişim** | Hasta kendi verisini görür; doktor yalnızca kendi hastalarını; admin sistemi yönetir |
| **Silme süresi** | Randevu + 30 gün sonra otomatik; kullanıcı talebiyle anında |
| **İşlem kaydı (audit log)** | Kim ne zaman hangi veriye erişti — değiştirilemez log |
| **Veri taşınabilirliği** | Kullanıcı kendi verilerini JSON/PDF olarak indirebilmeli (GDPR Madde 20) |

Bu gereksinimler `engine/schema.sql` genişletilirken uygulanacak. Pilot MVP'de Supabase Row Level Security (RLS) ile başlanabilir.

---

## 4. Norveç KI-loven (Yapay Zekâ Kanunu Taslağı)

**Durum:** Regjeringen'in `under behandling` (yasama sürecinde) listesinde.  
**Kaynak:** Regjeringen.no — KI-loven taslağı, 2025–2026.

EU AI Act 2 Ağustos 2024'te yürürlüğe girdi; Norveç EEA üyesi olarak uyum yükümlüsüdür.  
KI-loven ayrı bir Norveç yasası değil, AI Act'in iç hukuka aktarımıdır.

**Pratik adım:** KI-loven onayını beklemeye gerek yok. Sistem şimdiden AI Act uyumlu tasarlanmalı.

### MVP için uygulanması gereken AI Act maddeleri

| Madde | Konu | MVP'de durum |
|---|---|---|
| Madde 9 | Risk yönetim sistemi | ☐ Belgelenecek |
| Madde 13 | Şeffaflık ve bilgilendirme | ☐ Arayüz notu eklenecek |
| Madde 14 | İnsan denetimi | ✓ Kullanıcı seçiyor, doktor onaylıyor |
| Madde 17 | Kalite yönetim sistemi | ☐ Pilot sonrası |
| Madde 50 | Genel amaçlı AI şeffaflık | Uygulanmıyor — genel amaçlı AI kullanımı değil |

---

## 5. Erişilebilirlik — WCAG 2.1 AA / Norveç uuTilsynet

**Yasal dayanak:** Likestillings- og diskrimineringsloven § 18; forskrift om universell utforming av IKT.  
**Kaynak:** uutilsynet.no — kamu ve özel kuruluşların dijital hizmetleri WCAG 2.1 AA ile uyumlu olmalı.

### Mevcut durum özeti (2026-09-01 taraması)

| Kontrol | Durum | Not |
|---|---|---|
| `lang` niteliği | ✓ Tüm sayfalarda `<html lang="en">` var | Türkçe sayfa açıkça yok; dil değişimi JS ile |
| Tüm görsellerde `alt` | ✓ 9/9 sayfada logo+favicon alt metni var | |
| Klavye odağı görünür | ☐ Denetlenmedi | CSS'de `:focus-visible` kontrolü gerekiyor |
| Renk kontrastı | ☐ Kısmen — `--text-3: #6b7a92` açık zeminde 3,5:1 | AA için 4,5:1 gerekli |
| Form etiketleri | ☐ `triage.html` ve `join.html` denetlenmeli | `<label>` ilişkilendirmesi |
| Mobil dokunma hedefi | ☐ 44×44 px minimum | Küçük linkler kontrol edilmeli |
| Atlama bağlantısı | ☐ Yok | "İçeriğe geç" bağlantısı eklenmeli |
| Hata mesajı | ☐ Form hataları programatik mı? | `aria-describedby` veya `aria-live` |

### Acil düzeltmeler

1. **`--text-3` kontrast sorunu** — `#6b7a92` açık zeminde 3,5:1 (AA eşiği 4,5:1). Düzeltme: `#5a6a82` → ~4,6:1.
2. **Atlama bağlantısı** — Her sayfada `<a href="#main-content" class="skip-link">İçeriğe geç</a>` eklenecek.
3. **Form `<label>` ilişkilendirmesi** — `triage.html` ve `join.html` denetlenecek.

---

## 6. Açık Kalanlar ve Takvim

| Madde | Sorumlu | Hedef |
|---|---|---|
| WCAG kontrast ve atlama bağlantısı | Geliştirme | MVP'den önce |
| Gizlilik bildirimi onay akışı | Geliştirme + Hukuk | MVP'den önce |
| Randevu verisi silme politikası | Mimari | Veritabanı tasarımında |
| AI Act teknik dokümantasyonu | Geliştirme | Pilot beta'dan önce |
| Kullanıcı testi — ekran okuyucu | Test | Beta aşamasında |

---

> **Not:** Bu belge iç planlama kaydıdır. Hukuki uyum değerlendirmesi için Norveç veri koruma hukuku uzmanından görüş alınmalıdır.
