import Link from 'next/link';
import CountryPicker from '@/components/CountryPicker.tsx';
import { getCountry } from '@/lib/country.ts';

/**
 * Giriş ekranı = tek soru: "Şu anda neyle karşılaştın?"
 *
 * Serbest metin yerine buton kullanıyoruz. İki sebep:
 * 1) Mahsur kalmış, ıslanmış, telefonu %12 şarjda olan biri yazmak istemez.
 * 2) Serbest metin bir LLM çağrısı demek — MVP'de gereksiz maliyet ve gecikme.
 *    Niyet zaten yedi başlıktan biri; dil modeli bunu çözmek için gerekmiyor.
 */
const problems = [
  { kind: 'cancelled', icon: '⛴', label: 'My ferry or train was cancelled', hint: 'Other ways to still get there' },
  { kind: 'missed',    icon: '🕐', label: 'I missed my connection',          hint: 'The rest of today, rebuilt' },
  { kind: 'road',      icon: '🚧', label: 'The road is closed',              hint: 'Alternative route' },
  { kind: 'eat',       icon: '🍽', label: 'Where can we eat now?',           hint: 'Worth walking to from here' },
  { kind: 'rain',      icon: '🌧', label: 'It started raining',              hint: 'Wait it out, or move indoors' },
  { kind: 'meet',      icon: '🎪', label: 'I want to be around people',      hint: 'What is on tonight, free to walk into' },
  { kind: 'basics',    icon: '💶', label: 'What am I supposed to know here?', hint: 'The rules locals never explain' },
];

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
