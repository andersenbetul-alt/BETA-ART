---
name: autoprompt
description: >
  QBLOGG için günlük proje denetim ve geliştirme döngüsü. "/autoprompt" komutu,
  "günlük rapor", "projeyi incele", "günlük denetim yap", "AUTOPROMPT çalıştır",
  "daily report" veya "projeyi tara" gibi ifadelerle tetiklenir. Projenin mevcut
  durumunu tarar, kalite/güvenlik/görünürlük kontrollerini çalıştırır, açık riskleri
  ve fırsatları tespit eder, uygulanabilir değişiklikleri yapar, proje günlüğünü
  günceller ve tarihli bir günlük rapor üretip commit eder. Bu skill her oturumun
  başında veya günlük bakım gerektiğinde çağrılmalıdır.
owner: QBLOGG
---

# AUTOPROMPT — QBLOGG Günlük Denetim Döngüsü

Bu skill her çalıştırıldığında QBLOGG projesinin tüm boyutlarını tarar, kontrol
eder, raporlar ve uygulanabilir iyileştirmeleri yapar. Amacın doğrulanmamış
hiçbir şeyi tamamlanmış olarak göstermemek ve yapılamayan işlemleri açıkça
belirtmek.

---

## ÇALIŞMA SIRASI

Aşağıdaki adımları bu sırayla uygula. Adım atlamak serbest değil; bir adım
engellenirse (ağ kapalı, dosya yok, kullanıcı onayı gerekiyor) bunu kaydet ve
sonraki adıma geç.

### 1. Proje Durumunu Oku

```bash
git log --oneline -10          # son değişiklikler
git status --short             # bekleyen dosyalar
```

Şu dosyaları oku:
- `ROADMAP.md` → açık işler ve öncelik sırası
- `docs/proje-gunlugu.md` → son giriş (ne zaman güncellendi?)
- `docs/autoprompt/P01_QBLOGG/00_INDEX/PROJECT-INDEX.md` → açık kararlar
- `docs/autoprompt/P01_QBLOGG/00_INDEX/RISK-REGISTER.md` → aktif riskler
- `assets/js/config.js` → canlı yapılandırma (boş alanlar var mı?)

**Bugünün tarihini al.** Rapor ve dosya adlarında kullan.

### 2. Otomatik Kalite Kapıları

```bash
npm run check       # 8 kontrol: i18n, posts, HTML, sitemap, JSON-LD
npm run guvenlik    # 13 kontrol: XSS, GDPR, CSP, tabnabbing
npm run gorunurluk  # 16 kural × 10 yazı
```

Her sonucu kaydet: PASS / FAIL / BLOCKED + kanıt satırı.

### 3. Config Boşluk Denetimi

`assets/js/config.js` içindeki şu alanları kontrol et:
- `newsletterEndpoint` — `tatil` mi yazıyor? (R01 riski: yanlış Buttondown hesabı)
- `formEndpoint` — boş mu? (R02 riski: brief başvuruları kaybolabilir)
- `prices` — boş mu? (piyasa altı fiyat riski)
- `social.*` — tüm boş mu? (sosyal kanıt eksikliği)
- `payLinks` — boş mu? (Stripe bağlı değil)

### 4. Git Geçmişinden Delta Tespiti

Son günlük rapor tarihinden bu yana hangi dosyalar değişti?
```bash
git log --oneline --since="7 days ago"
```

Değişen her dosyayı kategorize et: kod / içerik / belge / yapılandırma.

### 5. Risk Güncellemesi

`RISK-REGISTER.md` içindeki her aktif riski kontrol et:
- Hâlâ geçerli mi?
- Yeni bilgi var mı?
- Durum değişti mi?

Yeni risk tespit ettiysen kaydet.

### 6. Pazar ve Fırsat Taraması

Dış web erişimi varsa araştır; yoksa eğitim bilgisinden:
- Norveç B2B içerik pazarı: güncel fiyat ve trend
- Rakip hareketleri
- Mevsimsel fırsat (bütçe sezonu, sektör etkinlikleri)
- Mevzuat değişiklikleri (GDPR, Norveç Datatilsynet, EU AI Act)

**Önemli:** Doğrulanamayan iddiayı "eğitim verisi / teyit gerekiyor" notiyle kaydet.
Uydurma yok.

### 7. Uygulanabilir Değişiklikler

Şu kriterlere göre filtrele — hepsini karşılayanları uygula, geri kalanları
"kullanıcı eylemi gerekiyor" listesine ekle:

- ✓ Kod veya içerik değişikliği (dosya erişimim var)
- ✓ `npm run check` yeşil kalacak
- ✓ Güvenlik veya GDPR riski yaratmıyor
- ✓ Geri alınabilir (git)
- ✗ Üretim yayını, ödeme, DNS, panel değişikliği → kullanıcı onayı gerekir

Uyguladığın her değişiklik için:
1. Değişikliği yap
2. `npm run check` çalıştır
3. Sonucu kaydet

### 8. Günlük Rapor Oluştur

Tarihli dosyaya yaz:
```
docs/autoprompt/P01_QBLOGG/06_LAUNCH/YYYY-MM-DD_P01_06_LAUNCH_DAILY-REPORT_v1.0.md
```

Rapor şablonu (tüm başlıkları doldur, boş bırakma):

```markdown
# Günlük Proje Raporu
## Proje: QBLOGG · Tarih: YYYY-MM-DD · Faz: 06 Launch

## Yönetici Özeti
[2-3 cümle: en önemli bulgu ve eylem]

## Kalite Kapısı Sonuçları
[check / guvenlik / gorunurluk — PASS/FAIL + satır sayısı]

## Config Boşluk Durumu
[newsletterEndpoint, formEndpoint, prices, social, payLinks]

## Son Değişiklikler (git log)
[tarihten bu yana ne değişti]

## Risk Durumu
[aktif riskler — durum değişti mi?]

## Pazar / Araştırma Bulguları
[fırsat, tehdit, mevzuat — kaynak notu ile]

## Uygulanan Değişiklikler
[dosya adı, değişiklik, test sonucu]

## Kullanıcı Eylemi Gereken Konular
[sıralı liste: önce en kritik]

## Bir Sonraki En Değerli Üç Görev
1.
2.
3.
```

### 9. Günlük Günlüğü Güncelle

`docs/proje-gunlugu.md` sonuna ekle:

```
## YYYY-MM-DD — [tek satır özet]

[2-4 cümle: ne incelendi, ne bulundu, ne yapıldı, ne bekleniyor]
```

### 10. Commit ve Push

```bash
npm run check   # son kez — yeşil olmalı
git add docs/autoprompt/ docs/proje-gunlugu.md [değiştirilen dosyalar]
git commit -m "autoprompt: YYYY-MM-DD günlük denetim ve rapor

[değişiklik özeti]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Claude-Session: [oturum URL]"
git push -u origin [mevcut dal]
```

Push başarısız olursa: eksponansiyel geri-çekilme ile 4 deneme (2s, 4s, 8s, 16s).

---

## ÇIKTI STANDARDI

Skill bittikten sonra kullanıcıya şu özeti ver:

```
## ✅ AUTOPROMPT tamamlandı — YYYY-MM-DD

**Kontroller:** check N/8 · güvenlik N/13 · görünürlük N/10

**Uygulanan değişiklikler:**
- [dosya]: [ne yapıldı]

**🔴 Kritik / kullanıcı eylemi gereken:**
1. [en öncelikli eylem]
2. ...

**Bir sonraki üç görev:**
1. ...
```

---

## SINIRLAR (dürüstçe belirt)

Bu skill şunları yapamaz — raporda açıkça belirt:
- Dış web araştırması (dış ağ bu ortamda kapalı)
- Buttondown / Formspree / DNS / Vercel panel değişiklikleri
- Legal metin doldurma (kullanıcı bilgisi gerekiyor)
- Gerçek zamanlı rakip analizi (canlı sayfa erişimi yok)
- Fiyat kararı (iş kararı)
- Analitik kurulumu (ödeme/hesap kararı)

Yapılamayan her madde "Kullanıcı Eylemi Gereken Konular" bölümüne girer.

---

## PROJE BAĞLAMI

- **Çalışma dizini:** `/home/user/BETA-ART/`
- **Vercel:** `qblogg.vercel.app` (qblogg.com DNS doğrulaması bekleniyor)
- **Ana yapılandırma:** `assets/js/config.js`
- **Kalite kapıları:** `npm run check | guvenlik | gorunurluk`
- **Risk kaydı:** `docs/autoprompt/P01_QBLOGG/00_INDEX/RISK-REGISTER.md`
- **Proje günlüğü:** `docs/proje-gunlugu.md`

**Değişmez kural:** `npm run check` yeşil olmadan commit etme.
