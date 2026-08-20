#!/usr/bin/env node
/* Pull what Spotify actually publishes about the artist and write it into the repo.
 *
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/sync-spotify.mjs
 *
 * Why a build-time sync instead of a fetch from the page: the client credentials flow needs
 * a secret, and a static site cannot hold one. So a scheduled job runs this, commits the
 * JSON, and the page reads a plain file — no key in the browser, no backend, no third-party
 * request when someone opens the site.
 *
 * WHAT SPOTIFY'S PUBLIC API DOES NOT GIVE US:
 *   · monthly listeners  — only in Spotify for Artists
 *   · per-track stream counts — not exposed at all
 * So "43,394,947 streams" and "251,000 monthly listeners" stay hand-maintained, in
 * index.html and the twelve dictionaries. Anything this script can verify, it verifies;
 * the rest is honestly left alone rather than approximated from `popularity`.
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ARTIST_ID = '3yRqd6IO6SamMAmnXwZKeU';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets/data/spotify.json');

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set.');
  process.exit(1);
}

async function token() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function api(path, access) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { authorization: `Bearer ${access}` },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

const access = await token();

// Spotify pages at 50; the catalogue is past that once collaborations are counted.
async function all(path, access) {
  const items = [];
  let next = path;
  while (next) {
    const page = await api(next, access);
    items.push(...page.items);
    // `page.next` is an absolute URL; api() wants the path after /v1.
    next = page.next ? page.next.replace('https://api.spotify.com/v1', '') : null;
  }
  return items;
}

const artist = await api(`/artists/${ARTIST_ID}`, access);
// appears_on matters here: TOMA, Dança Estrada and MONTAGEM HYSTERIA are all releases where
// HXI is credited but not the primary artist. Leaving that group out hides a third of the
// catalogue, which is the opposite of what this sync is for.
const albums = await all(
  `/artists/${ARTIST_ID}/albums?include_groups=album,single,appears_on&market=NO&limit=50`,
  access,
);
const top = await api(`/artists/${ARTIST_ID}/top-tracks?market=NO`, access);

// Spotify returns every market variant; collapse to one entry per release name, newest first.
// No cap: the page's archive is meant to be the whole catalogue, and truncating here would
// silently shorten it — the renderer replaces the hand-written archive with this list.
const seen = new Set();
const releases = albums
  .sort((a, b) => b.release_date.localeCompare(a.release_date))
  .filter((a) => {
    const key = a.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .map((a) => ({
    name: a.name,
    type: a.album_type,
    tracks: a.total_tracks,
    releaseDate: a.release_date,          // 'YYYY-MM-DD' or 'YYYY' — precision varies
    url: a.external_urls.spotify,
    id: a.id,
    // Who it is credited to, so a collaboration is not shown as an HXI headline release.
    artists: a.artists.map((x) => x.name),
  }));

const data = {
  syncedAt: new Date().toISOString().slice(0, 10),
  artist: {
    name: artist.name,
    followers: artist.followers?.total ?? null,
    genres: artist.genres ?? [],
    url: artist.external_urls.spotify,
  },
  releases,
  topTracks: top.tracks.slice(0, 5).map((t) => ({
    name: t.name,
    url: t.external_urls.spotify,
    id: t.id,
  })),
  // Stated so nobody later mistakes the absence for a bug.
  notAvailableFromApi: ['monthly_listeners', 'stream_counts'],
};

const previous = existsSync(out) ? readFileSync(out, 'utf8') : '';
const next = JSON.stringify(data, null, 2) + '\n';
const stripDate = (s) => s.replace(/"syncedAt": "[^"]*",\n/, '');

if (stripDate(previous) === stripDate(next)) {
  console.log('No change.');
  process.exit(0);
}

// The page swaps its hand-written archive for this list. If the sync came back with less
// than the archive already shows, writing it would quietly shorten the catalogue — so stop
// and say so instead. A partial API response is not a reason to lose rows.
const archived = (readFileSync(join(root, 'index.html'), 'utf8').match(/<time datetime=/g) || []).length;
if (archived && releases.length < archived) {
  console.error(`Refusing to write: Spotify returned ${releases.length} releases but the page's`);
  console.error(`archive already lists ${archived}. Check the API response before overwriting.`);
  process.exit(1);
}

writeFileSync(out, next);
console.log(`Wrote ${releases.length} releases, ${data.artist.followers} followers.`);

const newest = releases[0];
const pageHtml = readFileSync(join(root, 'index.html'), 'utf8');
if (newest && !pageHtml.includes(newest.id) && !pageHtml.toLowerCase().includes(newest.name.toLowerCase())) {
  console.log(`\nNOTE: "${newest.name}" (${newest.releaseDate}) is Spotify's newest release`);
  console.log('      and does not appear on the page. Add it to the Latest section.');
}
