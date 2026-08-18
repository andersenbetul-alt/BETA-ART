/* Anahtarsız kaynaklar: RSS ve açık JSON uçları.
 *
 * Google Trends'in resmî API'si şu an alpha ve erişim gerektiriyor; bu yüzden
 * V1'de herkese açık RSS uçlarını kullanıyoruz. Erişim alındığında yeni bir
 * kaynak dosyası eklemek yeterli — hattın geri kalanı değişmez.
 *
 * Not: Bazı ağlar bu adresleri engelleyebilir. Her kaynak tek tek hata verir,
 * hattı durdurmaz.
 */

const UA = 'QBLOGG-CuriosityEngine/0.1 (+https://qblogg.no)';

async function fetchText(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Basit RSS/Atom ayrıştırıcı — bağımlılık eklememek için elle yazıldı. */
export function parseRSS(xml) {
  const items = [];
  const blocks = xml.split(/<(?:item|entry)[\s>]/i).slice(1);
  for (const block of blocks) {
    const pick = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      if (!m) return null;
      return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
    };
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
    const title = pick('title');
    if (!title) continue;
    items.push({
      title,
      url: pick('link') || (linkMatch ? linkMatch[1] : null),
      publishedAt: pick('pubDate') || pick('updated') || null,
      traffic: pick('ht:approx_traffic')
    });
  }
  return items;
}

export const SOURCES = {
  /** Google News — konu bazlı haber akışı. */
  async googleNews(query) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    return parseRSS(await fetchText(url)).slice(0, 20).map((i) => ({
      source: 'google_news', externalId: i.url, title: i.title, url: i.url,
      rawScore: null, publishedAt: i.publishedAt
    }));
  },

  /** Google Trends günlük yükselenler (RSS). */
  async googleTrends(geo = 'US') {
    const url = `https://trends.google.com/trending/rss?geo=${geo}`;
    return parseRSS(await fetchText(url)).slice(0, 20).map((i) => ({
      source: 'google_trends', externalId: i.title, title: i.title, url: i.url,
      rawScore: i.traffic ? Number(String(i.traffic).replace(/\D/g, '')) : null,
      publishedAt: i.publishedAt
    }));
  },

  /** Hacker News ön sayfa — teknoloji sinyali. */
  async hackerNews() {
    return parseRSS(await fetchText('https://hnrss.org/frontpage?points=100')).slice(0, 20).map((i) => ({
      source: 'hn', externalId: i.url, title: i.title, url: i.url, publishedAt: i.publishedAt
    }));
  },

  /** Reddit — insanların doğrudan sorduğu sorular. */
  async reddit(subreddit, period = 'day') {
    const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=25&t=${period}`;
    const data = JSON.parse(await fetchText(url));
    return (data?.data?.children || []).map((c) => ({
      source: 'reddit', externalId: c.data.id, title: c.data.title,
      url: 'https://reddit.com' + c.data.permalink, rawScore: c.data.score,
      publishedAt: new Date(c.data.created_utc * 1000).toISOString()
    }));
  }
};

/** Yapılandırılmış tarama: her kaynak ayrı ayrı denenir, biri düşerse diğerleri devam eder. */
export async function scan(config) {
  const out = [];
  const errors = [];
  const jobs = [];

  for (const q of config.newsQueries || []) jobs.push(['google_news:' + q, () => SOURCES.googleNews(q)]);
  for (const geo of config.trendsGeos || []) jobs.push(['google_trends:' + geo, () => SOURCES.googleTrends(geo)]);
  for (const sub of config.subreddits || []) jobs.push(['reddit:' + sub, () => SOURCES.reddit(sub)]);
  if (config.hackerNews) jobs.push(['hn', () => SOURCES.hackerNews()]);

  const results = await Promise.allSettled(jobs.map(([, fn]) => fn()));
  results.forEach((r, i) => {
    const name = jobs[i][0];
    if (r.status === 'fulfilled') out.push(...r.value);
    else errors.push(`${name}: ${r.reason?.message || r.reason}`);
  });
  return { signals: out, errors };
}
