# QUALITY-GATE — P01 QBLOGG

**Son güncelleme:** 2026-08-31

Commit öncesi zorunlu: `npm run check` yeşil olmalı.
Deploy öncesi: `npm run check` + `npm run guvenlik` ikisi birden geçmeli.

---

## Otomatik Kontroller (CI)

| Komut | Kapsam | Son Sonuç | Tarih |
|---|---|---|---|
| `npm run check` | 8 kontrol: i18n, posts, HTML, sitemap, JSON-LD | ✓ 8/8 | 2026-08-31 |
| `npm run guvenlik` | 13 kontrol: XSS, GDPR, CSP, tabnabbing, ortaklık | ✓ 13/13 · 0 yüksek | 2026-08-31 |
| `npm run gorunurluk` | 16 madde × 10 yazı | ✓ 10/10 geçiyor | 2026-08-31 |

---

## Manuel Kontrol Listesi (deploy öncesi)

### İçerik
- [ ] Yeni metin 10 dilde eklenmiş (`QB_I18N`)
- [ ] Yeni yazı 10 dilde doldurulumuş (tr+en tam, 8 dil özet ≥3 blok)
- [ ] Yeni yazıda `orig` ve `src` (≥3 kaynak) var
- [ ] `sitemap.xml` güncellendi
- [ ] `npm run rss` çalıştırıldı (`feed.xml`)
- [ ] Eşleşmeyen `**` yok (`check.mjs` yakalar)

### Tasarım/Kod
- [ ] Yeni bölüm 6 sayfada güncellendi (index, work, blog, post, gizlilik, kosullar)
- [ ] Yeni ikon SVG (`fill="none"`, `stroke="currentColor"`, 24×24)
- [ ] Renkler değişkenlerden geliyor (`var(--brand)` vb.)
- [ ] RTL (Arapça) Arapçaya geçilip kontrol edildi
- [ ] Mobil (≤480px) Chrome DevTools'ta test edildi
- [ ] Koyu tema doğru çalışıyor

### Güvenlik / GDPR
- [ ] Yeni dış servis varsa `vercel.json` CSP `connect-src`'ye eklendi
- [ ] Yeni `localStorage` anahtarı gizlilik metninde belirtildi
- [ ] Yeni `{aff:{}}` bloğu için `why` alanı dolduruldu

---

## Sezgisel Denetim Puanları (24.08.2026)

| Sayfa | Ortalama (Nielsen N1–N10) | Özel (C1–C3) | Not |
|---|---:|---:|---|
| index | 4,4 | 4,3 | Hero'da 2 CTA yarışıyor |
| work | 4,4 | 5,0 | Bütçe alanı dolu açılıyor |
| demo (Action Pages) | 4,0 | 4,7 | İlerleme göstergesi eksik |

---

## Kalite Hedefleri

| Ölçüt | Hedef | Güncel |
|---|---|---|
| check.mjs | 8/8 geçti | ✓ 8/8 |
| guvenlik.mjs | 0 yüksek | ✓ 0 yüksek |
| gorunurluk.mjs | 0 kural ihlali | ✓ 0 ihlal |
| Hata raporu (kullanıcı bildirimi) | 0 açık | Bilinmiyor |
| Erişilebilirlik (manual) | AA | Değerlendirilmedi |
| Lighthouse perf. skoru | ≥90 | Değerlendirilmedi |
