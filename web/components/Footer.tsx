import Link from 'next/link';
import { t, type Locale } from '@/lib/i18n';
import { categories } from '@/lib/products';

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cols">
          <div>
            <h3>COBBAN</h3>
            <p className="muted">{t(locale, 'hero.title')}</p>
          </div>
          <div>
            <h3>{t(locale, 'nav.products')}</h3>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/${locale}/urunler?kategori=${c.id}`}>{c.name[locale]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t(locale, 'footer.legal')}</h3>
            <ul>
              <li><Link href={`/${locale}/kurumsal#satis`}>{t(locale, 'footer.terms')}</Link></li>
              <li><Link href={`/${locale}/kurumsal#gizlilik`}>{t(locale, 'footer.privacy')}</Link></li>
              <li><Link href={`/${locale}/kurumsal#iade`}>{t(locale, 'footer.returns')}</Link></li>
              <li><Link href={`/${locale}/kurumsal#cerez`}>{t(locale, 'footer.cookies')}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{t(locale, 'footer.contact')}</h3>
            <ul>
              <li><a href="mailto:hei@cobban.com">hei@cobban.com</a></li>
              <li className="muted">{t(locale, 'footer.orgnr')}: {'{{ORG_NR}}'}</li>
            </ul>
          </div>
        </div>
        <p className="legal-note small">
          © {new Date().getFullYear()} COBBAN. {t(locale, 'cart.vatIncluded')}
          {locale === 'tr' && ' · ETBİS kayıt no: {{ETBIS_NO}}'}
        </p>
      </div>
    </footer>
  );
}
