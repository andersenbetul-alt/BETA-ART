/* Curiosity Engine — veritabanı katmanı.
 * Node 22'nin yerleşik node:sqlite modülü; ek bağımlılık yok.
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = process.env.QB_DB || join(HERE, 'data', 'curiosity.db');

export function open() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(readFileSync(join(HERE, 'schema.sql'), 'utf8'));
  return db;
}

export const nowISO = () => new Date().toISOString();

export function startRun(db, mode) {
  const r = db.prepare('INSERT INTO runs (started_at, mode) VALUES (?, ?)').run(nowISO(), mode);
  return Number(r.lastInsertRowid);
}

export function finishRun(db, runId, signalsIn, topicsOut, notes = '') {
  db.prepare('UPDATE runs SET finished_at = ?, signals_in = ?, topics_out = ?, notes = ? WHERE id = ?')
    .run(nowISO(), signalsIn, topicsOut, notes, runId);
}

export function insertSignal(db, s) {
  const stmt = db.prepare(`INSERT OR IGNORE INTO signals
    (source, external_id, title, url, raw_score, captured_at, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const r = stmt.run(s.source, s.externalId ?? null, s.title, s.url ?? null,
                     s.rawScore ?? null, s.capturedAt ?? nowISO(), s.publishedAt ?? null);
  return Number(r.changes) ? Number(r.lastInsertRowid) : null;
}

export function upsertTopic(db, { slug, title, pillar }) {
  const existing = db.prepare('SELECT id FROM topics WHERE slug = ?').get(slug);
  if (existing) {
    db.prepare('UPDATE topics SET last_seen = ?, signal_count = signal_count + 1 WHERE id = ?')
      .run(nowISO(), existing.id);
    return Number(existing.id);
  }
  const r = db.prepare(`INSERT INTO topics (slug, title, pillar, first_seen, last_seen, signal_count)
                        VALUES (?, ?, ?, ?, ?, 1)`).run(slug, title, pillar ?? null, nowISO(), nowISO());
  return Number(r.lastInsertRowid);
}

export function linkSignal(db, topicId, signalId) {
  if (!signalId) return;
  db.prepare('INSERT OR IGNORE INTO topic_signals (topic_id, signal_id) VALUES (?, ?)').run(topicId, signalId);
}

export function saveScore(db, topicId, runId, s) {
  db.prepare(`INSERT INTO scores
    (topic_id, run_id, growth, search_interest, social, commercial, competition,
     brand_fit, freshness, trend_score, opportunity, money, final_score, decision, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(topicId, runId, s.growth, s.searchInterest, s.social, s.commercial, s.competition,
         s.brandFit, s.freshness, s.trendScore, s.opportunity, s.money, s.finalScore, s.decision, nowISO());
  db.prepare('UPDATE topics SET status = ? WHERE id = ?')
    .run(s.decision === 'skip' ? 'skipped' : 'scored', topicId);
}

export function queueArticle(db, topicId, { slug, title, speed, moneyPath, wordTarget }) {
  db.prepare(`INSERT OR IGNORE INTO articles (topic_id, slug, title, speed, money_path, word_target, created_at)
              VALUES (?,?,?,?,?,?,?)`).run(topicId, slug, title, speed, moneyPath, wordTarget, nowISO());
  db.prepare("UPDATE topics SET status = 'queued' WHERE id = ?").run(topicId);
}

/** Dashboard için son çalıştırmanın tablosu. */
export function liveBoard(db, limit = 25) {
  return db.prepare(`
    SELECT t.slug, t.title, t.pillar, t.signal_count,
           s.trend_score, s.opportunity, s.money, s.final_score, s.decision,
           s.growth, s.competition, s.created_at
    FROM scores s
    JOIN topics t ON t.id = s.topic_id
    WHERE s.run_id = (SELECT MAX(id) FROM runs)
    ORDER BY s.final_score DESC
    LIMIT ?`).all(limit);
}
