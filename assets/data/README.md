# assets/data

`spotify.json` is written by `scripts/sync-spotify.mjs` and committed by the weekly
`.github/workflows/spotify.yml` run. It is not in the repo until that workflow has
credentials — the release list on the page stays hidden until then, and the hand-written
release cards carry the section on their own.

To fill it now: create an app at https://developer.spotify.com/dashboard, put its client id
and secret into the repository secrets `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, then
run the workflow manually from the Actions tab.

What the sync can and cannot verify is documented at the top of the script. Short version:
release list and follower count yes; monthly listeners and stream counts no — Spotify does
not publish those through the API, so they stay hand-maintained.
