/* QBLOGG — ilgi izi.
 * Anonim, yalnızca bu tarayıcıda kalan görüntüleme geçmişinden "bunu da
 * beğenebilirsiniz" önerisi üretir. Sunucuya hiçbir şey gönderilmez;
 * kaydedilen tek şey kategori + zaman damgasıdır (kimlik, ad, e-posta yok).
 * localStorage anahtarı `qb_ilgi` — bkz. gizlilik.html.
 *
 * Geçmiş yoksa (ilk ziyaret) recommend() null döner; çağıran taraf mevcut
 * aynı-kategori mantığına düşer — ilk ziyaretçi için davranış değişmez.
 */
(function () {
  'use strict';

  var LS_KEY = 'qb_ilgi';
  var MAX_EVENTS = 30;

  function readEvents() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function writeEvents(events) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(events)); } catch (e) { /* gizli mod: yoksay */ }
  }

  function trackView(slug, category) {
    if (!slug || !category) return;
    var events = readEvents().filter(function (ev) { return ev.slug !== slug; });
    events.push({ slug: slug, category: category, ts: Date.now() });
    if (events.length > MAX_EVENTS) events = events.slice(events.length - MAX_EVENTS);
    writeEvents(events);
  }

  /* Diziin sonu en yeni görüntüleme — ağırlık dizindeki konuma göre artar
     (basit ters-sıra ağırlığı, üstel azalma gibi bağımlılık gerektirmez). */
  function categoryWeights() {
    var weights = {};
    readEvents().forEach(function (ev, i) {
      weights[ev.category] = (weights[ev.category] || 0) + (i + 1);
    });
    return weights;
  }

  function recommend(posts, excludeSlug, count) {
    count = count || 2;
    var weights = categoryWeights();
    if (!Object.keys(weights).length) return null; // geçmiş yok

    var viewedSlugs = {};
    readEvents().forEach(function (ev) { viewedSlugs[ev.slug] = true; });

    var candidates = (posts || []).filter(function (p) { return p.slug !== excludeSlug; });
    candidates.sort(function (a, b) {
      var scoreA = (weights[a.category] || 0) - (viewedSlugs[a.slug] ? 1000 : 0);
      var scoreB = (weights[b.category] || 0) - (viewedSlugs[b.slug] ? 1000 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.date) - new Date(a.date);
    });
    return candidates.slice(0, count);
  }

  window.QB_ILGI = { trackView: trackView, recommend: recommend };
})();
