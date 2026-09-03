import type { HomeDict } from "./home.en";

export const uiNo: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Proveniens",
  "ui.prov.heading": "Verifiseringsjournal",
  "ui.prov.intro": "Denne journalen er ennå ikke verifisert. En plate omtales bare som menneskeverifisert når RAW-originalen og opptaksjournalen er arkivert.",
  "ui.prov.footer": "Provenensdokumentasjon kan etterspørres før lisensiering. Be om katalognummeret, så får du den journalen som finnes for filen.",
  "ui.prov.r.status": "Verifiseringsstatus",
  "ui.prov.r.raw": "RAW-original arkivert",
  "ui.prov.r.capture": "Opptaksjournal bevart",
  "ui.prov.r.signed": "Fotografsignert lisens",
  "ui.prov.r.cat": "Katalognummer",
  "ui.prov.r.c2pa": "C2PA-innholdslegitimasjon",

  // Capture metadata table
  "ui.cap.heading": "Opptaksmetadata",
  "ui.cap.date": "Opptaksdato",
  "ui.cap.location": "Sted",
  "ui.cap.camera": "Kamera",
  "ui.cap.lens": "Objektiv",
  "ui.cap.exposure": "Eksponering",

  // Shared placeholder value
  "ui.cap.placeholder": "Plassholderbilde",
  "ui.val.tbd": "Oppgis senere",

  // Recommendation strip
  "ui.foryou.default": "Fortsett i arkivet",
  "ui.foryou.next": "Dette vil du kanskje lisensiere neste gang",
  "ui.foryou.note": "Basert på det du åpnet her. Lagres bare på enheten din — ingenting sendes eller spores.",

  // Breadcrumbs
  "ui.crumb.home": "Hjem",
  "ui.crumb.collection": "Samling",

  // Plate detail page chrome
  "ui.skip": "Hopp til innhold",
  "ui.detail.priceNote": "Utkast til priser — kun veiledende, ikke bekreftede lisensvilkår.",
  "ui.detail.licHeading": "Lisensalternativer",
  "ui.detail.licIntro": "Velg omfanget som passer bruken din. Sammendraget nedenfor er klarspråk; den signerte avtalen er det bindende dokumentet.",
  "ui.detail.selectLic": "Velg en lisens",
  "ui.detail.draftPrice": "Utkast til pris — kun veiledende",
  "ui.detail.mayDo": "hva du kan gjøre",
  "ui.detail.notIncluded": "Ikke inkludert",
  "ui.detail.delivery": "Levering",
  "ui.detail.orderHeading": "Slik fungerer bestilling",

  // Licence request form
  "ui.form.label": "Lisensforespørsel",
  "ui.form.heading": "Be om vilkår for en plate",
  "ui.form.intro": "Kun frontend foreløpig — innsending og leveringsintegrasjon må kobles til før lansering. Ingenting du skriver inn her overføres eller lagres.",
  "ui.form.plate": "Plate",
  "ui.form.selectPlate": "Velg en plate",
  "ui.form.licenceType": "Lisenstype",
  "ui.form.selectLicence": "Velg en lisens",
  "ui.form.name": "Navn",
  "ui.form.email": "E-post",
  "ui.form.company": "Firma",
  "ui.form.territory": "Territorium",
  "ui.form.duration": "Varighet",
  "ui.form.use": "Tiltenkt bruk",
  "ui.form.notes": "Merknader",
  "ui.form.optional": "(valgfritt)",
  "ui.form.submit": "Klargjør forespørsel",

  // Form — recorded state
  "ui.form.rec.label": "Forespørsel registrert i denne nettleseren",
  "ui.form.rec.heading": "Forespørselen din er klargjort",
  "ui.form.rec.body": "Ingenting er sendt ennå. Dette nettstedet har ingen innsendingsbackend tilkoblet, så detaljene du skrev inn blir værende kun i denne nettleserøkten. Sending og levering må kobles til før lansering.",
  "ui.form.rec.plate": "Plate",
  "ui.form.rec.licence": "Lisens",
  "ui.form.rec.again": "Start en ny forespørsel",

  // Form — validation
  "ui.form.v.plate": "Velg en plate.",
  "ui.form.v.licence": "Velg en lisenstype.",
  "ui.form.v.name": "Skriv inn navnet ditt.",
  "ui.form.v.nameLong": "Navnet må være under 100 tegn.",
  "ui.form.v.email": "Skriv inn e-postadressen din.",
  "ui.form.v.emailBad": "Skriv inn en gyldig e-postadresse.",
  "ui.form.v.company": "Firma må være under 120 tegn.",
  "ui.form.v.use": "Beskriv hvordan bildet skal brukes.",
  "ui.form.v.useLong": "Tiltenkt bruk må være under 1000 tegn.",
  "ui.form.v.notes": "Merknader må være under 1000 tegn.",
};
