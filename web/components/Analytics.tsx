'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cobban.consent.v1';

type Consent = { analytics: boolean; marketing: boolean };

/**
 * Ölçüm betikleri YALNIZCA rıza alındıktan sonra yüklenir.
 * Rıza yoksa hiçbir üçüncü taraf isteği yapılmaz — GDPR/KVKK gereği.
 * Rıza bandı kararı `cobban:consent` olayıyla buraya ulaşır.
 */
export default function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setConsent(JSON.parse(raw) as Consent);
    } catch {
      /* localStorage kapalı — rıza yok sayılır */
    }

    function onConsent(event: Event) {
      setConsent((event as CustomEvent<Consent>).detail);
    }
    window.addEventListener('cobban:consent', onConsent);
    return () => window.removeEventListener('cobban:consent', onConsent);
  }, []);

  if (!measurementId || !consent?.analytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent','default',{ad_storage:'denied',analytics_storage:'granted'});
gtag('config','${measurementId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
