/* Sinyal kümesinden puanlama özniteliklerini türetir.
 *
 * Burada dürüst olmak önemli: bazı öznitelikler doğrudan ölçülemiyor ve
 * vekil (proxy) ile tahmin ediliyor. Hangisinin ölçüm hangisinin tahmin
 * olduğu aşağıda tek tek yazılı. Gerçek veri kaynağı bağlandıkça vekiller
 * ölçümle değiştirilir.
 */
import { keywords } from './cluster.mjs';

/* Ticari niyet işaretleri: bunlar geçiyorsa okuyucu satın almaya yakın. */
const COMMERCIAL = ['best', 'top', 'review', 'vs', 'price', 'pricing', 'cost', 'cheap',
  'tool', 'software', 'platform', 'alternative', 'buy', 'worth it', 'compare',
  'en iyi', 'fiyat', 'ücret', 'karşılaştırma'];

const QUESTION = ['how', 'what', 'why', 'which', 'can', 'should', 'is it', 'does',
  'nasıl', 'nedir', 'neden', 'hangi', 'mi ', 'mı '];

const OUR_PILLARS = new Set(['ai', 'money', 'jobs', 'business', 'life', 'senior', 'safety']);

const norm = (v, max) => Math.max(0, Math.min(100, (v / max) * 100));
const hoursSince = (iso, now) => (now - new Date(iso).getTime()) / 36e5;

export function deriveFeatures(cluster, { now = Date.now(), pillar = null } = {}) {
  const sigs = cluster.signals;
  const times = sigs.map((s) => s.publishedAt || s.capturedAt).filter(Boolean);
  const ages = times.map((t) => hoursSince(t, now)).filter((h) => Number.isFinite(h) && h >= 0);
  const newest = ages.length ? Math.min(...ages) : 72;

  // ÖLÇÜM: son 24 saatteki sinyal payı — konu şu an mı konuşuluyor?
  const recent = ages.filter((h) => h <= 24).length;
  const growth = ages.length ? norm(recent / ages.length * 100, 100) : 40;

  // ÖLÇÜM (kısmi): Trends yaklaşık trafiği veya GSC gösterimi varsa kullanılır.
  const trendTraffic = Math.max(0, ...sigs.filter((s) => s.source === 'google_trends').map((s) => s.rawScore || 0));
  const gscImpr = Math.max(0, ...sigs.filter((s) => s.source === 'gsc').map((s) => s.rawScore || 0));
  const searchInterest = trendTraffic ? norm(trendTraffic, 50000)
    : gscImpr ? norm(gscImpr, 5000)
    : norm(sigs.length, 8);          // vekil: kaç kaynak konuşuyor

  // ÖLÇÜM: Reddit/HN puanları toplamı.
  const socialRaw = sigs.filter((s) => ['reddit', 'hn'].includes(s.source))
    .reduce((sum, s) => sum + (s.rawScore || 0), 0);
  const social = norm(socialRaw, 3000);

  // TAHMİN: başlıktaki ticari niyet işaretleri.
  const text = sigs.map((s) => s.title).join(' ').toLowerCase();
  const commercialHits = COMMERCIAL.filter((k) => text.includes(k)).length;
  const commercial = Math.min(100, 25 + commercialHits * 20);

  // VEKİL: haber kaynağı yoğunluğu rekabet göstergesi sayılır. Gerçek rekabet
  // SERP verisi ister (Ahrefs/Semrush); o bağlanınca burası ölçüme döner.
  // 100 = rakipsiz, 0 = doymuş.
  const newsCount = sigs.filter((s) => s.source === 'google_news').length;
  const competition = Math.max(10, 100 - newsCount * 15);

  // ÖLÇÜM: bizim yedi sütunumuza uyuyor mu.
  const brandFit = pillar && OUR_PILLARS.has(pillar) ? 100 : 35;

  // ÖLÇÜM: en yeni sinyalin yaşı.
  const freshness = newest <= 6 ? 100 : newest <= 24 ? 80 : newest <= 72 ? 55 : 25;

  // ÖLÇÜM: soru biçimindeki sinyaller (insanlar tam olarak neyi soruyor).
  const questionCount = sigs.filter((s) => {
    const t = s.title.toLowerCase();
    return t.includes('?') || QUESTION.some((q) => t.startsWith(q));
  }).length;

  return {
    growth: Math.round(growth), searchInterest: Math.round(searchInterest),
    social: Math.round(social), commercial, competition, brandFit,
    freshness, questionCount, moneyPath: moneyPathFor(pillar, commercial)
  };
}

/* Gelir yolu: sütun ve ticari niyete göre. Money Agent (AI) varsa bunu
   ezer; yoksa bu kural yeterince iyi bir başlangıç. */
export function moneyPathFor(pillar, commercial) {
  if (pillar === 'business' || pillar === 'ai') return commercial >= 65 ? 'service' : 'affiliate';
  if (pillar === 'money') return commercial >= 65 ? 'affiliate' : 'product';
  if (pillar === 'jobs') return 'course';
  if (pillar === 'senior') return 'affiliate';
  if (pillar === 'safety') return 'affiliate';
  if (pillar === 'life') return 'ads';
  return 'none';
}

export const KEYWORD_HINT = (title) => keywords(title).slice(0, 6).join(' ');
