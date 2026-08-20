import Link from 'next/link';
import CountryPicker from '@/components/CountryPicker.tsx';
import { getCountry } from '@/lib/country.ts';
import { problems } from '@/lib/problems.ts';

/**
 * Giriş ekranı = tek soru: "Şu anda neyle karşılaştın?"
 *
 * Serbest metin yerine buton kullanıyoruz. İki sebep:
 * 1) Mahsur kalmış, ıslanmış, telefonu %12 şarjda olan biri yazmak istemez.
 * 2) Serbest metin bir LLM çağrısı demek — MVP'de gereksiz maliyet ve gecikme.
 *    Niyet zaten yedi başlıktan biri; dil modeli bunu çözmek için gerekmiyor.
 */

export default async function Home({
  searchParams,
}: { searchParams: Promise<{ country?: string }> }) {
  const { country: code } = await searchParams;
  const country = await getCountry(code ?? '');

  return (
    <>
      <h1>What went wrong?</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: '1.2rem' }}>
        Tap what happened. Answer on the next screen.
      </p>

      <CountryPicker active={country.code} basePath="/" />

      <div className="problems">
        {problems.map((p) => (
          <Link
            key={p.kind}
            href={`/sorun/${p.kind}?country=${country.code}`}
            className="problem"
          >
            <span className="icon" aria-hidden="true">{p.icon}</span>
            <span className="label">
              {p.label}
              <span className="hint">{p.hint}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
