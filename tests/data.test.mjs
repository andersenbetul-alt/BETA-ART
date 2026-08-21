/* Checks that need no browser and no server: the translation files and the
   price catalogue. These are the things a careless edit breaks silently. */
import fs from 'node:fs';
import vm from 'node:vm';
import { suite, test, assert, equal } from './harness.mjs';

const LOCALES = fs.readdirSync('assets/i18n').filter(f => f.endsWith('.json'));

function load(file) {
  return JSON.parse(fs.readFileSync('assets/i18n/' + file, 'utf8'));
}

function keysOf(node, prefix = '', out = []) {
  if (typeof node === 'string') { out.push(prefix); return out; }
  if (Array.isArray(node)) { node.forEach((v, i) => keysOf(v, `${prefix}[${i}]`, out)); return out; }
  if (node && typeof node === 'object') {
    Object.keys(node).forEach(k => keysOf(node[k], prefix ? `${prefix}.${k}` : k, out));
  }
  return out;
}

function config() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('assets/js/config.js', 'utf8'), sandbox);
  return sandbox.window.NAVIAR_CONFIG;
}

export default async function () {
  await suite('translations', async () => {
    const base = keysOf(load('no.json')).sort();

    await test('every locale carries the same keys as Norwegian', () => {
      for (const file of LOCALES) {
        if (file === 'no.json') continue;
        const other = keysOf(load(file)).sort();
        const missing = base.filter(k => !other.includes(k));
        const extra = other.filter(k => !base.includes(k));
        assert(!missing.length && !extra.length,
          `${file}: ${missing.length} missing (${missing.slice(0, 3)}), ${extra.length} extra (${extra.slice(0, 3)})`);
      }
    });

    await test('no locale has an empty string', () => {
      for (const file of LOCALES) {
        const empties = [];
        (function walk(n, p) {
          if (typeof n === 'string') { if (!n.trim()) empties.push(p); return; }
          if (Array.isArray(n)) return n.forEach((v, i) => walk(v, `${p}[${i}]`));
          if (n && typeof n === 'object') Object.keys(n).forEach(k => walk(n[k], p ? `${p}.${k}` : k));
        }(load(file), ''));
        assert(!empties.length, `${file}: ${empties.join(', ')}`);
      }
    });

    await test('interpolation placeholders match across locales', () => {
      const no = load('no.json');
      const placeholders = s => (String(s).match(/\{[a-z]+\}/g) || []).sort().join(',');
      for (const file of LOCALES) {
        if (file === 'no.json') continue;
        const other = load(file);
        for (const key of base) {
          const a = key.split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => o?.[k], no);
          const b = key.split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => o?.[k], other);
          if (typeof a !== 'string' || typeof b !== 'string') continue;
          equal(placeholders(b), placeholders(a), `${file} ${key}`);
        }
      }
    });

    /* The independence notice is a brand rule, not decoration: NAVIAR sounds
       enough like NAV that the site must say it is not part of it, in every
       language. Losing it in one locale is the kind of thing nobody notices. */
    await test('the independence notice survives in every language', () => {
      for (const file of LOCALES) {
        const d = load(file);
        assert(typeof d.brand?.disclaimer === 'string' && d.brand.disclaimer.trim().length > 15,
          `${file}: brand.disclaimer missing or too short`);
        assert(/NAVIAR/.test(d.brand.disclaimer), `${file}: notice does not name NAVIAR`);
        assert(/NAV/.test(d.brand.disclaimer), `${file}: notice does not name NAV`);
      }
    });
  });

  await suite('catalogue', async () => {
    const CFG = config();
    const catalog = load('no.json').catalog;

    await test('every sold service has a translation', () => {
      for (const s of CFG.services) {
        assert(catalog[s.id], `no catalog entry for ${s.id}`);
        assert(catalog[s.id].n && catalog[s.id].d, `${s.id} missing name or description`);
      }
    });

    await test('prices are whole kroner or a quote', () => {
      for (const s of CFG.services) {
        assert(s.price === null || Number.isInteger(s.price), `${s.id}: ${s.price}`);
      }
    });

    await test('the net fee is consistent with 25% MVA', () => {
      for (const s of CFG.services) {
        if (!s.price || s.net == null) continue;
        const expected = Math.round(s.price / (1 + CFG.vatRate));
        assert(Math.abs(s.net - expected) <= 1, `${s.id}: net ${s.net}, expected ~${expected}`);
      }
    });

    await test('the catalogue is the low-risk offer', () => {
      const price = id => CFG.services.find(s => s.id === id)?.price;
      equal(CFG.services.length, 6, 'service count');
      equal(price('sjekk'), 0, 'the scope check is free');
      equal(price('v01'), 590, 'practical guide');
      equal(price('career_free'), 0, 'the career starter is free');
      equal(price('career_kit'), 299, 'career kit');
      equal(price('career_review'), 790, 'personal CV review');
      equal(price('sprak'), null, 'language support is by quote');
    });

    /* A price on the page with nothing behind it is the worst kind of promise.
       Every paid career service names the folder it actually ships. */
    await test('nothing is sold that has no deliverable behind it', () => {
      const shipped = {
        career_free: ['leveranser/karriere/gratis/cv-sjekkliste.md',
                      'leveranser/karriere/gratis/fem-prompts.md',
                      'leveranser/karriere/gratis/jobbtracker.csv'],
        career_kit:  ['leveranser/karriere/kit/cv-mal-no.md',
                      'leveranser/karriere/kit/cv-template-en.md',
                      'leveranser/karriere/kit/prompts.md',
                      'leveranser/karriere/kit/intervju.md',
                      'leveranser/karriere/kit/linkedin-sjekkliste.md',
                      'leveranser/karriere/kit/jobbtracker.csv',
                      'leveranser/karriere/kit/ukeplan.md']
      };
      for (const [id, files] of Object.entries(shipped)) {
        assert(CFG.services.some(s => s.id === id), `${id} is not in the catalogue`);
        for (const f of files) {
          assert(fs.existsSync(f), `${id} is sold but ${f} does not exist`);
          assert(fs.statSync(f).size > 400, `${id} ships ${f}, which is nearly empty`);
        }
      }
    });

    /* The work the model refuses to take must not be back on the price list by
       accident. These ids sold exactly that: reading a decision letter, an
       advice call about a case, official interpreting. */
    await test('the refused services are not sold anywhere', () => {
      for (const id of ['k01', 'k02', 'tolk', 'v02', 'h01', 'o01', 's01', 't30', 't60', 'tf']) {
        assert(!CFG.services.some(s => s.id === id), `${id} is back in the catalogue`);
        assert(!catalog[id], `${id} still has a translation, so it can be sold again by mistake`);
      }
    });

    /* Nothing is bought straight off the page: a person checks the scope, then
       sends a payment link to one customer. A link in config would put a buy
       button back on the site. */
    await test('nothing can be paid for without a scope check', () => {
      const links = Object.values(CFG.payments.paymentLinks || {}).filter(Boolean);
      equal(links.length, 0, 'a payment link is configured: ' + links.join(', '));
    });

    /* Two numbers on the front page count things that live elsewhere. They
       drift the moment either list changes, and nobody notices a wrong count. */
    await test('the counts on the front page match what is actually listed', () => {
      const no = load('no.json');
      equal(CFG.stats.areas, String(no.areas.items.length), 'areas count');
      equal(CFG.stats.languages, String(CFG.languages.length), 'language count');
    });

    await test('booking hours are in Norwegian wall-clock time', () => {
      equal(CFG.booking.timezone, 'Europe/Oslo');
    });
  });
}
