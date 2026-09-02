# QBLOGG eşikleri — business-pulse / monday-brief / friday-brief için

Eklentinin `thresholds.md` dosyasının yerine geçer. Ölçek: tek kurucu,
ödeme kanıtı öncesi, NOK. Yüzde eşikleri sıfıra yakın tabanda anlamsız;
burada mutlak sayılar ve sayaçlar var. Tarih: 02.09.2026. Her eşik
**[H]**'dir; ilk ücretli pilot sonrası yeniden ayarlanır.

## Nakit (Stripe + gider CSV'si)

**Sabit aylık gider tabanı** (Vercel, Buttondown, Supabase, alan adı,
yazılım): kullanıcı CSV verene kadar **n/a** — tahmin etme.

**Nakit yastığı** (kasadaki NOK ÷ aylık sabit gider)
- 🟢 ≥ 6 ay
- 🟡 3–6 ay
- 🔴 < 3 ay

**Ödeme akışı (Stripe, son 30 gün)**
- 🟢 ≥ 1 ödeme
- 🟡 0 ödeme ama açık görüşme var
- 🔴 0 ödeme ve 14 gündür görüşme yok

**Başarısız/iade edilen ödeme**: tek işlem > 500 NOK → 🟡, > 2.000 NOK ya da
haftada 2+ → 🔴. Her biri müşteri adı ve tutarla yazılır.

**Alacak (fatura kesildiyse)**: vade + 14 gün → adıyla yaz; + 30 gün → 🔴.
Norveç'te tipik vade 14 gün, ABD'nin 30/60/90 dilimlerini kullanma.

## Görüşme hattı (Action Pages 30 günlük kapı)

Sayaç `docs/action-pages-teklif.md` kuralından: **30 günde 10 görüşme + 3
ücretli pilot; satılmazsa platform büyütülmez.** Başlangıç tarihini
kullanıcıdan al (belge 24.08.2026 tarihli, kapı açılış günü belgede yok).

- 🟢 görüşme sayısı ≥ (geçen gün / 30) × 10 ve pilot ≥ (geçen gün / 30) × 3
- 🟡 görüşme hedefte, pilot geride
- 🔴 ikisi de geride ya da 7 gündür yeni görüşme yok

**Bayat görüşme**: 14+ gün cevapsız → adıyla yaz (eklentinin 7 günü tek
kişilik satış temposuna göre fazla sık).

## Trafik ve liste (Vercel analytics + Buttondown)

- Haftalık tekil ziyaretçi: mutlak sayı + geçen hafta farkı; renk verme,
  taban küçük. 7 gün üst üste 0 ise 🔴 (dağıtım kırılmış olabilir →
  `run-qblogg` smoke).
- Bülten: yeni abone / hafta. 0 ise sarı değil **not**: Buttondown adresi hâlâ
  `tatil` (ROADMAP #54), önce bu düzelmeli.
- Ziyaretçi→abone oranı ölçülmeye başlanınca `docs/gelir-sistemi.md`'deki
  %1–3 bandı referans; bandın altı 🟡.

## İzleme listesi (Gmail)

Sayısal eşik yok. Şu kelimeler her zaman öne çıkar: brief, başvuru, teklif,
fatura, iptal, iade, şikâyet, klage, refusjon, faktura, invoice, refund,
cancel. Konu 3 gündür cevapsızsa 🔴.

## Genel durum

En kötü bölüm rengi. Ek kural: 7 gün içinde görüşme tarihi olan adlandırılmış
bir aday varsa ve hazırlık yoksa 🔴.

## Ne zaman yeniden ayarlanır

İlk ücretli pilot tahsil edildiğinde; Action Pages kapısı kapanınca (satıldı
ya da satılmadı — iki sonuç da eşikleri değiştirir); muhasebe bağlayıcısı
eklenince.
