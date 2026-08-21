/* There is no build step — the site is static on purpose. These are the
   checks a build would otherwise have caught: files that are referenced but
   missing, links that go nowhere, markup that does not close. */
import fs from 'node:fs';
import path from 'node:path';
import { suite, test, assert, equal } from './harness.mjs';

const HTML = ['index.html', 'admin.html', 'personvern.html', 'vilkar.html', 'hva-vi-gjor.html'];
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta',
                      'param','source','track','wbr','path','rect','line','circle',
                      'polygon','polyline','use','stop','ellipse']);

/* A deliberately small tag-balance check: enough to catch an unclosed div,
   not a full parser. Attribute values are blanked first — the favicon is a
   data: URI carrying a whole SVG document, and scanning it as markup finds
   tags that are not in the page. */
function unbalanced(source) {
  const html = source.replace(/=\s*"[^"]*"/g, '=""').replace(/=\s*'[^']*'/g, "=''");
  const stack = [];
  const errors = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, closing, tag, attrs, selfClose] = m;
    const name = tag.toLowerCase();
    if (VOID.has(name) || selfClose) continue;
    if (!closing) stack.push(name);
    else if (stack[stack.length - 1] === name) stack.pop();
    else if (stack.includes(name)) { while (stack.length && stack.pop() !== name); errors.push(name); }
    else errors.push(name);
  }
  return { open: stack, errors };
}

export default async function () {
  await suite('static build', async () => {
    await test('every referenced asset exists', () => {
      for (const file of HTML) {
        const html = fs.readFileSync(file, 'utf8');
        const refs = [...html.matchAll(/(?:src|href)="((?!https?:|mailto:|tel:|data:|#)[^"]+)"/g)].map(m => m[1]);
        for (const ref of refs) {
          const target = ref.split(/[?#]/)[0];
          assert(fs.existsSync(target), `${file} references missing ${target}`);
        }
      }
    });

    await test('every locale named in config has a file', () => {
      const src = fs.readFileSync('assets/js/config.js', 'utf8');
      const codes = [...src.matchAll(/code:\s*'([a-z]{2})'/g)].map(m => m[1]);
      assert(codes.length >= 2, 'no language codes found in config');
      for (const code of codes) {
        assert(fs.existsSync(`assets/i18n/${code}.json`), `missing assets/i18n/${code}.json`);
      }
    });

    await test('every locale file is valid JSON', () => {
      for (const f of fs.readdirSync('assets/i18n')) {
        try { JSON.parse(fs.readFileSync(path.join('assets/i18n', f), 'utf8')); }
        catch (err) { throw new Error(`${f}: ${err.message}`); }
      }
    });

    await test('markup closes', () => {
      for (const file of HTML) {
        const { open, errors } = unbalanced(fs.readFileSync(file, 'utf8'));
        assert(!open.length, `${file}: unclosed ${open.join(', ')}`);
        assert(!errors.length, `${file}: mismatched ${errors.slice(0, 3).join(', ')}`);
      }
    });

    await test('no anchor points at a section that does not exist', () => {
      for (const file of HTML) {
        const html = fs.readFileSync(file, 'utf8');
        const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
        const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(Boolean);
        const dead = anchors.filter(a => !ids.has(a));
        assert(!dead.length, `${file}: ${dead.join(', ')}`);
      }
    });

    await test('the pages the footer promises are present', () => {
      for (const page of ['personvern.html', 'vilkar.html']) {
        assert(fs.existsSync(page), `${page} is linked but missing`);
      }
    });

    await test('the admin page stays out of search results', () => {
      const html = fs.readFileSync('admin.html', 'utf8');
      assert(/name="robots"[^>]*noindex/.test(html), 'admin.html is missing its noindex');
    });

    await test('the site points at one domain everywhere', () => {
      const cfg = fs.readFileSync('assets/js/config.js', 'utf8');
      const site = cfg.match(/siteUrl:\s*'([^']+)'/);
      assert(site, 'config.js has no siteUrl');
      const url = site[1];
      assert(!url.endsWith('/'), 'siteUrl must not end in a slash');

      for (const file of ['index.html', 'personvern.html', 'vilkar.html', 'hva-vi-gjor.html']) {
        const html = fs.readFileSync(file, 'utf8');
        const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/);
        assert(canonical, `${file} has no canonical link`);
        assert(canonical[1].startsWith(url), `${file} is canonical to ${canonical[1]}, not ${url}`);
      }
      for (const file of ['robots.txt', 'sitemap.xml']) {
        const text = fs.readFileSync(file, 'utf8');
        const others = [...text.matchAll(/https?:\/\/[^\s<"]+/g)].map(m => m[0])
          .filter(u => !u.startsWith(url) && !u.includes('sitemaps.org'));
        equal(others.length, 0, `${file} points somewhere else: ${others.join(', ')}`);
      }
    });

    await test('every page in the sitemap exists and is not hidden', () => {
      const xml = fs.readFileSync('sitemap.xml', 'utf8');
      const robots = fs.readFileSync('robots.txt', 'utf8');
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
      assert(locs.length > 0, 'the sitemap is empty');
      for (const loc of locs) {
        const file = new URL(loc).pathname.replace(/^\//, '') || 'index.html';
        assert(fs.existsSync(file), `the sitemap lists ${file}, which does not exist`);
        assert(!robots.includes('Disallow: /' + file), `${file} is in the sitemap and disallowed in robots.txt`);
      }
      assert(/Disallow:\s*\/admin\.html/.test(robots), 'robots.txt must keep the case queue out');
    });

    await test('the service model and the code agree on the workflow', () => {
      const doc = fs.readFileSync('docs/tjenestemodell.md', 'utf8');
      const src = fs.readFileSync('server/db.js', 'utf8');
      const listed = src.match(/const BOOKING_STATUS = \[([\s\S]*?)\];/);
      assert(listed, 'could not find BOOKING_STATUS in server/db.js');
      const codeStatuses = [...listed[1].matchAll(/'([a-z_]+)'/g)].map(m => m[1]);
      assert(codeStatuses.length >= 8, 'BOOKING_STATUS looks wrong: ' + codeStatuses.join(','));
      for (const st of codeStatuses) {
        assert(doc.includes('`' + st + '`'), `docs/tjenestemodell.md never mentions ${st}`);
      }
    });

    await test('no placeholder secret is committed', () => {
      for (const file of ['server/server.js', 'assets/js/config.js']) {
        const src = fs.readFileSync(file, 'utf8');
        assert(!/sk_live_|whsec_[A-Za-z0-9]{10,}/.test(src), `${file} looks like it contains a real key`);
      }
      assert(!fs.existsSync('server/.env') || fs.readFileSync('.gitignore', 'utf8').includes('.env'),
        '.env exists but is not ignored');
    });
  });
}
