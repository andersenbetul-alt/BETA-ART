---
name: deploy-naviar
description: Legg ut Naviar Care på Vercel og feilsøk utrullingen. Bruk denne når noen ber om å deploye, publisere, oppdatere eller feilsøke nettstedet på Vercel, spør hvorfor naviar-care.vercel.app viser feil innhold, hvorfor en deployment står som BLOCKED, eller hvorfor git-kobling ikke virker. Også for å forstå prosjektlandskapet i teamet bet-art.
---

# Deploy av Naviar Care

Kunnskapen her er prøvd i praksis 24.08.2026, med de faktiske feilmeldingene.
Skillen finnes fordi tre åpenbare veier er stengt, og fordi den fjerde som
virker, ikke kan gjettes. **Når GitHub-appen får tilgang (se nederst), slettes
hele denne skillen** – da tar git-kobling over.

## Landskapet: team `bet-art` (`team_xNtowH7U0jXQrI53DFJFzH2o`)

| Prosjekt | Koblet repo | Merk |
|---|---|---|
| `naviar-care` | betulandersen-droid/naviar-care-1 (ubrukt kobling) | **Målet.** Eier naviar-care.vercel.app. Innholdet er en gammel logostudie lastet opp for hånd |
| `naviar-care-1` | samme repo (aktiv) | v0/Next.js-sida. 183 MB byggecache per push |
| `beta-art`, `eve-slack-agent` | eve-slack-agent | Duplikatpar; beta-art er død |
| `qblogg`, `qblogg-uye` | ingen | qblogg-uye **kloner dette repoet i bygget** – mønsteret vi låner |
| `cobban` | ingen | Rød: mangler lib/-filer i opplastingen |

Kildekoden her ligger i `andersenbetul-alt/BETA-ART` – et **annet** GitHub-eierskap
enn Vercel-appen er installert i. Det er roten til alt under.

## Tre veier som IKKE virker (ikke prøv dem igjen)

1. **CLI + token.** Ingen `VERCEL_TOKEN` i miljøet, og `api.vercel.com` gir
   `000` gjennom proxyen. CLI-en kan ikke nå API-et uansett token.
2. **`create_git_project` mot dette repoet.**
   `repo_no_access: You need admin or write access to the repository "beta-art"`.
   Vercel-appen er installert hos betulandersen-droid, repoet hos andersenbetul-alt.
3. **Alt innhold inline i `deploy_to_vercel`.** Nettstedet er ~1 MB over 82
   filer; det sprenger ett verktøykall. Ikke forsøk base64-bilder inline.

## Veien som virker: klon i bygget

`deploy_to_vercel` (Vercel-MCP) med to småfiler, der bygget selv henter repoet
– samme mønster som qblogg-uye bruker i produksjon i dag:

- files: `vercel.json` (rewrites fra repoet) + en README
- projectSettings:
  - installCommand: `git clone --depth 1 --branch <gren> https://github.com/andersenbetul-alt/BETA-ART.git _src && git -C _src rev-parse HEAD`
  - buildCommand: `mkdir -p dist/besok dist/assets && cp _src/*.html _src/robots.txt _src/sitemap.xml _src/vercel.json dist/ && cp _src/besok/*.html dist/besok/ && cp -r _src/assets/css _src/assets/js _src/assets/img dist/assets/`
  - outputDirectory: `dist`
- name: `naviar-care`, teamId over

Kopilista er `.vercelignore` i praksis: dokumenter, tester, verktøy og
observasjonslogg skal ikke ut på en offentlig vert.

**Fell fra qblogg-uye:** bygget kloner grenen i det øyeblikket det starter.
Push før deploy, ellers bygger du forrige commit – qblogg-uye feilet nøyaktig
slik (`cannot stat '_src/uye/lib/supabase.js'`) og lyktes 45 sekunder senere.

## Tilstander du vil møte

- **`BLOCKED`, ingen bygglogg:** plattformblokk på kontoen (Hobby), ikke din
  feil. Løses bare i dashbordet – åpne inspectorUrl-en og se banneret.
- **Produksjonsdeploy nektet av klassifiseringen:** utoverrettet publisering
  krever brukerens samtykke. Kjør preview, be brukeren om produksjon.
- **Verifisering:** `curl` mot `*.vercel.app` gir `000` (proxy).
  Bruk `web_fetch_vercel_url`. SSO-beskyttede previews kan ikke nås herfra –
  share-lenken krever en cookie-dans proxyen stopper.

## Den egentlige løsningen (gjør skillen overflødig)

<https://github.com/apps/vercel/installations/new> → velg `andersenbetul-alt`
→ gi tilgang til `beta-art`. Deretter: koble `naviar-care`-prosjektet til
repoet (beholder domenene), sett produksjonsgren, og **slett denne skillen**
i samme commit som koblingen dokumenteres.
