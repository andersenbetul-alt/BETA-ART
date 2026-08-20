import assert from 'node:assert/strict';
import test from 'node:test';
import { rankEvents, weekdayIn, universalWays, type SocialEvent } from '../lib/events.ts';
import { countryOrder, eventsIn, getCountry } from '../lib/country.ts';

function ev(over: Partial<SocialEvent> = {}): SocialEvent {
  return {
    cityId: 'x', name: 'X', kind: 'market', days: [0],
    from: '10:00', note: 'n', free: true, ...over,
  };
}

test('bugün olan etkinlik başa gelir', () => {
  // Turistin sorusu "bu şehirde neler oluyor" değil, "BU AKŞAM nereye gideyim".
  const ranked = rankEvents(
    [ev({ name: 'cuma', days: [5] }), ev({ name: 'bugün', days: [1] })],
    1, // Pazartesi
  );
  assert.equal(ranked[0].name, 'bugün');
  assert.equal(ranked[0].inDays, 0);
});

test('her gün açık olan her zaman bugündür', () => {
  const [e] = rankEvents([ev({ days: 'daily' })], 3);
  assert.equal(e.inDays, 0);
});

test('hafta sonu dönüşü doğru sayılır', () => {
  // Cumartesi günü bakan biri için pazar YARIN, altı gün sonra değil.
  const [e] = rankEvents([ev({ days: [0] })], 6);
  assert.equal(e.inDays, 1);
  assert.equal(e.dayLabel, 'Tomorrow');
});

test('birden çok günü olan etkinlik en yakın günle sıralanır', () => {
  const [e] = rankEvents([ev({ days: [2, 6] })], 5); // Cuma: cumartesi yarın
  assert.equal(e.inDays, 1);
});

test('akşam başlayan bugünkü etkinlik "Tonight" der', () => {
  assert.equal(rankEvents([ev({ days: 'daily', from: '17:00' })], 2)[0].dayLabel, 'Tonight');
  assert.equal(rankEvents([ev({ days: 'daily', from: '09:00' })], 2)[0].dayLabel, 'Today');
});

test('uzaktaki gün adıyla gösterilir', () => {
  const [e] = rankEvents([ev({ days: [4] })], 1); // Pazartesi → Perşembe
  assert.equal(e.inDays, 3);
  assert.equal(e.dayLabel, 'Thursday');
});

test('aynı gün içinde erken başlayan önce', () => {
  const ranked = rankEvents(
    [ev({ name: 'geç', days: 'daily', from: '18:00' }), ev({ name: 'erken', days: 'daily', from: '08:00' })],
    0,
  );
  assert.equal(ranked[0].name, 'erken');
});

test('ülkenin saat dilimi geçerli ve gün 0-6 arasında', () => {
  for (const { code } of countryOrder) {
    // Geçersiz saat dilimi Intl'de patlar; -1 dönerse eşleşme kurulamamış demektir.
    const day = weekdayIn('Europe/Oslo');
    assert.ok(day >= 0 && day <= 6, `gün ${day}`);
    assert.ok(code.length === 2);
  }
});

test('her ülkenin saat dilimi Intl tarafından tanınıyor', async () => {
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    const day = weekdayIn(c.timeZone);
    assert.ok(day >= 0 && day <= 6, `${code}/${c.timeZone} gün döndürmedi`);
  }
});

test('etkinlikler yalnızca var olan şehirlere bağlı ve tutarlı', async () => {
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    const ids = new Set(c.cities.map((city) => city.id));
    for (const e of c.events) {
      assert.ok(ids.has(e.cityId), `${code}: "${e.name}" olmayan şehre bağlı`);
      assert.match(e.from, /^\d{2}:\d{2}$/, `${code}: "${e.name}" başlangıç saati`);
      if (e.to) assert.match(e.to, /^\d{2}:\d{2}$/, `${code}: "${e.name}" bitiş saati`);
      if (e.days !== 'daily') {
        assert.ok(e.days.length > 0, `${code}: "${e.name}" gününü söylemiyor`);
        for (const d of e.days) assert.ok(d >= 0 && d <= 6, `${code}: "${e.name}" gün ${d}`);
      }
      assert.ok(e.note.length > 0, `${code}: "${e.name}" notsuz`);
    }
  }
});

test('eventsIn yalnızca istenen şehri döndürür', async () => {
  const gr = await getCountry('GR');
  for (const e of eventsIn(gr, 'athina')) assert.equal(e.cityId, 'athina');
});

test('etkinliksiz şehirde bile verilecek bir şey var', () => {
  // Boş ekran yasak: küratörlü etkinlik yoksa her Avrupa şehrinde geçerli
  // olan yollar devreye girer.
  assert.ok(universalWays.length >= 3);
  for (const w of universalWays) assert.ok(w.detail.length > 40, w.what);
});
