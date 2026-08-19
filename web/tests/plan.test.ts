import assert from 'node:assert/strict';
import test from 'node:test';
import { assessImpact, rankByPlan, type Plan, type PlanItem } from '../lib/plan.ts';

const T = (h: number, m = 0) => `2026-08-20T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`;

function item(over: Partial<PlanItem> = {}): PlanItem {
  return { id: 'x', kind: 'activity', title: 'Museum', startsAt: T(15), fixed: false, ...over };
}

const plan = (items: PlanItem[]): Plan => ({ countryCode: 'NO', items });

test('erken varışta plan bozulmaz', () => {
  const p = plan([item({ id: 'hotel', kind: 'stay', title: 'Hotel check-in', startsAt: T(20), fixed: true })]);
  const impact = assessImpact(p, T(16), { from: T(12) });
  assert.equal(impact.level, 'safe');
  assert.equal(impact.summary, 'Your plan still works.');
});

test('sabit maddeyi kaçırmak planı kırar', () => {
  const p = plan([item({ id: 'flight', kind: 'transport', title: 'Flight home', startsAt: T(18), fixed: true })]);
  const impact = assessImpact(p, T(18, 45), { from: T(12) });
  assert.equal(impact.level, 'breaks');
  assert.match(impact.summary, /miss Flight home by 45 min/);
});

test('esnek madde kırılmaz, kayar', () => {
  // Müzeyi kaçırmak tatili bitirmez — bunu "kırıldı" diye göstermek panik yaratır.
  const p = plan([item({ id: 'museum', title: 'KODE', startsAt: T(15), fixed: false })]);
  const impact = assessImpact(p, T(15, 30), { from: T(12) });
  assert.equal(impact.level, 'tight');
  assert.match(impact.summary, /slips by 30 min/);
});

test('konaklamada asıl sınır geç giriş saatidir', () => {
  // 18:00'de giriş yazıyor ama resepsiyon 23:00'e kadar açık — panik yok.
  const p = plan([item({
    id: 'hotel', kind: 'stay', title: 'Hotel', startsAt: T(18), fixed: true, latestAcceptableAt: T(23),
  })]);
  assert.equal(assessImpact(p, T(21), { from: T(12) }).level, 'safe');
  assert.equal(assessImpact(p, T(23, 30), { from: T(12) }).level, 'breaks');
});

test('sınıra çok yakın varış "tight" sayılır', () => {
  const p = plan([item({ id: 'dinner', kind: 'meal', title: 'Dinner', startsAt: T(19), fixed: false })]);
  const impact = assessImpact(p, T(18, 50), { from: T(12) });
  assert.equal(impact.level, 'tight');
  assert.match(impact.summary, /10 min to spare/);
});

test('geçmişteki maddeler etkilenmişe sayılmaz', () => {
  // Sabah 08:00'deki madde, öğlen yaşanan aksaklıkta hangi seçeneği seçersen
  // seç zaten geçmişte — onu "kaçırdın" diye göstermek yanlış alarm olur.
  const p = plan([item({ id: 'past', title: 'Morning walk', startsAt: T(8), fixed: true })]);
  assert.equal(assessImpact(p, T(20), { from: T(12) }).level, 'safe');
});

test('değiştirilen maddenin kendisi etkilenmişe sayılmaz', () => {
  // İptal olan feribotu "kaçırdın" diye göstermek saçma olur.
  const p = plan([item({ id: 'ferry', kind: 'transport', title: 'Ferry', startsAt: T(14), fixed: true })]);
  assert.equal(assessImpact(p, T(17), { replacedItemId: 'ferry', from: T(13) }).level, 'safe');
});

test('sıralama en hızlıyı değil planı kurtaranı öne alır', () => {
  // Ürünün özü: 20 dk erken varıp uçuşu kaçıran seçenek kötüdür.
  const p = plan([item({ id: 'flight', kind: 'transport', title: 'Flight', startsAt: T(19), fixed: true })]);
  const ranked = rankByPlan(p, [
    { arrival: T(19, 20), label: 'fast but misses flight' },
    { arrival: T(18, 30), label: 'slower, keeps flight' },
  ], { from: T(12) });
  assert.equal(ranked[0].option.label, 'slower, keeps flight');
  assert.equal(ranked[0].impact.level, 'safe');
  assert.equal(ranked[1].impact.level, 'breaks');
});

test('eşit etkide erken varan önce', () => {
  const p = plan([]);
  const ranked = rankByPlan(p, [{ arrival: T(20) }, { arrival: T(18) }], { from: T(12) });
  assert.equal(ranked[0].option.arrival, T(18));
});

test('boş planda her seçenek güvenli', () => {
  assert.equal(assessImpact(plan([]), T(12), { from: T(10) }).level, 'safe');
});
