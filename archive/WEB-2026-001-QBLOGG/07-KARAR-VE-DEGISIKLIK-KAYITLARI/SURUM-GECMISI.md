# WEB-2026-001 — Sürüm Geçmişi

## Sürümleme sistemi

**Önceki durum:** SemVer kullanılmıyordu — yalnızca git dalları ve commitler.
**2026-09-03 itibarıyla:** v1.0.0 olarak etiketlenecek.

## v1.0.0 — İlk kararlı sürüm (22.08.2026)

**Dal:** `main`
**Son commit:** `b12dde9` (Merge PR #15)
**Yayın tarihi:** 2026-08-22
**Canlı adres:** https://qblogg.vercel.app
**Sınıf:** Doğrulanmış kararlı sürüm

**Kapsamı:**
- 9 HTML sayfası
- 10 dil desteği
- 11 blog yazısı
- Tam marka sistemi (14 varlık)
- Curiosity Engine entegrasyonu (görünürlük kuralı)
- Güvenlik denetimi geçer
- RSS beslemesi
- Sitemap (18 URL)

**Eksikler (kasıtlı — sonraki sürüm için):**
- config.js boş
- Formspree kurulmadı
- Stripe kurulmadı
- Alan adı doğrulanmadı

## Sonraki sürüm planı: v1.1.0

**Hedef:** config.js doldurulmuş + Formspree aktif + alan adı bağlı

**Gerekli işler:**
- [ ] `config.js` — mailTo, prices, social doldur
- [ ] Formspree form ID'si ekle
- [ ] Buttondown endpoint'ini doğru listeye bağla
- [ ] `_vercel` TXT kaydını doğrula → qblogg.com bağla

## Git dal geçmişi (ana dallar)

| Dal | Amaç | Durum |
|---|---|---|
| `main` | Kararlı, yayın | Aktif |
| `claude/hxi-dosyalari-nuf9y8` | Aktif geliştirme | Açık (PR #17 bekliyor) |
| `claude/qblogg-web-sayfasi-upcarm` | Önceki geliştirme | Merge edildi |
| `claude/hxi-brand-architecture-740yhs` | HXI marka | Merge edildi |
