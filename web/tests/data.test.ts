import assert from 'node:assert/strict';
import test from 'node:test';
import { countryOrder, getCountry, placesIn } from '../lib/country.ts';
import { kinds, problemFor, problems } from '../lib/problems.ts';
import { clock } from '../lib/format.ts';

test('acil numara alanında ihbar hattı bulunamaz', async () => {
  // Asıl kural bu: "Emergency" başlığı altında görünen her numara, birisi
  // tehlikedeyken aranabilir olmalı. Danimarka'nın 114'ü ve Hollanda'nın
  // 0900-8844'ü ihbar hattı — orada olurlarsa turist kuyruğa düşer.
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    for (const [what, n] of Object.entries(c.emergency)) {
      if (n === undefined) continue;
      // Avrupa'daki her acil hat iki veya üç haneli ve ücretsiz. İhbar
      // hatları (0900-8844) uzun ve ücretli olduğu için burada elenir.
      // İspanya'nın 091'i üç haneli ve ücretsiz — geçmeli.
      assert.match(n, /^\d{2,3}$/, `${code}.${what} acil hat gibi durmuyor: ${n}`);
    }
  }
});

test('112 her ülkede acil numara olarak duruyor', async () => {
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    assert.equal(c.emergency.general, '112', `${code}`);
  }
});

test('112 ile aynı olan doğrudan hat tekrar yazılmaz', async () => {
  // Aynıysa ekranda "Direct lines: Police 112" diye gürültü olurdu.
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    for (const [what, n] of Object.entries(c.emergency)) {
      if (what === 'general') continue;
      assert.notEqual(n, '112', `${code}.${what} gereksiz tekrar`);
    }
  }
});

test('ihbar hattı ne için olduğunu söylüyor', async () => {
  for (const { code } of countryOrder) {
    const { nonEmergency: ne } = await getCountry(code);
    if (!ne) continue;
    assert.ok(ne.what.length > 10, `${code}: ihbar hattı ne için olduğunu söylemiyor`);
    assert.ok(ne.number.length > 0, code);
  }
});

test('saat, seferin ülkesinin saat diliminde gösterilir', () => {
  // Sabit saat dilimi Norveç dışında her kalkışı yanlış gösterirdi.
  const noon = '2026-08-20T12:00:00Z';
  assert.equal(clock(noon, 'Europe/Oslo'), '14:00');
  assert.equal(clock(noon, 'Europe/Athens'), '15:00');
  assert.equal(clock(noon, 'Atlantic/Reykjavik'), '12:00');
});

test('saat 24 saatlik biçimde — Avrupa tabelalarıyla aynı', () => {
  assert.equal(clock('2026-08-20T20:30:00Z', 'Europe/Lisbon'), '21:30');
});

test('her sorun türünün kartı ve başlığı var', () => {
  assert.equal(problems.length, 7);
  assert.equal(kinds.length, new Set(kinds).size, 'yinelenen tür');
  for (const p of problems) {
    assert.ok(p.headline.endsWith('.') || p.headline.endsWith('?'), p.kind);
    assert.ok(p.label.length > 10, p.kind);
    assert.ok(p.hint.length > 10, p.kind);
    assert.equal(problemFor(p.kind), p);
  }
});

test('bilinmeyen sorun türü çözülmüyor', () => {
  assert.equal(problemFor('shopping'), undefined);
});

test('her şehirde yemek ve kapalı alan seçeneği var', async () => {
  // Boş liste = boş ekran. Turist ıslakken boş ekran görürse geri gelmez.
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    for (const city of c.cities) {
      for (const kind of ['eat', 'indoor'] as const) {
        assert.ok(placesIn(c, city.id, kind).length > 0,
          `${code}/${city.id}: ${kind} boş`);
      }
    }
  }
});

test('yerler yürüme mesafesine göre sıralı geliyor', async () => {
  const no = await getCountry('NO');
  const list = placesIn(no, 'bergen', 'eat');
  const walks = list.map((p) => p.walkMinutes);
  assert.deepEqual(walks, [...walks].sort((a, b) => a - b));
});

test('arayüzde görünen ülke verisinde Türkçe karakter yok', async () => {
  // Kod yorumları Türkçe, arayüz İngilizce. Yer adları yerel dilde olabilir
  // (München, Athína) ama Türkçe'ye özgü harfler sızıntı demektir.
  const turkish = /[ığşĞİŞ]/;
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    for (const e of c.essentials) {
      assert.ok(!turkish.test(e.when + e.answer + e.costsIfUnknown),
        `${code}: essentials içinde Türkçe`);
    }
    for (const e of c.events) {
      assert.ok(!turkish.test(e.note), `${code}: etkinlik notunda Türkçe`);
    }
  }
});
