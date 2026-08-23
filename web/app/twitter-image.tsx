import { ImageResponse } from 'next/og';
import { Mark } from './_mark.tsx';

export const size = { width: 1200, height: 675 };

export const contentType = 'image/png';
export const alt = 'COBBAN — travel problems in Europe, solved in one screen';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', background: '#141A1F', padding: '0 80px',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 64 }}>
          <div style={{
            width: 104, height: 104, borderRadius: 23, background: '#1F272E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 28,
          }}>
            <Mark width={72} />
          </div>
          <span style={{ fontSize: 44, fontWeight: 700, color: '#F4F1EC', letterSpacing: 2 }}>COBBAN</span>
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#F4F1EC' }}>
          Europe is complicated.
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#A85835', marginTop: 12 }}>
          COBBAN makes it simple.
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#9AA7AF', marginTop: 56 }}>
          Ferry cancelled · train missed · road closed · rain
        </div>
        <div style={{ display: 'flex', width: 100, height: 4, background: '#A85835', marginTop: 40 }} />
      </div>
    ),
    size,
  );
}
