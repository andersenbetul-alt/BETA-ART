# assets/data

`spotify.json` is written by `scripts/sync-spotify.mjs` and committed by the daily
`.github/workflows/spotify.yml` run. It ships empty, and the page keeps its hand-written
archive until the sync has credentials.

## Turning it on

1. Create an app at https://developer.spotify.com/dashboard.
2. Put its client id and secret into the repository secrets `SPOTIFY_CLIENT_ID` and
   `SPOTIFY_CLIENT_SECRET` (Settings → Secrets and variables → Actions).
3. Actions → spotify → Run workflow.

From then on it runs every morning at 06:17 UTC and commits only when something changed.

## What it carries

Everything Spotify publishes about the catalogue:

- **Every release**, including the ones where HXI is credited but is not the primary artist —
  `include_groups` covers `album`, `single` and `appears_on`, which is how TOMA, Dança Estrada
  and MONTAGEM HYSTERIA get in. Paginated, so nothing is lost past the API's 50-item page.
- **Release dates**, which is what the hand-written archive is missing for five known releases.
- **Who each release is credited to**, so a collaboration is not rendered as an HXI headline.
- **Follower count** and the genres Spotify assigns.

When the file has releases in it, the page swaps its hand-written archive for this list — a
complete, dated, self-updating catalogue instead of one somebody has to remember to edit.

## What it cannot carry

The public API does not expose these at all:

- **Monthly listeners** — Spotify for Artists only.
- **Per-track stream counts** — not published anywhere in the API.

So "43,394,947 streams" and "251K monthly listeners" stay hand-maintained, in `index.html` and
in the matching key of all twelve dictionaries. The script says so rather than approximating
them from the `popularity` score, which is a 0–100 index and not a stream count.

## The guard

If the API returns fewer releases than the page's archive already lists, the script refuses to
write and exits non-zero. A truncated or rate-limited response should not quietly shorten the
catalogue — the archive replaces itself only with something at least as complete.
