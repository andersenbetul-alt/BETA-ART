import { notFound } from 'next/navigation';
import { isLocale, t, type Locale } from '@/lib/i18n';

const content: Record<Locale, { intro: string; sections: { id: string; title: string; body: string }[] }> = {
  no: {
    intro:
      'COBBAN er en kuratert nettbutikk. Vi velger få, men riktige produkter — laget av folk vi kjenner, i materialer vi tør stå for.',
    sections: [
      { id: 'satis', title: 'Salgsbetingelser', body: 'Fullstendige salgsbetingelser etter forbrukerkjøpsloven og angrerettloven. Se docs/sozlesmeler/NO-salgsbetingelser.md.' },
      { id: 'gizlilik', title: 'Personvernerklæring', body: 'Hvordan vi behandler personopplysninger etter GDPR. Se docs/sozlesmeler/NO-personvernerklaering.md.' },
      { id: 'iade', title: 'Angrerett og retur', body: '14 dagers lovbestemt angrerett — COBBAN gir deg 30 dager. Første retur er gratis.' },
      { id: 'cerez', title: 'Informasjonskapsler', body: 'Nødvendige kapsler brukes uten samtykke; analyse og markedsføring kun med ditt samtykke.' },
    ],
  },
  en: {
    intro:
      'COBBAN is a curated online store. We choose few but right products — made by people we know, in materials we stand behind.',
    sections: [
      { id: 'satis', title: 'Terms of sale', body: 'Full terms under Norwegian consumer law. See docs/sozlesmeler/EN-terms-of-sale.md.' },
      { id: 'gizlilik', title: 'Privacy policy', body: 'How we process personal data under the GDPR. See docs/sozlesmeler/EN-privacy-policy.md.' },
      { id: 'iade', title: 'Returns and withdrawal', body: 'Statutory 14-day right of withdrawal — COBBAN gives you 30 days. First return is free.' },
      { id: 'cerez', title: 'Cookies', body: 'Essential cookies run without consent; analytics and marketing only with your consent.' },
    ],
  },
  tr: {
    intro:
      'COBBAN, seçki yapan bir online mağazadır. Az ama doğru ürün seçiyoruz — tanıdığımız insanların ürettiği, arkasında durabildiğimiz malzemelerden.',
    sections: [
      { id: 'satis', title: 'Mesafeli satış sözleşmesi', body: '6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında. Bkz. docs/sozlesmeler/TR-mesafeli-satis-sozlesmesi.md.' },
      { id: 'gizlilik', title: 'KVKK aydınlatma metni', body: '6698 sayılı Kanun m.10 uyarınca kişisel verilerin işlenmesi. Bkz. docs/sozlesmeler/TR-kvkk-aydinlatma-metni.md.' },
      { id: 'iade', title: 'İade ve cayma hakkı', body: 'Yasal 14 gün cayma hakkı — COBBAN 30 gün veriyor. İlk iade kargosu ücretsiz.' },
      { id: 'cerez', title: 'Çerez politikası', body: 'Zorunlu çerezler rıza olmadan; analitik ve pazarlama çerezleri yalnızca açık rızanızla çalışır.' },
    ],
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const page = content[locale];

  return (
    <div className="wrap" style={{ padding: '2.5rem 0 4rem', maxWidth: 760 }}>
      <h1>{t(locale, 'about.title')}</h1>
      <p style={{ fontSize: '1.125rem' }}>{page.intro}</p>

      <div className="notice small">
        Yasal metinlerin tam hâli <code>docs/sozlesmeler/</code> klasöründedir.
        Yayına almadan önce <code>{'{{...}}'}</code> alanlarını doldur ve bir avukata okut.
      </div>

      {page.sections.map((s) => (
        <section key={s.id} id={s.id} style={{ marginTop: '2.5rem', scrollMarginTop: '90px' }}>
          <h2>{s.title}</h2>
          <p className="muted">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
