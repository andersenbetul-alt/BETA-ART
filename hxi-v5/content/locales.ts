export const siteUrl = 'https://hxi.no';

export type Locale = 'en' | 'no' | 'de' | 'fr' | 'es' | 'ar';

export const localeCodes: Locale[] = ['en', 'no', 'de', 'fr', 'es', 'ar'];

export function isLocale(s: string): s is Locale {
  return (localeCodes as string[]).includes(s);
}

export interface LocaleData {
  lang: string;
  direction: 'ltr' | 'rtl';
  hreflang: string;
  title: string;
  description: string;
  skip: string;
  nav: {
    music: string;
    catalog: string;
    about: string;
    stems: string;
    contact: string;
    listen: string;
  };
  hero: {
    kicker: string;
    tagline: string;
    desc: string;
    cta: string;
    ctaSecondary: string;
    signalTitle: string;
    signalNote: string;
  };
  marqueeItems: string[];
  latest: {
    eyebrow: string;
    heading: string;
    desc: string;
    meta: string;
    playerLabel: string;
    playerNote: string;
  };
  facts: Array<{ value: string; label: string }>;
  timeline: {
    eyebrow: string;
    heading: string;
    rows: Array<{ year: string; event: string }>;
  };
  releases: {
    eyebrow: string;
    heading: string;
    desc: string;
    items: Array<{ title: string; year: string; platform: string }>;
  };
  proof: {
    eyebrow: string;
    heading: string;
    items: Array<{ tag: string; heading: string; desc: string; link: string; linkLabel: string }>;
  };
  nordic: {
    eyebrow: string;
    heading: string;
    intro: string;
    impactH: string;
    impactP: string;
    identityEyebrow: string;
    identityH: string;
    identityP: string;
    coord: { label: string; value: string; lat: string; lon: string; alt: string };
  };
  creators: {
    eyebrow: string;
    heading: string;
    note: string;
    items: Array<{ name: string; role: string; url: string }>;
  };
  work: {
    eyebrow: string;
    heading: string;
    items: Array<{ tag: string; heading: string; desc: string; link: string; linkLabel: string }>;
  };
  frequency: {
    eyebrow: string;
    heading: string;
    intro: string;
    gatedNote: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    copy: string;
    cta: string;
    ctaSecondary: string;
  };
  footer: {
    copy: string;
    privacyLink: string;
    privacyStrip: string;
  };
  privacy: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    back: string;
    hostingH: string;
    hostingP: string;
    spotifyH: string;
    spotifyP: string;
    contactH: string;
    contactP: string;
  };
}

export const localeData: Record<Locale, LocaleData> = {
  en: {
    lang: 'en',
    direction: 'ltr',
    hreflang: 'en',
    title: 'HXI — Nordic Phonk',
    description: 'Norwegian phonk producer from Oslo. 43M+ Spotify streams. Signed to NCS.',
    skip: 'Skip to content',
    nav: {
      music: 'Music',
      catalog: 'Catalog',
      about: 'About',
      stems: 'Stems',
      contact: 'Contact',
      listen: 'Listen Now'
    },
    hero: {
      kicker: 'Oslo / Norway / Nordic Phonk',
      tagline: 'THE SAME SPEED — COLDER.',
      desc: 'Phonk built for the cold. Raw 808s, razor-hi-hats, and sub frequencies designed for maximum impact on any system.',
      cta: 'Stream on Spotify',
      ctaSecondary: 'Full Catalog',
      signalTitle: 'LIVE SIGNAL',
      signalNote: 'Monthly listeners · Spotify · Updated weekly'
    },
    marqueeItems: [
      'NCS SIGNED', 'OSLO NORWAY', '43M STREAMS', 'NORDIC PHONK',
      'DRIFT PHONK', 'DARK ENERGY', 'NCS SIGNED', 'OSLO NORWAY',
      '43M STREAMS', 'NORDIC PHONK', 'DRIFT PHONK', 'DARK ENERGY'
    ],
    latest: {
      eyebrow: 'LATEST RELEASE',
      heading: 'COLD\nFRONT',
      desc: 'Maximum 808 weight. Razor-sharp hi-hats tuned to the Oslo cold. The defining HXI sound — stripped to its core.',
      meta: 'NCS · 2024 · Phonk',
      playerLabel: 'STREAM',
      playerNote: 'Available on Spotify, Apple Music, YouTube Music and all major platforms.'
    },
    facts: [
      { value: '43M+', label: 'Spotify Streams' },
      { value: '30M+', label: 'YouTube Views' },
      { value: '2021', label: 'Founded' },
      { value: 'NCS', label: 'Label' }
    ],
    timeline: {
      eyebrow: 'TIMELINE',
      heading: 'FROM\nOSLO\nTO\nGLOBAL',
      rows: [
        { year: '2021', event: 'FIRST UPLOAD' },
        { year: '2022', event: 'NCS DEBUT' },
        { year: '2023', event: '10M STREAMS' },
        { year: '2024', event: '43M STREAMS' }
      ]
    },
    releases: {
      eyebrow: 'CATALOG',
      heading: 'EVERY\nDROP',
      desc: 'Full discography. Every release through NCS and independent channels.',
      items: [
        { title: 'COLD FRONT', year: '2024', platform: 'NCS' },
        { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' },
        { title: 'NORDIC VOID', year: '2023', platform: 'NCS' },
        { title: 'POLAR BASS', year: '2022', platform: 'NCS' },
        { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' },
        { title: 'DARK NORTH', year: '2021', platform: 'Independent' }
      ]
    },
    proof: {
      eyebrow: 'PROOF',
      heading: 'THE\nNUMBERS',
      items: [
        {
          tag: 'NCS',
          heading: 'NCS RELEASE RADIO',
          desc: 'Featured on NCS Release Radio — one of the most-followed electronic music playlists on Spotify.',
          link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU',
          linkLabel: 'Listen on Spotify →'
        },
        {
          tag: 'YOUTUBE',
          heading: 'YOUTUBE',
          desc: '30 million combined views across NCS and HXI YouTube channels. Multiple videos with 5M+ individual views.',
          link: 'https://www.youtube.com/@hximusic',
          linkLabel: 'Watch on YouTube →'
        },
        {
          tag: 'INSTAGRAM',
          heading: 'INSTAGRAM',
          desc: 'Behind the scenes, studio process, and updates on upcoming releases.',
          link: 'https://www.instagram.com/prod.hxi/',
          linkLabel: 'Follow @prod.hxi →'
        },
        {
          tag: 'NCS CATALOG',
          heading: 'NCS ARTIST PAGE',
          desc: 'Official HXI page on NoCopyrightSounds — all releases in one place.',
          link: 'https://ncs.io/artist/1169/hxi',
          linkLabel: 'View on NCS →'
        }
      ]
    },
    nordic: {
      eyebrow: 'ORIGIN',
      heading: 'MADE\nIN\nOSLO',
      intro: 'Phonk produced in Oslo, Norway — shaped by cold winters, dark fjords, and the underground club circuit.',
      impactH: 'THE SOUND',
      impactP: 'HXI builds phonk around one principle: maximum sub-bass impact, minimum excess. 808s tuned to feel physical. Hi-hats sharp enough to cut through anything. The result is music that hits differently at any volume.',
      identityEyebrow: 'ARTIST',
      identityH: 'CHRISTOFFER ANDERSEN',
      identityP: 'Producer and sound designer based in Oslo. Started releasing in 2021 and signed with NCS within a year. Every track is produced, mixed, and mastered independently.',
      coord: {
        label: 'ORIGIN POINT',
        value: 'OSLO\nNORWAY',
        lat: '59.9139° N',
        lon: '10.7522° E',
        alt: 'ALT 23M'
      }
    },
    creators: {
      eyebrow: 'PLATFORMS',
      heading: 'FIND\nHXI',
      note: 'All music is available for free use under the NCS license — no copyright claims on YouTube.',
      items: [
        { name: 'Spotify', role: 'Stream', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' },
        { name: 'YouTube Music', role: 'Stream', url: 'https://www.youtube.com/@hximusic' },
        { name: 'Apple Music', role: 'Stream', url: 'https://music.apple.com/artist/hxi/1614660004' },
        { name: 'NCS', role: 'Free Download', url: 'https://ncs.io/artist/1169/hxi' },
        { name: 'Instagram', role: 'Follow', url: 'https://www.instagram.com/prod.hxi/' }
      ]
    },
    work: {
      eyebrow: 'USE CASES',
      heading: 'WHERE\nIT\nFITS',
      items: [
        {
          tag: 'CONTENT',
          heading: 'CONTENT CREATORS',
          desc: 'NCS license — use in YouTube videos, Twitch streams, TikTok, and short-form content without copyright claims.',
          link: 'https://ncs.io/artist/1169/hxi',
          linkLabel: 'Get the tracks →'
        },
        {
          tag: 'GAMING',
          heading: 'GAMING',
          desc: 'Built for high-speed gameplay. Drift, racing, FPS — the BPM and energy match the pace.',
          link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU',
          linkLabel: 'Stream on Spotify →'
        },
        {
          tag: 'SYNC',
          heading: 'SYNC & LICENSING',
          desc: 'Custom sync licensing for film, advertising, and commercial projects. Direct booking through contact.',
          link: 'mailto:booking@hxi.no',
          linkLabel: 'Get in touch →'
        }
      ]
    },
    frequency: {
      eyebrow: 'STEMS',
      heading: 'SOURCE\nFILES',
      intro: 'Individual stem packs for select releases. 808s, melodics, hi-hats, FX — every element that built the track.',
      gatedNote: 'Stem packs are gated — enter your email to get access. Available for producers and serious content creators.',
      cta: 'Request Stem Pack'
    },
    contact: {
      eyebrow: 'CONTACT',
      heading: 'BOOK\nHXI',
      copy: 'Sync licensing, remix requests, collaboration, label inquiries, and press — everything goes through here.',
      cta: 'Send a Message',
      ctaSecondary: 'Instagram DM'
    },
    footer: {
      copy: '© 2024 HXI / Christoffer Andersen. All rights reserved.',
      privacyLink: 'Privacy',
      privacyStrip: 'This site does not use cookies or tracking. Hosting via Vercel.'
    },
    privacy: {
      title: 'Privacy — HXI',
      description: 'Privacy and data policy for hxi.no.',
      eyebrow: 'LEGAL',
      heading: 'PRIVACY',
      lead: 'This site does not collect personal data, use cookies, or track visitors.',
      back: '← Back to site',
      hostingH: 'Hosting',
      hostingP: 'This site is hosted on Vercel. Vercel may collect anonymised access logs (IP address, user agent, referrer) for infrastructure purposes. No data is shared with third parties. See vercel.com/legal/privacy-policy.',
      spotifyH: 'Spotify Embed',
      spotifyP: 'When you interact with the Spotify player on this page, Spotify sets its own cookies and may collect data according to its privacy policy (spotify.com/privacy). The embed is loaded only when you click to play.',
      contactH: 'Contact',
      contactP: 'Contact links use mailto: — your email client handles the data. No form data is stored on this server. For inquiries: booking@hxi.no.'
    }
  },

  no: {
    lang: 'no',
    direction: 'ltr',
    hreflang: 'nb',
    title: 'HXI — Nordisk Phonk',
    description: 'Norsk phonk-produsent fra Oslo. 43M+ Spotify-avspillinger. Signert NCS.',
    skip: 'Hopp til innhold',
    nav: {
      music: 'Musikk',
      catalog: 'Katalog',
      about: 'Om',
      stems: 'Stems',
      contact: 'Kontakt',
      listen: 'Hør nå'
    },
    hero: {
      kicker: 'Oslo / Norge / Nordisk Phonk',
      tagline: 'SAME SPEED — KALDERE.',
      desc: 'Phonk laget for kulden. Rå 808s, knivskarpte hi-hats og sub-frekvenser designet for maksimal effekt på ethvert system.',
      cta: 'Stream på Spotify',
      ctaSecondary: 'Full katalog',
      signalTitle: 'LIVE SIGNAL',
      signalNote: 'Månedlige lyttere · Spotify · Oppdatert ukentlig'
    },
    marqueeItems: [
      'NCS SIGNERT', 'OSLO NORGE', '43M AVSPILLINGER', 'NORDISK PHONK',
      'DRIFT PHONK', 'MØRK ENERGI', 'NCS SIGNERT', 'OSLO NORGE',
      '43M AVSPILLINGER', 'NORDISK PHONK', 'DRIFT PHONK', 'MØRK ENERGI'
    ],
    latest: {
      eyebrow: 'SISTE UTGIVELSE',
      heading: 'COLD\nFRONT',
      desc: 'Maksimal 808-tyngde. Knivskarpte hi-hats stemt til Oslo-kulden. Den definerende HXI-lyden — strippet til kjernen.',
      meta: 'NCS · 2024 · Phonk',
      playerLabel: 'STREAM',
      playerNote: 'Tilgjengelig på Spotify, Apple Music, YouTube Music og alle store plattformer.'
    },
    facts: [
      { value: '43M+', label: 'Spotify-avspillinger' },
      { value: '30M+', label: 'YouTube-visninger' },
      { value: '2021', label: 'Grunnlagt' },
      { value: 'NCS', label: 'Label' }
    ],
    timeline: {
      eyebrow: 'TIDSLINJE',
      heading: 'FRA\nOSLO\nTIL\nVERDEN',
      rows: [
        { year: '2021', event: 'FØRSTE SPOR' },
        { year: '2022', event: 'NCS-DEBUT' },
        { year: '2023', event: '10M AVSPILLINGER' },
        { year: '2024', event: '43M AVSPILLINGER' }
      ]
    },
    releases: {
      eyebrow: 'KATALOG',
      heading: 'ALLE\nUTGIVELSER',
      desc: 'Full diskografi. Alle utgivelser gjennom NCS og uavhengige kanaler.',
      items: [
        { title: 'COLD FRONT', year: '2024', platform: 'NCS' },
        { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' },
        { title: 'NORDIC VOID', year: '2023', platform: 'NCS' },
        { title: 'POLAR BASS', year: '2022', platform: 'NCS' },
        { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' },
        { title: 'DARK NORTH', year: '2021', platform: 'Uavhengig' }
      ]
    },
    proof: {
      eyebrow: 'BEVIS',
      heading: 'TALLENE',
      items: [
        {
          tag: 'NCS',
          heading: 'NCS RELEASE RADIO',
          desc: 'Fremhevet på NCS Release Radio — en av de mest fulgte elektroniske musikk-spillelistene på Spotify.',
          link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU',
          linkLabel: 'Hør på Spotify →'
        },
        {
          tag: 'YOUTUBE',
          heading: 'YOUTUBE',
          desc: '30 millioner kombinerte visninger på NCS og HXI YouTube-kanaler.',
          link: 'https://www.youtube.com/@hximusic',
          linkLabel: 'Se på YouTube →'
        },
        {
          tag: 'INSTAGRAM',
          heading: 'INSTAGRAM',
          desc: 'Bak kulissene, studioprosessen og oppdateringer om kommende utgivelser.',
          link: 'https://www.instagram.com/prod.hxi/',
          linkLabel: 'Følg @prod.hxi →'
        },
        {
          tag: 'NCS KATALOG',
          heading: 'NCS ARTISTSIDE',
          desc: 'Offisiell HXI-side på NoCopyrightSounds — alle utgivelser på ett sted.',
          link: 'https://ncs.io/artist/1169/hxi',
          linkLabel: 'Se på NCS →'
        }
      ]
    },
    nordic: {
      eyebrow: 'OPPRINNELSE',
      heading: 'LAGET\nI\nOSLO',
      intro: 'Phonk produsert i Oslo, Norge — formet av kalde vintre, mørke fjorder og undergrunnens klubbscene.',
      impactH: 'LYDEN',
      impactP: 'HXI bygger phonk rundt ett prinsipp: maksimal sub-bass-effekt, minimalt overskudd. 808s stemt for å kjennes fysisk. Hi-hats skarpe nok til å kutte gjennom alt.',
      identityEyebrow: 'ARTIST',
      identityH: 'CHRISTOFFER ANDERSEN',
      identityP: 'Produsent og lyddesigner basert i Oslo. Begynte å gi ut musikk i 2021 og signerte med NCS på ett år.',
      coord: {
        label: 'OPPRINNELSESPUNKT',
        value: 'OSLO\nNORGE',
        lat: '59.9139° N',
        lon: '10.7522° Ø',
        alt: 'ALT 23M'
      }
    },
    creators: {
      eyebrow: 'PLATTFORMER',
      heading: 'FINN\nHXI',
      note: 'All musikk er tilgjengelig gratis under NCS-lisensen — ingen copyright-krav på YouTube.',
      items: [
        { name: 'Spotify', role: 'Stream', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' },
        { name: 'YouTube Music', role: 'Stream', url: 'https://www.youtube.com/@hximusic' },
        { name: 'Apple Music', role: 'Stream', url: 'https://music.apple.com/artist/hxi/1614660004' },
        { name: 'NCS', role: 'Gratis nedlasting', url: 'https://ncs.io/artist/1169/hxi' },
        { name: 'Instagram', role: 'Følg', url: 'https://www.instagram.com/prod.hxi/' }
      ]
    },
    work: {
      eyebrow: 'BRUKSOMRÅDER',
      heading: 'HVOR\nDET\nPASSER',
      items: [
        {
          tag: 'INNHOLD',
          heading: 'INNHOLDSSKAPERE',
          desc: 'NCS-lisens — bruk i YouTube-videoer, Twitch-strømmer og kortvideoer uten copyright-krav.',
          link: 'https://ncs.io/artist/1169/hxi',
          linkLabel: 'Hent sporene →'
        },
        {
          tag: 'GAMING',
          heading: 'GAMING',
          desc: 'Laget for høyhastighets gameplay. Drift, racing, FPS — BPM og energi matcher tempoet.',
          link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU',
          linkLabel: 'Stream på Spotify →'
        },
        {
          tag: 'SYNC',
          heading: 'SYNC & LISENSIERING',
          desc: 'Tilpasset sync-lisensiering for film, reklame og kommersielle prosjekter.',
          link: 'mailto:booking@hxi.no',
          linkLabel: 'Ta kontakt →'
        }
      ]
    },
    frequency: {
      eyebrow: 'STEMS',
      heading: 'KILDEFILER',
      intro: 'Individuelle stem-pakker for utvalgte utgivelser. 808s, melodier, hi-hats, FX — hvert element som bygget sporet.',
      gatedNote: 'Stem-pakker er tilgangsbegrenset — skriv inn e-posten din for å få tilgang.',
      cta: 'Be om Stem-pakke'
    },
    contact: {
      eyebrow: 'KONTAKT',
      heading: 'BOOK\nHXI',
      copy: 'Sync-lisensiering, remix-forespørsler, samarbeid, label-henvendelser og presse — alt går gjennom her.',
      cta: 'Send melding',
      ctaSecondary: 'Instagram DM'
    },
    footer: {
      copy: '© 2024 HXI / Christoffer Andersen. Alle rettigheter forbeholdt.',
      privacyLink: 'Personvern',
      privacyStrip: 'Dette nettstedet bruker ikke informasjonskapsler. Driftes av Vercel.'
    },
    privacy: {
      title: 'Personvern — HXI',
      description: 'Personvern og datapolitikk for hxi.no.',
      eyebrow: 'JURIDISK',
      heading: 'PERSONVERN',
      lead: 'Dette nettstedet samler ikke inn personopplysninger, bruker ikke informasjonskapsler og sporer ikke besøkende.',
      back: '← Tilbake til siden',
      hostingH: 'Hosting',
      hostingP: 'Dette nettstedet driftes av Vercel. Vercel kan samle inn anonymiserte tilgangslogger for infrastrukturformål. Se vercel.com/legal/privacy-policy.',
      spotifyH: 'Spotify-innbygging',
      spotifyP: 'Når du samhandler med Spotify-spilleren, setter Spotify egne informasjonskapsler i henhold til sin personvernpolicy (spotify.com/privacy).',
      contactH: 'Kontakt',
      contactP: 'Kontaktlenker bruker mailto: — e-postklienten din håndterer dataene. Ingen skjemadata lagres. For henvendelser: booking@hxi.no.'
    }
  },

  de: {
    lang: 'de',
    direction: 'ltr',
    hreflang: 'de',
    title: 'HXI — Nordic Phonk',
    description: 'Norwegischer Phonk-Produzent aus Oslo. 43M+ Spotify-Streams. Bei NCS unter Vertrag.',
    skip: 'Zum Inhalt springen',
    nav: {
      music: 'Musik',
      catalog: 'Katalog',
      about: 'Über uns',
      stems: 'Stems',
      contact: 'Kontakt',
      listen: 'Jetzt hören'
    },
    hero: {
      kicker: 'Oslo / Norwegen / Nordischer Phonk',
      tagline: 'GLEICHE GESCHWINDIGKEIT — KÄLTER.',
      desc: 'Phonk für die Kälte gemacht. Rohe 808s, messerscharfe Hi-Hats und Sub-Frequenzen für maximale Wirkung.',
      cta: 'Auf Spotify streamen',
      ctaSecondary: 'Gesamtkatalog',
      signalTitle: 'LIVE SIGNAL',
      signalNote: 'Monatliche Hörer · Spotify · Wöchentlich aktualisiert'
    },
    marqueeItems: [
      'NCS SIGNIERT', 'OSLO NORWEGEN', '43M STREAMS', 'NORDISCHER PHONK',
      'DRIFT PHONK', 'DUNKLE ENERGIE', 'NCS SIGNIERT', 'OSLO NORWEGEN',
      '43M STREAMS', 'NORDISCHER PHONK', 'DRIFT PHONK', 'DUNKLE ENERGIE'
    ],
    latest: {
      eyebrow: 'NEUESTE VERÖFFENTLICHUNG',
      heading: 'COLD\nFRONT',
      desc: 'Maximales 808-Gewicht. Messerscharfe Hi-Hats auf die Osloer Kälte abgestimmt.',
      meta: 'NCS · 2024 · Phonk',
      playerLabel: 'STREAM',
      playerNote: 'Verfügbar auf Spotify, Apple Music, YouTube Music und allen großen Plattformen.'
    },
    facts: [
      { value: '43M+', label: 'Spotify-Streams' },
      { value: '30M+', label: 'YouTube-Aufrufe' },
      { value: '2021', label: 'Gegründet' },
      { value: 'NCS', label: 'Label' }
    ],
    timeline: {
      eyebrow: 'ZEITLINIE',
      heading: 'VON\nOSLO\nZUR\nWELT',
      rows: [
        { year: '2021', event: 'ERSTER UPLOAD' },
        { year: '2022', event: 'NCS DEBÜT' },
        { year: '2023', event: '10M STREAMS' },
        { year: '2024', event: '43M STREAMS' }
      ]
    },
    releases: {
      eyebrow: 'KATALOG',
      heading: 'ALLE\nRELEASES',
      desc: 'Vollständige Diskographie über NCS und unabhängige Kanäle.',
      items: [
        { title: 'COLD FRONT', year: '2024', platform: 'NCS' },
        { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' },
        { title: 'NORDIC VOID', year: '2023', platform: 'NCS' },
        { title: 'POLAR BASS', year: '2022', platform: 'NCS' },
        { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' },
        { title: 'DARK NORTH', year: '2021', platform: 'Unabhängig' }
      ]
    },
    proof: {
      eyebrow: 'BEWEIS',
      heading: 'DIE\nZAHLEN',
      items: [
        { tag: 'NCS', heading: 'NCS RELEASE RADIO', desc: 'In der NCS Release Radio vorgestellt.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Auf Spotify hören →' },
        { tag: 'YOUTUBE', heading: 'YOUTUBE', desc: '30 Millionen kombinierte Aufrufe auf NCS und HXI YouTube-Kanälen.', link: 'https://www.youtube.com/@hximusic', linkLabel: 'Auf YouTube ansehen →' },
        { tag: 'INSTAGRAM', heading: 'INSTAGRAM', desc: 'Einblicke hinter die Kulissen und Updates zu kommenden Releases.', link: 'https://www.instagram.com/prod.hxi/', linkLabel: '@prod.hxi folgen →' },
        { tag: 'NCS KATALOG', heading: 'NCS KÜNSTLERSEITE', desc: 'Offizielle HXI-Seite auf NoCopyrightSounds.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Auf NCS ansehen →' }
      ]
    },
    nordic: {
      eyebrow: 'HERKUNFT',
      heading: 'GEMACHT\nIN\nOSLO',
      intro: 'Phonk produziert in Oslo, Norwegen — geprägt von kalten Wintern, dunklen Fjorden und dem Underground.',
      impactH: 'DER SOUND',
      impactP: 'HXI baut Phonk nach einem Prinzip: maximale Sub-Bass-Wirkung, minimaler Überschuss. 808s abgestimmt um physisch zu fühlen.',
      identityEyebrow: 'KÜNSTLER',
      identityH: 'CHRISTOFFER ANDERSEN',
      identityP: 'Produzent und Sound-Designer in Oslo. Begann 2021 zu veröffentlichen und unterschrieb innerhalb eines Jahres bei NCS.',
      coord: { label: 'URSPRUNGSPUNKT', value: 'OSLO\nNORWEGEN', lat: '59.9139° N', lon: '10.7522° O', alt: 'ALT 23M' }
    },
    creators: {
      eyebrow: 'PLATTFORMEN',
      heading: 'HXI\nFINDEN',
      note: 'Alle Musik ist unter der NCS-Lizenz kostenlos nutzbar — keine Copyright-Claims auf YouTube.',
      items: [
        { name: 'Spotify', role: 'Streamen', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' },
        { name: 'YouTube Music', role: 'Streamen', url: 'https://www.youtube.com/@hximusic' },
        { name: 'Apple Music', role: 'Streamen', url: 'https://music.apple.com/artist/hxi/1614660004' },
        { name: 'NCS', role: 'Kostenloser Download', url: 'https://ncs.io/artist/1169/hxi' },
        { name: 'Instagram', role: 'Folgen', url: 'https://www.instagram.com/prod.hxi/' }
      ]
    },
    work: {
      eyebrow: 'ANWENDUNGEN',
      heading: 'WO\nES\nPASST',
      items: [
        { tag: 'CONTENT', heading: 'CONTENT CREATOR', desc: 'NCS-Lizenz — in YouTube-Videos, Twitch-Streams und Kurzvideos ohne Copyright-Claims nutzbar.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Tracks holen →' },
        { tag: 'GAMING', heading: 'GAMING', desc: 'Für Hochgeschwindigkeits-Gameplay gebaut. Drift, Racing, FPS.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Auf Spotify streamen →' },
        { tag: 'SYNC', heading: 'SYNC & LIZENZIERUNG', desc: 'Sync-Lizenzierung für Film, Werbung und kommerzielle Projekte.', link: 'mailto:booking@hxi.no', linkLabel: 'Kontakt aufnehmen →' }
      ]
    },
    frequency: {
      eyebrow: 'STEMS',
      heading: 'QUELL-\nDATEIEN',
      intro: 'Einzelne Stem-Pakete für ausgewählte Releases. 808s, Melodien, Hi-Hats, FX.',
      gatedNote: 'Stem-Pakete sind zugangsbeschränkt — gib deine E-Mail ein, um Zugang zu erhalten.',
      cta: 'Stem-Paket anfragen'
    },
    contact: {
      eyebrow: 'KONTAKT',
      heading: 'HXI\nBUCHEN',
      copy: 'Sync-Lizenzierung, Remix-Anfragen, Zusammenarbeit und Pressearbeit — alles hier.',
      cta: 'Nachricht senden',
      ctaSecondary: 'Instagram DM'
    },
    footer: {
      copy: '© 2024 HXI / Christoffer Andersen. Alle Rechte vorbehalten.',
      privacyLink: 'Datenschutz',
      privacyStrip: 'Diese Website verwendet keine Cookies. Hosting über Vercel.'
    },
    privacy: {
      title: 'Datenschutz — HXI',
      description: 'Datenschutz- und Datenrichtlinie für hxi.no.',
      eyebrow: 'RECHTLICHES',
      heading: 'DATENSCHUTZ',
      lead: 'Diese Website erfasst keine personenbezogenen Daten und verwendet keine Cookies.',
      back: '← Zurück zur Website',
      hostingH: 'Hosting',
      hostingP: 'Diese Website wird auf Vercel gehostet. Vercel kann anonymisierte Zugriffsprotokolle erfassen. Siehe vercel.com/legal/privacy-policy.',
      spotifyH: 'Spotify-Einbettung',
      spotifyP: 'Wenn Sie mit dem Spotify-Player interagieren, setzt Spotify eigene Cookies gemäß seiner Datenschutzrichtlinie (spotify.com/privacy).',
      contactH: 'Kontakt',
      contactP: 'Kontaktlinks verwenden mailto: — keine Formulardaten werden gespeichert. Für Anfragen: booking@hxi.no.'
    }
  },

  fr: {
    lang: 'fr',
    direction: 'ltr',
    hreflang: 'fr',
    title: 'HXI — Nordic Phonk',
    description: 'Producteur de phonk norvégien d\'Oslo. 43M+ streams Spotify. Signé chez NCS.',
    skip: 'Aller au contenu',
    nav: { music: 'Musique', catalog: 'Catalogue', about: 'À propos', stems: 'Stems', contact: 'Contact', listen: 'Écouter' },
    hero: {
      kicker: 'Oslo / Norvège / Phonk Nordique',
      tagline: 'MÊME VITESSE — PLUS FROID.',
      desc: 'Phonk conçu pour le froid. 808s brutes, hi-hats tranchants et sub-fréquences pour un impact maximal.',
      cta: 'Écouter sur Spotify',
      ctaSecondary: 'Catalogue complet',
      signalTitle: 'SIGNAL EN DIRECT',
      signalNote: 'Auditeurs mensuels · Spotify · Mis à jour chaque semaine'
    },
    marqueeItems: [
      'NCS SIGNÉ', 'OSLO NORVÈGE', '43M STREAMS', 'PHONK NORDIQUE',
      'DRIFT PHONK', 'ÉNERGIE SOMBRE', 'NCS SIGNÉ', 'OSLO NORVÈGE',
      '43M STREAMS', 'PHONK NORDIQUE', 'DRIFT PHONK', 'ÉNERGIE SOMBRE'
    ],
    latest: { eyebrow: 'DERNIÈRE SORTIE', heading: 'COLD\nFRONT', desc: 'Poids 808 maximal. Hi-hats acérés accordés au froid d\'Oslo.', meta: 'NCS · 2024 · Phonk', playerLabel: 'STREAM', playerNote: 'Disponible sur Spotify, Apple Music, YouTube Music et toutes les grandes plateformes.' },
    facts: [
      { value: '43M+', label: 'Streams Spotify' },
      { value: '30M+', label: 'Vues YouTube' },
      { value: '2021', label: 'Fondé' },
      { value: 'NCS', label: 'Label' }
    ],
    timeline: { eyebrow: 'CHRONOLOGIE', heading: 'D\'OSLO\nAU\nMONDE', rows: [{ year: '2021', event: 'PREMIER UPLOAD' }, { year: '2022', event: 'DÉBUTS NCS' }, { year: '2023', event: '10M STREAMS' }, { year: '2024', event: '43M STREAMS' }] },
    releases: { eyebrow: 'CATALOGUE', heading: 'TOUTES\nLES\nSORTIES', desc: 'Discographie complète via NCS et canaux indépendants.', items: [{ title: 'COLD FRONT', year: '2024', platform: 'NCS' }, { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' }, { title: 'NORDIC VOID', year: '2023', platform: 'NCS' }, { title: 'POLAR BASS', year: '2022', platform: 'NCS' }, { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' }, { title: 'DARK NORTH', year: '2021', platform: 'Indépendant' }] },
    proof: { eyebrow: 'PREUVES', heading: 'LES\nCHIFFRES', items: [{ tag: 'NCS', heading: 'NCS RELEASE RADIO', desc: 'Présenté sur NCS Release Radio.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Écouter sur Spotify →' }, { tag: 'YOUTUBE', heading: 'YOUTUBE', desc: '30 millions de vues combinées sur NCS et les chaînes HXI.', link: 'https://www.youtube.com/@hximusic', linkLabel: 'Voir sur YouTube →' }, { tag: 'INSTAGRAM', heading: 'INSTAGRAM', desc: 'Coulisses et mises à jour sur les prochaines sorties.', link: 'https://www.instagram.com/prod.hxi/', linkLabel: 'Suivre @prod.hxi →' }, { tag: 'NCS', heading: 'PAGE ARTISTE NCS', desc: 'Page officielle HXI sur NoCopyrightSounds.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Voir sur NCS →' }] },
    nordic: { eyebrow: 'ORIGINE', heading: 'FAIT\nÀ\nOSLO', intro: 'Phonk produit à Oslo, Norvège — façonné par des hivers froids et des fjords sombres.', impactH: 'LE SON', impactP: 'HXI construit le phonk sur un principe: impact sub-bass maximal, excès minimal.', identityEyebrow: 'ARTISTE', identityH: 'CHRISTOFFER ANDERSEN', identityP: 'Producteur et sound designer basé à Oslo. A commencé à sortir de la musique en 2021 et signé chez NCS en moins d\'un an.', coord: { label: 'POINT D\'ORIGINE', value: 'OSLO\nNORVÈGE', lat: '59.9139° N', lon: '10.7522° E', alt: 'ALT 23M' } },
    creators: { eyebrow: 'PLATEFORMES', heading: 'TROUVER\nHXI', note: 'Toute la musique est disponible gratuitement sous licence NCS.', items: [{ name: 'Spotify', role: 'Écouter', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' }, { name: 'YouTube Music', role: 'Écouter', url: 'https://www.youtube.com/@hximusic' }, { name: 'Apple Music', role: 'Écouter', url: 'https://music.apple.com/artist/hxi/1614660004' }, { name: 'NCS', role: 'Téléchargement gratuit', url: 'https://ncs.io/artist/1169/hxi' }, { name: 'Instagram', role: 'Suivre', url: 'https://www.instagram.com/prod.hxi/' }] },
    work: { eyebrow: 'UTILISATIONS', heading: 'OÙ\nÇA\nFIT', items: [{ tag: 'CONTENU', heading: 'CRÉATEURS', desc: 'Licence NCS — utilisation dans vidéos YouTube, streams Twitch sans réclamations de droits d\'auteur.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Obtenir les pistes →' }, { tag: 'GAMING', heading: 'GAMING', desc: 'Conçu pour le gameplay haute vitesse. Drift, course, FPS.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Écouter sur Spotify →' }, { tag: 'SYNC', heading: 'SYNC & LICENCE', desc: 'Licence sync pour film, publicité et projets commerciaux.', link: 'mailto:booking@hxi.no', linkLabel: 'Prendre contact →' }] },
    frequency: { eyebrow: 'STEMS', heading: 'FICHIERS\nSOURCE', intro: 'Packs de stems individuels pour des sorties sélectionnées. 808s, mélodies, hi-hats, FX.', gatedNote: 'Les packs de stems sont réservés — entrez votre e-mail pour y accéder.', cta: 'Demander un pack Stem' },
    contact: { eyebrow: 'CONTACT', heading: 'RÉSERVER\nHXI', copy: 'Licence sync, demandes de remix, collaborations et relations presse — tout passe par ici.', cta: 'Envoyer un message', ctaSecondary: 'Instagram DM' },
    footer: { copy: '© 2024 HXI / Christoffer Andersen. Tous droits réservés.', privacyLink: 'Confidentialité', privacyStrip: 'Ce site n\'utilise pas de cookies. Hébergé par Vercel.' },
    privacy: { title: 'Confidentialité — HXI', description: 'Politique de confidentialité pour hxi.no.', eyebrow: 'LÉGAL', heading: 'CONFIDENTIALITÉ', lead: 'Ce site ne collecte pas de données personnelles et n\'utilise pas de cookies.', back: '← Retour au site', hostingH: 'Hébergement', hostingP: 'Ce site est hébergé sur Vercel. Voir vercel.com/legal/privacy-policy.', spotifyH: 'Intégration Spotify', spotifyP: 'Quand vous interagissez avec le lecteur Spotify, Spotify définit ses propres cookies (spotify.com/privacy).', contactH: 'Contact', contactP: 'Les liens de contact utilisent mailto:. Pour les demandes: booking@hxi.no.' }
  },

  es: {
    lang: 'es',
    direction: 'ltr',
    hreflang: 'es',
    title: 'HXI — Nordic Phonk',
    description: 'Productor de phonk noruego de Oslo. 43M+ streams en Spotify. Firmado con NCS.',
    skip: 'Ir al contenido',
    nav: { music: 'Música', catalog: 'Catálogo', about: 'Sobre', stems: 'Stems', contact: 'Contacto', listen: 'Escuchar' },
    hero: {
      kicker: 'Oslo / Noruega / Phonk Nórdico',
      tagline: 'MISMA VELOCIDAD — MÁS FRÍO.',
      desc: 'Phonk hecho para el frío. 808s crudos, hi-hats afilados y sub-frecuencias para máximo impacto.',
      cta: 'Escuchar en Spotify',
      ctaSecondary: 'Catálogo completo',
      signalTitle: 'SEÑAL EN VIVO',
      signalNote: 'Oyentes mensuales · Spotify · Actualizado semanalmente'
    },
    marqueeItems: [
      'NCS FIRMADO', 'OSLO NORUEGA', '43M STREAMS', 'PHONK NÓRDICO',
      'DRIFT PHONK', 'ENERGÍA OSCURA', 'NCS FIRMADO', 'OSLO NORUEGA',
      '43M STREAMS', 'PHONK NÓRDICO', 'DRIFT PHONK', 'ENERGÍA OSCURA'
    ],
    latest: { eyebrow: 'ÚLTIMO LANZAMIENTO', heading: 'COLD\nFRONT', desc: 'Peso 808 máximo. Hi-hats afilados sintonizados al frío de Oslo.', meta: 'NCS · 2024 · Phonk', playerLabel: 'STREAM', playerNote: 'Disponible en Spotify, Apple Music, YouTube Music y todas las plataformas principales.' },
    facts: [
      { value: '43M+', label: 'Streams en Spotify' },
      { value: '30M+', label: 'Vistas en YouTube' },
      { value: '2021', label: 'Fundado' },
      { value: 'NCS', label: 'Sello' }
    ],
    timeline: { eyebrow: 'CRONOLOGÍA', heading: 'DE\nOSLO\nAL\nMUNDO', rows: [{ year: '2021', event: 'PRIMERA SUBIDA' }, { year: '2022', event: 'DEBUT NCS' }, { year: '2023', event: '10M STREAMS' }, { year: '2024', event: '43M STREAMS' }] },
    releases: { eyebrow: 'CATÁLOGO', heading: 'TODOS\nLOS\nLANZAMIENTOS', desc: 'Discografía completa a través de NCS y canales independientes.', items: [{ title: 'COLD FRONT', year: '2024', platform: 'NCS' }, { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' }, { title: 'NORDIC VOID', year: '2023', platform: 'NCS' }, { title: 'POLAR BASS', year: '2022', platform: 'NCS' }, { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' }, { title: 'DARK NORTH', year: '2021', platform: 'Independiente' }] },
    proof: { eyebrow: 'PRUEBA', heading: 'LOS\nNÚMEROS', items: [{ tag: 'NCS', heading: 'NCS RELEASE RADIO', desc: 'Presentado en NCS Release Radio.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Escuchar en Spotify →' }, { tag: 'YOUTUBE', heading: 'YOUTUBE', desc: '30 millones de vistas combinadas en canales NCS y HXI.', link: 'https://www.youtube.com/@hximusic', linkLabel: 'Ver en YouTube →' }, { tag: 'INSTAGRAM', heading: 'INSTAGRAM', desc: 'Detrás de las cámaras y actualizaciones sobre próximos lanzamientos.', link: 'https://www.instagram.com/prod.hxi/', linkLabel: 'Seguir @prod.hxi →' }, { tag: 'NCS', heading: 'PÁGINA DE ARTISTA NCS', desc: 'Página oficial de HXI en NoCopyrightSounds.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Ver en NCS →' }] },
    nordic: { eyebrow: 'ORIGEN', heading: 'HECHO\nEN\nOSLO', intro: 'Phonk producido en Oslo, Noruega — formado por inviernos fríos y fiordos oscuros.', impactH: 'EL SONIDO', impactP: 'HXI construye phonk alrededor de un principio: máximo impacto de sub-bass, mínimo exceso.', identityEyebrow: 'ARTISTA', identityH: 'CHRISTOFFER ANDERSEN', identityP: 'Productor y diseñador de sonido basado en Oslo. Comenzó a publicar en 2021 y firmó con NCS en menos de un año.', coord: { label: 'PUNTO DE ORIGEN', value: 'OSLO\nNORUEGA', lat: '59.9139° N', lon: '10.7522° E', alt: 'ALT 23M' } },
    creators: { eyebrow: 'PLATAFORMAS', heading: 'ENCUENTRA\nHXI', note: 'Toda la música está disponible gratuitamente bajo la licencia NCS.', items: [{ name: 'Spotify', role: 'Escuchar', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' }, { name: 'YouTube Music', role: 'Escuchar', url: 'https://www.youtube.com/@hximusic' }, { name: 'Apple Music', role: 'Escuchar', url: 'https://music.apple.com/artist/hxi/1614660004' }, { name: 'NCS', role: 'Descarga gratuita', url: 'https://ncs.io/artist/1169/hxi' }, { name: 'Instagram', role: 'Seguir', url: 'https://www.instagram.com/prod.hxi/' }] },
    work: { eyebrow: 'USOS', heading: 'DÓNDE\nENCAJA', items: [{ tag: 'CONTENIDO', heading: 'CREADORES', desc: 'Licencia NCS — uso en videos de YouTube, streams de Twitch sin reclamaciones de derechos de autor.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: 'Obtener las pistas →' }, { tag: 'GAMING', heading: 'GAMING', desc: 'Hecho para gameplay de alta velocidad. Drift, carreras, FPS.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: 'Escuchar en Spotify →' }, { tag: 'SYNC', heading: 'SYNC Y LICENCIAS', desc: 'Licencias sync para cine, publicidad y proyectos comerciales.', link: 'mailto:booking@hxi.no', linkLabel: 'Ponerse en contacto →' }] },
    frequency: { eyebrow: 'STEMS', heading: 'ARCHIVOS\nFUENTE', intro: 'Packs de stems individuales para lanzamientos seleccionados. 808s, melodías, hi-hats, FX.', gatedNote: 'Los packs de stems están restringidos — introduce tu email para acceder.', cta: 'Solicitar pack Stem' },
    contact: { eyebrow: 'CONTACTO', heading: 'RESERVAR\nHXI', copy: 'Licencias sync, solicitudes de remix, colaboraciones y prensa — todo por aquí.', cta: 'Enviar mensaje', ctaSecondary: 'Instagram DM' },
    footer: { copy: '© 2024 HXI / Christoffer Andersen. Todos los derechos reservados.', privacyLink: 'Privacidad', privacyStrip: 'Este sitio no usa cookies. Alojado en Vercel.' },
    privacy: { title: 'Privacidad — HXI', description: 'Política de privacidad para hxi.no.', eyebrow: 'LEGAL', heading: 'PRIVACIDAD', lead: 'Este sitio no recopila datos personales ni usa cookies.', back: '← Volver al sitio', hostingH: 'Alojamiento', hostingP: 'Este sitio está alojado en Vercel. Ver vercel.com/legal/privacy-policy.', spotifyH: 'Integración de Spotify', spotifyP: 'Cuando interactúas con el reproductor de Spotify, Spotify establece sus propias cookies (spotify.com/privacy).', contactH: 'Contacto', contactP: 'Los enlaces de contacto usan mailto:. Para consultas: booking@hxi.no.' }
  },

  ar: {
    lang: 'ar',
    direction: 'rtl',
    hreflang: 'ar',
    title: 'HXI — فونك نوردي',
    description: 'منتج فونك نرويجي من أوسلو. أكثر من 43 مليون بث على Spotify. موقّع مع NCS.',
    skip: 'انتقل إلى المحتوى',
    nav: { music: 'موسيقى', catalog: 'الكتالوج', about: 'عن', stems: 'مسارات', contact: 'اتصال', listen: 'استمع الآن' },
    hero: {
      kicker: 'أوسلو / النرويج / فونك نوردي',
      tagline: 'نفس السرعة — أكثر برودة.',
      desc: 'فونك مصنوع للبرد. 808 خام، هاي هات حادة وترددات سابق للتأثير الأقصى.',
      cta: 'بث على Spotify',
      ctaSecondary: 'الكتالوج الكامل',
      signalTitle: 'إشارة مباشرة',
      signalNote: 'مستمعون شهريون · Spotify · تحديث أسبوعي'
    },
    marqueeItems: [
      'وقّع مع NCS', 'أوسلو النرويج', '43 مليون بث', 'فونك نوردي',
      'درفت فونك', 'طاقة مظلمة', 'وقّع مع NCS', 'أوسلو النرويج',
      '43 مليون بث', 'فونك نوردي', 'درفت فونك', 'طاقة مظلمة'
    ],
    latest: { eyebrow: 'آخر إصدار', heading: 'COLD\nFRONT', desc: 'ثقل 808 أقصى. هاي هات حادة مضبوطة على برد أوسلو.', meta: 'NCS · 2024 · فونك', playerLabel: 'بث', playerNote: 'متاح على Spotify وApple Music وYouTube Music وجميع المنصات الرئيسية.' },
    facts: [
      { value: '+43M', label: 'بث على Spotify' },
      { value: '+30M', label: 'مشاهدات YouTube' },
      { value: '2021', label: 'التأسيس' },
      { value: 'NCS', label: 'التسجيل' }
    ],
    timeline: { eyebrow: 'الجدول الزمني', heading: 'من\nأوسلو\nإلى\nالعالم', rows: [{ year: '2021', event: 'أول رفع' }, { year: '2022', event: 'ظهور NCS' }, { year: '2023', event: '10 مليون بث' }, { year: '2024', event: '43 مليون بث' }] },
    releases: { eyebrow: 'الكتالوج', heading: 'كل\nالإصدارات', desc: 'الديسكوغرافيا الكاملة عبر NCS والقنوات المستقلة.', items: [{ title: 'COLD FRONT', year: '2024', platform: 'NCS' }, { title: 'DRIFT SIGNAL', year: '2023', platform: 'NCS' }, { title: 'NORDIC VOID', year: '2023', platform: 'NCS' }, { title: 'POLAR BASS', year: '2022', platform: 'NCS' }, { title: 'FJORD NIGHTS', year: '2022', platform: 'NCS' }, { title: 'DARK NORTH', year: '2021', platform: 'مستقل' }] },
    proof: { eyebrow: 'إثبات', heading: 'الأرقام', items: [{ tag: 'NCS', heading: 'NCS RELEASE RADIO', desc: 'مميز في NCS Release Radio.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: '← استمع على Spotify' }, { tag: 'يوتيوب', heading: 'يوتيوب', desc: '30 مليون مشاهدة مجمّعة على قنوات NCS و HXI.', link: 'https://www.youtube.com/@hximusic', linkLabel: '← شاهد على YouTube' }, { tag: 'إنستغرام', heading: 'إنستغرام', desc: 'خلف الكواليس وتحديثات حول الإصدارات القادمة.', link: 'https://www.instagram.com/prod.hxi/', linkLabel: '← تابع @prod.hxi' }, { tag: 'كتالوج NCS', heading: 'صفحة فنان NCS', desc: 'صفحة HXI الرسمية على NoCopyrightSounds.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: '← عرض على NCS' }] },
    nordic: { eyebrow: 'الأصل', heading: 'صُنع\nفي\nأوسلو', intro: 'فونك منتج في أوسلو، النرويج — مشكّل بفصول الشتاء الباردة والمضايق المظلمة.', impactH: 'الصوت', impactP: 'يبني HXI الفونك حول مبدأ واحد: تأثير سابق أقصى، فائض أدنى.', identityEyebrow: 'الفنان', identityH: 'كريستوفر أندرسن', identityP: 'منتج ومصمم صوت مقيم في أوسلو. بدأ النشر عام 2021 ووقّع مع NCS خلال عام.', coord: { label: 'نقطة الأصل', value: 'أوسلو\nالنرويج', lat: '59.9139° ش', lon: '10.7522° ش', alt: 'ارتفاع 23م' } },
    creators: { eyebrow: 'المنصات', heading: 'ابحث\nعن HXI', note: 'جميع الموسيقى متاحة مجاناً بموجب رخصة NCS — بدون ادعاءات حقوق النشر على YouTube.', items: [{ name: 'Spotify', role: 'بث', url: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU' }, { name: 'YouTube Music', role: 'بث', url: 'https://www.youtube.com/@hximusic' }, { name: 'Apple Music', role: 'بث', url: 'https://music.apple.com/artist/hxi/1614660004' }, { name: 'NCS', role: 'تحميل مجاني', url: 'https://ncs.io/artist/1169/hxi' }, { name: 'Instagram', role: 'متابعة', url: 'https://www.instagram.com/prod.hxi/' }] },
    work: { eyebrow: 'حالات الاستخدام', heading: 'أين\nيناسب', items: [{ tag: 'محتوى', heading: 'صناع المحتوى', desc: 'رخصة NCS — استخدم في مقاطع YouTube وبثوث Twitch بدون ادعاءات حقوق النشر.', link: 'https://ncs.io/artist/1169/hxi', linkLabel: '← احصل على المقاطع' }, { tag: 'ألعاب', heading: 'ألعاب الفيديو', desc: 'مصنوع للألعاب عالية السرعة. درفت، سباق، FPS.', link: 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU', linkLabel: '← بث على Spotify' }, { tag: 'مزامنة', heading: 'مزامنة وترخيص', desc: 'ترخيص مزامنة مخصص للأفلام والإعلانات والمشاريع التجارية.', link: 'mailto:booking@hxi.no', linkLabel: '← تواصل معنا' }] },
    frequency: { eyebrow: 'مسارات', heading: 'ملفات\nالمصدر', intro: 'حزم مسارات فردية لإصدارات مختارة. 808، لحنيات، هاي هات، تأثيرات صوتية.', gatedNote: 'حزم المسارات مقيّدة — أدخل بريدك الإلكتروني للوصول.', cta: 'طلب حزمة مسار' },
    contact: { eyebrow: 'اتصال', heading: 'احجز\nHXI', copy: 'ترخيص المزامنة، طلبات الريمكس، التعاون والصحافة — كل شيء من هنا.', cta: 'أرسل رسالة', ctaSecondary: 'Instagram DM' },
    footer: { copy: '© 2024 HXI / كريستوفر أندرسن. جميع الحقوق محفوظة.', privacyLink: 'الخصوصية', privacyStrip: 'لا يستخدم هذا الموقع ملفات تعريف الارتباط. استضافة عبر Vercel.' },
    privacy: { title: 'الخصوصية — HXI', description: 'سياسة الخصوصية والبيانات لـ hxi.no.', eyebrow: 'قانوني', heading: 'الخصوصية', lead: 'لا يجمع هذا الموقع بيانات شخصية ولا يستخدم ملفات تعريف الارتباط.', back: '→ العودة إلى الموقع', hostingH: 'الاستضافة', hostingP: 'هذا الموقع مستضاف على Vercel. انظر vercel.com/legal/privacy-policy.', spotifyH: 'تضمين Spotify', spotifyP: 'عند التفاعل مع مشغل Spotify، يضع Spotify ملفات تعريف الارتباط الخاصة به وفقاً لسياسة الخصوصية (spotify.com/privacy).', contactH: 'اتصال', contactP: 'تستخدم روابط الاتصال mailto: — لا تُخزّن بيانات النماذج. للاستفسارات: booking@hxi.no.' }
  }
};
