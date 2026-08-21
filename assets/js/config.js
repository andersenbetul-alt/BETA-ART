/* =============================================================================
   NAVIAR CONSULT — site configuration
   Everything that changes between environments or business decisions lives here.
   No secrets in this file: it ships to the browser.
   ========================================================================== */
window.NAVIAR_CONFIG = {

  /* --------------------------------------------------------------- company */
  company: {
    legalName: 'NAVIAR CONSULT AS',
    brand: 'NAVIAR',
    descriptor: 'CONSULTING',
    /* The address the site is published under. Used for canonical links, the
       sitemap and the Stripe return URLs. No trailing slash. */
    domain: 'naviarconsult.com',
    siteUrl: 'https://naviarconsult.com',
    orgNumber: '000 000 000',          // TODO: Brønnøysundregistrene org.nr
    email: 'post@naviarconsult.com',   // TODO: create the mailbox on the domain
    phone: '+47 000 00 000',           // TODO: real number
    phoneHref: '+4700000000',
    address: ['Gateadresse 1', '0000 Oslo, Norge'],
    hours: 'Man – fre, 09:00 – 16:00'
  },

  /* ------------------------------------------------------------- languages */
  /* Adding a language = add an entry here + assets/i18n/<code>.json          */
  languages: [
    { code: 'no', label: 'Norsk',      native: 'Norsk bokmål', dir: 'ltr' },
    { code: 'en', label: 'English',    native: 'English',      dir: 'ltr' },
    { code: 'tr', label: 'Türkçe',     native: 'Türkçe',       dir: 'ltr' },
    { code: 'ar', label: 'العربية',     native: 'Arabic',       dir: 'rtl' },
    { code: 'pl', label: 'Polski',     native: 'Polish',       dir: 'ltr' },
    { code: 'uk', label: 'Українська', native: 'Ukrainian',    dir: 'ltr' },
    { code: 'ru', label: 'Русский',    native: 'Russian',      dir: 'ltr' },
    { code: 'so', label: 'Soomaali',   native: 'Somali',       dir: 'ltr' },
    { code: 'lt', label: 'Lietuvių',   native: 'Lithuanian',   dir: 'ltr' },
    { code: 'ti', label: 'ትግርኛ',        native: 'Tigrinya',     dir: 'ltr' }
  ],
  defaultLang: 'no',

  /* ----------------------------------------------------------- key figures */
  /* Only verifiable facts. No invented client counts or success rates.       */
  stats: { languages: '10', areas: '9', reply: '24t', written: '100%' },

  /* -------------------------------------------------------- price catalogue
     Pilot catalogue from the NAVIAR System Blueprint v1.0 §12.1.
     `price` is the CUSTOMER TOTAL incl. 25% MVA — a consumer interface must
     always show the final total. `net` is the ex-MVA service fee that the
     commission (§12.3) is calculated from. `price: null` = quote only.
     type: 'meeting'  -> customer picks a time slot
           'delivery' -> no slot; delivered within `sla`
     ------------------------------------------------------------------------ */
  vatRate: 0.25,
  commissionRate: 0.20,          // pilot platform commission on the net fee
  currency: 'NOK',

  /* The low-risk catalogue. Every one of these is practical help: finding the
     right channel, preparing questions, writing a CV. None of it interprets a
     decision, judges a right, or touches health, tax, debt or residency — see
     docs/tjenestemodell.md §3 for the line and hva-vi-gjor.html for how it is
     put to the customer.

     Nothing here is bought directly. Every request starts as a free scope
     check; the price is agreed in writing and the payment link is sent by a
     person, afterwards. That is why there are no payment links below. */
  services: [
    { id: 'sjekk', code: '—',   price: 0,   net: 0,   minutes: 0,  type: 'delivery', group: 'advice', free: true, sla: '1 virkedag' },
    { id: 'v01',   code: 'V01', price: 590, net: 472, minutes: 0,  type: 'delivery', group: 'advice', sla: '2 virkedager' },
    { id: 'v02',   code: 'V02', price: 790, net: 632, minutes: 60, type: 'meeting',  group: 'advice' },
    /* `tolk: true` asks the customer which language they need. It does NOT mean
       official interpreting: a public body assesses and orders a qualified
       interpreter for its own meetings (tolkeloven). This is private, everyday
       conversation only, and the form says so. */
    { id: 'sprak', code: 'S',   price: null, net: null, minutes: 60, type: 'meeting', group: 'tolk', tolk: true }
  ],

  /* Surcharges (§12.2). Shown before purchase, never added afterwards. */
  surcharges: { express24h: 0.25, eveningWeekend: 0.25 },

  /* Languages offered for private language support — everyday conversations
     the customer has themselves. Not for meetings with a public body. */
  tolkLanguages: [
    'Arabisk', 'Dari', 'Engelsk', 'Fransk', 'Kurdisk (sorani)', 'Litauisk',
    'Pashto', 'Polsk', 'Russisk', 'Somali', 'Spansk', 'Swahili', 'Thai',
    'Tigrinja', 'Tyrkisk', 'Ukrainsk', 'Urdu', 'Vietnamesisk', 'Tegnspråk'
  ],

  /* -------------------------------------------------------------- booking */
  booking: {
    openHour: 9,            // first slot starts 09:00 (Europe/Oslo)
    closeHour: 16,          // last slot ends by 16:00
    slotMinutes: 30,        // grid granularity
    leadTimeHours: 24,      // no bookings inside the next 24 hours
    daysAhead: 21,          // how far the day strip runs
    workdays: [1, 2, 3, 4, 5],
    timezone: 'Europe/Oslo'
  },

  /* ---------------------------------------------------------- integrations */
  /* apiBase: '' -> demo mode (no backend). Set to e.g. 'https://api.naviarconsult.com'
     once server/ is deployed, and bookings + payments go live.               */
  apiBase: '',

  payments: {
    /* NAVIAR never holds client funds itself (Blueprint §12.4): collection,
       split and payout run through a licensed payment provider.             */
    card: true,                 // Stripe Checkout via the backend
    vipps: true,                // Vipps ePayment (backend, Norway)
    invoice: true,              // manual invoice / faktura
    /* Deliberately empty. The site does not sell anything directly: a payment
       link is written by a person, after the scope check, and sent to the one
       customer it belongs to. Putting a link here would put a buy button back
       on the page. */
    paymentLinks: {}
  },

  /* Where the form falls back to when there is no backend. */
  /* Falls back to company.email so the address exists in one place only. */
  fallbackMailto: null
};
