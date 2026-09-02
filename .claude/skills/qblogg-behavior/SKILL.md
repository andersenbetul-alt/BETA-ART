---
name: qblogg-behavior
description: QBLOGG davranış tabanlı kişiselleştirme sistemi — behavior.js mimarisi, localStorage API, öneri algoritması, Stripe CTA aktivasyonu ve yeni site/dile uyarlama adımları. Behavior sistemi geliştirme, hata ayıklama veya Stripe aktivasyonu için yükle.
owner: QBLOGG
---

# QBLOGG Davranış Sistemi — geliştirme kılavuzu

Sistem 02.09.2026'da tamamlandı. Bu belge sonraki oturumlar için referanstır.

---

## 1. Mimari özet

```
assets/js/behavior.js   ← tek IIFE modülü; derleme yok
assets/js/i18n.js       ← 3 yeni anahtar: beh.nextRead, beh.recoPlan, beh.contReading
assets/js/config.js     ← payLinks: {p1,p2,p3} — Stripe aktivasyon noktası
localStorage: qb_beh    ← {events:[{s,c,ts}]}; MAX_EV=60
```

**Başlatma noktası:** `document.addEventListener('qb:lang', init)` — app.js'in
`renderAll()` bitiminde dispatch ettiği event. DOMContentLoaded veya setTimeout
yok; timing güvenli çünkü `qb:lang` her zaman `renderPost()` / `renderList()`
çalıştıktan sonra gelir.

---

## 2. Genel API (`window.QB_BEH`)

| Fonksiyon | İmza | Ne yapar |
|---|---|---|
| `track` | `(slug, category)` | `localStorage`'a `{s, c, ts}` yazar; MAX_EV aşılırsa eski eventler düşer |
| `suggest` | `(posts, currentSlug, limit=3)` | Okunmamış + en yüksek puanlı yazıları döndürür |
| `topCat` | `()` | Decay-ağırlıklı en yüksek kategoriyi döndürür |
| `recoPlan` | `()` | `topCat` → `{business:'p3', safety:'p1', money:'p2', jobs:'p2', ai:'p2'}` |
| `eventCount` | `()` | Toplam kayıtlı event sayısı |
| `clear` | `()` | `localStorage.removeItem('qb_beh')` |

---

## 3. Öneri algoritması

```
Puan = (kategorinin decay-ağırlıklı event toplamı) + (topCategory bonusu: 5)
Bozulursa: tarihe göre azalan sıralama
```

- **Decay:** `Math.pow(0.85, günSayısı)` — eski okumalar ağırlığını kaybeder
- **Filtre:** zaten okunan sluglar (localStorage'da `e.s` bulunan) ve currentSlug
- **Limit:** varsayılan 3 öneri

**Eşikler:**
- `MIN_SUGGEST = 2` — bu kadar event birikince öneri widget'ı göster
- `MIN_PLAN = 4` — Stripe CTA göstermek için minimum event

---

## 4. Widget enjeksiyonu

### Yazı sayfası (`injectPostWidget`)
1. `#article` var mı ve içinde `<h1>` var mı? (yazı render edildi mi kontrolü)
2. `sessionStorage['qb_beh_seen_<slug>']` yoksa `track()` çağır ve işaretle
3. `eventCount() >= 2` → öneri widget'ı `#article`'ın sonuna ekle
4. `payLinks[recoPlan()]` doluysa ve `eventCount() >= 4` → Stripe CTA ekle
5. Dil değişiminde eski `#beh-widget`'ı kaldır, yeniden enjekte et

### Blog sayfası (`injectBlogHint`)
1. `#postList` var mı + `eventCount() >= 3`?
2. `topCat()` → kategori filtre bağlantısı olarak `#postList`'ten önce ipucu paragrafı ekle
3. Dil değişiminde `#beh-hint` kaldır, yeniden ekle

---

## 5. Stripe CTA aktivasyonu (kullanıcı yapacak)

`assets/js/config.js` içindeki `payLinks` nesnesine Stripe Payment Link URL'lerini ekle:

```js
payLinks: {
  p1: 'https://buy.stripe.com/…',   // safety paketi
  p2: 'https://buy.stripe.com/…',   // money/jobs/ai paketi
  p3: 'https://buy.stripe.com/…',   // business/hr paketi
}
```

**Değişmeden önce CTA görünmez.** URL'ler eklendiği anda, 4+ event biriken
ziyaretçilere otomatik olarak uygun plan CTA'sı çıkar. Kod değişikliği gerekmez.

---

## 6. i18n anahtarları (10 dil × 3 anahtar)

```
beh.nextRead    — "Bunlar da ilginizi çekebilir" / "You might also enjoy" / …
beh.recoPlan    — "Okudularınıza göre önerimiz" / "Based on your reading" / …
beh.contReading — "Okumaya devam edin:" / "Continue reading about" / …
```

Yeni dil eklendiğinde bu 3 anahtarı da doldurun. `check.mjs` kontrol eder.

---

## 7. Yeni sayfa/platform uyarlaması

QBLOGG klonu için behavior.js'i yeniden kullanmak:

1. `LS_KEY` sabitini değiştir (namespace çakışması önler: `'nav_beh'`, `'prj_beh'` vb.)
2. `recoPlan()` içindeki `map`'i yeni hizmet planlarıyla güncelle
3. i18n anahtarlarının karşılıklarını platforma ekle
4. `qb:lang` event yerine platformun render hook'unu kullan (veya DOMContentLoaded)
5. `config.js → payLinks` yapısını yeni plan anahtarlarına uyarla

NAVIAR için TypeScript uyarlaması hazır: `naviar/docs/behavior-system.md`

---

## 8. Test etme

```js
// Konsoldan manuel test:
QB_BEH.track('ai-icerik-studyosu', 'ai');
QB_BEH.track('seo-rehberi', 'seo');
QB_BEH.eventCount(); // → 2
QB_BEH.topCat();     // → 'ai' veya 'seo'
QB_BEH.suggest(QB_POSTS, 'ai-icerik-studyosu', 3);

// Widget'ı sıfırla:
QB_BEH.clear(); location.reload();
```

Widget'ın gözükmesi için: yazı sayfasında ol (`post.html?slug=…`), 2+
farklı slug track'lenmiş olsun, sayfayı yenile.

---

## 9. GDPR notu

- Kişisel veri yok: IP, e-posta, ad saklanmaz; yalnızca slug ve kategori.
- `localStorage` tarayıcıda, yalnızca o cihazda; sunucuya gönderilmez.
- GDPR meşru menfaat kapsamında değerlendirilebilir (içerik kişiselleştirme).
- `QB_BEH.clear()` gizlilik sayfasına "Veriyi sil" butonu olarak bağlanabilir.
- Gizlilik metnine "tarayıcı tercihleri" açıklaması eklenmelidir.
