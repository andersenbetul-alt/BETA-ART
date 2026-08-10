/**
 * Beta Art — sample collection data.
 *
 * REPLACEMENT POINT: swap `src` with the real photograph, and update
 * title / catalogue / location / date / price with the archive record.
 * Placeholder imagery lives in src/assets/plate-0*.jpg.
 */
import plate01 from "@/assets/plate-01.jpg";
import plate02 from "@/assets/plate-02.jpg";
import plate03 from "@/assets/plate-03.jpg";
import plate04 from "@/assets/plate-04.jpg";
import plate05 from "@/assets/plate-05.jpg";
import plate06 from "@/assets/plate-06.jpg";

export type Plate = {
  title: string;
  catalogue: string;
  location?: string;
  date?: string;
  price: number;
  currency: string;
  src: string;
  alt: string;
};

export const CURRENCY = "NOK";
export const FROM_PRICE = 190;

export const plates: Plate[] = [
  {
    title: "First Light",
    catalogue: "BA-001",
    location: "Jæren, Norway",
    date: "2023",
    price: 190,
    currency: CURRENCY,
    src: plate01,
    alt: "Placeholder photograph: pine ridge emerging from dawn mist",
  },
  {
    title: "Into the Pines",
    catalogue: "BA-002",
    location: "Nordmarka, Norway",
    date: "2023",
    price: 190,
    currency: CURRENCY,
    src: plate01,
    alt: "Placeholder photograph: dense pine forest under low fog",
  },
  {
    title: "Sea of Fog",
    catalogue: "BA-003",
    location: "Runde, Norway",
    date: "2022",
    price: 190,
    currency: CURRENCY,
    src: plate02,
    alt: "Placeholder photograph: coastal cliffs disappearing into sea fog",
  },
  {
    title: "Still Water",
    catalogue: "BA-004",
    location: "Tyrifjorden, Norway",
    date: "2024",
    price: 190,
    currency: CURRENCY,
    src: plate03,
    alt: "Placeholder photograph: mirror-still lake at blue hour",
  },
  {
    title: "PALM",
    catalogue: "BA-005",
    location: "Lisbon, Portugal",
    date: "2022",
    price: 190,
    currency: CURRENCY,
    src: plate04,
    alt: "Placeholder photograph: palm frond and its shadow on a pale wall",
  },
  {
    title: "Blue Hour Grid",
    catalogue: "BA-006",
    location: "Oslo, Norway",
    date: "2024",
    price: 190,
    currency: CURRENCY,
    src: plate03,
    alt: "Placeholder photograph: city surfaces in blue hour light",
  },
  {
    title: "Night Crossing",
    catalogue: "BA-007",
    location: "Bergen, Norway",
    date: "2023",
    price: 190,
    currency: CURRENCY,
    src: plate05,
    alt: "Placeholder photograph: wet crossing at night with reflected street light",
  },
  {
    title: "Golden Hour",
    catalogue: "BA-008",
    location: "Lofoten, Norway",
    date: "2021",
    price: 190,
    currency: CURRENCY,
    src: plate06,
    alt: "Placeholder photograph: warm low sunlight across an interior wall",
  },
  {
    title: "Portrait in Amber",
    catalogue: "BA-009",
    location: "Studio, Oslo",
    date: "2024",
    price: 240,
    currency: CURRENCY,
    src: plate06,
    alt: "Placeholder photograph: profile portrait in amber window light",
  },
  {
    title: "The Maker",
    catalogue: "BA-010",
    location: "Studio, Oslo",
    date: "2024",
    price: 240,
    currency: CURRENCY,
    src: plate05,
    alt: "Placeholder photograph: a maker at work in low light",
  },
  {
    title: "Slow Morning",
    catalogue: "BA-011",
    location: "Copenhagen, Denmark",
    date: "2023",
    price: 190,
    currency: CURRENCY,
    src: plate04,
    alt: "Placeholder photograph: quiet morning light on a plain interior",
  },
  {
    title: "Low Tide",
    catalogue: "BA-012",
    location: "Sola, Norway",
    date: "2022",
    price: 190,
    currency: CURRENCY,
    src: plate02,
    alt: "Placeholder photograph: shoreline at low tide under a pale sky",
  },
];

export const licenses = [
  {
    name: "Personal",
    price: "from kr 190",
    summary: "Private prints, personal walls, non-commercial digital use.",
    points: ["Single image, single use", "Print up to 70 × 100 cm", "Perpetual, non-transferable"],
  },
  {
    name: "Commercial",
    price: "from kr 1 200",
    summary: "Editorial, marketing and product surfaces for one organisation.",
    points: ["Web, social and print campaigns", "One brand, unlimited placements", "Two-year term, renewable"],
  },
  {
    name: "Extended",
    price: "from kr 4 500",
    summary: "Broad distribution, packaging and resale-adjacent products.",
    points: ["Packaging and merchandise", "Worldwide territory", "Perpetual term"],
  },
  {
    name: "Custom & Exclusive",
    price: "On request",
    summary: "Sector exclusivity, buy-outs and commissioned capture.",
    points: ["Category or full exclusivity", "Archive removal on request", "Contract drafted per project"],
  },
];

export const faqs = [
  {
    q: "What does “verified human photography” mean here?",
    a: "Every plate in the archive was made by a person with a physical camera. The RAW original is kept on file, the capture record is preserved, and the licence is issued by the photographer who pressed the shutter.",
  },
  {
    q: "Can I see proof for a specific image?",
    a: "Yes. Ask for the provenance sheet of any catalogue number and you receive the capture record, the RAW checksum and the chain of custody for that file.",
  },
  {
    q: "Do you ever use generated or synthetic imagery?",
    a: "No. Nothing generated enters the archive. If an image cannot be traced back to a RAW original and a documented capture, it is not listed.",
  },
  {
    q: "Which licence do I need?",
    a: "Personal covers private prints. Commercial covers marketing for one organisation. Extended covers packaging and wide distribution. If none of those fit, a custom or exclusive agreement is drafted for you.",
  },
  {
    q: "How is the licence delivered?",
    a: "As a signed PDF referencing the catalogue number, the licensed scope and the file checksum, together with the delivery files in your requested resolution and colour space.",
  },
  {
    q: "Can I license print and digital together?",
    a: "Yes. Scopes are combined in a single agreement so you hold one document per project rather than several overlapping licences.",
  },
];
