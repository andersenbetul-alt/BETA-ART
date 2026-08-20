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
    orgNumber: '000 000 000',          // TODO: Brønnøysundregistrene org.nr
    email: 'post@naviar.no',           // TODO: real address
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
  services: [
    { id: 'intro',  code: '—',   price: 0,    net: 0,    minutes: 15, type: 'meeting',  group: 'advice', free: true },
    { id: 'k01',    code: 'K01', price: 800,  net: 640,  minutes: 0,  type: 'delivery', group: 'advice', sla: '24–48t' },
    { id: 'k02',    code: 'K02', price: 1500, net: 1200, minutes: 45, type: 'meeting',  group: 'advice' },
    { id: 'h01',    code: 'H01', price: 3000, net: 2400, minutes: 60, type: 'meeting',  group: 'advice', sla: '2–4d' },
    { id: 'o01',    code: 'O01', price: 4500, net: 3600, minutes: 45, type: 'meeting',  group: 'advice', sla: '30d' },
    { id: 's01',    code: 'S01', price: 1500, net: 1200, minutes: 60, type: 'meeting',  group: 'advice', perHour: true },
    { id: 't30',    code: 'T30', price: 800,  net: 640,  minutes: 30, type: 'meeting',  group: 'tolk', tolk: true },
    { id: 't60',    code: 'T60', price: 1250, net: 1000, minutes: 60, type: 'meeting',  group: 'tolk', tolk: true },
    { id: 'tf',     code: 'TF',  price: null, net: null, minutes: 60, type: 'meeting',  group: 'tolk', tolk: true }
  ],

  /* Surcharges (§12.2). Shown before purchase, never added afterwards. */
  surcharges: { express24h: 0.25, eveningWeekend: 0.25 },

  /* Interpreter languages offered for NAVIAR Tolk bookings. */
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
  /* apiBase: '' -> demo mode (no backend). Set to e.g. 'https://api.naviar.no'
     once server/ is deployed, and bookings + payments go live.               */
  apiBase: '',

  payments: {
    /* NAVIAR never holds client funds itself (Blueprint §12.4): collection,
       split and payout run through a licensed payment provider.             */
    card: true,                 // Stripe Checkout via the backend
    vipps: true,                // Vipps ePayment (backend, Norway)
    invoice: true,              // manual invoice / faktura
    /* Fallback for pure static hosting: one Stripe Payment Link per service. */
    paymentLinks: {}
  },

  /* Where the form falls back to when there is no backend. */
  fallbackMailto: 'post@naviar.no'
};
