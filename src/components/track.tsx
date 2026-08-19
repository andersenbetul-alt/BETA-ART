"use client";

/**
 * Ölçüm sarmalayıcıları.
 *
 * Görünümler sunucu bileşeni; `track()` tarayıcıda çalışır. Aradaki köprü bu
 * dosyadır: sayfanın tamamını istemciye taşımak yerine yalnızca ölçülen
 * bağlantı ve sınır işaretleri istemci bileşeni olur.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsPayload } from "@/lib/analytics";

type TrackedProps = {
  event: AnalyticsEvent;
  payload?: AnalyticsPayload;
};

/** İç bağlantı — tıklanınca olay gönderir, gezinmeyi engellemez. */
export function TrackedLink({
  href,
  event,
  payload,
  children,
  ...rest
}: TrackedProps & { href: string; children: ReactNode } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link href={href} onClick={() => track(event, payload)} {...rest}>
      {children}
    </Link>
  );
}

/** Dış bağlantı (mailto, tel) — Next yönlendirmesi yok. */
export function TrackedAnchor({
  event,
  payload,
  children,
  ...rest
}: TrackedProps & { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a onClick={() => track(event, payload)} {...rest}>
      {children}
    </a>
  );
}

/** Sayfa açıldığında bir kez. Aynı sayfada tekrar tetiklenmez. */
export function TrackView({ event, payload }: TrackedProps) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, payload);
    // payload sabit değerlerden oluşur; olay adı kimliği belirler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}

/**
 * Ekranda görününce bir kez. Yazının sonuna konur; "okundu" sinyali verir.
 * IntersectionObserver yoksa sessizce hiçbir şey yapmaz.
 */
export function TrackVisible({ event, payload }: TrackedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || sent.current) continue;
        sent.current = true;
        track(event, payload);
        observer.disconnect();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return <div ref={ref} aria-hidden="true" />;
}
