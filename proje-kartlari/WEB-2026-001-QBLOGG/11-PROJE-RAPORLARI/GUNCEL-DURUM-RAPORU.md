# WEB-2026-001 QBLOGG — Güncel Durum Raporu

**Tarih:** 2026-09-03  
**Hazırlayan:** Arşivleme sistemi (otomatik, AUTOPROMPT)

---

## Özet

QBLOGG şirketlere içerik hattı satan bir stüdyonun tanıtım + blog sitesidir.
**Yayında** — qblogg.vercel.app adresinde erişilebilir. Temel altyapı eksiksiz;
gelir kapısı (Stripe) henüz açık değil.

## Teknik Sağlık

| Gösterge | Durum |
|---|---|
| `npm run check` | ✅ 8/8 yeşil (2026-09-03) |
| `npm run guvenlik` | ✅ Geçti |
| `npm run gorunurluk` | ✅ 11 yazı kapıdan geçiyor |
| Sayfa sayısı | 9 HTML |
| Blog yazısı | 11 |
| Dil | 10 (tr, en, zh, hi, es, ar, fr, pt, ru, no) |
| Sitemap | 18 URL |

## Gelir Durumu

| Kanal | Durum |
|---|---|
| Brief formu (`mailto:`) | Aktif ama e-posta adresi girilmemiş |
| Stripe CTA (`payLinks`) | **Kapalı — payLinks boş** |
| Lead magnet | Aktif |
| Buttondown newsletter | Aktif — kullanıcı adı yanlış (`tatil`) |
| Ortaklık bağlantıları | Altyapı hazır; `{aff:}` bloğu çalışıyor |

## Açık Görevler (Öncelik Sırasıyla)

1. **🔴 Stripe payLinks:** `config.js → payLinks: {p1:'', p2:'', p3:''}` — gelir kapısı
2. **🔴 Git tag:** `git tag qblogg-v1.7.0 && git push origin qblogg-v1.7.0`
3. **🟡 config.js tamamla:** Gerçek e-posta, sosyal hesaplar, NOK fiyatlar
4. **🟡 qblogg.com DNS:** Vercel TXT doğrulama + Verify & Claim
5. **🟡 Buttondown:** kullanıcı adını `tatil` → `qblogg` olarak değiştir
6. **🟡 kosullar.html:** 10 `[DOLDURULACAK]` yasal alanı doldur

## Yakın Dönem Planı

- Ön-render (çok dilli SEO için her dili ayrı URL'de)
- Formu `composeMail()` → Formspree/Netlify Forms'a taşı
- NOK fiyatlandırma (Norveç piyasası: 10–40 bin kr/ay, ROADMAP satır 67)
- Analitik (gizlilik dostu; hangi yazı brief getiriyor?)

## Risk Özeti

| Risk | Seviye |
|---|---|
| Git tag yok — sürüm geri alımı güç | Orta |
| Stripe entegre değil — gelir bekleniyor | Yüksek |
| Vercel–GitHub otomatik deploy yok | Düşük |
| qblogg.com alan adı bağlı değil | Orta |
