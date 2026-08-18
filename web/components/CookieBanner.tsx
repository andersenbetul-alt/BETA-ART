'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

const STORAGE_KEY = 'cobban.consent.v1';

type Consent = { analytics: boolean; marketing: boolean; ts: number };

const copy: Record<Locale, { body: string; accept: string; reject: string; link: string }> = {
  no: {
    body: 'Vi bruker nødvendige informasjonskapsler for at butikken skal virke. Analyse- og markedsføringskapsler settes kun hvis du samtykker.',
    accept: 'Godta alle',
    reject: 'Kun nødvendige',
    link: 'Les mer',
  },
  en: {
    body: 'We use essential cookies to run the store. Analytics and marketing cookies are set only if you consent.',
    accept: 'Accept all',
    reject: 'Essential only',
    link: 'Read more',
  },
  tr: {
    body: 'Mağazanın çalışması için zorunlu çerezleri kullanıyoruz. Analitik ve pazarlama çerezleri yalnızca onay verirsen çalışır.',
    accept: 'Tümünü kabul et',
    reject: 'Sadece zorunlu',
    link: 'Daha fazla bilgi',
  },
};

/**
 * GDPR/KVKK uyumlu rıza bandı.
 * "Reddet" butonu "Kabul et" ile aynı görsel ağırlıkta — düzenleyici zorunluluk.
 * Rıza alınana kadar hiçbir analitik/pazarlama betiği yüklenmez.
 */
export default function CookieBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage kapalıysa (gizli mod) bandı gösterme — kararı kaydedemeyiz.
    }
  }, []);

  function decide(analytics: boolean, marketing: boolean) {
    const consent: Consent = { analytics, marketing, ts: Date.now() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* yoksay */
    }
    // Ölçüm betikleri bu olayı dinleyip yalnızca rıza varsa yüklenmeli.
    window.dispatchEvent(new CustomEvent('cobban:consent', { detail: consent }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookies">
      <p className="small">
        {text.body}{' '}
        <a href={`/${locale}/kurumsal#cerez`}>{text.link}</a>
      </p>
      <div className="consent-actions">
        <button className="btn btn-ghost" onClick={() => decide(false, false)}>{text.reject}</button>
        <button className="btn btn-ghost" onClick={() => decide(true, true)}>{text.accept}</button>
      </div>
    </div>
  );
}
