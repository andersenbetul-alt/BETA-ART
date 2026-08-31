---
name: small-business
description: BETA ART'ın kendi küçük işletme işleri — nakit takibi, Norveç şahıs şirketi (enkeltpersonforetak) için MVA ve forskuddsskatt, üç mülkün (Privat/Galleri/Business) satış ve müşteri kaydı. Kullanıcı "MVA", "forskuddsskatt", "muhasebe", "banka ekstresi", "fatura", "nakit durumu", "BAP/BAG/BAB" ya da BETA ART'ın parasal/müşteri işleriyle ilgili bir şey sorduğunda MUTLAKA bu beceriyi kullan. Para veya müşteriye giden HER adım kullanıcı onayı gerektirir — bu beceri hiçbir ödeme, fatura veya mesajı kullanıcı onayı olmadan göndermez.
owner: BETA ART
---

# small-business — BETA ART nakit, MVA ve müşteri kaydı

**Zorunlu kural, istisnasız:** Para veya bir müşteriye ulaşan **her adım** kullanıcı
onayı ister — fatura göndermek, ödeme talep etmek, MVA beyanı hazırlamak,
bir müşteriye e-posta taslağı dışında bir şey yollamak. Bu beceri hiçbir
zaman kendi başına harekete geçmez; taslak hazırlar, onay bekler.

## Durum: iskelet — gerçek operasyonel veri eksik

Bu beceri iki farklı oturumdan gelen bilgiyle kuruldu: ilk talimat (isim,
sürüm, kapsam açıklaması — girişim kodları dahil) ile 29–30.08.2026'da bu
oturuma aktarılan BETA ART üç-mülk sistemi belgeleri (`PROJECTMANIFEST.md`,
`BETAARTROUTEMAP.md`, `BETAARTPROJECTCODES.md`). İkisi arasında **bir
çelişki var, sessizce çözülmedi** — aşağıda §1'de.

## 1. Girişimler — doğrulanmış kodlar, bir çelişki notuyla

`BETAARTPROJECTCODES.md`'den doğrulanan üç mülk:

| Kod | Mülk | Ne | Alt yol |
|---|---|---|---|
| **BAP-01** | Privat | Doğrulanmış insan fotoğrafçılığı, edisyon, doğrudan lisanslama | `/privat/` |
| **BAG-03** | Galleri og Utstilling Event | Sanatçı/eser/sergi/etkinlik programı | `/events/` |
| **BAB-02** | Business | İnşaat sektörüne B2B proje dokümantasyonu, "20 dakikalık görüşme" CTA'sı | `/business/` |

**Çelişki:** Bu beceriyi ilk isteyen talimat "BAB pilot sales and contracts,
**BAC** subscription clients, and BAP editions" diyordu. Sonradan gelen
resmi proje kodlarında **BAC diye bir kod yok** — üçüncü mülk BAG (Galleri)
olarak tanımlı, "subscription clients" (abonelik müşterileri) de hiçbir
BETA ART belgesinde geçmiyor. İki olası okuma: (a) BAC, Galleri resmileşmeden
önceki bir çalışma adıydı ve BAG'e dönüştü, (b) "BAC / abonelik müşterileri"
BETA ART'ın parçası olmayan, tamamen başka bir girişim. **Ben seçim yapmadım
— kullanıcı hangisinin doğru olduğunu söylemeden bu beceri BAC/abonelik
varsayımıyla çalışmaz.**

## 2. Dil kuralı — kısmen doğrulandı

`PROJECTMANIFEST.md`: "Business remains Norwegian-first." Privat ve Galleri
sayfalarının incelenen `index.html`'leri tamamen İngilizce. Yani şu an
gözlemlenen:

- **Business → Norveççe öncelikli**
- **Privat, Galleri → İngilizce** (gözlemlenen, ama resmi kural olarak
  yazılı değil)
- **Türkçe** — ilk talimatta "Norwegian, Turkish or English by venture"
  deniyordu ama hiçbir BETA ART belgesinde Türkçe müşteri diline rastlanmadı.
  Muhtemelen kullanıcıyla iç yazışma dili (bu konuşmanın kendisi Türkçe) —
  müşteriye giden değil. **Doğrulanmadan varsayılmaz.**

## 3. Doldurulması gereken operasyonel veri (uydurulmadı, boş bırakıldı)

Bu beceri gerçek işlem yapabilmek için aşağıdakilerin kullanıcıdan gelmesi
gerekiyor — hiçbiri tahmin edilmedi:

- **Banka/muhasebe export formatı** — hangi bankadan, hangi dosya biçiminde
  (CSV/PDF), kategori adları ne
- **Stripe hesap kapsamı** — QBLOGG'un bilinen BETA ART Stripe hesabıyla
  (`docs/odeme-sistemi.md`, ana QBLOGG deposunda) aynı hesap mı, yoksa
  BAP/BAG/BAB'ın her biri ayrı mı tahsilat yapıyor
- **"Pipeline dosyası"** — konum ve format (JSON/spreadsheet/Notion) —
  ilk talimatta adı geçti, içeriği hiç görülmedi
- **MVA beyan dönemi** — aylık mı, üç aylık mı; **forskuddsskatt** taksit
  tarihleri
- **Org.nr** — DNS taslak sayfasında `000 000 000` yer tutucu olarak
  duruyordu, gerçek numara henüz yok (bkz. `PROJECTMANIFEST.md`: "Legal
  and compliance files are reference drafts only... organization number...
  require human confirmation")

Bu alanlardan biri gerekince ve kullanıcı vermemişse: **tahmin etme,
doğrudan sor.**

## 4. Bu beceri hazır olduğunda ne yapacak (taslak kapsam)

Yukarıdaki boşluklar doldurulunca:

1. **Nakit durumu** — banka/muhasebe export'unu okur, üç mülke göre
   ayrıştırır (gelir/gider hangi BAP/BAG/BAB'a ait), özet çıkarır.
2. **MVA hazırlığı** — dönem sonunda beyan taslağı hazırlar, **göndermez** —
   kullanıcı onayı ve muhtemelen bir muhasebeci/Altinn adımı gerekir.
3. **Fatura/tahsilat taslağı** — Stripe kaydı veya elle girilen bir satıştan
   fatura taslağı üretir, göndermeden önce onay ister.
4. **Müşteri kaydı** — BAG (Galleri) sergi/etkinlik katılımcıları, BAB
   (Business) pilot görüşme talepleri, BAP (Privat) lisans talepleri —
   hangi "pipeline dosyası" formatında tutulacaksa oraya yazar.

## 5. Sınır — bu beceri neyi yapmaz

- Canlı DNS, registrar, ödeme sağlayıcı veya CRM değişikliği yapmaz
  (`PROJECTMANIFEST.md`'de zaten kayıtlı ilke: "Live DNS, registrar,
  deployment, payment and CRM changes were not performed").
- Hukuki/vergi tavsiyesi vermez — MVA ve forskuddsskatt kuralları hakkında
  Norveç mevzuatını bu ortamda doğrulama imkânı yok (`skatteetaten.no` gibi
  resmî kaynaklar bu ortamda erişilemeyebilir); rakam gerektiren her hesap
  kullanıcıya veya bir muhasebeciye doğrulatılmalı.
- Bir mülkün fiyat/lisans şartını bir diğerine uygulamaz — `BETAARTROUTEMAP.md`
  bunu açıkça yasaklıyor ("Do not reuse Privat prices or licensing terms
  for Gallery/Event or Business").
