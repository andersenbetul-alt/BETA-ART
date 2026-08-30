# Curiosity Engine V1

İnsanların neyi merak etmeye başladığını rakiplerden önce fark eden, puanlayan,
araştıran ve blog taslağı üreten hat. Otomatik yayın **yok** — yayın kararı insanda.

```
KAYNAKLAR → KÜMELEME → ÖZNİTELİK → PUANLAMA → KARAR → KUYRUK
                                                        ↓
                        SORULAR → ARAŞTIRMA → YAZI → SEO → PARA → KALİTE KAPISI
                                                        ↓
                                                  İNSAN ONAYI
```

## Çalıştırma

```bash
node engine/run.mjs --demo            # fikstürle; ağ ve API anahtarı gerekmez
node engine/run.mjs --live            # canlı RSS kaynakları (anahtarsız)
node engine/run.mjs --live --gsc q.csv # Search Console dışa aktarımını da katar
node engine/run.mjs --board           # son tabloyu yazdır
node engine/write.mjs --next --dry    # zinciri anlat, API çağırma
node engine/write.mjs --next          # araştır + yaz (ANTHROPIC_API_KEY gerekir)
```

Panel: `engine/dashboard.html` (statik dosya; `engine/data/board.json` okur).

## Dosyalar

| Dosya | İş |
|---|---|
| `schema.sql` | 8 tablo: sinyal, konu, soru, puan, makale, GSC, çalıştırma |
| `db.mjs` | Node 22'nin yerleşik `node:sqlite` modülü; ek bağımlılık yok |
| `sources/rss.mjs` | Google News, Google Trends RSS, Hacker News, Reddit — anahtarsız |
| `sources/gsc.mjs` | Search Console CSV içe aktarma + fırsat sorguları |
| `cluster.mjs` | Eş anlamlı başlıkları tek konuda toplar (AI'sız çalışır) |
| `features.mjs` | Sinyallerden puanlama özniteliklerini türetir |
| `score.mjs` | Trend / Opportunity / Money skorları + karar eşikleri |
| `agents.mjs` | Altı Claude ajanı: soru, araştırma, yazar, SEO, para, kalite |
| `run.mjs` | Tarama → puanlama hattı |
| `write.mjs` | Seçilen konu için araştırma → makale zinciri |
| `dashboard.html` | Live Curiosity paneli |

## Puanlama

Trend Score ağırlıkları: büyüme %25, arama ilgisi %20, sosyal %15, ticari niyet %15,
düşük rekabet %10, sütun uyumu %10, güncellik %5.

Final skor üç bileşenin harmanı: Trend %45 + Fırsat %30 + Para %25.

Karar eşikleri: 93+ 🔥 hot · 85+ 🟢 yayınla · 75+ 🟠 taslak · 60+ 🟡 fikir · altı ❌ geç.

## Bilinen sınırlar — bunları bilerek kullanın

**1. Bazı öznitelikler ölçüm değil vekil.** `features.mjs` içinde her biri işaretli.
En önemlisi **rekabet**: gerçek rekabet SERP verisi ister (Ahrefs/Semrush). Şu an haber
yoğunluğundan tahmin ediliyor. Bu bağlanana kadar rekabet skorlarına ihtiyatlı bakın.

**2. Mutlak skorlar düşük kalıyor.** Yalnızca RSS vekilleriyle konular 40–75 bandında
toplanıyor; 85+ pratikte çıkmıyor. Bu yüzden kuyruk iki aşamalı: eşiği geçen varsa
onlar, yoksa **günün en iyi 3'ü** yine de kuyruğa alınır (`--top N`). Google Trends API
(alpha erişimi) ve Search Console bağlandığında bant yukarı kayacak ve eşik anlam
kazanacak.

**3. Google Trends'in resmî API'si alpha ve erişim gerektiriyor.** V1 herkese açık RSS
uçlarını kullanıyor. Erişim alındığında `sources/` altına yeni bir dosya eklemek yeterli;
hattın geri kalanı değişmez.

**4. Otomatik indeksleme yok — bilinçli.** Google'ın Indexing API'si genel blog yazıları
için değil, iş ilanı ve canlı yayın sayfaları için. Normal içerikte sitemap + Search
Console yolu kullanılır.

**5. Kümeleme AI'sız çalışırken sınırlı.** "AI receptionist" ve "AI answering service"
gibi eş anlamlıları kelime örtüşmesiyle yakalayamıyor. API anahtarı varsa
`questionAgent` bunu kanonik ada indiriyor; V2'de kümeleme de ajana devredilecek.

**6. Kalite kapısı insanın yerine geçmez.** `qualityGate` neye bakılacağını söyler,
karar vermez. Yayın kararı insanda kalır — bu, sistem kendini kanıtlayana kadar
değişmemeli.

## Maliyet

Bir makale zinciri (soru + araştırma + yazı + SEO + para + kalite) yaklaşık
40–80 bin çıktı tokenı tüketir. Claude Opus 5 fiyatlarıyla ($5 girdi / $25 çıktı
per milyon token) makale başına kabaca **1,5–3 dolar**. Ayda 20 makale ≈ 30–60 dolar.
Araştırma adımındaki web araması ayrıca ücretlendirilir.

## Yol haritası

- **V1 (burada):** trend topla → puanla → panelde göster → seçileni araştır → taslak üret
- **V2:** SEO otomasyonu + CMS'e yayın
- **V3:** Search Console öğrenme döngüsü (hangi sorgu hangi yazıyı besliyor)
- **V4:** newsletter + sosyal medya dağıtımı
- **V5:** tam otonom döngü — ve aynı motorun SaaS olarak satılması
