'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { CityRef } from '@/lib/country.ts';

/** İki nokta arası kaba mesafe — şehir seçmek için yeterli, harita kütüphanesi gerekmez. */
function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = (aLat - bLat) * 111;
  const dLon = (aLon - bLon) * 111 * Math.cos((aLat * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
}

/**
 * Tarayıcının konum API'si — ücretsiz, sunucu gerektirmez, hiçbir yere
 * gönderilmez. Sadece en yakın şehri seçip URL'yi günceller.
 */
export default function UseMyLocation(
  { cities, param = 'city' }: { cities: CityRef[]; param?: 'city' | 'from' },
) {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<'idle' | 'working' | 'denied' | 'far'>('idle');

  function locate() {
    if (!navigator.geolocation) return setState('denied');
    setState('working');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = cities
          .map((c) => ({ c, km: distanceKm(coords.latitude, coords.longitude, c.lat, c.lon) }))
          .sort((a, b) => a.km - b.km)[0];

        // 150 km'den uzaksa yanlış şehri seçmektense sormaya devam et.
        if (nearest.km > 150) return setState('far');

        const next = new URLSearchParams(params.toString());
        next.set(param, nearest.c.id);
        router.push(`?${next.toString()}`);
        setState('idle');
      },
      () => setState('denied'),
      { timeout: 8000, maximumAge: 300_000 },
    );
  }

  if (state === 'denied') return null;

  return (
    <p className="small muted" style={{ marginTop: '-.8rem', marginBottom: '1.2rem' }}>
      {state === 'far'
        ? "You're not near any city we cover here — check the country above."
        : (
          <button
            onClick={locate}
            disabled={state === 'working'}
            style={{
              background: 'none', border: 0, padding: 0, color: 'inherit',
              textDecoration: 'underline', font: 'inherit',
            }}
          >
            {state === 'working' ? 'Finding you…' : '📍 Use my location'}
          </button>
        )}
    </p>
  );
}
