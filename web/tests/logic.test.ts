import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldGoIndoors, type WeatherVerdict } from '../lib/weather.ts';
import { placesFor, cityById, cities } from '../lib/places.ts';
import { duration, modeLabel } from '../lib/format.ts';

function weather(over: Partial<WeatherVerdict> = {}): WeatherVerdict {
  return { wetNow: true, dryInHours: null, temperature: 8, summary: 'rain', ...over };
}

test('kuru havada dışarıdaki plan korunur', () => {
  const { indoors } = shouldGoIndoors(weather({ wetNow: false }));
  assert.equal(indoors, false);
});

test('kısa süreli yağmurda içeri girmek önerilmez', () => {
  // Ürünün asıl faydası burada: 40 dakikalık yağmur için günü değiştirmek yanlış.
  const { indoors, advice } = shouldGoIndoors(weather({ dryInHours: 1 }));
  assert.equal(indoors, false);
  assert.match(advice, /Clears in about 1 hour/);
});

test('sınırdaki iki saat hâlâ beklemeye değer', () => {
  assert.equal(shouldGoIndoors(weather({ dryInHours: 2 })).indoors, false);
});

test('uzun süren yağmurda içeri geçilir', () => {
  assert.equal(shouldGoIndoors(weather({ dryInHours: 5 })).indoors, true);
});

test('ne zaman duracağı bilinmiyorsa içeri geçilir', () => {
  assert.equal(shouldGoIndoors(weather({ dryInHours: null })).indoors, true);
});

test('yer listesi yürüme mesafesine göre sıralı', () => {
  const list = placesFor('bergen', 'eat');
  const walks = list.map((p) => p.walkMinutes);
  assert.deepEqual(walks, [...walks].sort((a, b) => a - b));
});

test('her şehirde hem yemek hem kapalı mekan var', () => {
  // Boş liste, kullanıcıya boş ekran demek — sessizce olmamalı.
  for (const city of cities) {
    assert.ok(placesFor(city.id, 'eat').length > 0, `${city.id} yemek`);
    assert.ok(placesFor(city.id, 'indoor').length > 0, `${city.id} kapalı mekan`);
  }
});

test('bilinmeyen şehir kimliği undefined döner', () => {
  assert.equal(cityById('atlantis'), undefined);
});

test('süre biçimlendirme', () => {
  assert.equal(duration(45), '45 min');
  assert.equal(duration(195), '3 h 15 min');
  assert.equal(duration(120), '2 h 0 min');
});

test('bilinmeyen ulaşım modu ham hâliyle gösterilir', () => {
  assert.equal(modeLabel('water'), 'Ferry');
  assert.equal(modeLabel('funicular'), 'funicular');
});
