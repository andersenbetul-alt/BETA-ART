/* assets/js/behavior.js — QBLOGG kundeatferdssporing
 * Sporer hvilke innlegg brukeren har lest og anbefaler neste lesing.
 * Bruker utelukkende localStorage — ingen nettverksforespørsler, ingen cookies.
 */
(function () {
  'use strict';

  var KEY = 'qb_beh';
  var MAX = 25;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (_) { return []; }
  }

  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (_) {}
  }

  /* Registrer at brukeren leste et innlegg. Kall denne etter at artikkelen
     er rendret, slik at historikken oppdateres ved hvert besøk. */
  function record(slug, category) {
    if (!slug) return;
    var arr = load();
    var idx = -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].s === slug) { idx = i; break; }
    }
    if (idx !== -1) arr.splice(idx, 1);
    arr.unshift({ s: slug, c: category, ts: Date.now() });
    if (arr.length > MAX) arr.length = MAX;
    save(arr);
  }

  /* Returner limit antall anbefalte innlegg for brukeren.
     currentSlug utelukkes fra resultatet (tom streng = ingen ekskludering).
     Innlegg brukeren allerede har lest vektes ned; foretrukne kategorier
     basert på lesehistorikk vektes opp. */
  function recommend(currentSlug, posts, limit) {
    limit = limit || 3;
    var history = load();
    var seen = {};
    var catScore = {};
    for (var i = 0; i < history.length; i++) {
      seen[history[i].s] = true;
      catScore[history[i].c] = (catScore[history[i].c] || 0) + 1;
    }

    var unseen = [];
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].slug !== currentSlug && !seen[posts[j].slug]) {
        unseen.push(posts[j]);
      }
    }

    /* Ingen historikk eller alt er lest: returner nyeste ikke-gjeldende */
    if (!history.length || !unseen.length) {
      var fallback = [];
      for (var k = 0; k < posts.length; k++) {
        if (posts[k].slug !== currentSlug) fallback.push(posts[k]);
      }
      return fallback.slice(0, limit);
    }

    /* Sorter uleste innlegg etter kategorivekt, deretter dato */
    var scored = unseen.map(function (p) {
      return { p: p, score: catScore[p.category] || 0 };
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return b.p.date > a.p.date ? 1 : -1;
    });
    return scored.slice(0, limit).map(function (x) { return x.p; });
  }

  /* Har brukeren lesehistorikk? */
  function hasHistory() {
    return load().length > 0;
  }

  /* Returner liste over sett slugs (for "lest" merking). */
  function getSeenSlugs() {
    return load().map(function (h) { return h.s; });
  }

  /* Nullstill lesehistorikk (personvernkontroll). */
  function clear() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  window.QB_BEHAVIOR = {
    record: record,
    recommend: recommend,
    hasHistory: hasHistory,
    getSeenSlugs: getSeenSlugs,
    clear: clear
  };
})();
