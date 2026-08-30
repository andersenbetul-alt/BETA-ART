/* Ödeme ve kredi testleri — sağlayıcı hesabı gerektirmez. */
import assert from 'node:assert';
import { unlinkSync, existsSync } from 'node:fs';
import * as b from './billing.mjs';

const TMP = '/tmp/qb-billing-test.db';
for (const f of [TMP, TMP + '-wal', TMP + '-shm']) if (existsSync(f)) unlinkSync(f);
const db = b.openBilling(TMP);

const acc = b.ensureAccount(db, { email: 'test@ornek.no', country: 'NO', currency: 'NOK' });
assert.strictEqual(b.creditBalance(db, acc.id), 0, 'yeni hesap sıfır kredi');

// Aynı e-posta ikinci kez hesap açmamalı
const same = b.ensureAccount(db, { email: 'test@ornek.no' });
assert.strictEqual(same.id, acc.id, 'hesap tekilliği');

// Kredi yükleme ve harcama
b.addCredits(db, acc.id, 1000, { reason: 'subscription_grant' });
assert.strictEqual(b.creditBalance(db, acc.id), 1000);

const r1 = b.spendCredits(db, acc.id, 'article');       // 20 kredi
assert.ok(r1.ok && r1.balance === 980, 'makale 20 kredi yemeli');
const r2 = b.spendCredits(db, acc.id, 'deep_report');   // 50 kredi
assert.strictEqual(r2.balance, 930);

// Bakiye yetmezse hiçbir şey yazılmamalı
const poor = b.ensureAccount(db, { email: 'fakir@ornek.no' });
b.addCredits(db, poor.id, 10);
const fail = b.spendCredits(db, poor.id, 'article');
assert.ok(!fail.ok && fail.needed === 20, 'yetersiz bakiye reddedilmeli');
assert.strictEqual(b.creditBalance(db, poor.id), 10, 'reddedilen harcama defteri kirletmemeli');

// Defter = bakiye (sütun yok, toplam var)
const rows = db.prepare('SELECT delta FROM credit_ledger WHERE account_id = ?').all(acc.id);
assert.strictEqual(rows.reduce((s, r) => s + r.delta, 0), b.creditBalance(db, acc.id), 'defter toplamı bakiyeye eşit');

// Webhook tekilliği — çift kredi yüklenmemeli
assert.strictEqual(b.claimWebhook(db, 'stripe', 'evt_1', 'checkout.completed', { a: 1 }), true);
assert.strictEqual(b.claimWebhook(db, 'stripe', 'evt_1', 'checkout.completed', { a: 1 }), false, 'aynı olay iki kez işlenmemeli');

// Ödeme kaydı: hak + kredi
const pay = b.recordPayment(db, { accountId: acc.id, provider: 'stripe', providerRef: 'pi_123',
  amount: 49900, currency: 'NOK', kind: 'subscription', credits: 1000, feature: 'engine:starter' });
assert.ok(pay.ok);
assert.strictEqual(b.creditBalance(db, acc.id), 1930);
assert.ok(b.hasEntitlement(db, acc.id, 'engine:starter'), 'ödeme hakkı vermeli');

// Aynı ödeme tekrar gelirse kredi iki kez yüklenmemeli
const again = b.recordPayment(db, { accountId: acc.id, provider: 'stripe', providerRef: 'pi_123',
  amount: 49900, currency: 'NOK', kind: 'subscription', credits: 1000, feature: 'engine:starter' });
assert.ok(!again.ok && again.reason === 'zaten_islenmis');
assert.strictEqual(b.creditBalance(db, acc.id), 1930, 'çift ödeme çift kredi yüklememeli');

// Süresi geçmiş hak verilmemiş sayılır
b.grantEntitlement(db, acc.id, 'report:eski', { sourceType: 'payment', sourceId: 'x', expiresAt: '2020-01-01T00:00:00Z' });
assert.ok(!b.hasEntitlement(db, acc.id, 'report:eski'), 'süresi geçen hak kapanmalı');

// Fatura yoluyla ödenen B2B satış da aynı hakkı vermeli
const b2b = b.ensureAccount(db, { email: 'firma@ornek.no', company: 'Nordic SaaS AS' });
b.recordPayment(db, { accountId: b2b.id, provider: 'invoice', providerRef: '2026-0001',
  amount: 350000, currency: 'NOK', kind: 'one_time', feature: 'workforce:receptionist' });
assert.ok(b.hasEntitlement(db, b2b.id, 'workforce:receptionist'), 'fatura da hak vermeli');

console.log('ödeme testleri geçti');
console.log('  kredi bakiyesi:', b.creditBalance(db, acc.id));
console.log('  499 NOK →', b.formatMoney(49900, 'NOK'));
console.log('  3.500 EUR →', b.formatMoney(350000, 'EUR', 'de-DE'));
const usage = db.prepare('SELECT operation, credits FROM usage_events WHERE account_id = ?').all(acc.id);
console.log('  kullanım kaydı:', usage.map(u => `${u.operation}:${u.credits}`).join(', '));
