/* Puanlama testleri — ağ ve API gerektirmez. */
import { scoreTopic, WEIGHTS, decide } from './score.mjs';
import assert from 'node:assert';

const w = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
assert.ok(Math.abs(w - 1) < 1e-9, 'ağırlıklar toplamı 1 olmalı, şu an ' + w);

// Kullanıcının örnek tablosu: AI receptionist yüksek çıkmalı, ChatGPT prompts düşük
const receptionist = scoreTopic({ growth: 88, searchInterest: 80, social: 70, commercial: 96,
  competition: 55, brandFit: 100, freshness: 80, questionCount: 8, moneyPath: 'service' });
const prompts = scoreTopic({ growth: 70, searchInterest: 90, social: 75, commercial: 60,
  competition: 5, brandFit: 60, freshness: 40, questionCount: 3, moneyPath: 'ads' });

assert.ok(receptionist.finalScore > prompts.finalScore,
  `hizmete giden konu öne çıkmalı (${receptionist.finalScore} vs ${prompts.finalScore})`);
assert.ok(['draft', 'publish', 'hot'].includes(receptionist.decision),
  'hizmete giden güçlü konu en az taslak üretmeli, aldı: ' + receptionist.decision);
assert.strictEqual(prompts.decision, 'skip', 'rekabeti yüksek, parası zayıf konu elenmeli');

// Eşikler
assert.strictEqual(decide(95).decision, 'hot');
assert.strictEqual(decide(88).decision, 'publish');
assert.strictEqual(decide(80).decision, 'draft');
assert.strictEqual(decide(65).decision, 'idea');
assert.strictEqual(decide(30).decision, 'skip');

// İçerik tipi
const breaking = scoreTopic({ growth: 95, freshness: 95, searchInterest: 70, social: 80,
  commercial: 60, competition: 60, brandFit: 90, questionCount: 4, moneyPath: 'affiliate' });
assert.strictEqual(breaking.speed, 'breaking');
// Her şeyi güçlü olan konu yayın eşiğini geçebilmeli (motor asla yayınlamıyor olmamalı)
const excellent = scoreTopic({ growth: 95, searchInterest: 90, social: 85, commercial: 95,
  competition: 70, brandFit: 100, freshness: 90, questionCount: 10, moneyPath: 'service' });
assert.ok(excellent.finalScore >= 85, 'ideal konu yayın eşiğini geçmeli: ' + excellent.finalScore);

const evergreen = scoreTopic({ growth: 20, freshness: 30, searchInterest: 85, social: 40,
  commercial: 80, competition: 40, brandFit: 95, questionCount: 10, moneyPath: 'service' });
assert.strictEqual(evergreen.speed, 'evergreen');

console.log('puanlama testleri geçti');
console.log('  AI receptionist  →', receptionist.finalScore, receptionist.decision, '|', receptionist.speed);
console.log('  ChatGPT prompts  →', prompts.finalScore, prompts.decision);
console.log('  breaking örneği  →', breaking.finalScore, breaking.decision, '|', breaking.speed, breaking.sla);
console.log('  ideal konu       →', excellent.finalScore, excellent.decision);
