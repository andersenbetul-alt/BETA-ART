#!/usr/bin/env node
/* Eve Slack Agent sürücüsü — yapıyı doğrular, typecheck çalıştırır.
 *
 * Kullanım (eve-slack-agent/ klasöründen):
 *   node .claude/skills/run-eve-slack-agent/driver.mjs check [çıktı-dizini]
 *   node .claude/skills/run-eve-slack-agent/driver.mjs invoke <url> <prompt> [çıktı-dizini]
 *
 * check  : typecheck + yapı doğrulaması. Çıkış kodu 0 = PASS, 1 = FAIL.
 * invoke : deploy edilmiş bir eve endpoint'ine prompt gönderir, yanıtı yazar.
 *
 * NOT: eve build/dev Vercel AI Gateway'e erişim gerektirir (ai-gateway.vercel.sh).
 * Bu konteynerden erişim proxy tarafından engellenmektedir (HTTP 403).
 * Bu nedenle yerel çalıştırma mümkün değildir; deploy edilmiş URL kullanın.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // eve-slack-agent/
const KIP = process.argv[2] || 'check';
const OUT = (KIP === 'invoke' ? process.argv[4] : process.argv[3]) || '/tmp/eve-slack-run';
mkdirSync(OUT, { recursive: true });

let kalan = 0;
const kontrol = (ad, k, ek = '') => {
  console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
  if (!k) kalan++;
};

if (KIP === 'check') {
  // Yapı doğrulaması
  const gerekliDosyalar = [
    'package.json',
    'agent/agent.ts',
    'agent/instructions.md',
    'agent/tools/get_weather.ts',
    'agent/skills/plan_a_trip.md',
    'agent/channels/slack.ts',
  ];
  for (const dosya of gerekliDosyalar) {
    kontrol(`dosya mevcut: ${dosya}`, existsSync(join(KOK, dosya)));
  }

  // node_modules kurulu mu?
  kontrol('node_modules kurulu', existsSync(join(KOK, 'node_modules')));

  // Typecheck
  try {
    execSync('pnpm typecheck', { cwd: KOK, stdio: 'pipe' });
    kontrol('typecheck geçti', true);
  } catch (e) {
    kontrol('typecheck geçti', false, e.stderr?.toString().trim().slice(0, 120));
  }

  console.log(kalan === 0 ? 'CHECK: PASS' : `CHECK: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);

} else if (KIP === 'invoke') {
  // Deploy edilmiş endpoint'e istek gönder
  const url = process.argv[3];
  const prompt = process.argv[4] || 'Merhaba';
  if (!url) {
    console.error('Kullanım: driver.mjs invoke <url> <prompt> [çıktı-dizini]');
    process.exit(1);
  }

  // eve invoke ile çağır (Node 24 gerekli)
  const NODE24 = '/tmp/node-v24.20.0-linux-x64/bin/node';
  const eveJs = join(KOK, 'node_modules/eve/bin/eve.js');
  if (!existsSync(NODE24)) {
    console.error('Node 24 bulunamadı: /tmp/node-v24.20.0-linux-x64/bin/node');
    console.error('İndirin: curl -fsSL https://nodejs.org/dist/v24.20.0/node-v24.20.0-linux-x64.tar.xz -o /tmp/node24.tar.xz && tar -xf /tmp/node24.tar.xz -C /tmp');
    process.exit(1);
  }

  try {
    const sonuc = execSync(
      `${NODE24} ${eveJs} invoke --url ${url} ${JSON.stringify(prompt)}`,
      { cwd: KOK, encoding: 'utf8', timeout: 60000 }
    );
    const dosya = join(OUT, 'invoke-result.txt');
    writeFileSync(dosya, sonuc);
    console.log('Yanıt:', sonuc.slice(0, 500));
    console.log('Dosya:', dosya);
  } catch (e) {
    console.error('invoke hatası:', e.message);
    process.exit(1);
  }
}
