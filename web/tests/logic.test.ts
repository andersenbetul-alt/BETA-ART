import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldGoIndoors, type WeatherVerdict } from '../lib/weather.ts';
import { cityIn, countryOrder, getCountry, isCountryCode, placesIn } from '../lib/country.ts';
import { duration, modeLabel } from '../lib/format.ts';

const norway = await getCountry('NO');

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
  const list = placesIn(norway, 'bergen', 'eat');
  const walks = list.map((p) => p.walkMinutes);
  assert.deepEqual(walks, [...walks].sort((a, b) => a - b));
});

test('bilinmeyen şehir kimliği ilk şehre düşer', () => {
  // Boş ekran göstermektense makul bir varsayılan: turist zaten aceleci.
  assert.equal(cityIn(norway, 'atlantis').id, norway.cities[0].id);
});

test('bilinmeyen ülke kodu varsayılana düşer', async () => {
  assert.equal((await getCountry('ZZ')).code, 'NO');
  assert.equal(isCountryCode('ZZ'), false);
  assert.equal(isCountryCode('GR'), true);
});

test('her ülke dosyası eksiksiz', async () => {
  // Bir ülkeyi kayıt defterine yazıp verisini yarım bırakmak, o ülkedeki
  // turiste boş ekran göstermek demek. Test bunu sessizce geçirmemeli.
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    assert.equal(c.code, code, `${code} kodu dosyayla uyuşmuyor`);
    assert.ok(c.cities.length > 0, `${code} şehirsiz`);
    assert.ok(c.essentials.length >= 4, `${code} temel bilgi az`);
    assert.match(c.emergency.general, /^\d{3}$/, `${code} acil numara`);

    const ids = new Set(c.cities.map((city) => city.id));
    for (const place of c.places) {
      assert.ok(ids.has(place.cityId), `${code}: ${place.name} olmayan şehre bağlı`);
    }
    for (const item of c.essentials) {
      assert.ok(item.costsIfUnknown.length > 0, `${code}: "${item.when}" bedelsiz`);
    }
  }
});

test('her şehirde hem yemek hem kapalı mekan var', async () => {
  // Boş liste, kullanıcıya boş ekran demek — sessizce olmamalı.
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    for (const city of c.cities) {
      assert.ok(placesIn(c, city.id, 'eat').length > 0, `${code}/${city.id} yemek`);
      assert.ok(placesIn(c, city.id, 'indoor').length > 0, `${code}/${city.id} kapalı mekan`);
    }
  }
});

test('ulaşım sağlayıcısı olan ülkede durak kimlikleri dolu', async () => {
  for (const { code } of countryOrder) {
    const c = await getCountry(code);
    if (c.transport === 'none') continue;
    for (const city of c.cities) {
      assert.ok(city.stopPlaceId, `${code}/${city.id} durak kimliği yok`);
    }
  }
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
