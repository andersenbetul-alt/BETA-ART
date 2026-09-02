#!/usr/bin/env node
/* Eve Chat Template sürücüsü — yapıyı doğrular, typecheck çalıştırır.
 *
 * Kullanım (eve-chat-template/ klasöründen):
 *   node .claude/skills/run-eve-chat-template/driver.mjs check [çıktı-dizini]
 *
 * NOT: `pnpm dev` hem Next.js hem eve sunucusunu başlatır.
 * Eve, Vercel AI Gateway'e (ai-gateway.vercel.sh) bağlanır — bu konteynerden 403.
 * Deploy edilmiş URL yoksa yerel çalıştırma mümkün değildir.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // eve-chat-template/
const OUT = process.argv[3] || '/tmp/eve-chat-run';
mkdirSync(OUT, { recursive: true });

let kalan = 0;
const kontrol = (ad, k, ek = '') => {
  console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
  if (!k) kalan++;
};

// Yapı doğrulaması
const gerekliDosyalar = [
  'package.json',
  'next.config.ts',
  'agent/agent.ts',
  'agent/instructions.md',
  'agent/tools/get_weather.ts',
  'agent/skills/plan_a_trip.md',
  'agent/channels/eve.ts',
  'agent/channels/slack.ts',
];
for (const dosya of gerekliDosyalar) {
  kontrol(`dosya mevcut: ${dosya}`, existsSync(join(KOK, dosya)));
}

// node_modules kurulu mu?
kontrol('node_modules kurulu', existsSync(join(KOK, 'node_modules')));

// Typecheck (next typegen + tsgo)
try {
  execSync('pnpm typecheck', { cwd: KOK, stdio: 'pipe' });
  kontrol('typecheck geçti', true);
} catch (e) {
  kontrol('typecheck geçti', false, e.stderr?.toString().trim().slice(0, 120));
}

console.log(kalan === 0 ? 'CHECK: PASS' : `CHECK: FAIL (${kalan})`);
process.exit(kalan ? 1 : 0);
