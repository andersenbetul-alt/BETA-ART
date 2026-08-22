# Verktøy som ikke er en del av nettstedet

Skriptene her kjøres for hånd når merket skal tegnes om. De inngår ikke i
`npm test`, ikke i `npm run sjekk`, og siden laster dem aldri. Prosjektet har
fortsatt null avhengigheter i det som sendes til nettleseren.

## Ordmerket

`lag-ordmerke.py` setter NAVIAR CARE i Inter og gjør bokstavene om til flater.
`lag-logo.py` setter sammen de fem logofilene av flatene og merket.

```
pip install fonttools
curl -o inter-700.ttf <Inter Bold fra Google Fonts>
curl -o inter-400.ttf <Inter Regular fra Google Fonts>
python3 lag-ordmerke.py && python3 lag-logo.py
```

Grunnen til at teksten ikke ligger som `<text>` i SVG-en: en logo som er
avhengig av at en skrift er installert der den vises, er ikke en logo. Den er
en forhåpning. Inter er lisensiert under SIL Open Font License, som tillater at
konturene brukes slik.

Endres sporingen eller ordmellomrommet, er det her det gjøres – ikke ved å
redigere banedata i SVG-filene for hånd.
