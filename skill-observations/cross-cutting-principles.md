# Prinsipper på tvers av ferdigheter

Takeaways som gjelder mer enn én ferdighet. Hentet fra observasjonsloggen
under gjennomganger.

**Status:** ingen gjennomgang har kjørt ennå. Prinsippene under er foreslått
direkte fra observasjoner i samme økt som de oppsto, og er ikke validert over
tid.

---

## P1 – Skill mellom «fant ingenting» og «kom ikke fram»

Et verktøy som svarer det samme på begge, må sannsynliggjøres før svaret
brukes. Kjør en kontrollspørring med kjent treff.

*Fra observasjon 2 (find-skills) og navnearbeidet, der fem varemerkeregistre
og Enhetsregisteret alle svarte 000.*

## P2 – Et negativt måleresultat skal bekreftes med en uavhengig måling

Verktøy beskjærer, filtrerer og svarer på et annet spørsmål enn du stilte.
`accessibility.snapshot()` ga tomt for `role="alert"` fordi den beskjærer som
standard. `querySelector('h1')` ga overskriften til en skjult seksjon.

*Fra observasjon 4 (run-skill-generator).*

## P3 – Skjul aldri utdata fra et steg du senere skal teste

Feiler steget stille, tester neste steg noe annet enn du tror.

*Fra observasjon 5.*

## P4 – Sammenlign avgjørelser, ikke aggregater

To motorer som blokkerte «74 av 79» kunne vært uenige om hvilke fem.

*Fra observasjon 6.*
