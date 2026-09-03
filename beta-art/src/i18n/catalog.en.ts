/**
 * Beta Art — catalogue copy (FAQ, licences, delivery, ordering, plate status),
 * canonical English source. Mirrors the display strings in data/collection.ts.
 *
 * collection.ts stays the structural source (ids, prices, slugs, images) and is
 * used verbatim for SEO/JSON-LD; these keys carry the translatable display text.
 * Each language lives in catalog.<lang>.ts with the SAME keys.
 *
 * Brand names, catalogue ids (BA-001…), "RAW", "AI", "kr", "TIFF/JPEG",
 * "PDF", "C2PA" and numeric prices are NOT translated.
 */
import type { HomeDict } from "./home.en";

export const catalogEn: HomeDict = {
  // FAQ
  "cat.faq.1.q": "What does “verified human photography” mean here?",
  "cat.faq.1.a": "It means a plate is only listed as verified when it was made by a person with a physical camera, the RAW original is held on file, and the licence is issued by the photographer who pressed the shutter. Records that do not yet meet that standard are marked as awaiting a verified original.",
  "cat.faq.2.q": "Can I see proof for a specific image?",
  "cat.faq.2.a": "You can request the provenance documentation for any catalogue number before licensing. Where a capture record or RAW checksum has not been supplied yet, the detail page says so rather than showing a value.",
  "cat.faq.3.q": "Do you use generated or synthetic imagery?",
  "cat.faq.3.a": "Not in the archive. The images currently shown on this site are development placeholders and are labelled as such; they are not part of the verified archive.",
  "cat.faq.4.q": "Which licence do I need?",
  "cat.faq.4.a": "Personal is for private, non-commercial use only and never covers business activity. Commercial covers marketing for one organisation. Extended covers packaging and wide distribution. If none of those fit, a custom or exclusive agreement is drafted for you.",
  "cat.faq.5.q": "How is the licence delivered?",
  "cat.faq.5.a": "As a signed PDF referencing the catalogue number, the licensed scope and the file checksum, together with the delivery files in the agreed resolution and colour space.",
  "cat.faq.6.q": "Can I license print and digital together?",
  "cat.faq.6.a": "Yes. Scopes are combined in a single agreement so you hold one document per project rather than several overlapping licences.",

  // Licence audience labels
  "cat.aud.private": "Private, non-commercial use only",
  "cat.aud.business": "Business use",

  // Licence: Personal
  "cat.lic.personal.name": "Personal",
  "cat.lic.personal.price": "from kr 190",
  "cat.lic.personal.summary": "For private individuals only: prints for your own walls and personal digital use. This licence never covers business, brand, freelance or other commercial activity — those need Commercial or Extended.",
  "cat.lic.personal.p1": "Print one copy for a private space",
  "cat.lic.personal.p2": "Use on a personal, non-monetised website or profile",
  "cat.lic.personal.p3": "Keep the file indefinitely for that single use",
  "cat.lic.personal.n1": "Any commercial or promotional use",
  "cat.lic.personal.n2": "Resale, redistribution or transfer",

  // Licence: Commercial
  "cat.lic.commercial.name": "Commercial",
  "cat.lic.commercial.price": "from kr 1 200",
  "cat.lic.commercial.summary": "For one organisation to use the image in its own marketing and editorial material.",
  "cat.lic.commercial.p1": "Website, social and digital campaigns for one organisation",
  "cat.lic.commercial.p2": "Print advertising and editorial placements",
  "cat.lic.commercial.p3": "Internal and client-facing presentations",
  "cat.lic.commercial.n1": "Packaging or merchandise",
  "cat.lic.commercial.n2": "Sub-licensing to other organisations",

  // Licence: Extended
  "cat.lic.extended.name": "Extended",
  "cat.lic.extended.price": "from kr 4 500",
  "cat.lic.extended.summary": "For wide distribution, including physical products where the image is part of the goods.",
  "cat.lic.extended.p1": "Packaging, merchandise and product surfaces",
  "cat.lic.extended.p2": "Worldwide territory across all media",
  "cat.lic.extended.p3": "Unlimited print run within the agreed term",
  "cat.lic.extended.n1": "Exclusive rights",
  "cat.lic.extended.n2": "Resale of the image file itself as stock",

  // Licence: Custom & Exclusive
  "cat.lic.custom.name": "Custom & Exclusive",
  "cat.lic.custom.price": "On request",
  "cat.lic.custom.summary": "For exclusivity, buy-outs, archive removal or commissioned capture. Terms drafted per project.",
  "cat.lic.custom.p1": "Category or full exclusivity",
  "cat.lic.custom.p2": "Archive removal on request",
  "cat.lic.custom.p3": "Commissioned work to the same archival standard",
  "cat.lic.custom.n1": "Nothing is fixed in advance — scope is agreed in writing",

  // Delivery
  "cat.del.1.t": "File formats",
  "cat.del.1.d": "High-resolution TIFF or JPEG. Colour space agreed with you before delivery.",
  "cat.del.2.t": "Delivery method",
  "cat.del.2.d": "Download link issued after the licence is signed. Delivery timing confirmed per request.",
  "cat.del.3.t": "Licence document",
  "cat.del.3.d": "A signed PDF naming the catalogue number, the licensed scope and the checksum of the delivered file.",
  "cat.del.4.t": "Provenance sheet",
  "cat.del.4.d": "Capture record and RAW checksum supplied with the licence once the original has been archived.",

  // Ordering steps
  "cat.ord.1.t": "Choose an image",
  "cat.ord.1.b": "Open the plate you need and check its catalogue number, provenance panel and capture record.",
  "cat.ord.2.t": "Choose a licence and request terms",
  "cat.ord.2.b": "Pick the scope that matches your use and send the request. Custom scopes are agreed in writing.",
  "cat.ord.3.t": "Receive invoice, licence and file",
  "cat.ord.3.b": "Once terms are approved you receive the invoice, the signed licence and the delivery file.",

  // Plate shared placeholder / verification
  "cat.ver.status": "Awaiting verified original",
  "cat.ver.notprovided": "Not provided",
  "cat.ver.signed": "Available on licensing",
  "cat.plate.desc": "Placeholder record. The catalogue description for this plate has not been written yet — it will describe the frame, the conditions it was made in and what the licensed file contains.",
};
