/**
 * Beta Art — collection data.
 *
 * REPLACEMENT POINT: every record below is a PLACEHOLDER. Swap `src` with the
 * real photograph and fill the `capture` fields from the archive record.
 * Nothing here has been verified — `verification.status` must stay
 * "Awaiting verified original" until a RAW original and capture record exist.
 *
 * Unknown values MUST use PLACEHOLDER ("To be supplied") — never invent a
 * camera, date, location or exposure.
 */
import { PLACEHOLDER } from "@/config/site";
import plate01 from "@/assets/plate-01.jpg";
import plate02 from "@/assets/plate-02.jpg";
import plate03 from "@/assets/plate-03.jpg";
import plate04 from "@/assets/plate-04.jpg";
import plate05 from "@/assets/plate-05.jpg";
import plate06 from "@/assets/plate-06.jpg";

export type Capture = {
  date: string;
  location: string;
  camera: string;
  lens: string;
  exposure: string;
  c2pa: string;
};

export type Verification = {
  /** "Awaiting verified original" for placeholder records. */
  status: string;
  rawArchived: string;
  captureRecord: string;
  signedLicense: string;
};

export type Plate = {
  slug: string;
  title: string;
  catalogue: string;
  price: number;
  currency: string;
  src: string;
  alt: string;
  description: string;
  capture: Capture;
  verification: Verification;
};

export const CURRENCY = "NOK";
export const FROM_PRICE = 190;

/** Applied to every placeholder record. */
const unverified: Verification = {
  status: "Awaiting verified original",
  rawArchived: "Not provided",
  captureRecord: "Not provided",
  signedLicense: "Available on licensing",
};

const noCapture: Capture = {
  date: PLACEHOLDER,
  location: PLACEHOLDER,
  camera: PLACEHOLDER,
  lens: PLACEHOLDER,
  exposure: PLACEHOLDER,
  c2pa: "Not provided",
};

const PLACEHOLDER_DESCRIPTION =
  "Placeholder record. The catalogue description for this plate has not been written yet — it will describe the frame, the conditions it was made in and what the licensed file contains.";

type Seed = { title: string; slug: string; catalogue: string; price: number; src: string };

const seeds: Seed[] = [
  { title: "First Light", slug: "first-light", catalogue: "BA-001", price: 190, src: plate01 },
  { title: "Into the Pines", slug: "into-the-pines", catalogue: "BA-002", price: 190, src: plate01 },
  { title: "Sea of Fog", slug: "sea-of-fog", catalogue: "BA-003", price: 190, src: plate02 },
  { title: "Still Water", slug: "still-water", catalogue: "BA-004", price: 190, src: plate03 },
  { title: "PALM", slug: "palm", catalogue: "BA-005", price: 190, src: plate04 },
  { title: "Blue Hour Grid", slug: "blue-hour-grid", catalogue: "BA-006", price: 190, src: plate03 },
  { title: "Night Crossing", slug: "night-crossing", catalogue: "BA-007", price: 190, src: plate05 },
  { title: "Golden Hour", slug: "golden-hour", catalogue: "BA-008", price: 190, src: plate06 },
  { title: "Portrait in Amber", slug: "portrait-in-amber", catalogue: "BA-009", price: 240, src: plate06 },
  { title: "The Maker", slug: "the-maker", catalogue: "BA-010", price: 240, src: plate05 },
  { title: "Slow Morning", slug: "slow-morning", catalogue: "BA-011", price: 190, src: plate04 },
  { title: "Low Tide", slug: "low-tide", catalogue: "BA-012", price: 190, src: plate02 },
];

export const plates: Plate[] = seeds.map((seed) => ({
  ...seed,
  currency: CURRENCY,
  alt: `Placeholder image standing in for the plate catalogued as ${seed.catalogue}, “${seed.title}”`,
  description: PLACEHOLDER_DESCRIPTION,
  capture: { ...noCapture },
  verification: { ...unverified },
}));

export function getPlate(slug: string): Plate | undefined {
  return plates.find((p) => p.slug === slug);
}

export type License = {
  id: string;
  name: string;
  price: string;
  summary: string;
  permitted: string[];
  notPermitted: string[];
};

export const licenses: License[] = [
  {
    id: "personal",
    name: "Personal",
    price: "from kr 190",
    summary: "For private, non-commercial use — prints for your own walls and personal digital use.",
    permitted: [
      "Print one copy for a private space",
      "Use on a personal, non-monetised website or profile",
      "Keep the file indefinitely for that single use",
    ],
    notPermitted: ["Any commercial or promotional use", "Resale, redistribution or transfer"],
  },
  {
    id: "commercial",
    name: "Commercial",
    price: "from kr 1 200",
    summary: "For one organisation to use the image in its own marketing and editorial material.",
    permitted: [
      "Website, social and digital campaigns for one organisation",
      "Print advertising and editorial placements",
      "Internal and client-facing presentations",
    ],
    notPermitted: ["Packaging or merchandise", "Sub-licensing to other organisations"],
  },
  {
    id: "extended",
    name: "Extended",
    price: "from kr 4 500",
    summary: "For wide distribution, including physical products where the image is part of the goods.",
    permitted: [
      "Packaging, merchandise and product surfaces",
      "Worldwide territory across all media",
      "Unlimited print run within the agreed term",
    ],
    notPermitted: ["Exclusive rights", "Resale of the image file itself as stock"],
  },
  {
    id: "custom",
    name: "Custom & Exclusive",
    price: "On request",
    summary: "For exclusivity, buy-outs, archive removal or commissioned capture. Terms drafted per project.",
    permitted: [
      "Category or full exclusivity",
      "Archive removal on request",
      "Commissioned work to the same archival standard",
    ],
    notPermitted: ["Nothing is fixed in advance — scope is agreed in writing"],
  },
];

export const deliveryInfo = [
  {
    term: "File formats",
    detail: "High-resolution TIFF or JPEG. Colour space agreed with you before delivery.",
  },
  {
    term: "Delivery method",
    detail: "Download link issued after the licence is signed. Delivery timing confirmed per request.",
  },
  {
    term: "Licence document",
    detail:
      "A signed PDF naming the catalogue number, the licensed scope and the checksum of the delivered file.",
  },
  {
    term: "Provenance sheet",
    detail:
      "Capture record and RAW checksum supplied with the licence once the original has been archived.",
  },
];

export const orderingSteps = [
  {
    index: "01",
    title: "Choose an image",
    body: "Open the plate you need and check its catalogue number, provenance panel and capture record.",
  },
  {
    index: "02",
    title: "Choose a licence and request terms",
    body: "Pick the scope that matches your use and send the request. Custom scopes are agreed in writing.",
  },
  {
    index: "03",
    title: "Receive invoice, licence and file",
    body: "Once terms are approved you receive the invoice, the signed licence and the delivery file.",
  },
];

export const faqs = [
  {
    q: "What does “verified human photography” mean here?",
    a: "It means a plate is only listed as verified when it was made by a person with a physical camera, the RAW original is held on file, and the licence is issued by the photographer who pressed the shutter. Records that do not yet meet that standard are marked as awaiting a verified original.",
  },
  {
    q: "Can I see proof for a specific image?",
    a: "You can request the provenance documentation for any catalogue number before licensing. Where a capture record or RAW checksum has not been supplied yet, the detail page says so rather than showing a value.",
  },
  {
    q: "Do you use generated or synthetic imagery?",
    a: "Not in the archive. The images currently shown on this site are development placeholders and are labelled as such; they are not part of the verified archive.",
  },
  {
    q: "Which licence do I need?",
    a: "Personal covers private prints. Commercial covers marketing for one organisation. Extended covers packaging and wide distribution. If none of those fit, a custom or exclusive agreement is drafted for you.",
  },
  {
    q: "How is the licence delivered?",
    a: "As a signed PDF referencing the catalogue number, the licensed scope and the file checksum, together with the delivery files in the agreed resolution and colour space.",
  },
  {
    q: "Can I license print and digital together?",
    a: "Yes. Scopes are combined in a single agreement so you hold one document per project rather than several overlapping licences.",
  },
];
