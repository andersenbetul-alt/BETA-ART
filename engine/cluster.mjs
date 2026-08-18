/* Konu kümeleme — AI olmadan çalışan sürüm.
 *
 * Amaç: aynı şeyi söyleyen sinyalleri tek konuda toplamak. Bu, "100 tane
 * birbirinin aynısı makale" sorununu kaynağında engeller — Google'ın
 * ölçekli içerik kötüye kullanımı tanımına girmemek için önemli.
 *
 * Yöntem: başlıkları normalize et, anlamsız kelimeleri at, kalan anahtar
 * kelimelerden imza çıkar, imzası örtüşen sinyalleri birleştir.
 * API anahtarı varsa agents.mjs içindeki daha iyi kümeleyici devreye girer.
 */

const STOP = new Set(('the a an and or for to of in on with your you are is be how what why when '
  + 've ile bir bu şu için nasıl neden ne mi mı da de').split(' '));

/** Hafif gövdeleme: "businesses" ve "business" aynı kelime sayılsın.
 *  Dikkat: "business" (ss ile biter) kısaltılmamalı — önceki sürüm bunu
 *  "busines" yapıp "businesses" ile eşleşmesini engelliyordu. */
export function stem(w) {
  if (w.length <= 3) return w;
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (/(ses|xes|ches|shes)$/.test(w)) return w.slice(0, -2);
  if (w.endsWith('ss')) return w;
  if (w.endsWith('s')) return w.slice(0, -1);
  return w;
}

/* İki harfli olmasına rağmen anlamlı olan tokenlar. "ai" bunların en önemlisi:
   uzunluk filtresine takıldığı için AI sütunu hiçbir başlıkla eşleşmiyordu. */
const SHORT_KEEP = new Set(['ai', 'ml', 'vr', 'ar', 'ux', 'hr', 'b2b', 'seo']);

export function keywords(title) {
  return String(title).toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => (w.length > 2 || SHORT_KEEP.has(w)) && !STOP.has(w))
    .map(stem);
}

export function slugify(text) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
  return String(text).toLowerCase().replace(/[çğıöşü]/g, (c) => map[c])
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

/** İki başlık aynı konuyu mu anlatıyor?
 *  Örtüşme katsayısı kullanılır (Jaccard değil): başlık uzunlukları çok
 *  farklı olduğunda Jaccard yanıltıyor — "AI agents for small business are
 *  exploding" ile "Best AI agents for small businesses in 2026" aynı konu
 *  olduğu hâlde Jaccard 0,33 veriyordu. */
export function similarity(a, b) {
  const A = new Set(keywords(a)), B = new Set(keywords(b));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.min(A.size, B.size);
}

/** Sinyalleri konulara toplar. 0.6 örtüşme pratikte iyi ayırıyor. */
export function clusterSignals(signals, threshold = 0.6) {
  const clusters = [];
  for (const s of signals) {
    let best = null, bestSim = 0;
    for (const c of clusters) {
      const sim = similarity(s.title, c.title);
      if (sim > bestSim) { bestSim = sim; best = c; }
    }
    if (best && bestSim >= threshold) {
      best.signals.push(s);
      // En çok sinyali olan kaynağın başlığı temsilci olsun
      if ((s.rawScore || 0) > (best.topScore || 0)) { best.title = s.title; best.topScore = s.rawScore || 0; }
    } else {
      clusters.push({ title: s.title, topScore: s.rawScore || 0, signals: [s] });
    }
  }
  return clusters.map((c) => ({
    title: c.title,
    slug: slugify(c.title),
    signals: c.signals,
    sources: [...new Set(c.signals.map((s) => s.source))]
  }));
}

/* Sütun eşlemesi: konu hangi menü başlığına ait.
   Anahtar kelime bazlı; AI varsa agents.mjs daha isabetli sınıflandırır. */
const PILLAR_HINTS = {
  ai: ['ai', 'agent', 'chatgpt', 'claude', 'gemini', 'automation', 'llm', 'model', 'robot'],
  money: ['money', 'income', 'side hustle', 'earn', 'passive', 'affiliate', 'salary', 'freelance', 'para'],
  jobs: ['job', 'career', 'hiring', 'resume', 'cv', 'interview', 'skill', 'employment', 'layoff'],
  business: ['business', 'startup', 'saas', 'company', 'agency', 'entrepreneur', 'founder'],
  life: ['life', 'future', '2030', '2035', '2040', 'society', 'human', 'family'],
  senior: ['senior', 'retire', 'older', '50+', 'over 50', 'after 50', 'longevity', 'pension', 'emekli'],
  safety: ['scam', 'fraud', 'privacy', 'deepfake', 'security', 'safe', 'protect']
};

/* Sütun önceliği. Neredeyse her başlıkta "AI" geçtiği için AI sütunu her şeyi
   yutuyordu; bu yüzden karşılaştırma değil, öncelik sırası kullanılıyor:
   daha spesifik sütun eşleşirse o kazanır, AI en sonda kalır. */
const PILLAR_PRIORITY = ['safety', 'senior', 'jobs', 'money', 'business', 'life', 'ai'];

export function guessPillar(title) {
  const text = String(title).toLowerCase();
  const words = new Set(keywords(title));           // gövdelenmiş kelimeler
  for (const pillar of PILLAR_PRIORITY) {
    const hit = PILLAR_HINTS[pillar].some((h) =>
      h.includes(' ') ? text.includes(h) : words.has(stem(h)));
    if (hit) return pillar;
  }
  return null;
}
