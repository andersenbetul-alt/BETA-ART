/* Regenerate the icon set from the site's own mark.
 *
 * The mark is ◈ — the diamond the header and the footer carry next to the wordmark,
 * in the accent red on the page ground. Everything here is drawn from that one shape,
 * so the browser tab, the iOS home screen and the install prompt all show the same thing.
 *
 * Deliberately dependency-free, like the rest of the site: a diamond is |dx| + |dy| <= r,
 * so the rasteriser is a distance test and the PNG writer is node:zlib plus four chunks.
 * Run it after changing the mark or a colour token:  node scripts/icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BG = [0x08, 0x08, 0x0f];   // --bg
const FG = [0xef, 0x2b, 0x2d];   // --accent

/* ---------- the mark ---------- */

// Proportions of the canvas, matching the ◈ glyph the logo uses.
const R_OUT = 0.44;   // outer edge of the ring
const R_IN  = 0.20;   // the solid diamond inside it
const STROKE = 0.085; // ring thickness

// How much ink a pixel gets, 0..1, supersampled so the diagonals do not stair-step.
// At tab size the ring and the diamond inside it collapse into one muddy blob, so
// anything 20px or under drops the ring and keeps the solid diamond on its own —
// the same mark, reduced to the one shape that still reads at that size.
function coverage(x, y, n, scale) {
  const S = 4, c = n / 2;
  const small = n <= 20;
  const rOut = R_OUT * n * scale;
  const stroke = STROKE * n * scale;
  const rMid = rOut - stroke;
  const rIn = (small ? 0.40 : R_IN) * n * scale;
  let hits = 0;
  for (let i = 0; i < S; i++) {
    for (let j = 0; j < S; j++) {
      const d = Math.abs(x + (i + 0.5) / S - c) + Math.abs(y + (j + 0.5) / S - c);
      if (d <= rIn || (!small && d >= rMid && d <= rOut)) hits++;
    }
  }
  return hits / (S * S);
}

// scale < 1 pulls the mark into the safe zone a maskable icon may be cropped to.
function render(n, scale = 1) {
  const px = Buffer.alloc(n * n * 3);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const a = coverage(x, y, n, scale);
      const o = (y * n + x) * 3;
      for (let k = 0; k < 3; k++) px[o + k] = Math.round(BG[k] + (FG[k] - BG[k]) * a);
    }
  }
  return px;
}

/* ---------- PNG ---------- */

const CRC = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return buf => {
    let c = -1;
    for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(body));
  return Buffer.concat([len, body, crc]);
}

function png(n, px) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0); ihdr.writeUInt32BE(n, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 2;    // colour type: truecolour, no alpha — iOS wants an opaque icon
  const raw = Buffer.alloc(n * (n * 3 + 1));
  for (let y = 0; y < n; y++) {
    raw[y * (n * 3 + 1)] = 0;  // filter: none
    px.copy(raw, y * (n * 3 + 1) + 1, y * n * 3, (y + 1) * n * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- ICO ---------- */

// /favicon.ico is still requested by crawlers and by browsers that ignore the SVG.
// PNG-compressed entries, which every browser since IE11 reads.
function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  const dir = [];
  let offset = 6 + images.length * 16;
  for (const { n, data } of images) {
    const e = Buffer.alloc(16);
    e[0] = n >= 256 ? 0 : n; e[1] = n >= 256 ? 0 : n;
    e.writeUInt16LE(1, 4);   // colour planes
    e.writeUInt16LE(32, 6);  // bits per pixel
    e.writeUInt32BE(0, 8); e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += data.length;
  }
  return Buffer.concat([head, ...dir, ...images.map(i => i.data)]);
}

/* ---------- write ---------- */

const write = (rel, buf) => { writeFileSync(join(root, rel), buf); console.log(rel, buf.length + ' bytes'); };

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#08080f"/>
  <path fill="#ef2b2d" d="M16 1.92 30.08 16 16 30.08 1.92 16Zm0 3.85L5.77 16 16 26.23 26.23 16Z"/>
  <path fill="#ef2b2d" d="M16 9.6 22.4 16 16 22.4 9.6 16Z"/>
</svg>
`;
write('assets/favicon.svg', Buffer.from(svg));
write('assets/favicon.ico', ico([16, 32, 48].map(n => ({ n, data: png(n, render(n)) }))));
write('assets/apple-touch-icon.png', png(180, render(180)));
write('assets/icon-192.png', png(192, render(192)));
write('assets/icon-512.png', png(512, render(512)));
write('assets/icon-maskable-512.png', png(512, render(512, 0.6)));

write('assets/site.webmanifest', Buffer.from(JSON.stringify({
  name: 'HXI',
  short_name: 'HXI',
  description: 'Official site of HXI — Norwegian drift phonk producer.',
  start_url: '/',
  scope: '/',
  display: 'minimal-ui',
  background_color: '#08080f',
  theme_color: '#08080f',
  icons: [
    { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n'));
