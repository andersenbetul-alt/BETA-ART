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

const artist = await api(`/artists/${ARTIST_ID}`, access);
const albums = await api(
  `/artists/${ARTIST_ID}/albums?include_groups=album,single&market=NO&limit=50`,
  access,
);
const top = await api(`/artists/${ARTIST_ID}/top-tracks?market=NO`, access);

// Spotify returns every market variant; collapse to one entry per release name, newest first.
const seen = new Set();
const releases = albums.items
  .sort((a, b) => b.release_date.localeCompare(a.release_date))
  .filter((a) => {
    const key = a.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .slice(0, 12)
  .map((a) => ({
    name: a.name,
    type: a.album_type,
    tracks: a.total_tracks,
    releaseDate: a.release_date,          // 'YYYY-MM-DD' or 'YYYY' — precision varies
    url: a.external_urls.spotify,
    id: a.id,
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

writeFileSync(out, next);
console.log(`Wrote ${releases.length} releases, ${data.artist.followers} followers.`);

const newest = releases[0];
const pageHtml = readFileSync(join(root, 'index.html'), 'utf8');
if (newest && !pageHtml.includes(newest.id) && !pageHtml.toLowerCase().includes(newest.name.toLowerCase())) {
  console.log(`\nNOTE: "${newest.name}" (${newest.releaseDate}) is Spotify's newest release`);
  console.log('      and does not appear on the page. Add it to the Latest section.');
}
