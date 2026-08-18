import { ImageResponse } from 'next/og';
import { isLocale, t, defaultLocale } from '@/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'COBBAN';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : defaultLocale;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#F4F1EC',
          color: '#141A1F',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 18, marginBottom: 48 }}>COBBAN</div>
        <div style={{ fontSize: 64, lineHeight: 1.15, maxWidth: 900 }}>
          {t(active, 'hero.title')}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 26, color: '#5C6B75' }}>
          {t(active, 'usp.shipping')} · {t(active, 'usp.returns')}
        </div>
      </div>
    ),
    size,
  );
}
