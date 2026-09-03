# WEB-2026-001 — Güncel Durum Raporu

**Rapor tarihi:** 2026-09-03
**Hazırlayan:** AUTOPROMPT arşivleme sistemi

---

## 1. Proje kimliği

**WEB-2026-001 — QBLOGG**

## 2. Projenin amacı

İçerik ekibi olmayan KOBİ ve SaaS şirketlerine, tek araştırmadan yedi çıktı + on dil desteğiyle içerik hattı kurmak. Sitenin işi brief formunu doldurtmaktır.

## 3. Mevcut durum

**YAYINda** — Site çalışıyor. Operasyonel eksikler var.

## 4. Tespit edilen son sürüm

**v1.0.0** — main dalı, commit `b12dde9`, yayın tarihi 22.08.2026
**Sınıf:** Doğrulanmış kararlı sürüm

## 5. Son sürümün hangi kanıtlarla belirlendiği

- `git log main --decorate` → son merge commit `b12dde9` (Merge PR #15)
- `git log --format="%ai" main -1` → 2026-08-24 18:16:10 +0000
- `npm run check` oturum başlangıcında 8/8 geçti
- Vercel'de canlı adres (qblogg.vercel.app) erişilebilir

## 6. Tasarım yaklaşımı

- Sade, marka odaklı — Midnight Navy + Electric Aqua
- Koyu tema desteği (CSS değişken tabanlı)
- RTL (Arapça) desteği
- Emoji yasak, satır içi SVG ikon
- Token bazlı yazı tipi ölçeği

## 7. İçerik yapısı

- 9 HTML sayfası (9 işlevsel + 404)
- 11 blog yazısı × 10 dil
- İki katman: TR/EN tam makale, diğer 8 dil özet

## 8. Teknik mimari

Saf statik site — HTML + CSS + JS. Derleme yok, framework yok, bağımlılık yok. Tüm içerik JS dosyalarında. Vercel'de yayın.

## 9. Sayfa listesi

9 sayfa (bkz. `03-UX-VE-SERVIS-TASARIMI/SITE-HARITASI.md`)

## 10. Kod yapısı

4 JS dosyası (config, i18n, posts, app) + 1 CSS dosyası. Toplam ~3.600 satır.

## 11. Yeniden kullanılabilecek kodlar

| Bileşen | Dosya | Sınıf |
|---|---|---|
| i18n motoru (10 dil, veri-davranış ayrımı) | `app.js` + `i18n.js` | Küçük düzenleme ile kullanılabilir |
| CSS değişken sistemi (dark/light/RTL) | `main.css` | Olduğu gibi kullanılabilir |
| Blog liste + arama + filtre | `app.js` | Küçük düzenleme ile kullanılabilir |
| Marka üretim betiği | `scripts/marka-uret.py` | Projeye özel |
| Görünürlük kuralı denetimi | `scripts/gorunurluk.mjs` | Projeye özel |

## 12. Eksik belgeler

- `01-FIKIR-VE-STRATEJI/ILK-FIKIR.md` — ilk fikrin çıkış anı bilinmiyor
- `02-ARASTIRMA/` — kullanıcı araştırması yok (hızlı lansmanla atlandı)
- `05-ICERIK/SAYFA-ENVANTERI.md` — sayfa bazında detaylı içerik envanteri yok
- `10-SURUMLER/` — SemVer ve git tag henüz kullanılmıyordu

## 13. Teknik borçlar

1. `config.js` gerçek verilerle doldurulmadı (**Yüksek**)
2. Formspree kurulmadı (**Yüksek**)
3. Buttondown yanlış listeye bağlı (**Orta**)
4. GitHub entegrasyonu yetkisiz (otomatik deploy yok) (**Orta**)
5. İstemci taraflı i18n → çok dilli SEO sınırlı (**Düşük — bilinen, kabul edilmiş**)

## 14. Güvenlik ve gizlilik riskleri

- `npm run guvenlik` son çalıştırma tarihi bilinmiyor — çalıştırılmalı
- CSP `connect-src` yeni servis bağlandığında güncellenmeli
- Kişisel veri: yalnızca bülten e-postası Buttondown'a gidiyor (GDPR uyumu gizlilik.html'de)

## 15. Çakışan veya kopya dosyalar

Yok (bu proje için).

## 16. Arşivlenen sürümler

Yok — tek sürüm var (v1.0.0 = ilk kararlı sürüm).

## 17. Alınması gereken kararlar

1. config.js ne zaman doldurulacak? (Acil — site kullanılabilir değil)
2. Hangi form servisi? (Formspree önerili)
3. NOK cinsinden fiyatlandırma mı, EUR mı?
4. Portföy/vaka çalışmaları nereden gelecek?

## 18. Önerilen sonraki adımlar

**Acil (v1.1.0):**
1. `config.js` doldur — `mailTo`, `siteUrl`, `prices`, `social`
2. Buttondown'u doğru listeye bağla
3. Formspree form ID'sini ekle
4. `_vercel` TXT kaydını GoDaddy'e ekle

**Kısa vadeli (v1.2.0):**
5. 2–3 vaka çalışması ekle
6. Hakkımızda bölümü yaz (kim yazıyor)
7. GitHub entegrasyonunu `andersenbetul-alt`'a yetkilendir
