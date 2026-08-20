# Getting hximusic.com to serve this site

The site is static: 26 pre-rendered pages plus assets, built by `npm run build` into `dist/`.
Any host that serves a folder will do. Two are already configured here.

## What is in the repo

- `CNAME` — contains `hximusic.com`. GitHub Pages reads it from the published root to bind the
  custom domain; `scripts/build.mjs` copies it into `dist/`. Every other host ignores it.
- `vercel.json` — build command, output directory, and the security headers the site cannot set
  from a `<meta>` tag (HSTS, `X-Content-Type-Options`).
- `.github/workflows/deploy.yml` — on a push to `main`, runs the checks, builds, and publishes
  `dist/` to GitHub Pages.

## Path A — GitHub Pages

1. Push the repo. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Pages → Custom domain: `hximusic.com`. Save.
3. At the DNS registrar, for the apex record, four A records:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   and for `www`, a CNAME to `<username>.github.io`.
4. Back in Settings → Pages, tick **Enforce HTTPS** once the certificate is issued. It can take
   an hour; it is normal for the box to be greyed out until then.

## Path B — Vercel

The `bet-art` team already exists and has a stack of HXI projects from earlier attempts.

1. Vercel → Add New → Project → import the GitHub repo. `vercel.json` supplies the build
   settings, so accept the defaults.
2. Project → Settings → Domains → add `hximusic.com`.
3. Vercel shows the exact records. For an apex domain it is usually an A record to `76.76.21.21`,
   or nameserver delegation if the domain is managed by Vercel.

**Before adding it, find where the domain is now.** It is not attached to any project in the
`bet-art` team — every project there carries only `*.vercel.app` domains. Earlier notes mention a
project called `2026-1`, which does not exist in that team, so the domain is probably on a
personal Vercel account rather than the team, or has been released. A domain can only be attached
to one project at a time; moving it while something is live on it will take that thing down.

## Do not run both

Pages and Vercel cannot both answer for the apex at once — the DNS record points at one of them.
Pick one, and delete the other's DNS records so a stale A record does not intermittently serve an
old build.

## After it is live

Check these, in this order:

1. `https://hximusic.com/` and `https://hximusic.com/tr/` both load, and the Turkish page is
   actually in Turkish with `<html lang="tr">`.
2. `https://hximusic.com/robots.txt` and `/sitemap.xml` resolve, and the sitemap lists 26 URLs.
3. A URL that does not exist serves the site's own 404, not the host's.
4. Submit the sitemap in Google Search Console. Until that happens the twelve language pages are
   not being crawled as separate pages, which is the whole point of pre-rendering them.
