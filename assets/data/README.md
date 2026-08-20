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

The script says so rather than approximating them from the `popularity` score, which is a
0–100 index and not a stream count.

# figures.json — the two numbers the API cannot fetch

Those two figures used to be typed into seventeen places: five in `index.html` and one in each
of the twelve dictionaries. That is why they went stale, and why the page and the artist's own
July 2026 data pack disagreed about the stream count (43,394,947 against 43,367,812).

They now live in `figures.json` and nowhere else.

```json
"streams_help_urself": { "value": 43394947, "source": "…", "checkedAt": "2026-08-18" }
```

`figures.json` holds four numbers now: `streams_help_urself`, `monthly_listeners`,
`streams_x_pirata` and `streams_x_pirata_slowed`. Any dictionary string that prints one
carries a **named token** — `{streams_help_urself}`, not a typed number — and `npm run check`
fails if a number is typed in instead. Adding a fifth figure is a key in the file plus a token
in the string; nothing else changes.

**The monthly job.** Open Spotify for Artists — monthly listeners on the dashboard, the
stream count on the "help urself" track page — and run:

```bash
npm run figures -- --streams 43500000 --listeners 252400
```

The two X-PIRATA figures are edited in the file directly for now; only the two that move weekly have flags. Either flag on its own is fine, and the numbers can be pasted with the separators Spotify
shows (`43.500.000`, `252 400`) — they are stripped. The script stamps `checkedAt` with
today's date on whatever it changed, so that field never lies about how old a figure is.
Then commit.

That is the whole job. `app.js` fills the live page from the same file, `build.mjs` bakes it
into the twelve pre-rendered pages, and `npm run check` fails if any of them ever disagree —
or if a number gets typed into a dictionary instead of `{n}`.

`npm run check` also prints a note when a figure has not been checked in sixty days, with the
command to fix it. It is a note, not a failure: nothing is broken, but a stream count nobody
has looked at since spring is the quiet way this page stops being true.

A side effect worth having: the numbers are now formatted per language by `Intl.NumberFormat`,
so Hindi shows `2,51,000` and `4.3 क॰`, French `43 394 947`, Turkish `43,4 Mn`. Before, every
language printed the English `43.4M+`.

`source` and `checkedAt` are there so the next person knows where a number came from and how
old it is. Fill them in honestly — "Spotify for Artists, 1 July 2026" is useful; "Spotify" is not.

# If the numbers should update themselves

Nothing free will do it. The options, in the order worth considering:

1. **Spotify for Artists, by hand — the chosen approach.** First-party truth, and the only
   place monthly listeners exist. One command a month, with a reminder in `npm run check`
   when it has been missed. Revisit only if the cadence starts slipping.
2. **Songstats** (~€13/month) has an API covering streams, followers and monthly listeners.
   That is the cheapest way to make `figures.json` self-updating: a second scheduled workflow
   writing the same file the same way. Chartmetric does the same for considerably more.
3. **Scraping the public artist page.** Do not. It breaks whenever Spotify changes its markup,
   and it puts the site on the wrong side of terms it does not need to be near.

One thing to know before automating: **Spotify's Developer Policy restricts "derived metrics"** —
presenting figures like "reached X streams" is limited regardless of where the number came
from. An artist stating their own numbers on their own site is ordinary practice and is not
what that clause is aimed at, but it is worth a read before building a dashboard out of it.

## The guard

If the API returns fewer releases than the page's archive already lists, the script refuses to
write and exits non-zero. A truncated or rate-limited response should not quietly shorten the
catalogue — the archive replaces itself only with something at least as complete.
