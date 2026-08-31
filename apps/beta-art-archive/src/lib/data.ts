// All copy in this file is taken verbatim from the user's paste of the live
// https://beta-art.com/ pages (root, /categories, FAQ reference doc,
// /request-a-shoot, cart) on 2026-08-30, except where marked "sourced from
// static prototype" — the per-plate `category` tag is not visible in the
// flattened text of the live page and is reused from the earlier "BETA ART
// Privat" static prototype (docs/proje-arsivi.md madde 4), which this
// session's own analysis found matches the live root page almost verbatim
// (docs/beta-art/privat-icerik-analizi.md).

export type PlateCategory = "landscape" | "city" | "portrait";
export type PlateStatus = "available" | "pending";

export interface Plate {
  id: string;
  accession: string;
  title: string;
  category: PlateCategory; // sourced from static prototype, see header note
  status: PlateStatus;
  detail: string;
  swatch: string;
  // Added 30.08.2026 for the multi-photographer submission feature (see
  // pages/Sell.tsx) — every plate now shows who shot it, as the user
  // required ("HER FOTOGRAFIN KIM TARAFINDAN NERDE CEKILDIGI BELLI
  // OLUCAK"). The real beta-art.com text never names its photographer
  // (bio is first-person, unnamed) — no personal name is verified, so the
  // original 12 plates carry the brand name "Beta Art" rather than an
  // invented one. Future verified submissions would show the submitter's
  // real name here.
  photographer: string;
}

export const plates: Plate[] = [
  { id: "first-light", accession: "2026.0142", title: "First Light", category: "landscape", status: "pending", detail: "Capture details to be supplied", swatch: "from-slate-300 via-stone-300 to-neutral-700", photographer: "Beta Art" },
  { id: "into-the-pines", accession: "2026.0143", title: "Into the Pines", category: "landscape", status: "pending", detail: "October 2025", swatch: "from-amber-800 via-amber-600 to-amber-200", photographer: "Beta Art" },
  { id: "sea-of-fog", accession: "2026.0144", title: "Sea of Fog", category: "landscape", status: "pending", detail: "Ventura, CA · July 2019", swatch: "from-stone-200 via-stone-300 to-stone-500", photographer: "Beta Art" },
  { id: "still-water", accession: "2026.0145", title: "Still Water", category: "landscape", status: "pending", detail: "Jotunheimen", swatch: "from-slate-900 via-slate-700 to-slate-400", photographer: "Beta Art" },
  { id: "palm", accession: "2026.0146", title: "PALM", category: "city", status: "pending", detail: "Ventura, CA · July 2019", swatch: "from-amber-900 via-amber-700 to-amber-300", photographer: "Beta Art" },
  { id: "blue-hour-grid", accession: "2026.0147", title: "Blue Hour Grid", category: "city", status: "pending", detail: "Chicago, US", swatch: "from-amber-700 via-amber-500 to-amber-200", photographer: "Beta Art" },
  { id: "night-crossing", accession: "2026.0148", title: "Night Crossing", category: "city", status: "pending", detail: "Singapore", swatch: "from-amber-300 via-amber-700 to-neutral-950", photographer: "Beta Art" },
  { id: "golden-hour", accession: "2026.0149", title: "Golden Hour", category: "landscape", status: "pending", detail: "Location to be supplied", swatch: "from-slate-300 via-slate-100 to-slate-500", photographer: "Beta Art" },
  { id: "portrait-in-amber", accession: "2026.0150", title: "Portrait in Amber", category: "portrait", status: "available", detail: "Studio, Oslo · release on file", swatch: "from-emerald-800 via-stone-400 to-emerald-950", photographer: "Beta Art" },
  { id: "the-maker", accession: "2026.0151", title: "The Maker", category: "portrait", status: "available", detail: "Norway · release on file", swatch: "from-slate-950 via-teal-800 to-emerald-500", photographer: "Beta Art" },
  { id: "slow-morning", accession: "2026.0152", title: "Slow Morning", category: "landscape", status: "pending", detail: "August 2025", swatch: "from-slate-950 via-indigo-900 to-stone-300", photographer: "Beta Art" },
  { id: "low-tide", accession: "2026.0153", title: "Low Tide", category: "landscape", status: "pending", detail: "December 2025", swatch: "from-stone-100 via-stone-300 to-stone-500", photographer: "Beta Art" },
];

export interface VerificationMethod {
  numeral: string;
  title: string;
  body: string;
}

export const verificationMethods: VerificationMethod[] = [
  { numeral: "I", title: "The RAW original is archived.", body: "Every plate begins as a RAW file from a real camera. The originals are stored in an offline archive, available for inspection on request." },
  { numeral: "II", title: "The capture record travels with the image.", body: "Camera, lens, exposure, place and date accompany each photograph. Where the equipment supports it, C2PA Content Credentials are embedded at capture." },
  { numeral: "III", title: "The license is signed by the maker.", body: "You license directly from the photographer. Each order arrives with a written license, a proper invoice, and a numbered certificate — no intermediaries." },
];

export interface Exhibition {
  tag: "Upcoming" | "Planned";
  when: string;
  where: string;
  title: string;
  body: string;
}

export const exhibitions: Exhibition[] = [
  { tag: "Upcoming", when: "Autumn 2026", where: "Oslo, Norway", title: "Volume I — Opening Exhibition", body: "The first public showing of the Beta Art archive. Twelve original prints, each accompanied by its capture record and provenance certificate. Limited attendance." },
  { tag: "Planned", when: "Winter 2026", where: "To be announced", title: "Print & Provenance", body: "A group exhibition exploring the relationship between photographic provenance and print. Beta Art participates alongside selected photographers working with verified originals." },
  { tag: "Planned", when: "Spring 2027", where: "By invitation", title: "Private Viewing — Volume II Preview", body: "An intimate preview of the second volume of the Beta Art archive, available exclusively to existing licence holders and registered collectors." },
];

export interface LicenceTier {
  name: string;
  price: string;
  desc: string;
  bullets: string[];
  cta: string;
}

export const licenceTiers: LicenceTier[] = [
  { name: "Personal", price: "from kr 190", desc: "For private, non-commercial use.", bullets: ["Personal projects", "Private digital use", "Non-commercial use"], cta: "Request licence" },
  { name: "Commercial", price: "Price on request", desc: "For businesses, editorial projects and marketing.", bullets: ["Websites", "Business social media", "Advertising and editorial"], cta: "Request licence" },
  { name: "Extended", price: "Price on request", desc: "For broader commercial distribution.", bullets: ["Large campaigns", "Packaging", "Extended distribution"], cta: "Request licence" },
  { name: "Custom & Exclusive", price: "Price on request", desc: "Custom licensing or exclusive rights.", bullets: ["Exclusivity", "Custom agreements", "Commissioned photography"], cta: "Contact photographer" },
];

export type FaqCategory = "About the photographs" | "Licenses and use" | "Ordering and delivery" | "Payment and refunds";

export interface FaqItem {
  category: FaqCategory;
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  { category: "About the photographs", q: "Do you use AI?", a: "No. Every photograph on this site is an original image captured with a physical camera. Nothing is generated, composited or enhanced by AI. The RAW files are archived and can be produced on request. That's the whole point of BETA ART." },
  { category: "About the photographs", q: "How does 'Human Verified' work?", a: "Every photograph is shipped with its capture record — camera, lens, exposure, location, date. The original RAW file is kept in a permanent archive. If anyone questions whether a photograph is genuine, I can produce the RAW original, the EXIF data, and, where the camera supports it, C2PA Content Credentials." },
  { category: "About the photographs", q: "Where are the photographs taken?", a: "Primarily in Norway and the Nordics, with some international work. Each photograph's location is stated on its page." },
  { category: "About the photographs", q: "Can I request a specific photograph or custom shoot?", a: "Yes. Contact me at hallo@beta-art.com with your brief and timing." },
  { category: "Licenses and use", q: "Which license do I need?", a: "Personal — for private projects, gifts, personal websites. Commercial — for one business, on marketing, web, social, print up to 5,000 copies. Extended — for unlimited print, products for resale, national campaigns. If you're unsure, email me before you buy — I'd rather help you pick the right tier than deal with it after." },
  { category: "Licenses and use", q: "Can I use the photograph on social media for my business?", a: "Yes, with a Commercial license or higher." },
  { category: "Licenses and use", q: "Can I edit or crop the photograph?", a: "Yes, for design purposes (crop, colour adjustment, overlay text). You cannot use it as training data for AI, present it as your own work, or make it the primary sellable element of a product without an Extended license." },
  { category: "Licenses and use", q: "Can I use the photograph for AI training?", a: "No. Every license explicitly excludes use in training generative-AI models." },
  { category: "Licenses and use", q: "Is the license exclusive?", a: "No, unless you specifically buy an Exclusive license (contact me for a quote). Standard licenses are non-exclusive — the same photograph may be licensed to other buyers." },
  { category: "Licenses and use", q: "Can I transfer the license to a client?", a: "No — the license is granted to the entity named on the invoice. Agencies buying on behalf of a client should either use the Extended License (which permits one client sublicense) or purchase a separate license per client." },
  { category: "Ordering and delivery", q: "How do I receive the file?", a: "Immediately after payment, you'll get an email with a download link (valid 72 hours) and a PDF license certificate. The file is high-resolution, sRGB, JPEG or TIFF on request." },
  { category: "Ordering and delivery", q: "Do I get an invoice?", a: "Yes — a proper Norwegian invoice with organisation number and VAT (where applicable) is sent by email." },
  { category: "Ordering and delivery", q: "Do you deliver internationally?", a: "Yes. Delivery is digital, so location doesn't matter." },
  { category: "Ordering and delivery", q: "What if the download link expires?", a: "Email me at hallo@beta-art.com with your order number and I'll send a fresh link." },
  { category: "Payment and refunds", q: "Can I get a refund?", a: "Because photographs are delivered digitally and you keep the file, refunds are limited to technical delivery failures or duplicate charges. See the License Terms for details." },
  { category: "Payment and refunds", q: "What about the 14-day withdrawal right?", a: "Under Norwegian law you have a 14-day right to withdraw digital purchases — unless you consent to receive the file immediately, in which case you waive that right. You will be asked to tick a box at checkout." },
];

export const faqCategories: FaqCategory[] = ["About the photographs", "Licenses and use", "Ordering and delivery", "Payment and refunds"];

export interface CategoryEntry {
  n: number;
  name: string;
  tag: string;
  body: string;
}

export interface CategorySection {
  title: string;
  meta: string;
  intro: string;
  entries: CategoryEntry[];
}

export const categorySections: CategorySection[] = [
  {
    title: "Global Categories",
    meta: "16 categories",
    intro: "The full range of subjects that drive licensing across every industry — from advertising to editorial, from healthcare to hospitality.",
    entries: [
      { n: 1, name: "People", tag: "Highest demand", body: "Real faces, honest expressions, authentic human moments. The most searched category across every industry — from advertising to editorial." },
      { n: 2, name: "Business", tag: "High demand", body: "Modern workplaces, collaborative teams, and technology in action. Built for brands that need professional imagery without the staged look." },
      { n: 3, name: "Nature", tag: "High demand", body: "Landscapes, wildlife, and the natural world in every season. One of the highest-earning categories across all major photo platforms." },
      { n: 4, name: "Lifestyle", tag: "High demand", body: "Everyday life captured without filters or formulas. The imagery brands reach for when they want to feel real." },
      { n: 5, name: "Food & Drink", tag: "High demand", body: "From raw ingredients to finished dishes — restaurants, health food, and everything in between. High demand from hospitality, retail, and media." },
      { n: 6, name: "Travel", tag: "Seasonal peak", body: "Cities, destinations, and cultural moments worth remembering. Consistently the top search category every summer." },
      { n: 7, name: "Health & Wellness", tag: "Fast growing", body: "Fitness, mindfulness, and the full spectrum of wellbeing. Fast-growing demand from healthcare, apps, and consumer brands." },
      { n: 8, name: "Family", tag: "Steady demand", body: "Multigenerational moments, relationships, and everyday connection. Trusted imagery for brands that speak to real people." },
      { n: 9, name: "Sustainability", tag: "Strong growth", body: "Green economy, environmental action, and conscious living. One of the strongest growth categories heading into 2025–2026." },
      { n: 10, name: "Architecture", tag: "Steady demand", body: "Buildings, interiors, and urban environments — from heritage structures to contemporary design." },
      { n: 11, name: "Fashion & Style", tag: "High demand", body: "Clothing, accessories, and personal style captured with editorial precision. High demand from e-commerce, magazines, and lifestyle brands looking for imagery that sells." },
      { n: 12, name: "Education & Children", tag: "Steady demand", body: "Learning environments, curious minds, and childhood in motion. Consistently in demand from schools, publishers, apps, and family-focused brands." },
      { n: 13, name: "Sports & Activity", tag: "Fast growing", body: "From competitive athletics to everyday movement — running, climbing, team sports, and outdoor adventure. One of the fastest-licensing categories in digital media." },
      { n: 14, name: "Art & Culture", tag: "Steady demand", body: "Galleries, performances, street art, and cultural events. Essential imagery for museums, media, tourism boards, and creative industries." },
      { n: 15, name: "Technology & AI", tag: "Top 3 fastest growing", body: "Screens, devices, data, and the human relationship with technology. Among the top 3 fastest-growing search categories heading into 2026." },
      { n: 16, name: "Real Estate & Interiors", tag: "High demand", body: "Homes, offices, and designed spaces that make people stop scrolling. High commercial value for agencies, developers, architects, and interior brands." },
    ],
  },
  {
    title: "Norway — Exclusive to Beta Art",
    meta: "5 categories · Verified · Exclusive",
    intro: "Authentic Norwegian imagery shot and verified by photographers who know this land. No international stock library can replicate these.",
    entries: [
      { n: 17, name: "Norwegian Nature", tag: "Exclusive", body: "Fjords, mountains, northern lights, and four dramatic seasons. Authentic Norwegian landscapes — shot and verified by photographers who know this land." },
      { n: 18, name: "Norwegian Cities", tag: "Exclusive", body: "Oslo, Bergen, Tromsø and beyond — captured as locals see them, not as postcards. The imagery Norwegian businesses actually need." },
      { n: 19, name: "Local Business", tag: "Exclusive", body: "Shops, craftspeople, restaurants, and the faces behind them. Real Norwegian businesses documented with care and verified authenticity." },
      { n: 20, name: "Norwegian Work Life", tag: "Exclusive", body: "Fisheries, offshore, technology, and the industries that define Norway's economy. Professional imagery that reflects how Norwegians actually work." },
      { n: 21, name: "Seasons & Holidays", tag: "Exclusive", body: "17. mai, Christmas, Nordic summer, and the moments in between. Cultural imagery that no international stock library can replicate." },
    ],
  },
  {
    title: "Norwegian Industries",
    meta: "5 categories · High demand",
    intro: "Sector-specific imagery for Norway's key industries — built for procurement teams, communications departments, and agencies working in these fields.",
    entries: [
      { n: 22, name: "Maritime & Offshore", tag: "High demand", body: "Ships, rigs, harbours, and the people who work at sea. Norway's most internationally recognised industry — and one of the least-served by stock libraries." },
      { n: 23, name: "Energy & Renewables", tag: "Fast growing", body: "Wind, hydro, solar, and the infrastructure of Norway's energy transition. Critical imagery for utilities, investors, and sustainability reports." },
      { n: 24, name: "Aquaculture & Seafood", tag: "High demand", body: "Salmon farming, fishing, processing, and the full supply chain. Norway exports more seafood than almost any country on earth — the imagery should match." },
      { n: 25, name: "Healthcare & Research", tag: "Steady demand", body: "Hospitals, laboratories, and the people driving Norwegian medical innovation. In demand from pharma, public health, and research institutions." },
      { n: 26, name: "Tourism & Hospitality", tag: "Seasonal peak", body: "Hotels, restaurants, and the experiences that bring visitors to Norway. Essential for destination marketing, travel media, and hospitality brands." },
    ],
  },
  {
    title: "Editorial & Media",
    meta: "5 categories",
    intro: "Categories built for publishers, journalists, and content teams who need imagery that tells a story without staging one.",
    entries: [
      { n: 27, name: "News & Current Events", tag: "Editorial only", body: "Protests, elections, public gatherings, and the visual record of what is happening now. Editorial use only — not available for commercial licensing." },
      { n: 28, name: "Portraits & Profiles", tag: "Steady demand", body: "Individual subjects photographed with intention — for profiles, interviews, and editorial features. Environmental and studio portraits." },
      { n: 29, name: "Documentary", tag: "Steady demand", body: "Long-form visual storytelling across social, environmental, and human subjects. The category for work that goes beyond the single frame." },
      { n: 30, name: "Science & Environment", tag: "Fast growing", body: "Climate, ecology, research, and the natural systems that sustain life. Growing demand from academic publishers, NGOs, and environmental media." },
      { n: 31, name: "Politics & Society", tag: "Editorial only", body: "Public life, civic spaces, and the visual language of democracy. Editorial use — for news organisations, think tanks, and public affairs." },
    ],
  },
  {
    title: "Specialised & Emerging",
    meta: "4 categories · New",
    intro: "Categories responding to where demand is moving — new subjects, new formats, and the gaps that major stock libraries have not yet filled.",
    entries: [
      { n: 32, name: "Accessibility & Inclusion", tag: "Fast growing", body: "Disability, neurodiversity, and the full range of human experience. One of the most under-served categories in stock photography — and one of the fastest growing." },
      { n: 33, name: "Ageing & Later Life", tag: "High demand", body: "Active older adults, intergenerational relationships, and the realities of ageing. High demand from healthcare, financial services, and public sector communications." },
      { n: 34, name: "Mental Health", tag: "Fast growing", body: "Honest, non-stigmatising imagery of psychological wellbeing and struggle. Increasingly required by healthcare providers, apps, and media — and rarely done well." },
      { n: 35, name: "AI & Human Interaction", tag: "Top 3 fastest growing", body: "The relationship between people and intelligent systems — not the clichéd robot imagery, but the real, everyday experience of living and working with AI." },
    ],
  },
];
