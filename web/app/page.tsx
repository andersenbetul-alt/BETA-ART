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
  { kind: 'cancelled', icon: '⛴', label: 'My ferry or train was cancelled', hint: 'Other ways to still get there' },
  { kind: 'missed',    icon: '🕐', label: 'I missed my connection',          hint: 'The rest of today, rebuilt' },
  { kind: 'road',      icon: '🚧', label: 'The road is closed',              hint: 'Alternative route' },
  { kind: 'eat',       icon: '🍽', label: 'Where can we eat now?',           hint: 'Worth walking to from here' },
  { kind: 'rain',      icon: '🌧', label: 'It started raining',              hint: 'Wait it out, or move indoors' },
];

export default function Home() {
  return (
    <>
      <h1>What went wrong?</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
        Tap what happened. Answer on the next screen.
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
