# WEB-2026-001 QBLOGG — Değişiklik Günlüğü

Tarih sırasıyla önemli değişiklikler. Ayrıntılı günlük: `docs/proje-gunlugu.md`.

---

## 2026-09-02 — Davranış sistemi (behavior.js)

**Değişiklik:** `assets/js/behavior.js` oluşturuldu (228 satır).

**Kapsam:**
- `track(slug, category)` — yazı okunduğunda, oturum başına bir kez
- Gün bazlı azalma (DECAY=0,85)
- `suggest()` — kategori ağırlıklı öneri sıralaması
- `recoPlan()` — kategori → Stripe paket eşleşmesi
- `injectPostWidget()` — 2. okumadan öneri, 4. okumadan Stripe CTA
- `injectBlogHint()` — 3+ okuma sonrası kategori ipucu
- `QB_BEH.clear()` — GDPR veri silme
- `qb:lang` event dinleyici

**Yan değişiklikler:**
- `i18n.js`: 3 yeni anahtar × 10 dil (`beh.nextRead`, `beh.recoPlan`, `beh.contReading`)
- 6 HTML sayfasına `behavior.js` eklendi
- `naviar/docs/behavior-system.md`: Next.js uyarlaması belgesi

**check.mjs:** 8/8 yeşil.

---

## 2026-09-01 — Norveç iş hukuku blog yazısı + font optimizasyonu

**Değişiklik:** Yeni blog yazısı eklendi (Norveç iş hukuku). Inter Variable font optimize edildi.

---

## 2026-08-30 — Monorepo: NAVIAR + agents

**Değişiklik:** `naviar/` ve `agents/` dizinleri depoya eklendi. `MONOREPO.md` oluşturuldu.

---

## 2026-08-24 — Üye uygulaması iskeleti; Action Pages demo

**Değişiklik:**
- `uye/` dizini: Q Brief Pro iskeleti (saf HTML + Supabase — henüz yapılandırılmamış)
- `demo/` dizini: CV Action Page demosu

---

## 2026-08-22 — Vercel yayın; marka tescil hazırlığı

**Değişiklik:**
- Site qblogg.vercel.app adresinde yayına alındı
- `scripts/marka-tescil.mjs` oluşturuldu
- `404.html`, `og:image`, `robots.txt` eklendi

---

## 2026-08-21 — Buttondown bağlantısı; CSP güncellemesi

**Değişiklik:**
- Buttondown POST API bağlandı
- `vercel.json` CSP `connect-src`'ye `https://buttondown.com` eklendi
- `gizlilik.html` + `kosullar.html` oluşturuldu

---

## 2026-08-19–20 — 10 blog yazısı görünürlük kapısından geçirildi

**Değişiklik:** Tüm yazılara `orig` (özgün katkı) ve `src` (≥3 kaynak) alanları eklendi. Gövde metinlerine `**vurgu**` desteği (`rich()` fonksiyonu).

---

## 2026-08-18 — Temel altyapı

**Değişiklik:**
- Blog, i18n sistemi, SEO (BlogPosting + FAQPage JSON-LD), lead magnet
- `scripts/check.mjs`, `scripts/guvenlik.mjs`, `scripts/gorunurluk.mjs`
- `docs/gelir-sistemi.md`, `docs/tasarim-sistemi.md`
- Ortaklık bağlantısı altyapısı (`{aff:}` bloğu)

---

## 2026-08-14 — İlk taslak

**Değişiklik:** Proje başlatıldı. Temel sayfa iskeleti (index, work, blog, post), 10 dil desteği, saf HTML/CSS/JS kararı alındı.
