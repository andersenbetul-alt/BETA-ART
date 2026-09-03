/**
 * Beta Art — remaining UI chrome (provenance panel, capture table, plate-detail
 * page headings, recommendation strip, breadcrumbs, licence request form incl.
 * validation), canonical English. Each language mirrors these keys in ui.<lang>.ts.
 *
 * NOT translated: brand names, catalogue ids, "RAW", "AI", "C2PA", "kr".
 */
import type { HomeDict } from "./home.en";

export const uiEn: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Provenance",
  "ui.prov.heading": "Verification record",
  "ui.prov.intro": "This record is not yet verified. A plate is only described as Human Verified once the RAW original and the capture record are on file.",
  "ui.prov.footer": "Provenance documentation can be requested before licensing. Ask for the catalogue number and you receive whatever record exists for that file.",
  "ui.prov.r.status": "Verification status",
  "ui.prov.r.raw": "RAW original archived",
  "ui.prov.r.capture": "Capture record preserved",
  "ui.prov.r.signed": "Photographer-signed licence",
  "ui.prov.r.cat": "Catalogue number",
  "ui.prov.r.c2pa": "C2PA content credentials",

  // Capture metadata table
  "ui.cap.heading": "Capture metadata",
  "ui.cap.date": "Capture date",
  "ui.cap.location": "Location",
  "ui.cap.camera": "Camera",
  "ui.cap.lens": "Lens",
  "ui.cap.exposure": "Exposure",

  // Shared placeholder value
  "ui.cap.placeholder": "Placeholder imagery",
  "ui.val.tbd": "To be supplied",

  // Recommendation strip
  "ui.foryou.default": "Continue in the archive",
  "ui.foryou.next": "You may want to license next",
  "ui.foryou.note": "Based on what you opened here. Kept on your device only — nothing is sent or tracked.",

  // Breadcrumbs
  "ui.crumb.home": "Home",
  "ui.crumb.collection": "Collection",

  // Plate detail page chrome
  "ui.skip": "Skip to content",
  "ui.detail.priceNote": "Draft pricing — indicative only, not confirmed licence terms.",
  "ui.detail.licHeading": "Licensing options",
  "ui.detail.licIntro": "Choose the scope that matches your use. The summary below is plain English; the signed agreement is the binding document.",
  "ui.detail.selectLic": "Select a licence",
  "ui.detail.draftPrice": "Draft price — indicative only",
  "ui.detail.mayDo": "what you may do",
  "ui.detail.notIncluded": "Not included",
  "ui.detail.delivery": "Delivery",
  "ui.detail.orderHeading": "How ordering works",

  // Licence request form
  "ui.form.label": "Licence request",
  "ui.form.heading": "Request terms for a plate",
  "ui.form.intro": "Front-end only for now — submission and delivery integration must be connected before launch. Nothing you enter here is transmitted or stored.",
  "ui.form.plate": "Plate",
  "ui.form.selectPlate": "Select a plate",
  "ui.form.licenceType": "Licence type",
  "ui.form.selectLicence": "Select a licence",
  "ui.form.name": "Name",
  "ui.form.email": "Email",
  "ui.form.company": "Company",
  "ui.form.territory": "Territory",
  "ui.form.duration": "Duration",
  "ui.form.use": "Intended use",
  "ui.form.notes": "Notes",
  "ui.form.optional": "(optional)",
  "ui.form.submit": "Prepare request",

  // Form — recorded state
  "ui.form.rec.label": "Request recorded in this browser",
  "ui.form.rec.heading": "Your request has been prepared",
  "ui.form.rec.body": "Nothing has been sent yet. This site has no submission backend connected, so the details you entered stay in this browser session only. Sending and delivery must be connected before launch.",
  "ui.form.rec.plate": "Plate",
  "ui.form.rec.licence": "Licence",
  "ui.form.rec.again": "Start another request",

  // Form — validation
  "ui.form.v.plate": "Select a plate.",
  "ui.form.v.licence": "Select a licence type.",
  "ui.form.v.name": "Enter your name.",
  "ui.form.v.nameLong": "Name must be under 100 characters.",
  "ui.form.v.email": "Enter your email address.",
  "ui.form.v.emailBad": "Enter a valid email address.",
  "ui.form.v.company": "Company must be under 120 characters.",
  "ui.form.v.use": "Describe how the image will be used.",
  "ui.form.v.useLong": "Intended use must be under 1000 characters.",
  "ui.form.v.notes": "Notes must be under 1000 characters.",
};
