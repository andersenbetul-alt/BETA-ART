#!/bin/bash
# Naviar – oppstartshook for Claude Code på nett.
#
# Denne hooken installerer ikke avhengigheter, og det er ikke en forglemmelse.
# Prosjektet har null avhengigheter med vilje: package.json har verken
# dependencies eller devDependencies, og node_modules skal ikke oppstå i
# repoet. Se regel 3 i CLAUDE.md.
#
# Jobben er en annen, og den er verdt en hook:
#
#   tests/e2e.test.js hopper over nettlesertestene hvis Playwright mangler.
#   Den skriver en linje om det og fortsetter. I en fersk container betyr det
#   at `npm test` sier «305 bestått» mens 153 tester aldri kjørte – og
#   ingen oppdager det, fordi det ser ut som suksess.
#
# Så: skaff Playwright globalt hvis det mangler, og si fra høyt hvis det
# fortsatt mangler etterpå. Globalt, aldri i repoet.

set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

GLOBALE=(
  /opt/node22/lib/node_modules/playwright
  /usr/lib/node_modules/playwright
  /usr/local/lib/node_modules/playwright
)

finnes() {
  for p in "${GLOBALE[@]}"; do
    [ -d "$p" ] && return 0
  done
  node -e "require('playwright')" >/dev/null 2>&1
}

if finnes; then
  echo "Playwright: finnes"
else
  echo "Playwright: mangler, installerer globalt"
  # -g holder det ute av repoet. npm install i mappa ville laget node_modules,
  # og det er nettopp det som ikke skal skje.
  npm install -g playwright >/dev/null 2>&1 || true
fi

if ! finnes; then
  echo "ADVARSEL: Playwright mangler fortsatt."
  echo "  npm test vil si «bestått» mens nettlesertestene aldri kjørte."
  echo "  Kjør npm run test:enhet alene, eller installer Playwright globalt."
fi

# Nettleseren er forhåndsinstallert i dette miljøet. Mangler den, har
# testene ingen å kjøre i, og feilen kommer først når noen venter på svar.
if [ -d /opt/pw-browsers ]; then
  echo "Chromium: finnes i /opt/pw-browsers"
else
  echo "ADVARSEL: fant ikke /opt/pw-browsers. Nettlesertestene vil feile."
fi

# Sperren. Dukker node_modules opp i repoet, er en avhengighet sneket inn,
# og da skal det stå her og ikke oppdages tre uker senere.
if [ -d "${CLAUDE_PROJECT_DIR:-.}/node_modules" ]; then
  echo "ADVARSEL: node_modules finnes i repoet. Prosjektet skal ha null"
  echo "  avhengigheter – se regel 3 i CLAUDE.md. Slett mappa, eller"
  echo "  begrunn avhengigheten i commit-meldingen."
fi

echo "Klar. npm test kjører 339 enhetstester og 153 nettlesertester."
