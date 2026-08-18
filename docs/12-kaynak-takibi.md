# 12 — Kaynak Takibi ve Doğrulama Kaydı

Bu projedeki rakamlar (vergi oranları, eşikler, sermaye tutarları, limitler)
**her yıl değişir.** Bu dosya, hangi bilginin ne zaman ve hangi kaynaktan
doğrulandığını kaydeder. Bir rakam kullanmadan önce buraya bak:
"son kontrol" tarihi 6 aydan eskiyse yeniden doğrula.

## Doğrulama kaydı

| Bilgi | Değer | Kaynak | Son kontrol | Tekrar bak |
|---|---|---|---|---|
| Norveç MVA kayıt eşiği | **50.000 NOK** / kayan 12 ay, net ciro | Skatteetaten — Merverdiavgiftshåndboken | 2026-08 | 2027-02 |
| Norveç MVA genel oran | %25 | Skatteetaten | 2026-08 | 2027-02 |
| VOEC değer sınırı | **3.000 NOK — ürün başına** | Tolletaten / Skatteetaten | 2026-08 | 2027-02 |
| VOEC kapsam dışı | gıda, takviye, vitamin, ilaç, silah, alkol, tütün, şeker, içecek ambalajı, madeni yağ, sera gazlı beyaz eşya | Tolletaten | 2026-08 | 2027-02 |
| TR mikro ihracat (ETGB) sınırı | **600 kg brüt / 30.000 EUR** (gönderi başına) | Ticaret Bakanlığı düzenlemesi, yürürlük **04.12.2025** | 2026-08 | 2027-02 |
| TR limited şirket asgari sermaye | **50.000 TL** | Cumhurbaşkanlığı kararı / TÜRMOB | 2026-08 | 2027-01 |
| TR anonim şirket asgari sermaye | **250.000 TL** | aynı | 2026-08 | 2027-01 |
| Mevcut şirketlerin uyum tarihi | **31.12.2026** — aksi hâlde münfesih | TÜRMOB sirküleri | 2026-08 | **2026-12 (kritik)** |
| Genç girişimci kazanç istisnası | **400.000 TL/yıl**, 3 dönem | GİB | 2026-08 | 2027-01 |
| Genç girişimci Bağ-Kur teşviki | ❌ **KALDIRILDI — 31.12.2025** | SGK mevzuat değişikliği | 2026-08 | — |
| TR KDV genel oran | %20 | GİB | 2026-08 | 2027-01 |
| TR kurumlar vergisi | %25 | GİB | 2026-08 | 2027-01 |

## Doğrulanamayanlar

| Bilgi | Durum |
|---|---|
| Brønnøysund kayıt ücretleri (ENK / AS) | `brreg.no` bu ortamdan erişilemedi. Dokümandaki rakamlar **yaklaşıktır** — `brreg.no/en/how-can-we-help-you/fees-for-registration/` adresinden teyit et |
| Bağ-Kur prim tutarı | Asgari ücrete bağlı, her yıl değişir — SMMM'den al |
| Tüketici Hakem Heyeti parasal sınırları | Her yıl yeniden belirlenir — `ticaret.gov.tr` |
| Marka tescil ücretleri (Patentstyret / TÜRKPATENT) | Yaklaşık; kurum tarife sayfalarından teyit et |

## Bu değişiklikler dokümanlara nasıl yansıdı

- `docs/01` — MVA eşiğinin **kayan 12 ay** ve **net ciro** olduğu netleştirildi
- `docs/02` — Bağ-Kur teşvikinin kaldırıldığı eklendi *(eski metin yanlıştı)*,
  istisna tutarı 400.000 TL yazıldı, 31.12.2026 sermaye uyum uyarısı eklendi
- `docs/03` — ETGB limitleri 600 kg / 30.000 EUR olarak güncellendi,
  VOEC sınırının **ürün başına** olduğu ve kapsam dışı listesi eklendi

## Düzenli olarak izlenecek kaynaklar

| Konu | Kaynak |
|---|---|
| Norveç vergi/MVA | `skatteetaten.no` — *Nyheter* bölümü |
| Norveç gümrük/VOEC | `toll.no/no/bedrift/import/voec` |
| Norveç şirket kaydı | `brreg.no` |
| Norveç tüketici hukuku | `forbrukertilsynet.no`, `lovdata.no` (angrerettloven, markedsføringsloven) |
| TR vergi | `gib.gov.tr` — sirküler ve tebliğler |
| TR e-ticaret/ETBİS | `ticaret.gov.tr`, `etbis.ticaret.gov.tr` |
| TR gümrük/mikro ihracat | `ticaret.gov.tr` gümrük genelgeleri |
| TR meslek kaynağı | `turmob.org.tr` sirkülerleri |
| KVKK | `kvkk.gov.tr` |
| GDPR (Norveç) | `datatilsynet.no` |

## Nasıl güncellenir

Yeni bir oturumda: yukarıdaki tabloda "tekrar bak" tarihi geçmiş satırları ara,
kaynaktan doğrula, değeri ve tarihi güncelle. Değer değiştiyse ilgili dokümanı
da düzelt ve bu dosyanın "Bu değişiklikler dokümanlara nasıl yansıdı"
bölümüne yaz. Eski değeri silme — **neyin ne zaman değiştiği** planlama için önemli.
