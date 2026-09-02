# BET·ART Panosu — proje takip Kanban'ı

Tek dosyalık (`index.html`), derleme gerektirmeyen bir Kanban panosu.
QBLOGG, HXI, Beta Art, NAVIAR ve Ortak/Altyapı işlerini beş sütunda
(Backlog → Sıradaki → Devam Ediyor → Beklemede → Bitti) takip eder.

## Özellikler
- Sürükle-bırak ile kart taşıma; kart ekle / düzenle / sil.
- Proje filtresi (renkli çipler) + canlı sayaçlar.
- "Senin adımın" etiketi: kullanıcı tarafında bekleyen işler (DNS, e-posta, görsel…).
- Açık/koyu tema; klavye erişimi; `prefers-reduced-motion`.
- **Kalıcılık:** kartlar tarayıcının `localStorage`'ında saklanır — sunucuya
  gitmez, başka cihaza taşınmaz (sitelerin gizlilik ilkesiyle aynı).
  "↺ Sıfırla" başlangıç durumuna döndürür.

## Başlangıç kartları
`index.html` içindeki `SEED` dizisi. Yeni durum eklemek için oraya satır
ekleyin: `["proje","sütun","başlık","not"(,"user")]` — proje: hxi/qb/ba/nav/ort,
sütun: backlog/next/doing/block/done, beşinci alan "user" ise kart kullanıcı
adımı olarak işaretlenir.

## Yayın
Ayrı Vercel projesi: **betart-panosu** (üretim herkese açık, önizleme korumalı).
Statik tek dosya; dağıtıma `index.html` olduğu gibi gönderilir.
Canlı: https://betart-panosu-bet-art.vercel.app
