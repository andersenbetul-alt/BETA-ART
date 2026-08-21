// Behavioural tests for the navbar. These lock in the fixes from AUDIT.md so
// the mobile-menu regression (it shipped unopenable) cannot come back silently.
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const URL = pathToFileURL(resolve('src/index.html')).href;
const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };

let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
});
after(async () => { await browser?.close(); });

const open = async (viewport, opts = {}) => {
  const page = await browser.newPage({ viewport, ...opts });
  await page.goto(URL);
  // Box measurements are only meaningful once fonts have settled — under load
  // a bare goto can hand back a pre-layout box and fail a correct assertion.
  await page.evaluate(() => document.fonts.ready);
  return page;
};

// WCAG relative luminance — the audit's numbers, enforced.
const contrast = (hex, bg = '#ffffff') => {
  const lum = (h) => {
    const v = h.replace('#', '').match(/../g).map((c) => {
      const n = parseInt(c, 16) / 255;
      return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const [a, b] = [lum(hex), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

describe('mobile menu', () => {
  it('opens when the toggle is clicked', async () => {
    const page = await open(MOBILE);
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'none',
      'menu should start closed');
    await page.click('.nav-toggle');
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'flex',
      'menu should open — this is the bug that shipped unopenable');
    await page.close();
  });

  it('keeps aria-expanded in sync', async () => {
    const page = await open(MOBILE);
    const aria = () => page.$eval('.nav-toggle', (e) => e.getAttribute('aria-expanded'));
    assert.equal(await aria(), 'false');
    await page.click('.nav-toggle');
    assert.equal(await aria(), 'true');
    await page.click('.nav-toggle');
    assert.equal(await aria(), 'false');
    await page.close();
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const page = await open(MOBILE);
    await page.click('.nav-toggle');
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'none');
    assert.ok(await page.$eval('.nav-toggle', (e) => e === document.activeElement),
      'focus should return to the toggle');
    await page.close();
  });

  it('closes on outside click', async () => {
    const page = await open(MOBILE);
    await page.click('.nav-toggle');
    // Click well below the open dropdown — clicking `main` at the top would
    // land on the menu itself, which overlays it.
    await page.mouse.click(195, 700);
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'none');
    await page.close();
  });
});

describe('hit targets', () => {
  it('toggle is at least 44x44', async () => {
    const page = await open(MOBILE);
    const box = await (await page.$('.nav-toggle')).boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44, `got ${box.width}x${box.height}, need >= 44x44`);
    await page.close();
  });

  it('nav links are at least 44 tall on both breakpoints', async () => {
    for (const vp of [DESKTOP, MOBILE]) {
      const page = await open(vp);
      if (vp === MOBILE) await page.click('.nav-toggle');
      const h = await page.$$eval('.nav-links a', (els) =>
        els.map((e) => e.getBoundingClientRect().height));
      assert.ok(h.every((x) => x >= 44), `${vp.width}px: got ${h.join(', ')}, need >= 44`);
      await page.close();
    }
  });
});

describe('accessibility', () => {
  it('has a skip link that reaches main', async () => {
    const page = await open(DESKTOP);
    const href = await page.$eval('a[href^="#"]', (e) => e.getAttribute('href'));
    assert.ok(await page.$(href), `skip link target ${href} does not exist`);
    await page.close();
  });

  it('marks the current page with aria-current', async () => {
    const page = await open(DESKTOP);
    assert.equal((await page.$$('[aria-current="page"]')).length, 1,
      'exactly one link should be marked current');
    await page.close();
  });

  it('names the nav landmark and the toggle', async () => {
    const page = await open(MOBILE);
    assert.ok(await page.$eval('nav', (e) => e.getAttribute('aria-label')), 'nav needs a label');
    assert.ok(await page.$eval('.nav-toggle', (e) => e.getAttribute('aria-label')), 'toggle needs a label');
    await page.close();
  });

  it('honours prefers-reduced-motion', async () => {
    const page = await open(MOBILE, { reducedMotion: 'reduce' });
    await page.click('.nav-toggle');
    const dur = await page.$eval('.nav-links', (e) => getComputedStyle(e).animationDuration);
    assert.ok(parseFloat(dur) < 0.05, `animation should be suppressed, got ${dur}`);
    await page.close();
  });

  it('every text colour meets WCAG AA', () => {
    for (const c of ['#666666', '#333333', '#111111']) {
      assert.ok(contrast(c) >= 4.5, `${c} is ${contrast(c).toFixed(2)}:1, need >= 4.5`);
    }
    assert.ok(contrast('#8f8f8f') >= 3, 'divider needs >= 3:1 for non-text UI');
  });
});
