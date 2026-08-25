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

// Click the toggle and wait until the menu is genuinely open. Measuring or
// clicking straight after `click()` assumes the handler already ran; under
// load it may not have, and the links then measure 0.
const openMenu = async (page) => {
  await page.click('.nav-toggle');
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector('.nav-links')).display !== 'none');
  // Let the open animation finish. Mid-flight the menu carries a translate,
  // and a transformed box measures in fractional device pixels — 44px reads
  // back as 43.999996. Measure the resting state instead.
  await page.evaluate(() => Promise.all(
    document.querySelector('.nav-links').getAnimations().map((a) => a.finished)));
};

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
    await openMenu(page);
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'flex',
      'menu should open — this is the bug that shipped unopenable');
    await page.close();
  });

  it('keeps aria-expanded in sync', async () => {
    const page = await open(MOBILE);
    const aria = () => page.$eval('.nav-toggle', (e) => e.getAttribute('aria-expanded'));
    // Wait for the attribute to reach the expected value, so a slow handler
    // reads as slow rather than as wrong.
    const waitAria = (v) => page.waitForFunction(
      (want) => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === want, v);

    assert.equal(await aria(), 'false');
    await page.click('.nav-toggle');
    await waitAria('true');
    assert.equal(await aria(), 'true');
    await page.click('.nav-toggle');
    await waitAria('false');
    assert.equal(await aria(), 'false');
    await page.close();
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const page = await open(MOBILE);
    await openMenu(page);
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('.nav-links', (e) => getComputedStyle(e).display), 'none');
    assert.ok(await page.$eval('.nav-toggle', (e) => e === document.activeElement),
      'focus should return to the toggle');
    await page.close();
  });

  it('closes on outside click', async () => {
    const page = await open(MOBILE);
    await openMenu(page);
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
    assert.ok(box.width >= 43.5 && box.height >= 43.5,
      `got ${box.width}x${box.height}, need >= 44x44`);
    await page.close();
  });

  it('nav links are at least 44 tall on both breakpoints', async () => {
    for (const vp of [DESKTOP, MOBILE]) {
      const page = await open(vp);
      if (vp === MOBILE) await openMenu(page);
      const h = await page.$$eval('.nav-links a', (els) =>
        els.map((e) => e.getBoundingClientRect().height));
      // Sub-pixel tolerance: layout geometry is fractional, so 43.9999 is 44.
      assert.ok(h.every((x) => x >= 43.5), `${vp.width}px: got ${h.join(', ')}, need >= 44`);
      await page.close();
    }
  });
});

describe('accessibility', () => {
  // Asserting the target *exists* passes while the skip link does nothing:
  // without tabindex="-1" on the target, activating it leaves focus on <body>
  // and the next Tab returns to the skip link. Assert the focus move itself.
  it('moves focus to main when the skip link is activated', async () => {
    const page = await open(DESKTOP);
    const href = await page.$eval('a[href^="#"]', (e) => e.getAttribute('href'));
    assert.ok(await page.$(href), `skip link target ${href} does not exist`);

    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.className),
      'skip-link', 'skip link should be the first tab stop');

    await page.keyboard.press('Enter');
    const landed = await page.evaluate(() => ({
      id: document.activeElement?.id,
      tag: document.activeElement?.tagName,
    }));
    assert.equal(landed.id, href.slice(1),
      `focus should move to ${href}, but landed on ${landed.tag}#${landed.id}`);
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
    await openMenu(page);
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
