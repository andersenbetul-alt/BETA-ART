import type { Locale } from './i18n';

export type CategoryId = 'hjem' | 'klaer' | 'skjonnhet' | 'gaver';

export const categories: { id: CategoryId; name: Record<Locale, string> }[] = [
  { id: 'hjem',       name: { no: 'Hjem & interiør', en: 'Home & interior', tr: 'Ev & dekorasyon' } },
  { id: 'klaer',      name: { no: 'Klær & tilbehør', en: 'Clothing & accessories', tr: 'Giyim & aksesuar' } },
  { id: 'skjonnhet',  name: { no: 'Skjønnhet',       en: 'Beauty',           tr: 'Kozmetik & bakım' } },
  { id: 'gaver',      name: { no: 'Gaver',           en: 'Gifts',            tr: 'Hediyelik' } },
];

export type Product = {
  slug: string;
  sku: string;
  category: CategoryId;
  /** Pazar başına el ile yuvarlanmış fiyat — otomatik kur çevirimi yok. */
  price: Record<Locale, number>;
  /** Depoya giriş maliyeti (NOK) — birim ekonomi hesabı için, vitrinde gösterilmez. */
  cogsNOK: number;
  stock: number;
  hsCode: string;
  originCountry: string;
  material: Record<Locale, string>;
  dimensions: string;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  bullets: Record<Locale, string[]>;
  /** Placeholder görsel rengi — gerçek fotoğraflar public/ altına konacak. */
  swatch: string;
};

export const products: Product[] = [
  {
    slug: 'stentoy-kaffekopp',
    sku: 'CB-HOME-CER-001',
    category: 'hjem',
    price: { no: 349, en: 34, tr: 1190 },
    cogsNOK: 96,
    stock: 42,
    hsCode: '6912.00',
    originCountry: 'TR',
    dimensions: 'Ø 8,5 × 9 cm · 280 ml',
    material: { no: 'Steintøy, blyfri glasur', en: 'Stoneware, lead-free glaze', tr: 'Stoneware, kurşunsuz sır' },
    name: {
      no: 'Stentøy kaffekopp – matt sand',
      en: 'Stoneware coffee cup – matte sand',
      tr: 'Stoneware kahve fincanı – mat kum',
    },
    summary: {
      no: 'En kopp som tåler hverdagen og ser bedre ut for hver vask.',
      en: 'A cup built for everyday use that looks better with every wash.',
      tr: 'Her gün kullanılan, her yıkamada daha güzelleşen bir fincan.',
    },
    bullets: {
      no: ['Håndlaget i små serier', 'Tåler oppvaskmaskin og mikrobølgeovn', 'Stabler uten å ripe'],
      en: ['Handmade in small batches', 'Dishwasher and microwave safe', 'Stacks without scratching'],
      tr: ['Küçük partiler hâlinde el yapımı', 'Bulaşık makinesi ve mikrodalga uyumlu', 'Çizmeden üst üste dizilir'],
    },
    swatch: '#D8CBB8',
  },
  {
    slug: 'lin-servietter-4pk',
    sku: 'CB-HOME-TEX-002',
    category: 'hjem',
    price: { no: 499, en: 49, tr: 1690 },
    cogsNOK: 138,
    stock: 25,
    hsCode: '6302.51',
    originCountry: 'TR',
    dimensions: '45 × 45 cm · 4 stk',
    material: { no: '100 % vasket lin', en: '100% washed linen', tr: '%100 yıkanmış keten' },
    name: {
      no: 'Linservietter – 4 stk',
      en: 'Linen napkins – set of 4',
      tr: 'Keten peçete – 4’lü set',
    },
    summary: {
      no: 'Forvasket lin som blir mykere for hver gang.',
      en: 'Pre-washed linen that softens with every wash.',
      tr: 'Her yıkamada yumuşayan ön yıkamalı keten.',
    },
    bullets: {
      no: ['OEKO-TEX sertifisert garn', 'Krever ikke stryking', 'Vevd i Tyrkia'],
      en: ['OEKO-TEX certified yarn', 'No ironing needed', 'Woven in Türkiye'],
      tr: ['OEKO-TEX sertifikalı iplik', 'Ütü gerektirmez', 'Türkiye’de dokundu'],
    },
    swatch: '#C9C2B4',
  },
  {
    slug: 'merinoull-skjerf',
    sku: 'CB-CLTH-WOL-003',
    category: 'klaer',
    price: { no: 899, en: 89, tr: 2990 },
    cogsNOK: 265,
    stock: 18,
    hsCode: '6214.20',
    originCountry: 'TR',
    dimensions: '190 × 35 cm',
    material: { no: '100 % merinoull (19,5 mikron)', en: '100% merino wool (19.5 micron)', tr: '%100 merinos yünü (19,5 mikron)' },
    name: {
      no: 'Merinoullskjerf – mose',
      en: 'Merino wool scarf – moss',
      tr: 'Merinos yün atkı – yosun',
    },
    summary: {
      no: 'Varm nok for norsk vinter, tynn nok for innendørs.',
      en: 'Warm enough for a Norwegian winter, thin enough to keep on indoors.',
      tr: 'Norveç kışına yetecek kadar sıcak, içeride çıkarmaya gerek bırakmayacak kadar ince.',
    },
    bullets: {
      no: ['Mulesing-fri ull', 'Klør ikke mot huden', 'Håndvask kaldt'],
      en: ['Mulesing-free wool', 'Non-itch against skin', 'Cold hand wash'],
      tr: ['Mulesing içermeyen yün', 'Cildi kaşındırmaz', 'Soğuk suda elde yıkama'],
    },
    swatch: '#3F5B4C',
  },
  {
    slug: 'skinn-kortholder',
    sku: 'CB-CLTH-LEA-004',
    category: 'klaer',
    price: { no: 649, en: 64, tr: 2190 },
    cogsNOK: 178,
    stock: 33,
    hsCode: '4202.31',
    originCountry: 'TR',
    dimensions: '10 × 7,5 × 0,8 cm',
    material: { no: 'Vegetabilsk garvet skinn', en: 'Vegetable-tanned leather', tr: 'Bitkisel tabaklanmış deri' },
    name: {
      no: 'Kortholder i skinn – leire',
      en: 'Leather card holder – clay',
      tr: 'Deri kartlık – kil',
    },
    summary: {
      no: 'Fire kort, noen sedler, ingenting mer.',
      en: 'Four cards, a few notes, nothing more.',
      tr: 'Dört kart, birkaç banknot, fazlası yok.',
    },
    bullets: {
      no: ['Får patina med bruk', 'RFID-beskyttet lomme', 'Sydd for hånd'],
      en: ['Develops patina with use', 'RFID-protected pocket', 'Hand-stitched'],
      tr: ['Kullandıkça patina yapar', 'RFID korumalı bölme', 'El dikişi'],
    },
    swatch: '#C4714B',
  },
  {
    slug: 'ansiktsolje-rose',
    sku: 'CB-BEAU-OIL-005',
    category: 'skjonnhet',
    price: { no: 449, en: 44, tr: 1490 },
    cogsNOK: 121,
    stock: 51,
    hsCode: '3304.99',
    originCountry: 'TR',
    dimensions: '30 ml',
    material: { no: 'Kaldpresset rosenolje, jojoba', en: 'Cold-pressed rose oil, jojoba', tr: 'Soğuk sıkım gül yağı, jojoba' },
    name: {
      no: 'Ansiktsolje – damascener-rose',
      en: 'Face oil – damask rose',
      tr: 'Yüz yağı – Isparta gülü',
    },
    summary: {
      no: 'Fem ingredienser. Ingen parfyme, ingen fyllstoff.',
      en: 'Five ingredients. No fragrance, no fillers.',
      tr: 'Beş içerik. Parfüm yok, dolgu maddesi yok.',
    },
    bullets: {
      no: ['Isparta-roser, destillert i Tyrkia', 'Uten parfyme og alkohol', 'Dråpeteller i glass'],
      en: ['Isparta roses, distilled in Türkiye', 'Fragrance and alcohol free', 'Glass dropper'],
      tr: ['Isparta gülü, Türkiye’de damıtıldı', 'Parfüm ve alkol içermez', 'Cam damlalık'],
    },
    swatch: '#E3C8C4',
  },
  {
    slug: 'olivensape-sett',
    sku: 'CB-BEAU-SOA-006',
    category: 'skjonnhet',
    price: { no: 299, en: 29, tr: 990 },
    cogsNOK: 74,
    stock: 60,
    hsCode: '3401.11',
    originCountry: 'TR',
    dimensions: '3 × 120 g',
    material: { no: 'Olivenolje, laurbærolje', en: 'Olive oil, laurel oil', tr: 'Zeytinyağı, defne yağı' },
    name: {
      no: 'Olivensåpe – sett med 3',
      en: 'Olive soap – set of 3',
      tr: 'Zeytinyağlı sabun – 3’lü set',
    },
    summary: {
      no: 'Kokt, skåret og modnet i ni måneder.',
      en: 'Cooked, cut and cured for nine months.',
      tr: 'Kaynatıldı, kesildi, dokuz ay dinlendirildi.',
    },
    bullets: {
      no: ['Kun to ingredienser', 'Uten palmeolje', 'Papiremballasje, ingen plast'],
      en: ['Only two ingredients', 'Palm oil free', 'Paper packaging, no plastic'],
      tr: ['Sadece iki içerik', 'Palm yağı içermez', 'Kâğıt ambalaj, plastik yok'],
    },
    swatch: '#B7BFA8',
  },
  {
    slug: 'gaveeske-verten',
    sku: 'CB-GIFT-BOX-007',
    category: 'gaver',
    price: { no: 799, en: 79, tr: 2690 },
    cogsNOK: 232,
    stock: 14,
    hsCode: '9505.90',
    originCountry: 'TR',
    dimensions: '28 × 20 × 9 cm',
    material: { no: 'Blandet – se innhold', en: 'Mixed – see contents', tr: 'Karışık – içeriğe bakınız' },
    name: {
      no: 'Gaveeske «Verten»',
      en: 'Gift box “The Host”',
      tr: 'Hediye kutusu «Ev Sahibi»',
    },
    summary: {
      no: 'Kaffekopp, linserviett og olivensåpe i én eske.',
      en: 'Coffee cup, linen napkin and olive soap in one box.',
      tr: 'Kahve fincanı, keten peçete ve zeytinyağlı sabun tek kutuda.',
    },
    bullets: {
      no: ['Pakket for hånd med silkepapir', 'Personlig hilsen inkludert', 'Sendes direkte til mottaker'],
      en: ['Hand-packed with tissue paper', 'Personal note included', 'Ships directly to the recipient'],
      tr: ['Pelür kâğıtla elde paketlenir', 'Kişisel not dahil', 'Doğrudan alıcıya gönderilir'],
    },
    swatch: '#141A1F',
  },
  {
    slug: 'stearinlys-3pk',
    sku: 'CB-GIFT-CAN-008',
    category: 'gaver',
    price: { no: 249, en: 24, tr: 850 },
    cogsNOK: 58,
    stock: 0,
    hsCode: '3406.00',
    originCountry: 'TR',
    dimensions: '2,2 × 25 cm · 3 stk',
    material: { no: '100 % bivoks', en: '100% beeswax', tr: '%100 balmumu' },
    name: {
      no: 'Kronelys i bivoks – 3 stk',
      en: 'Beeswax taper candles – 3 pcs',
      tr: 'Balmumu ince mum – 3 adet',
    },
    summary: {
      no: 'Brenner rent i syv timer, uten sot.',
      en: 'Burns clean for seven hours, without soot.',
      tr: 'İs bırakmadan yedi saat temiz yanar.',
    },
    bullets: {
      no: ['Naturlig honningduft', 'Bomullsveke', 'Drypper ikke i stille rom'],
      en: ['Natural honey scent', 'Cotton wick', 'Drip-free in still air'],
      tr: ['Doğal bal kokusu', 'Pamuk fitil', 'Hava akımı olmayan ortamda damlamaz'],
    },
    swatch: '#EBD9A8',
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category?: CategoryId): Product[] {
  return category ? products.filter((p) => p.category === category) : products;
}

/** Ücretsiz kargo eşiği ve kargo ücreti — pazar bazlı (bkz. docs/07). */
export const shipping: Record<Locale, { fee: number; freeOver: number }> = {
  no: { fee: 79, freeOver: 799 },
  en: { fee: 17, freeOver: 199 },
  tr: { fee: 89, freeOver: 1500 },
};
