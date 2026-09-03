import type { HomeDict } from "./home.en";

export const uiDe: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Herkunft",
  "ui.prov.heading": "Verifizierungsnachweis",
  "ui.prov.intro": "Dieser Nachweis ist noch nicht verifiziert. Eine Platte wird erst dann als Human Verified beschrieben, wenn das RAW-Original und der Aufnahmenachweis vorliegen.",
  "ui.prov.footer": "Herkunftsdokumentation kann vor der Lizenzierung angefordert werden. Fragen Sie nach der Katalognummer, und Sie erhalten den zu dieser Datei vorhandenen Nachweis.",
  "ui.prov.r.status": "Verifizierungsstatus",
  "ui.prov.r.raw": "RAW-Original archiviert",
  "ui.prov.r.capture": "Aufnahmenachweis bewahrt",
  "ui.prov.r.signed": "Vom Fotografen signierte Lizenz",
  "ui.prov.r.cat": "Katalognummer",
  "ui.prov.r.c2pa": "C2PA-Content-Credentials",

  // Capture metadata table
  "ui.cap.heading": "Aufnahmemetadaten",
  "ui.cap.date": "Aufnahmedatum",
  "ui.cap.location": "Ort",
  "ui.cap.camera": "Kamera",
  "ui.cap.lens": "Objektiv",
  "ui.cap.exposure": "Belichtung",

  // Shared placeholder value
  "ui.cap.placeholder": "Platzhalterbild",
  "ui.val.tbd": "Wird nachgereicht",

  // Recommendation strip
  "ui.foryou.default": "Im Archiv fortfahren",
  "ui.foryou.next": "Das möchten Sie vielleicht als Nächstes lizenzieren",
  "ui.foryou.note": "Basierend auf dem, was Sie hier geöffnet haben. Nur auf Ihrem Gerät gespeichert — nichts wird gesendet oder verfolgt.",

  // Breadcrumbs
  "ui.crumb.home": "Startseite",
  "ui.crumb.collection": "Sammlung",

  // Plate detail page chrome
  "ui.skip": "Zum Inhalt springen",
  "ui.detail.priceNote": "Vorläufige Preise — nur Richtwert, keine bestätigten Lizenzbedingungen.",
  "ui.detail.licHeading": "Lizenzoptionen",
  "ui.detail.licIntro": "Wählen Sie den Umfang, der zu Ihrer Nutzung passt. Die Zusammenfassung unten ist verständlich formuliert; die unterzeichnete Vereinbarung ist das verbindliche Dokument.",
  "ui.detail.selectLic": "Lizenz auswählen",
  "ui.detail.draftPrice": "Vorläufiger Preis — nur Richtwert",
  "ui.detail.mayDo": "was Sie tun dürfen",
  "ui.detail.notIncluded": "Nicht enthalten",
  "ui.detail.delivery": "Lieferung",
  "ui.detail.orderHeading": "So funktioniert die Bestellung",

  // Licence request form
  "ui.form.label": "Lizenzanfrage",
  "ui.form.heading": "Bedingungen für eine Platte anfragen",
  "ui.form.intro": "Vorerst nur Frontend — Übermittlung und Lieferung müssen vor dem Start angebunden werden. Nichts, was Sie hier eingeben, wird übertragen oder gespeichert.",
  "ui.form.plate": "Platte",
  "ui.form.selectPlate": "Platte auswählen",
  "ui.form.licenceType": "Lizenztyp",
  "ui.form.selectLicence": "Lizenz auswählen",
  "ui.form.name": "Name",
  "ui.form.email": "E-Mail",
  "ui.form.company": "Unternehmen",
  "ui.form.territory": "Gebiet",
  "ui.form.duration": "Dauer",
  "ui.form.use": "Vorgesehene Nutzung",
  "ui.form.notes": "Anmerkungen",
  "ui.form.optional": "(optional)",
  "ui.form.submit": "Anfrage vorbereiten",

  // Form — recorded state
  "ui.form.rec.label": "Anfrage in diesem Browser erfasst",
  "ui.form.rec.heading": "Ihre Anfrage wurde vorbereitet",
  "ui.form.rec.body": "Es wurde noch nichts gesendet. Diese Website hat kein Übermittlungs-Backend angebunden, daher bleiben die von Ihnen eingegebenen Angaben nur in dieser Browsersitzung. Versand und Lieferung müssen vor dem Start angebunden werden.",
  "ui.form.rec.plate": "Platte",
  "ui.form.rec.licence": "Lizenz",
  "ui.form.rec.again": "Weitere Anfrage starten",

  // Form — validation
  "ui.form.v.plate": "Wählen Sie eine Platte aus.",
  "ui.form.v.licence": "Wählen Sie einen Lizenztyp aus.",
  "ui.form.v.name": "Geben Sie Ihren Namen ein.",
  "ui.form.v.nameLong": "Der Name muss unter 100 Zeichen liegen.",
  "ui.form.v.email": "Geben Sie Ihre E-Mail-Adresse ein.",
  "ui.form.v.emailBad": "Geben Sie eine gültige E-Mail-Adresse ein.",
  "ui.form.v.company": "Das Unternehmen muss unter 120 Zeichen liegen.",
  "ui.form.v.use": "Beschreiben Sie, wie das Bild genutzt wird.",
  "ui.form.v.useLong": "Die vorgesehene Nutzung muss unter 1000 Zeichen liegen.",
  "ui.form.v.notes": "Die Anmerkungen müssen unter 1000 Zeichen liegen.",
};
