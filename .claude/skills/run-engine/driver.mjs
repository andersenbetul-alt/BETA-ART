#!/usr/bin/env node
/* Curiosity Engine — smoke test sürücüsü.
 * Yalnızca Node 22 + depo kökü gerektirir; npm install gerekmez.
 *
 * Kullanım (depo kökünden):
 *   node .claude/skills/run-engine/driver.mjs billing   # billing birim testleri
 *   node .claude/skills/run-engine/driver.mjs pipeline  # demo boru hattı
 *   node .claude/skills/run-engine/driver.mjs smoke     # her ikisi sırayla
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const MODE = process.argv[2] || 'smoke';

let allPassed = true;

function run(label, args) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(process.execPath, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env },
  });
  if (r.status !== 0) {
    console.error(`✗ ${label} — çıkış kodu ${r.status ?? 'sinyal:' + r.signal}`);
    allPassed = false;
  } else {
    console.log(`✓ ${label}`);
  }
}

function pipelineSmoke() {
  /* --demo: ağ/API anahtarı olmadan tam boru hattı */
  const r = spawnSync(process.execPath, ['engine/run.mjs', '--demo'], {
    cwd: ROOT,
    stdio: ['inherit', 'pipe', 'inherit'],
    env: { ...process.env },
  });
  const out = r.stdout?.toString() ?? '';
  const ok =
    r.status === 0 &&
    /sinyal/.test(out) &&   // "30 sinyal → ..." satırı
    /konu/.test(out);       // konu sayısı
  console.log(out);
  if (ok) {
    console.log('✓ pipeline demo');
  } else {
    console.error('✗ pipeline demo — beklenen çıktı yok');
    allPassed = false;
  }
}

if (MODE === 'billing' || MODE === 'smoke') {
  run('billing testleri', ['engine/billing.test.mjs']);
}

if (MODE === 'pipeline' || MODE === 'smoke') {
  console.log('\n▶ pipeline demo (ağ yok, sabit veri)');
  pipelineSmoke();
}

if (MODE === 'board') {
  run('board (son tablo)', ['engine/run.mjs', '--board']);
}

if (MODE === 'visibility') {
  run('görünürlük testleri', ['engine/visibility.test.mjs']);
}

if (MODE === 'score') {
  run('puan testleri', ['engine/score.test.mjs']);
}

console.log('\n' + (allPassed ? '✅ Tüm kontroller geçti' : '❌ En az bir kontrol başarısız'));
process.exit(allPassed ? 0 : 1);
