#!/usr/bin/env node
/* Curiosity Engine — hat çalıştırıcı.
 *
 *   node engine/run.mjs --demo              fikstür verisiyle (ağ ve anahtar gerekmez)
 *   node engine/run.mjs --live              canlı kaynaklar (RSS; anahtar gerekmez)
 *   node engine/run.mjs --live --gsc q.csv  Search Console dışa aktarımını da katar
 *   node engine/run.mjs --board             son tabloyu yazdırır
 *
 * Akış: TARA → KÜMELE → ÖZNİTELİK → PUANLA → KARAR → KUYRUK → PANEL
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as db from './db.mjs';
import { clusterSignals, guessPillar } from './cluster.mjs';
import { deriveFeatures } from './features.mjs';
import { scoreTopic } from './score.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i > -1 ? args[i + 1] : null; };

/* Canlı taramada izlenen kaynaklar. Sütunlarımıza göre seçildi. */
export const SCAN_CONFIG = {
  newsQueries: ['AI agents business', 'AI jobs 2030', 'AI side hustle', 'AI scam deepfake',
                'one person business AI', 'AI tools small business'],
  trendsGeos: ['US', 'GB', 'NO', 'TR'],
  subreddits: ['artificial', 'smallbusiness', 'Entrepreneur', 'sidehustle', 'careerguidance'],
  hackerNews: true
};

async function collect(mode) {
  if (mode === 'demo') {
    const fixture = JSON.parse(readFileSync(join(HERE, 'demo-data.json'), 'utf8'));
    const now = Date.now();
    return {
      signals: fixture.signals.map((s) => ({
        ...s,
        publishedAt: new Date(now - (s.hoursAgo || 0) * 36e5).toISOString(),
        capturedAt: new Date().toISOString()
      })),
      errors: []
    };
  }
  const { scan } = await import('./sources/rss.mjs');
  const res = await scan(SCAN_CONFIG);
  const gscPath = val('--gsc');
  if (gscPath) {
    const { parseGscCsv, findOpportunities } = await import('./sources/gsc.mjs');
    const rows = findOpportunities(parseGscCsv(gscPath));
    res.signals.push(...rows.map((r) => ({
      source: 'gsc', externalId: r.query, title: r.query, rawScore: r.impressions,
      publishedAt: new Date().toISOString()
    })));
  }
  return res;
}

async function main() {
  const mode = has('--live') ? 'live' : 'demo';
  const conn = db.open();

  if (has('--board')) { printBoard(db.liveBoard(conn)); return; }

  const runId = db.startRun(conn, mode);
  const { signals, errors } = await collect(mode);
  for (const e of errors) console.warn('  ! kaynak hatası —', e);
  if (!signals.length) {
    db.finishRun(conn, runId, 0, 0, 'sinyal yok: ' + errors.join('; '));
    console.error('Hiç sinyal toplanamadı. Ağ erişimini kontrol edin veya --demo kullanın.');
    process.exit(1);
  }

  const clusters = clusterSignals(signals);
  const now = Date.now();
  const rows = [];

  for (const cluster of clusters) {
    const pillar = guessPillar(cluster.title);
    const topicId = db.upsertTopic(conn, { slug: cluster.slug, title: cluster.title, pillar });
    for (const s of cluster.signals) db.linkSignal(conn, topicId, db.insertSignal(conn, s));

    const features = deriveFeatures(cluster, { now, pillar });
    const scored = scoreTopic(features);
    db.saveScore(conn, topicId, runId, scored);

    rows.push({ ...scored, topicId, slug: cluster.slug, title: cluster.title, pillar,
                signals: cluster.signals.length, sources: cluster.sources.join(','),
                moneyPath: features.moneyPath });
  }

  rows.sort((a, b) => b.finalScore - a.finalScore);

  /* Kuyruğa alma kuralı iki aşamalı:
     1) Mutlak eşiği geçenler (draft/publish/hot) her hâlükârda girer.
     2) Hiçbiri geçmezse günün en iyi N konusu yine de kuyruğa alınır.
        Sebep: RSS vekilleriyle mutlak skorlar 40–75 bandında kalıyor;
        Trends API ve Search Console bağlanınca bant yukarı kayacak.
        O gelene kadar "bugünün en iyi 3'ü" pratikte doğru karardır. */
  const topN = Number(val('--top') || 3);
  const passed = rows.filter((r) => ['draft', 'publish', 'hot'].includes(r.decision));
  const queue = passed.length ? passed : rows.slice(0, topN);
  for (const r of queue) {
    db.queueArticle(conn, r.topicId, {
      slug: r.slug, title: r.title, speed: r.speed, moneyPath: r.moneyPath, wordTarget: r.wordTarget
    });
    r.status = 'queued';
  }
  const queueNote = passed.length ? 'eşiği geçen' : `eşik geçilmedi → günün en iyi ${queue.length}`;

  db.finishRun(conn, runId, signals.length, clusters.length, errors.join('; '));
  mkdirSync(join(HERE, 'data'), { recursive: true });
  writeFileSync(join(HERE, 'data', 'board.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), mode, signals: signals.length, rows }, null, 2));

  console.log(`\n${signals.length} sinyal → ${clusters.length} konu · mod: ${mode}\n`);
  printBoard(rows);
  console.log(`\nKuyruğa alınan: ${queue.length} (${queueNote}) · panel verisi: engine/data/board.json`);
  queue.forEach((r) => console.log(`   → ${r.title.slice(0, 52)}  [${r.speed}, ${r.wordTarget} kelime, ${r.moneyPath}]`));
  console.log('Paneli açmak için: engine/dashboard.html');
}

function printBoard(rows) {
  const head = ['KONU', 'SÜTUN', 'TREND', 'FIRSAT', 'PARA', 'FINAL', 'KARAR'];
  const w = [42, 9, 6, 7, 6, 6, 8];
  console.log(head.map((h, i) => h.padEnd(w[i])).join(''));
  console.log('─'.repeat(w.reduce((a, b) => a + b, 0)));
  for (const r of rows.slice(0, 15)) {
    const icon = { hot: '🔥 HOT', publish: '🟢 YAYIN', draft: '🟠 TASLAK', idea: '🟡 FİKİR', skip: '❌ ATLA' }[r.decision];
    console.log([
      (r.title || '').slice(0, 40).padEnd(w[0]),
      String(r.pillar || '—').padEnd(w[1]),
      String(r.trendScore ?? r.trend_score).padEnd(w[2]),
      String(r.opportunity).padEnd(w[3]),
      String(r.money).padEnd(w[4]),
      String(r.finalScore ?? r.final_score).padEnd(w[5]),
      icon
    ].join(''));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
