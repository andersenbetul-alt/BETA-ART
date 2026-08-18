import Link from 'next/link';

/**
 * Giriş ekranı = tek soru: "Şu anda neyle karşılaştın?"
 *
 * Serbest metin yerine buton kullanıyoruz. İki sebep:
 * 1) Mahsur kalmış, ıslanmış, telefonu %12 şarjda olan biri yazmak istemez.
 * 2) Serbest metin bir LLM çağrısı demek — MVP'de gereksiz maliyet ve gecikme.
 *    Niyet zaten beş başlıktan biri; dil modeli bunu çözmek için gerekmiyor.
 */
const problems = [
  { kind: 'cancelled', icon: '⛴', label: 'My ferry or train was cancelled', hint: 'Find another way there' },
  { kind: 'missed',    icon: '🕐', label: 'I missed my connection',          hint: 'Rebuild the rest of today' },
  { kind: 'road',      icon: '🚧', label: 'The road is closed',              hint: 'Alternative route' },
  { kind: 'eat',       icon: '🍽', label: 'Where can we eat now?',           hint: 'Open, close, walkable' },
  { kind: 'rain',      icon: '🌧', label: 'It started raining',              hint: 'Swap to indoor plans' },
];

export default function Home() {
  return (
    <>
      <h1>What went wrong?</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
        Tap the problem. We&rsquo;ll handle the rest.
      </p>

      <div className="problems">
        {problems.map((p) => (
          <Link key={p.kind} href={`/sorun/${p.kind}`} className="problem">
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
