---
name: qblogg-deploy
description: Deploy QBLOGG to Vercel. Use when asked to deploy, publish, update the live site, push to production, or release a new version of QBLOGG. Also covers checking deployment status, troubleshooting failed deploys, and the Vercel project configuration.
---

QBLOGG is deployed to Vercel (project `qblogg`, team "BET - ART", `team_xNtowH7U0jXQrI53DFJFzH2o`). The live URL is `qblogg.vercel.app`. The GitHub integration is **not** connected to `andersenbetul-alt` (only to `betulandersen-droid`), so deploys are triggered manually or via Vercel CLI.

## Deploy flow

### 1. Pre-deploy checks (mandatory)

```bash
npm run check        # i18n keys, slug integrity, broken links, sitemap
npm run guvenlik     # XSS, CSP, privacy text, canonical
```

Both must exit 0. If red, fix first.

### 2. Commit and push to main

```bash
git add -A
git commit -m "feat: <description>"
git push -u origin main
```

`main` is the production branch. Changes pushed here are what Vercel deploys.

### 3. Trigger Vercel deploy

Since GitHub integration is not connected to this GitHub account, deploy via Vercel MCP tool or manual re-deploy in Vercel dashboard:

**Via Vercel MCP** (if available in session):
```
Use mcp__Vercel__deploy_to_vercel or mcp__Vercel__list_deployments
to find the project and trigger a re-deploy.
```

**Via Vercel dashboard** (user action required):
1. Open vercel.com → Projects → `qblogg`
2. Click **Redeploy** on the latest deployment
3. Watch build logs — `buildCommand` clones `main` and copies files to `dist/`

### 4. Verify

```bash
# Check live site responds
curl -sI https://qblogg.vercel.app | head -5
```

Expected: `HTTP/2 200` with `x-vercel-id` header.

## vercel.json structure

Single config file at repo root. Key fields:

```json
{
  "buildCommand": "git clone ... && cp -r pages/ dist/",
  "outputDirectory": "dist",
  "headers": [{ "source": "/(.*)", "headers": [...CSP...] }]
}
```

**CSP rule**: every new external service added to the site must also appear in `vercel.json` → `connect-src`. Missing entry = silent block. `npm run guvenlik` checks this.

## Connecting GitHub auto-deploy (user action)

If the user wants push-triggered deploys:
1. Vercel dashboard → `qblogg` project → Settings → Git
2. Connect repository → select `andersenbetul-alt/beta-art`
3. Production branch: `main`
4. After connection: every `git push origin main` auto-deploys

Or use `mcp__Vercel__create_git_project` with the repo URL.

## Custom domain (qblogg.com)

Domain is at GoDaddy. To connect:
1. Vercel dashboard → `qblogg` → Domains → Add `qblogg.com`
2. Vercel shows DNS records to add (CNAME or A + AAAA)
3. GoDaddy → DNS → add those records (keep MX records — email stays at GoDaddy)
4. Do NOT move nameservers to Vercel (breaks email)
5. Propagation: 15 min to 24 h

## Gotchas

- The Vercel project was recreated on 23.08.2026 (old `qblogg-flame`/`qblogg-bet-art` URLs are dead). Use `qblogg.vercel.app`.
- `buildCommand` clones the **public** `main` branch from GitHub — only committed, pushed changes are deployed.
- If Vercel's GitHub App is not installed for `andersenbetul-alt`, auto-deploy won't trigger even after branch pushes.
- Buttondown newsletter POST needs `newsletterEndpoint` in `assets/js/config.js` and the domain in `connect-src`.
