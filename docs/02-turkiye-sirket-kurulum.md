# 02 — Türkiye'de Şirket Kurulumu (COBBAN)

> Bilgilendirme amaçlıdır. Tutar ve oranları `gib.gov.tr`, `ticaret.gov.tr` ve SMMM'nle teyit et.

## 1. Şirket tipi: Şahıs mı Limited mi?

| | **Şahıs Firması** | **Limited Şirket (Ltd. Şti.)** |
|---|---|---|
| Kuruluş süresi | 1–2 gün | 3–7 gün |
| Kuruluş maliyeti | ~3.000–6.000 TL | ~15.000–25.000 TL |
| Sermaye | Yok | **50.000 TL** (¼'ü 24 ayda ödenir) |
| Sorumluluk | Sınırsız (kişisel malvarlığı) | Sermaye ile sınırlı — **ancak vergi/SGK borcunda ortak şahsen sorumlu** |
| Vergi | **Gelir vergisi %15–40 (artan oranlı)** | **Kurumlar vergisi %25** + temettü stopajı %15 |
| Muhasebe | İşletme defteri (basit) | Bilanço esası (ağır) |
| Aylık muhasebe ücreti | ~2.500–4.000 TL | ~5.000–9.000 TL |
| SGK | Bağ-Kur (4/b) zorunlu | Bağ-Kur (4/b) zorunlu |
| Kapatma | Kolay, ucuz | Tasfiye süreci, 6+ ay |

### COBBAN için tavsiye

**Şahıs firması ile başla.** Türkiye tarafı esas olarak *tedarik/üretim/ihracat* ayağı olduğu için:
- Yıllık kâr ~1.500.000 TL'yi geçtiğinde limitede geçmek vergisel olarak avantajlı hale gelir
  (gelir vergisinin üst dilimi %40 vs kurumlar %25 + %15 stopaj).
- **Genç Girişimci İstisnası:** 29 yaş altındaysan ve ilk defa mükellef oluyorsan
  3 yıl boyunca yıllık belirli bir tutara kadar **gelir vergisi istisnası** + 1 yıl Bağ-Kur primi
  Hazine tarafından karşılanır. Şahıs firmasında geçerli — ciddi avantaj.
- **İhracat istisnası:** Yurt dışına mal satışında KDV %0 ve KDV iadesi alınabilir (bkz. doküman 03).

## 2. Şahıs firması kurulum adımları

1. **SMMM (mali müşavir) bul** — kuruluşu o yapar, vekâletname yeterli.
2. **Vergi dairesi açılışı** — İnteraktif Vergi Dairesi / e-Devlet üzerinden.
   - NACE kodu: **47.91.01 – İnternet üzerinden perakende ticaret** (çok kategorili için uygun)
   - Ek olarak ihracat yapacaksan: **46.xx toptan ticaret** kodlarını da ekle.
3. **Yoklama** — vergi dairesi memuru iş yeri adresini kontrol eder.
   Ev adresi kullanılabilir (kira stopajı doğar) veya **sanal ofis** (~800–2.000 TL/ay).
4. **Bağ-Kur (4/b) tescili** — otomatik açılır, primi aylık öde.
5. **İmza beyannamesi** — noter (~1.500 TL).
6. **Ticaret Sicil / Esnaf Odası kaydı** (faaliyete göre).

## 3. E-ticaret için zorunlu kayıtlar

### ETBİS (Elektronik Ticaret Bilgi Sistemi) — ZORUNLU
- Ticaret Bakanlığı'nın sistemi. `etbis.ticaret.gov.tr`
- Kendi web siten, mobil uygulaman veya sosyal medya üzerinden satış yapıyorsan **kayıt zorunlu**.
- Kayıt sonrası verilen **ETBİS doğrulama bandını** sitenin footer'ına koymak zorundasın.
- Kayıtsız satış → idari para cezası.

### E-Fatura / E-Arşiv
- E-ticaret yapanlar için **e-Arşiv Fatura zorunlu** (ciro eşiğinden bağımsız olarak
  aracı hizmet sağlayıcı/pazaryeri üzerinden satışta zorunluluk doğar).
- Özel entegratör seç: Paraşüt, Logo İşbaşı, Uyumsoft, Nes Bilgi, Foriba.
- Aylık ~300–800 TL.

### Diğer
- [ ] **KVKK VERBİS kaydı** — yıllık çalışan sayısı ≥50 veya yıllık mali bilanço ≥25 mn TL ise zorunlu.
      Küçük işletme muaf olsa da **aydınlatma metni ve açık rıza yükümlülüğü herkes için geçerli.**
- [ ] **Mesafeli Satış Sözleşmesi** ve **Ön Bilgilendirme Formu** — siparişten önce onaylatılmalı
      → `sozlesmeler/TR-mesafeli-satis-sozlesmesi.md`
- [ ] **14 gün cayma hakkı** — Mesafeli Sözleşmeler Yönetmeliği
- [ ] **Garanti belgesi / tanıtma-kullanma kılavuzu** — belirli ürün gruplarında zorunlu
- [ ] **Ticari elektronik ileti (İYS)** — SMS/e-posta pazarlaması yapacaksan **İYS kaydı zorunlu**

## 4. Ödeme altyapısı (Türkiye)

| Sağlayıcı | Komisyon (yaklaşık) | Not |
|---|---|---|
| **iyzico** | %2,5–3,5 + işlem ücreti | En yaygın, kolay entegrasyon, taksit desteği |
| **PayTR** | %2,5–3,5 | Uygun, sanal POS |
| **Param / Sipay** | değişken | Alternatif |
| **Banka Sanal POS** | %1,5–2,5 | Ciro taahhüdü ister, en ucuzu |
| **Stripe** | TR'de sınırlı | Yurt dışı satış için Norveç şirketinden kullan |

> **Taksit Türkiye'de kritik:** 3–9 taksit sunmayan mağazada dönüşüm belirgin düşer.

## 5. Kargo (Türkiye)

| Taşıyıcı | Not |
|---|---|
| Yurtiçi Kargo, Aras, MNG, Sürat | E-ticaret anlaşmalı fiyat için aylık hacim gerekir |
| **Kolay Gelsin / Hepsijet** | E-ticaret odaklı, iade yönetimi iyi |
| **Sendeo, PTT Kargo** | Uygun fiyat |
| Yurt dışı | **PTT ETGB / DHL / UPS / FedEx** — bkz. doküman 03 |

Kargo entegrasyon aracı: **Kargoturk, Sipariş.io, Shipentegra** (çoklu kargo + pazaryeri).

## 6. Vergi oranları özeti

| Vergi | Oran |
|---|---|
| KDV — genel | **%20** |
| KDV — gıda, tekstil bazı ürünler, kitap | **%10** |
| KDV — ihracat | **%0** (iade alınabilir) |
| Gelir vergisi (şahıs) | %15 / %20 / %27 / %35 / %40 (artan dilim) |
| Kurumlar vergisi (limited) | %25 |
| Temettü stopajı | %15 |
| Bağ-Kur primi | Asgari ücret üzerinden aylık (SMMM'den güncel tutarı al) |
| Damga vergisi | Beyannameler üzerinden sabit tutar |

## 7. Tahmini kurulum maliyeti (TL)

| Kalem | Şahıs | Limited |
|---|---|---|
| SMMM kuruluş ücreti | 3.000 | 8.000 |
| Noter (imza, vekâlet, sözleşme) | 1.500 | 6.000 |
| Ticaret Sicil / Odalar | 500 | 6.000 |
| Sermaye | 0 | 50.000 (¼ peşin) |
| E-fatura entegratör (yıllık) | 5.000 | 8.000 |
| Muhasebe (yıllık) | 36.000 | 84.000 |
| Marka tescili (TÜRKPATENT, 1 sınıf) | ~8.000 | ~8.000 |
| **Toplam (sermaye hariç, 1. yıl)** | **~54.000** | **~120.000** |
