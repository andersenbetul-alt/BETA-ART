# WEB-2026-001 QBLOGG — Proje Özeti

## Projenin Amacı

QBLOGG, içerik ekibi olmayan KOBİ ve SaaS şirketlerine **içerik hattı** satan bir
stüdyonun tanıtım + blog sitesidir. Sitenin tek işi: ziyaretçiyi brief formuna
yönlendirmek.

## Ne Satar

Üç abonelik paketi:

| Paket | Kapsam | Hedef Müşteri |
|---|---|---|
| p1 | Güvenlik / rehber içeriği | `safety`, `guide` kategorileri |
| p2 | Para, kariyer, AI, SEO, pazarlama | `money`, `jobs`, `ai`, `seo`, `marketing` |
| p3 | İş dünyası, İK | `business`, `hr` |

## Teknik Tercihler ve Gerekçeleri

| Tercih | Gerekçe |
|---|---|
| Saf HTML/CSS/JS (framework yok) | Herhangi bir statik sunucuya derleme adımı olmadan yüklenir |
| 10 dil, istemci tarafı | Hızlı kurulum; SEO bedeli biliniyor (ön-render henüz eklenmedi) |
| Formlar `mailto:` ile | Sunucusuz çalışsın; gerçek forma geçiş noktası hazır (`composeMail`) |
| Font yerel (Inter, OFL-1.1) | GDPR: Google Fonts CDN IP kaydı riskli (Münih Mahkemesi kararı) |
| Emoji yok, SVG ikon | Çapraz platform tutarlılığı; işletim sistemi emoji renderı farklılık gösteriyor |
| Renk değişkenleri | Koyu tema otomatik çalışıyor; `--brand`, `--text` vb. |

## İçerik Modeli

- **TR + EN:** Tam makale (30–55 blok, 1.200+ kelime)
- **Diğer 8 dil:** 3 bloklu özet
- Her yazıda `orig` (özgün katkı) ve `src` (≥3 kaynak) zorunlu
- Davranış sistemi: `QB_BEH` ile kategori bazlı öneri + Stripe CTA (4+ event)

## Gelir Modeli

1. **Brief formu:** Müşteri brief gönderir → teklif → proje
2. **Stripe CTA:** 4+ okuma sonrası hedef pakete bağlantı (henüz aktif değil)
3. **Lead magnet:** Otomasyon Keşif Kontrol Listesi → Buttondown listesi

## Proje Tarihçesi (Özet)

| Tarih | Kilometre Taşı |
|---|---|
| 2026-08-14 | İlk taslak (tahmini) |
| 2026-08-18 | Temel altyapı: blog, i18n, SEO, lead magnet |
| 2026-08-19–20 | 10 blog yazısı görünürlük kapısından geçirildi |
| 2026-08-21 | Buttondown bağlandı; CSP güncellendi |
| 2026-08-22 | Vercel yayına alındı; marka tescil hazırlığı |
| 2026-08-24 | Üye uygulaması iskeleti; Action Pages demo |
| 2026-08-30 | Monorepo: NAVIAR + agents eklendi |
| 2026-09-01 | Yeni blog yazısı (Norveç iş hukuku); font optimize |
| 2026-09-02 | Davranış sistemi (behavior.js) tamamlandı; skills güncellendi |
