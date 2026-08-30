---
name: small-business
description: Beta Art'ın kendi küçük işletme operasyonları — Norveç şahıs şirketi (enkeltpersonforetak) için nakit takibi, MVA (KDV) hesaplama, forskuddsskatt (peşin vergi) taksitleri; BAB (NAVIAR) pilot satış/sözleşmeleri, BAC (Q Work) abonelik müşterileri, BAP (QBLOGG) içerik/yayın "edition"ları için satış pipeline'ı. Muhasebe/banka ekstresi, Stripe export'u veya pipeline dosyası üzerinde çalışırken, ya da "MVA hesapla", "forskuddsskatt", "nakit durumu", "bu ayki ciro", "BAB/BAC/BAP", "pipeline güncelle", "fatura", "enkeltpersonforetak" gibi ifadeler geçtiğinde MUTLAKA bu beceriyi kullan. Bu bir internal/dahili beceridir — herkese açık paylaşılmaz.
---

# Beta Art — küçük işletme operasyonları

Bu beceri **dahili**dir: Beta Art'ın kendi Norveç şahıs şirketi (enkeltpersonforetak)
operasyonlarını yönetir. Sahibinden başka kimse için anlamlı değildir, dışarı
paylaşılmaz.

## Değişmez kural: onay kapısı

**Parayı veya bir müşteriyi ilgilendiren hiçbir adım kullanıcı onayı olmadan
atılmaz.** Bu şunları kapsar: bir faturayı göndermek, MVA beyannamesini
göndermek, forskuddsskatt ödemesini onaylamak, bir sözleşmeyi müşteriye
iletmek, bir aboneliği aktif/iptal olarak işaretlemek, pipeline'da bir kaydı
"kazanıldı/kaybedildi" yapmak. Bu beceri her zaman **taslak üretir** —
göndermez, dosyalamaz, ödemez. Taslağın altına her seferinde şunu ekle:
"Bu bir taslak — göndermeden/onaylamadan önce gözden geçirin."

## Girişim kod adları

Beta Art üç girişimi kod adıyla takip ediyor (30.08.2026'da netleşti — bu
eşleme değişirse burayı güncelleyin):

| Kod | Gerçek proje | Gelir şekli | Bu depodaki karşılığı |
|---|---|---|---|
| **BAB** | NAVIAR | Pilot satış + sözleşme (proje bazlı danışmanlık) | `naviar/` |
| **BAC** | Q Work | Abonelik müşterileri (Q+, Q Teams) | henüz kod yok — `qblogg/docs/ai-workforce/` en yakın belge |
| **BAP** | QBLOGG | İçerik/yayın "edition"ları (çok dilli türev çıktılar) | `qblogg/` |

Pipeline'a veya deftere bir kayıt eklerken **her zaman kod adını** kullan
(BAB/BAC/BAP), gerçek proje adını değil — bu, üç girişimin muhasebesini
karıştırmadan ayrı tutmanın tek yolu.

## Diller

Müşteriye veya resmi makama giden her taslak (fatura, sözleşme, MVA
beyannamesi, forskuddsskatt yazışması) **Norveççe** yazılır — üçü de aynı
NOK pazarında ve resmi evrak Norveç makamlarına gidiyor. İç notlar (bu
beceriyle üretilen özetler, pipeline notları) Türkçe kalabilir.

## Girdi dosyaları

Üç kaynaktan çalışır. Hiçbiri bu depoda henüz yok — ilk gerçek dosya
geldiğinde bu bölümü gerçek sütun adlarına göre güncelle.

1. **Banka ekstresi** (CSV export) — varsayılan sütunlar: tarih, açıklama,
   tutar, bakiye. Norveç bankalarının çoğu (DNB, Sparebank1 vb.) bu şekilde
   export verir.
2. **Stripe export** (CSV/JSON, Stripe Dashboard → Payments → Export) —
   varsayılan sütunlar: tarih, müşteri, tutar, para birimi, Stripe komisyonu,
   net tutar, açıklama.
3. **Pipeline dosyası** — satış/sözleşme/abonelik takibi. Şablon:
   `.claude/skills/small-business/assets/pipeline-template.csv`. Çalışma
   kopyası yoksa **önce bunu sor**: "Pipeline dosyanız nerede tutuluyor,
   yoksa şablondan `muhasebe/pipeline.csv` olarak mı başlatalım?" Kendiliğinden
   yeni bir çalışma dosyası oluşturma — kullanıcı onaylamadan.

**Gizlilik:** Gerçek banka/Stripe export'ları (hesap numarası, tam işlem
geçmişi içerir) asla commit edilmez. `muhasebe/` altında bir export klasörü
açılırsa `.gitignore`'a eklenmeli — bu depo GitHub'da barınıyor.

## MVA (KDV) hesaplama

Norveç standart oranı **%25** — dijital hizmet ve danışmanlık satışlarının
çoğu bu orana girer (indirimli oranlar: gıda %15, ulaşım/konaklama %12 —
Beta Art'ın üç girişimi de hizmet sattığı için normalde standart oran
geçerli, ama **her hesaplamada** "bu satış türü için doğru MVA oranını
teyit edin" notu ekle — varsayım kesin kural değildir).

Çıktı kalıbı:
```
MVA hesabı — [dönem, örn. 2026 Ç3]
Satış MVA'sı (çıkış): [toplam satış] × %25 = [X] NOK
Alış MVA'sı (giriş, varsa gider faturaları): [Y] NOK
Net ödenecek/iade: [X − Y] NOK

⚠️ Taslak — Altinn'e göndermeden önce muhasebeci/Skatteetaten ile teyit edin.
```

## Forskuddsskatt (peşin vergi)

Şahıs şirketleri için yılda **4 taksit**: Norveç usulü olarak Mart, Mayıs,
Eylül ve Kasım aylarının ortasına denk gelir (kesin tarihler her yıl
Skatteetaten tarafından ilan edilir — **taslak üretirken güncel tarihi
teyit et**, ezberden yazma). Taksit tutarı, yıllık tahmini net kâr üzerinden
orantılı hesaplanır.

Çıktı kalıbı:
```
Forskuddsskatt tahmini — [taksit, örn. Eylül 2026]
Yıl başından bugüne net kâr (BAB+BAC+BAP toplam): [X] NOK
Yıllık tahmini net kâr: [Y] NOK
Bu taksit: [Y] / 4 × [uygulanabilir vergi oranı] = [Z] NOK

⚠️ Taslak — kesin tutar için Skatteetaten hesabınızdan/muhasebecinizden teyit edin.
```

## Sık yapılan işler

**"Bu ayki nakit durumunu özetle"** → banka ekstresi + Stripe export'unu
oku, girişim koduna göre ayır (BAB/BAC/BAP), gelir-gider tablosu üret.

**"MVA'yı hesapla"** → yukarıdaki kalıpla, dönemi netleştirerek (hangi çeyrek?).

**"[BAB/BAC/BAP]'a yeni bir [pilot/abone/edition] ekle"** → pipeline
dosyasına satır ekleme **taslağı** göster, onay iste, sonra yaz.

**"Forskuddsskatt taksitini hazırla"** → yukarıdaki kalıpla.

**Müşteriye/makama giden bir taslak (fatura, sözleşme)** → Norveççe yaz,
onay kapısı notunu ekle, göndermeden dur.

## Bilinmeyenler — ilk gerçek kullanımda netleştirilecek

- Banka ve Stripe export'larının gerçek sütun biçimi henüz görülmedi.
- Pipeline dosyasının nerede tutulacağı (bu depoda mı, başka bir yerde mi)
  henüz kesinleşmedi.
- MVA oranı ve forskuddsskatt taksit tarihleri genel Norveç kuralından
  yazıldı, Beta Art'ın kendi vergi dairesi kaydıyla teyit edilmedi.
