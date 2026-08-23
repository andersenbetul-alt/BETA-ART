import { ImageResponse } from 'next/og';
import { Mark } from './_mark.tsx';

/**
 * İkon derleme anında üretiliyor, ikili dosya olarak taşınmıyor.
 * Sebep pratik: bu ortamdan Vercel'e yalnızca metin gidebiliyor.
 * Yan faydası, işaretin sürüm kontrolünde okunabilir kod olması.
 */
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#141A1F', borderRadius: 112,
      }}>
        <Mark width={379} />
      </div>
    ),
    size,
  );
}
