# NAVIAR CARE — Davranış Tabanlı Kişiselleştirme Sistemi

Bu belge, NAVIAR CARE Next.js uygulamasına QBLOGG'la aynı mantıkta bir
davranış tabanlı kişiselleştirme sistemi entegre etmek için hazırlık
notlarıdır. Repo transferi tamamlandığında buradan uygulamaya geçilecek.

## Neden önemli

NAVIAR kullanıcıları (pårørende ve yaşlı bireyler) üç pilot konu etrafında
geziniyor: NAV başvuruları, belediye bakımı, dijital hizmetler. Birini okuyan
çok büyük ihtimalle diğerini de arıyor. Kişiselleştirme bu arayışı kısaltır.

## Teknik yapı (QBLOGG benzeri, Next.js uyarlaması)

```
naviar/app/lib/behavior.ts   ← bu belgedeki TS modülü
naviar/app/components/BehaviorWidget.tsx ← öneri bileşeni
naviar/app/hooks/useBehavior.ts ← React hook
```

## TypeScript modülü (behavior.ts)

```typescript
/* NAVIAR CARE — localStorage tabanlı davranış izleme.
 * Kişisel veri yok; yalnızca konu tercihleri. */

const LS_KEY  = 'nav_beh';
const MAX_EV  = 60;
const DECAY   = 0.85;

interface BehaviorEvent {
  s: string;     // slug / sayfa id
  c: string;     // kategori / pilot konu
  ts: number;    // timestamp (ms)
}

interface BehaviorStore {
  events: BehaviorEvent[];
}

function load(): BehaviorStore {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    return raw ? JSON.parse(raw) : { events: [] };
  } catch {
    return { events: [] };
  }
}

function save(d: BehaviorStore): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch { /* yoksay */ }
}

export function track(slug: string, category: string): void {
  const d = load();
  d.events.push({ s: slug, c: category, ts: Date.now() });
  if (d.events.length > MAX_EV) d.events = d.events.slice(-MAX_EV);
  save(d);
}

export function scores(): Record<string, number> {
  const d = load();
  const now = Date.now();
  const s: Record<string, number> = {};
  d.events.forEach(e => {
    if (!e.c) return;
    const days = (now - e.ts) / 86400000;
    s[e.c] = (s[e.c] ?? 0) + Math.pow(DECAY, days);
  });
  return s;
}

export function topCategory(): string | null {
  const s = scores();
  let best: string | null = null;
  let bv = 0;
  Object.entries(s).forEach(([c, v]) => { if (v > bv) { bv = v; best = c; } });
  return best;
}

export function eventCount(): number {
  return load().events.length;
}

export function suggest<T extends { slug: string; category: string; date: string }>(
  items: T[],
  currentSlug: string,
  limit = 3
): T[] {
  const d = load();
  const read: Record<string, boolean> = {};
  d.events.forEach(e => { if (e.s) read[e.s] = true; });
  read[currentSlug] = true;
  const s = scores();
  const top = topCategory();

  return items
    .filter(p => !read[p.slug])
    .map(p => ({
      item: p,
      score: (s[p.category] ?? 0) + (p.category === top ? 5 : 0)
    }))
    .sort((a, b) =>
      b.score !== a.score ? b.score - a.score
        : new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
    )
    .slice(0, limit)
    .map(x => x.item);
}

export function clearAll(): void {
  try { localStorage.removeItem(LS_KEY); } catch { /* yoksay */ }
}
```

## React Hook (useBehavior.ts)

```typescript
'use client';
import { useEffect, useState } from 'react';
import { track, topCategory, eventCount, suggest, clearAll } from './behavior';

export function useBehavior<T extends { slug: string; category: string; date: string }>(
  items: T[],
  currentSlug: string
) {
  const [ready, setReady] = useState(false);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [topCat, setTopCat] = useState<string | null>(null);

  useEffect(() => {
    /* İlk yükleme: takip et + öneri hesapla */
    const sessKey = `nav_beh_seen_${currentSlug}`;
    const current = items.find(p => p.slug === currentSlug);
    if (current) {
      try {
        if (!sessionStorage.getItem(sessKey)) {
          track(currentSlug, current.category);
          sessionStorage.setItem(sessKey, '1');
        }
      } catch {
        track(currentSlug, current.category);
      }
    }

    const count = eventCount();
    if (count >= 2) {
      setSuggestions(suggest(items, currentSlug, 3));
      setTopCat(topCategory());
    }
    setReady(true);
  }, [currentSlug]);

  return { ready, suggestions, topCat, clearAll };
}
```

## Bileşen örneği (BehaviorWidget.tsx)

```tsx
'use client';
import { useBehavior } from '@/lib/useBehavior';
import Link from 'next/link';

interface Props {
  items: Array<{ slug: string; category: string; date: string; title: string }>;
  currentSlug: string;
}

export function BehaviorWidget({ items, currentSlug }: Props) {
  const { ready, suggestions } = useBehavior(items, currentSlug);
  if (!ready || !suggestions.length) return null;

  return (
    <section className="behavior-widget">
      <h2>Du liker kanskje også</h2>
      <ul>
        {suggestions.map(p => (
          <li key={p.slug}>
            <Link href={`/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## Kategori → hizmet eşlemesi (NAVIAR'da geçerli)

| Kategori/pilot | Öneri |
|---|---|
| `nav` (NAV başvuruları) | Pårørende i NAV paketi |
| `kommune` (belediye bakımı) | Pårørende og kommunen paketi |
| `digital` (dijital hizmetler) | Digital hjelp paketi |

Bu eşleme, yeterli okuma verisi birikince kullanıcıya ilgili pilot projeye
yönlendiren bir CTA gösterebilir.

## Stripe entegrasyonu

NAVIAR'da gelecekte Stripe ile ödeme eklenecekse:
1. `config.ts` içine `STRIPE_PUBLISHABLE_KEY` ve `payLinks: {nav: '', kommune: '', digital: ''}` ekleyin
2. Yeterli davranış verisi (4+ event) olduğunda önerilen hizmet için Stripe Payment Link gösterin
3. QBLOGG'daki `recoPlan()` mantığını `kategori → planKey → payLinks[planKey]` akışıyla uygulayın

## Gizlilik

- `localStorage` tarayıcıda, kullanıcının cihazında; sunucuya gönderilmez.
- Kişisel tanımlayıcı (IP, e-posta, ad) saklanmaz; yalnızca okunan slug ve kategori.
- GDPR: meşru menfaat (içerik kişiselleştirme, ticari web) kapsamında değerlendirilebilir.
  Gizlilik politikasına "tarayıcı tercihleri" başlığı altında açıklama ekleyin.
- `clearAll()` fonksiyonu gizlilik sayfasındaki "Veriyi sil" butonuna bağlanabilir.
