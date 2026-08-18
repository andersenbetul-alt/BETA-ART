/* Search Console geri beslemesi.
 *
 * API yerine CSV içe aktarma ile başlıyoruz: Search Console → Performance →
 * Export → CSV. Anahtar, OAuth ve kota derdi yok; haftada bir dosya yeterli.
 * (API'ye geçildiğinde yalnızca bu dosya değişir.)
 *
 * Kullanım: node engine/run.mjs --gsc ./Queries.csv
 */
import { readFileSync } from 'node:fs';

export function parseGscCsv(path) {
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '');
  const [head, ...rows] = text.trim().split(/\r?\n/);
  const cols = head.split(',').map((c) => c.trim().toLowerCase());
  const idx = (names) => cols.findIndex((c) => names.some((n) => c.includes(n)));
  const iQuery = idx(['query', 'sorgu']);
  const iClicks = idx(['click', 'tıkla']);
  const iImpr = idx(['impression', 'gösterim']);
  const iCtr = idx(['ctr']);
  const iPos = idx(['position', 'konum']);
  if (iQuery === -1) throw new Error('CSV içinde sorgu sütunu bulunamadı');

  return rows.map((line) => {
    const c = line.split(',');
    const num = (i) => (i === -1 ? null : Number(String(c[i]).replace(/[%"]/g, '').replace(',', '.')) || 0);
    return {
      query: String(c[iQuery]).replace(/^"|"$/g, ''),
      clicks: num(iClicks), impressions: num(iImpr), ctr: num(iCtr), position: num(iPos)
    };
  }).filter((r) => r.query);
}

/** Trafiği olan ama sıralaması zayıf sorgular = en hızlı kazanç. */
export function findOpportunities(rows, { minImpressions = 100, minPosition = 8 } = {}) {
  return rows
    .filter((r) => r.impressions >= minImpressions && r.position >= minPosition)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50);
}
