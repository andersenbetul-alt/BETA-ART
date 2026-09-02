#!/usr/bin/env node
/**
 * run-engine/smoke.mjs
 * Curiosity Engine için smoke test sürücüsü.
 * Kullanım (engine/ dizininden):
 *   node .claude/skills/run-engine/smoke.mjs
 *
 * Modülleri import edip çalıştırır; test verisi demo-data.json'dan.
 * Çıkış kodu 0 = PASS, 1 = FAIL.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const ENGINE = resolve(__dir, '../../../');   // engine/ dizini

let pass = true;
const fail = (msg) => { console.error('❌', msg); pass = false; };
const ok = (msg) => console.log('✅', msg);

// ── 1. Billing modülü ──────────────────────────────────────────────────────
try {
  const { openBilling, creditBalance, formatMoney } = await import(`${ENGINE}/billing.mjs`);

  // openBilling(':memory:') ile geçici SQLite DB aç
  const db = openBilling(':memory:');
  const bal = creditBalance(db, 'test-acct');
  if (typeof bal !== 'number') fail(`creditBalance() sayı dönmeli; aldık: ${bal}`);
  else ok(`billing.creditBalance() → ${bal}`);

  // formatMoney kuruş/øre alır (örn. 49900 = 499,00 kr)
  const nok = formatMoney(49900, 'NOK');
  if (typeof nok !== 'string' || !nok.includes('kr')) fail(`formatMoney(NOK) hatalı: ${nok}`);
  else ok(`formatMoney(49900, NOK) → ${nok}`);
} catch (e) {
  fail(`billing.mjs import hatası: ${e.message}`);
}

// ── 2. Score modülü ────────────────────────────────────────────────────────
try {
  const { scoreTopic } = await import(`${ENGINE}/score.mjs`);

  // scoreTopic() tam nesne döndürür — finalScore sayısal, decision string
  const testTopic = { title: 'AI ile içerik üretimi', growth: 80, searchInterest: 70, commercial: 60, brandFit: 5 };
  const result = scoreTopic(testTopic);
  if (typeof result !== 'object' || result === null) fail(`scoreTopic() nesne beklendi`);
  else if (typeof result.finalScore !== 'number') fail(`finalScore sayı değil: ${result.finalScore}`);
  else if (typeof result.decision !== 'string') fail(`decision string değil`);
  else ok(`scoreTopic() → finalScore=${result.finalScore.toFixed(1)}, decision=${result.decision}`);
} catch (e) {
  fail(`score.mjs import hatası: ${e.message}`);
}

// ── 3. Visibility modülü ───────────────────────────────────────────────────
try {
  const { checkVisibility } = await import(`${ENGINE}/visibility.mjs`);

  // Demo makale — checkVisibility'nin beklediği alanlar
  const article = {
    title: 'AI ajanlari küçük işletme için',
    h1: 'AI ajanlari küçük işletme için',
    answer: 'AI ajanları küçük işletmelerin tekrarlayan görevleri otomatikleştirmesini sağlar.',
    inference: 'Çıkarım metni.',
    clusters: ['ai-uretimi', 'sebep-analizi', 'otomasyon-101', 'kucuk-isletme'],
    overlap: false,
    orig: 'Kendi isabet testi ve karşılaştırma tablosu.',
    src: [{ t: 'McKinsey', u: 'https://mckinsey.com' }, { t: 'Gartner' }, { t: 'Forrester' }],
    meta: 'AI ajanları küçük işletme: 103 karakterlik test metni',
    slug: 'ai-ajanlari-kucuk-isletme',
    schema: true,
    visuals: [{ alt: 'karşılaştırma tablosu' }],
    author: 'QBLOGG',
    date: '2026-08-18',
    wordCount: 1300,
    maxParaWords: 120,
  };

  const report = checkVisibility(article);
  const gates = Array.isArray(report) ? report : (report.gates || []);
  const failedGates = gates.filter(r => r.status === 'fail');
  if (failedGates.length > 5) fail(`Görünürlük kapıları çok başarısız (${failedGates.length})`);
  else ok(`visibility.checkVisibility() → ${gates.filter(r=>r.status==='pass').length} geçti`);
} catch (e) {
  fail(`visibility.mjs import hatası: ${e.message}`);
}

// ── 4. Test dosyalarını çalıştır ───────────────────────────────────────────
try {
  const { execSync } = await import('child_process');
  const out = execSync('node billing.test.mjs && node score.test.mjs && node visibility.test.mjs', {
    cwd: ENGINE, timeout: 20000
  }).toString();
  ok(`tüm test dosyaları geçti`);
} catch (e) {
  fail(`test dosyaları başarısız: ${e.stdout?.toString().slice(0,200) || e.message}`);
}

console.log('');
console.log(pass ? 'SMOKE: PASS' : 'SMOKE: FAIL');
process.exitCode = pass ? 0 : 1;
