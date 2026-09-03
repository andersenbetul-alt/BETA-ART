# WEB-2026-001 QBLOGG — Karar Günlüğü

Projenin teknik, tasarım ve iş kararları tarih sırasıyla. Her karar:
**ne** kararlaştırıldı, **neden**, **ne reddi içeriyor** ve **kim aldı**.

---

## KAR-001 — Saf HTML/CSS/JS, çatı yok (2026-08-14)

**Karar:** React, Next.js, Astro gibi çatılar kullanılmayacak; site saf HTML + CSS + JS olarak yazılacak.

**Gerekçe:** Herhangi bir statik sunucuya derleme adımı olmadan yüklenebilmesi. Bakım yükü sıfıra yakın; kırılacak derleme zinciri yok.

**Reddedilenler:** Next.js (derleme adımı zorunlu, Node bağımlılığı), Astro (bağımlılık yönetimi), Jekyll/Hugo (Ruby/Go kurulumu).

**Ödünleşim (bilinçli kabul edildi):** İstemci taraflı i18n nedeniyle çok dilli SEO tam verim vermiyor. Kalıcı çözüm (ön-render) ROADMAP'te.

**Karar sahibi:** Betul Andersen

---

## KAR-002 — 10 dil, istemci taraflı (2026-08-14)

**Karar:** tr, en, zh, hi, es, ar, fr, pt, ru, no — tüm metinler tek `i18n.js` sözlüğünden.

**Gerekçe:** Hızlı kurulum; tek dosya değişikliğiyle tüm diller güncellenir.

**Reddedilenler:** Ayrı HTML dosyası per dil (bakım 10 katına çıkar), server-side i18n (sunucu gerektirir).

**Ödünleşim:** SEO bedeli biliniyor; ön-render eklendiğinde bu karar revize edilebilir.

---

## KAR-003 — Fontlar yerel, Google Fonts CDN yok (2026-08-14)

**Karar:** Inter Variable font yerel olarak barındırılacak (OFL-1.1), Google Fonts CDN kullanılmayacak.

**Gerekçe:** GDPR riski — Münih Mahkemesi kararı (2022): Google Fonts CDN ziyaretçi IP'sini Google'a gönderir, bu veri işleme rızası gerektirir ve dava sonucu ihlal sayılmıştır.

**Reddedilenler:** Google Fonts CDN, system-ui yalnızca (marka tutarlılığı bozulur).

---

## KAR-004 — Emoji yasak, SVG ikon (2026-08-14)

**Karar:** Görünen her ikon satır içi SVG; emoji hiçbir yerde kullanılmayacak.

**Gerekçe:** Windows, Android ve macOS emoji renderı birbirinden farklı — marka görselinin kontrolü kaybedilir. SVG: 24×24, `fill="none"`, `stroke="currentColor"`, çapraz platform tutarlı.

**İstisna:** Ok ve tema düğmesindeki tek renkli metin işaretleri (→ ↑ ☾ ☀) bu kuralın dışında; yazı tipiyle çizilir.

---

## KAR-005 — Formlar `mailto:` ile, sunucu yok (2026-08-14)

**Karar:** Brief formu ve yazar başvurusu `composeMail()` ile `mailto:` taslağı açar.

**Gerekçe:** Sunucusuz çalışsın — sıfır backend maliyeti, sıfır güvenlik yüzeyi.

**Ödünleşim:** Kullanıcı kendi e-posta istemcisini açmak zorunda; dönüşüm oranı düşüyor olabilir. Geçiş noktası hazır: `app.js → composeMail` fonksiyonu Formspree/Netlify Forms'a kolayca bağlanabilir.

---

## KAR-006 — İki katmanlı içerik modeli (2026-08-18)

**Karar:** tr ve en tam makale (30–55 blok, 1.200+ kelime); kalan 8 dil özet katmanı (3 blok, 250–1.200 karakter).

**Gerekçe:** On dilde tam makale bakım yükü kaliteyi düşürür. Özet katmanı "eksik" değil tasarım — kendi dilinde kısa okuma, tam makale için tr/en'e yönlendirme.

**`check.mjs`:** İkisini ayrı eşiklerle denetler (CJK duyarlı kelime sayacı).

---

## KAR-007 — Vercel buildCommand deseni (2026-08-22)

**Karar:** Vercel'e yalnızca `vercel.json` deploy edilir; `buildCommand` public `main` dalını klonlayıp dosyaları `dist/`e kopyalar.

**Gerekçe:** `andersenbetul-alt` GitHub hesabı Vercel entegrasyonunda (`betulandersen-droid`a bağlı) yetkili değil; push başına otomatik deploy kurulamıyor. Bu desen yetkisizlik sorununu aşar.

**Güncelleme yolu:** main'e push → aynı Vercel dağıtımını yeniden tetikle.

---

## KAR-008 — Davranış sistemi: sıfır bağımlılık, localStorage (2026-09-02)

**Karar:** `behavior.js` IIFE olarak yazıldı; hiçbir kütüphane yok, localStorage kullanılıyor.

**Gerekçe:** Çatı yok kuralıyla tutarlı. localStorage'da yalnızca slug + kategori — kişisel veri yok, GDPR'da düşük risk. `QB_BEH.clear()` ile GDPR veri silme desteği.

**Reddedilenler:** Mixpanel/Amplitude (harici servis, GDPR yükü), React state (çatı gerektirir), cookie (tarayıcı politikaları değişiyor, ITP riski).

---

## KAR-009 — Fiyatlar "örnek" ibaresiyle (2026-08-18)

**Karar:** Paket fiyatları araştırma/örnek veri olarak işaretlenir; kesin vaat olarak sunulmaz.

**Gerekçe:** Abartılı iddia bu işte en pahalı hata. Norveç piyasa araştırması fiyatların 2–5 kat düşük olduğunu gösterdi (ROADMAP satır 67).

---

## KAR-010 — NAVIAR behavior.js: repo transferi sonrası (2026-08-31)

**Karar:** NAVIAR'a `behavior.js` entegrasyonu `betulandersen-droid/naviar-care-1` → `andersenbetul-alt` repo transferi tamamlanana kadar başlamaz.

**Gerekçe:** Kodun burada olması neyin mevcut olduğunu gösterir — bu olmadan marka kararları havada kalır. TS uyarlaması `naviar/docs/behavior-system.md`'de belgelenmiş, uygulama bekleniyor.
