# HXI Website

Static HTML site for [hximusic.com](https://hximusic.com).

## Stack

Pure HTML + CSS + JS. No build step, no framework, no dependencies.

## Files

| File | Description |
|---|---|
| `index.html` | Homepage (Hero → Current Signal → Works → Proof → Place → Story → Culture → Creator+Sync → Contact) |
| `music.html` | Music & Releases |
| `credits.html` | Credits (specific roles, no inflation) |
| `creator-use.html` | NCS creator use policy |
| `sync.html` | Sync / Licensing inquiry form |
| `booking.html` | Booking inquiry form |
| `press.html` | Press & EPK |
| `privacy.html` | Privacy notice |
| `legal.html` | Legal / Rights |
| `style.css` | All styles — brand tokens in `:root` |
| `config.js` | Email, domain, social links — edit here only |
| `app.js` | Mobile menu, Spotify lazy load, form → mailto |

## Configuration

Edit `config.js` to update contact email, canonical domain, and social links.
No other file needs changing.

## Forms

Forms use `mailto:` — they open the visitor's mail client with data pre-filled.
No third-party form service. No visitor data leaves the mail client.

## Logo assets

Logo SVGs are currently loaded from an external CDN (`cdn.websitepublisher.ai`).

**TODO:** Replace with self-hosted files once `scripts/hxi-marka-uret.py` generates them:
- Save `hxi-logo-candidate-a.svg` → `assets/brand/hxi/hxi-logo.svg`
- Save `hxi-symbol-x-candidate-a.svg` → `assets/brand/hxi/hxi-symbol.svg`
- Replace all `cdn.websitepublisher.ai/...` src attributes with `/assets/brand/hxi/hxi-logo.svg`

Grep for `TODO` in any HTML file to find all references.

## Deploy

Connect the `hxi-website/` directory to the `hxi-final` Vercel project.
Or: `vercel --cwd hxi-website`

## Brand

Palette: `#080808` · `#f0ede8` · `#c8ff00` · `#ef2b2d`  
Typography: Barlow Condensed · IBM Plex Sans · Space Mono (Google Fonts)  
Tagline: THE SAME SPEED — COLDER.
