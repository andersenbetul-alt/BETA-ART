# Research log

Every factual claim on the site should be traceable to something outside the site.
This file is that trail: what was checked, against what, and when. Add a row when you
verify something, and move a claim out of "unverified" only when a source says so.

Search works from this project's sessions; most music sites (Spotify, Apple Music,
Fandom, hximusic.com itself) are blocked by the network proxy, so verification comes
from search results rather than fetched pages. Say so when that is all you have.

## Verified

| Claim on the site | Source | Checked |
| --- | --- | --- |
| "help urself" — 43,394,947 Spotify streams | Spotify track page 54ggxbEopZwQ20zurJiHSD, via search | 2026-08-18 |
| "help urself" released 2022 | Spotify / Apple Music single, id 1659522077 | 2026-08-18 |
| Round Around feat. Nateki — NCS release, 23 September 2025 | ncs.io/roundaround, NCS wiki, Apple Music 1838924043 | 2026-08-18 |
| Lock n' Load — NCS release, September 2024 | ncs.io/LockNLoad | 2026-08-18 |
| MONTAGEM HYSTERIA EP — 19 June 2026 | Shazam, Apple Music | 2026-08-18 |
| Fast & Furious credit | "WORTH NOTHING (feat. Oliver Tree) — Aggressive Drift Phonk Version", *Fast & Furious: Drift Tape/Phonk Vol 1*, credited TWISTED & HXI (tunebat, Spotify album 5N4m9LmD1qtqjfWC4OW9g4) | 2026-08-18 |
| Socials: instagram.com/prod.hxi, tiktok.com/@hximusic, soundcloud.com/hximusic, x.com/HXIMusic, ncs.io/artist/1169/hxi | listed on the artist's own pages | 2026-08-18 |

## Corrected because of research

- **MONTAGEM HYSTERIA is a collaboration, not an HXI headline EP.** Listings credit it to
  -Prey, pvppet, ToufG & HXI, and it went out under -Prey. The page said "feat. -Prey ·
  pvppet · ToufG", which reads as HXI's own EP with guests. Now phrased "with", which is
  true either way.
- **The Fast & Furious credit was vague.** "Universal Pictures · Collab Remix" became
  "Drift Tape/Phonk Vol 1 · with TWISTED" — the actual, checkable credit, and it explains
  why TWISTED appears in the collaborator list.
- **Round Around linked to a Spotify album id.** It now links to ncs.io/roundaround, the
  canonical page, which is also the one creators need.

## Unverified — do not present as fact until confirmed

- **BODYCAM OST.** Searching turns up nothing tying HXI to the BODYCAM soundtrack. The
  game is small enough that its credits may simply not be indexed, so this is "unconfirmed",
  not "false". Ask HXI for the placement (label, release, date) or drop the credit.
- **251,000 monthly listeners.** Spotify's artist page is blocked here and the figure moves
  weekly. Only HXI (Spotify for Artists) can confirm the current number.
- **"10+ sync & collab credits"** in the hero. Nothing enumerates them; either list them or
  soften the claim.
- **discord.gg/hximusic.** The earlier build labelled the community "launching soon". The
  button now promises a live server. Confirm the invite resolves.
- **help urself funk — video year.** The page dates the music video 2025, while listings
  show a "help urself funk" EP in 2026. One of the two is probably wrong.

## Leads — releases the site does not mention yet

- **Dança Estrada** — EP, reported June 2026. Confirm artist credit and exact date, then add
  it to the Latest section and, if it is the newest, to the Music section.
- **help urself** has official Sped Up, Slowed and remix versions (freddy fazbear remix,
  "I Can't Stop" remix, and others) on Spotify. The catalogue only shows the original; a
  "versions" line on that card would reflect what is actually out there.

## How to refresh

1. Search for the artist name plus the year; look for releases newer than the ones in the
   Latest section.
2. Check the figures that rot: stream count on "help urself", monthly listeners, the latest
   release date. They live in `index.html` and in the matching keys of all twelve
   dictionaries in `assets/js/i18n.js`.
3. Update this file in the same commit — a number without a source in here is the thing that
   goes stale unnoticed.
4. `npm run check` before committing.
