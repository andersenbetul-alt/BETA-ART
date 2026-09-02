# Müşteri Davranışı / Sonraki-İstek Tahmin Sistemi — Konsept

Tarih: 2 Eylül 2026 · Durum: TASLAK, hiçbir siteye bağlanmamış ayrı konsept
Girdi: kullanıcının kısa tarifi — "tüm web sayfalarında kurulacak, müşterinin
bir sonraki ziyarette ne görmek/satın almak isteyeceğini bulan bir sistem."

Bu belge bir **ürün konsepti**dir, bir uygulama planı değil. Üç temel karar
(kapsam, ölçek, veri kaynağı) henüz kullanıcı tarafından verilmedi — bu
belge o kararları netleştirmek için var; hiçbirini kendiliğinden seçmedi.

## 1. Tek cümlelik tanım (aday)

Bir ziyaretçinin site içindeki davranışından (baktığı sayfalar, kategoriler,
geçirdiği zaman) çıkarım yaparak, **bir sonraki ziyaretinde** ona hangi
içeriği/ürünü önce göstermesi gerektiğini tahmin eden, siteler arası
taşınabilir bir öneri katmanı.

## 2. Çözülen problem

Bir ziyaretçi bir siteye ikinci kez geldiğinde, site onu ilk kez gelmiş gibi
karşılar — önceki ilgisini unutur. Bu, hem içerik sitelerinde (QBLOGG: hangi
kategoriye baktı) hem ürün/hizmet sitelerinde (NAVIAR projeleri: hangi
hizmete baktı) aynı boşluk. Amaç: "yeniden keşfettirme" yerine "kaldığı
yerden devam ettirme."

## 3. Nasıl çalışır — üç olası yaklaşım (birini seçmedim, üçü de gerçek seçenek)

| Yaklaşım | Ne yapar | Soğuk başlangıç sorunu |
|---|---|---|
| **Kural tabanlı** | "Bu kategoriye 2+ kez baktıysa, o kategoriden öner" gibi elle yazılmış kurallar | Yok — ilk ziyaretten itibaren çalışır, ama kaba |
| **İçerik tabanlı benzerlik** | Baktığı sayfaların etiket/kategori benzerliğine göre en yakın içeriği önerir | Az — tek sayfa görmesi yeterli |
| **Kolektif filtreleme (collaborative)** | "Senin gibi davrananlar şunu da gördü" — çapraz kullanıcı deseni | Çok — yeterli kullanıcı/etkileşim verisi birikene kadar anlamsız |

**Gerçekçi başlangıç:** Kural tabanlı + içerik tabanlı ikilisi. Kolektif
filtreleme, yeterli trafik/etkileşim verisi birikmeden (muhtemelen binlerce
oturum) gürültüden ayırt edilemez — bu, `docs/naviar/NAVIAR-TURIST-AUTOPROMPT-ANALIZI.md`'de
NAVIAR TURIST için tespit edilen aynı "önce doğrula, sonra ölçekle" dersiyle
örtüşüyor.

## 4. Kritik açık soru: veri kaynağı

Bu sistemin "ne satın alacağını" tahmin edebilmesi için **satın alma
verisi** gerekir. Şu an incelediğim sitelerde bu veri **yok**:

- **QBLOGG:** paketler `mailto:` taslağı üretiyor (`assets/js/app.js` →
  `composeMail`), gerçek bir checkout/ödeme akışı yok. "Satın aldı" diye
  işaretlenen hiçbir olay yok — yalnızca "mail taslağı açtı" var, ki bu
  onun gönderildiğini bile garanti etmiyor.
- **naviar-consult / naviar-care-1:** bu oturumda kaynak koduna erişimim
  olmadığı için checkout durumlarını bilmiyorum.

**Sonuç:** sistem başlangıçta "satın alma" değil, **"ilgi" (sayfa
görüntüleme, kategori tekrarı, süre)** tahmin edebilir. "Bir sonraki sefer
ne satın alacak" iddiası, gerçek bir satın alma olayı loglanmadan
**uydurma** olur — bu, projenin genel "rakamlar örnek olarak işaretlenir"
kuralına (CLAUDE.md madde 8) doğrudan uygulanır.

## 5. İki mimari seçenek — ikisi de gerçek, biri henüz seçilmedi

### A) Tarayıcı-içi, sunucusuz (localStorage)

- Derleme/backend gerektirmez, QBLOGG'un "derleme adımı yok" ilkesiyle
  bire bir uyumlu.
- **Ama:** yalnız aynı cihaz/tarayıcıda çalışır; kullanıcı telefonla
  gelirse sıfırlanır. Siteler arası da çalışmaz (her site kendi
  localStorage'ını görür, "tüm web sayfaları" hedefiyle çelişir).
- **Gizlilik uyarısı — gerçek, kodda doğrulanmış:** `scripts/guvenlik.mjs`
  hâlihazırda localStorage'a yazılan her anahtarı tarıyor ve kişisel veri
  içerenleri (örn. bülten e-postası `qb_subs`) gizlilik metninde
  açıklanmadıysa hata olarak işaretliyor (`guvenlik.mjs:75-80`). Davranış
  geçmişi de aynı denetime tabi olur — "hangi sayfalara baktı" listesi
  tek başına kişisel veri sayılabilir, gizlilik metnine eklenmesi gerekir.

### B) Sunucu + veritabanı, siteler arası kalıcı

- "Tüm web sayfalarında" hedefine gerçekten hizmet eder — tek kullanıcı
  kimliği (giriş/e-posta) üzerinden siteler arası birleşik profil.
- QBLOGG'un `uye/` alt uygulamasında zaten bir Supabase altyapısı var
  (`uye/lib/supabase.js`, `uye/schema.sql`) — bu, sıfırdan mimari
  kurmaktan daha ucuz bir başlangıç noktası olabilir, ama bu bir varsayım,
  doğrulanmadı: `uye/` şemasının bu iş için genişletilebilir olup
  olmadığını incelemedim.
- **Ama:** bu, projenin "derleme adımı yok, bağımlılık yok" temel
  ilkesinden **sapma**dır (CLAUDE.md: "Yeni bağımlılık eklemeden önce
  bunun gerçekten gerekli olduğunu doğrulayın"). Kullanıcı onayı olmadan
  bu yönde ilerlemem.

## 6. Gizlilik ve hukuk — atlanamaz, erteleniyor değil

Davranış izleme = kişisel veri işleme. Norveç/AB bağlamında (bu depodaki
diğer projeler Norveç merkezli) bu, GDPR kapsamına girer:

- Açık rıza (consent) mekanizması gerekir — sessiz izleme yasak.
- Gizlilik metninde ("gizlilik.html" QBLOGG'da zaten var) davranış
  izlemenin ne topladığı, ne kadar saklandığı, nasıl silineceği
  açıklanmalı.
- "Tüm web sayfalarında" ortak kimlikle izleme, siteler arası takip
  (cross-site tracking) sayılabilir — bu, çoğu tarayıcının üçüncü taraf
  çerezleri engelleme politikasıyla teknik olarak da çatışabilir.

Bu madde, sistemin en riskli varsayımıdır ve NAVIAR TURIST analizindeki
gibi **önce test edilecek** değil, **önce çözülecek** bir önkoşuldur —
hukuki uyumsuz bir izleme sistemi test edilemeden geri çekilir.

## 7. Şimdi yapılacak — kararlar (uygulama değil)

| # | Karar | Neden bekliyor |
|---|---|---|
| 1 | Hangi site(ler)de çalışacak | Bu oturumda yalnız QBLOGG'un kaynak koduna erişimim var; NAVIAR projeleri ayrı repo |
| 2 | Tarayıcı-içi mi, sunucu+veritabanı mı | Mimari sapma kararı — kullanıcı onayı gerekir |
| 3 | "İlgi" mi "satın alma" mı tahmin edilecek | Satın alma verisi şu an hiçbir sitede toplanmıyor |
| 4 | Rıza/gizlilik mekanizması nasıl kurulacak | Sistemin önkoşulu, sonradan eklenecek bir madde değil |

Bu dört karar netleşmeden bir uygulama planına geçmiyorum — geçersem,
NAVIAR TURIST analizinde eleştirdiğim aynı hatayı (riskli varsayımı test
etmeden yürütme planına atlamak) burada tekrar etmiş olurum.
