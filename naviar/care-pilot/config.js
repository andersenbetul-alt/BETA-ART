/**
 * NAVIAR Care Pilot — Merkezi Yapılandırma
 *
 * Tüm dışa bağımlı değerler (e-posta, Stripe, tier tanımları) tek yerden okunur.
 * Stripe linkleri hazır olduğunda buraya eklenir — başka dosyaya dokunmaya gerek kalmaz.
 *
 * pilot@naviarcare.example → RFC 2606 yer tutucusu, kasıtlı olarak çalışmaz.
 * Gerçek alan adı ve e-posta netleşene kadar değiştirilmemeli.
 */

const NAVIAR_CONFIG = {
  // İletişim
  email: 'pilot@naviarcare.example',

  // Stripe Payment Linkler (null = henüz yayında değil)
  // Hazır olduğunda: 'https://buy.stripe.com/...' formatında eklenir
  stripe: {
    grunnpakke:    null,
    standardpakke: null,
    familiepakke:  null,
  },

  // Abonelik paketleri
  // Fiyatlar: MVA kararı + piyasa testi bitene kadar yayınlanmaz.
  // stripeLink: null iken tier kartındaki CTA #kontakt formuna yönlendirir.
  tiers: [
    {
      id:       'grunnpakke',
      name:     'Grunnpakke',
      visits:   2,
      duration: 90,   // dakika
      features: [
        'Koordinatör ön görüşmesi',
        '2 besøk per måned (90 min)',
        'Bestilling via skjema',
      ],
      featured: false,
    },
    {
      id:       'standardpakke',
      name:     'Standardpakke',
      visits:   4,
      duration: 90,
      features: [
        'Koordinatör ön görüşmesi',
        '4 besøk per måned (90 min)',
        'Digital hverdagsstøtte',
        'Bestilling via skjema',
      ],
      featured: true,   // vurgulanmış kart
    },
    {
      id:       'familiepakke',
      name:     'Familiepakke',
      visits:   6,
      duration: 90,
      features: [
        'Koordinatör ön görüşmesi',
        '6 besøk per måned (90 min)',
        'Digital hverdagsstøtte',
        'Ukentlig statusoppsummering til pårørende',
        'Prioritert koordinatorkontakt',
      ],
      featured: false,
    },
  ],

  // Pilot kapsama alanı
  areas: ['Grünerløkka', 'Sagene', 'St. Hanshaugen', 'Frogner'],
};
