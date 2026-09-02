/* QBLOGG — müşteri davranışı modülü
 *
 * Ziyaretçinin okuma geçmişini yerel olarak (localStorage) tutar.
 * Sunucuya hiçbir veri gönderilmez; veriler yalnızca bu tarayıcıda kalır.
 * Gizlilik politikası: gizlilik.html → "İçerik tercihleri" bölümü.
 *
 * localStorage anahtarı : qb_beh  → { v, n, cats, read }
 * sessionStorage anahtarı: qb_ses  → oturum başlangıç işaretleyicisi
 */
(function () {
  'use strict';

  var KEY = 'qb_beh';
  var SES = 'qb_ses';

  /* Kaydedilmiş davranış verisini döndürür; hata durumunda null. */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* Davranış verisini kaydeder; hata sessizce yutulur (gizli mod). */
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* yoksay */ }
  }

  /* Boş davranış nesnesi: v = şema sürümü. */
  function empty() {
    return { v: 1, n: 0, cats: {}, read: [] };
  }

  /* Sayfa açılışında çağrılır.
     Yeni oturum tespiti: sessionStorage işaretleyicisi yoksa ziyaret sayacı artar.
     Aynı sekme veya pencerede ardışık sayfa açılışları tek oturum sayılır. */
  function boot() {
    var inSession = false;
    try { inSession = !!sessionStorage.getItem(SES); } catch (e) { /* yoksay */ }
    var data = load() || empty();
    if (!inSession) {
      data.n = (data.n || 0) + 1;
      save(data);
      try { sessionStorage.setItem(SES, '1'); } catch (e) { /* yoksay */ }
    }
  }

  /* Bir yazı okunduğunda çağrılır.
     Yazı slug'ı okunmuş listesine eklenir; kategori puanı bir artar. */
  function trackRead(slug, category) {
    if (!slug) return;
    var data = load() || empty();
    if (!data.read) data.read = [];
    if (data.read.indexOf(slug) === -1) {
      data.read.push(slug);
    }
    if (category) {
      if (!data.cats) data.cats = {};
      data.cats[category] = (data.cats[category] || 0) + 1;
    }
    save(data);
  }

  /* Ziyaretçi en az iki farklı oturumda siteyi açtıysa true döner. */
  function isReturning() {
    var data = load();
    return !!(data && data.n >= 2);
  }

  /* En ilgili n yazıyı döndürür.
     - Zaten okunmuş yazılar atlanır.
     - Kategori puanı yüksek olanlar öne çıkar.
     - Eşit puanda en yeni yazı kazanır. */
  function recommend(posts, n) {
    var data = load();
    if (!data || !posts || !posts.length) return [];
    var cats = data.cats || {};
    var read = data.read || [];
    return posts.slice()
      .filter(function (p) { return read.indexOf(p.slug) === -1; })
      .sort(function (a, b) {
        var sa = cats[a.category] || 0;
        var sb = cats[b.category] || 0;
        if (sb !== sa) return sb - sa;
        return a.date < b.date ? 1 : -1;
      })
      .slice(0, n || 3);
  }

  /* Ziyaretçi bir paketi (p1, p2, p3) görüntülediğinde çağrılır.
     Paket adı `qb_beh.pkgs` altında sayılır; satış sayfasına yönlendirme
     kararlarında kullanılabilir. */
  function trackPackage(pkgId) {
    if (!pkgId) return;
    var data = load() || empty();
    if (!data.pkgs) data.pkgs = {};
    data.pkgs[pkgId] = (data.pkgs[pkgId] || 0) + 1;
    save(data);
  }

  /* Ziyaretçinin en çok incelediği paketi döndürür. */
  function topPackage() {
    var data = load();
    if (!data || !data.pkgs) return null;
    var pkgs = data.pkgs;
    var best = null, max = 0;
    Object.keys(pkgs).forEach(function(k) {
      if (pkgs[k] > max) { max = pkgs[k]; best = k; }
    });
    return best;
  }

  window.QB_BEH = {
    boot: boot,
    trackRead: trackRead,
    trackPackage: trackPackage,
    topPackage: topPackage,
    isReturning: isReturning,
    recommend: recommend
  };

  /* Modül yüklendiğinde oturum kaydı başlar. */
  boot();
})();
