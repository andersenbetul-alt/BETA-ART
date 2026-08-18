'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CartLine = { slug: string; qty: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = 'cobban.cart.v1';
const CartCtx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Sepeti yalnızca istemcide oku — sunucu/istemci HTML uyuşmazlığı olmasın.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed.filter(
              (l): l is CartLine =>
                !!l && typeof (l as CartLine).slug === 'string' && Number.isFinite((l as CartLine).qty),
            ),
          );
        }
      }
    } catch {
      /* bozuk veri — sepeti boş başlat */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* kota dolu veya gizli mod */
    }
  }, [lines, ready]);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      ready,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      add: (slug, qty = 1) =>
        setLines((prev) => {
          const found = prev.find((l) => l.slug === slug);
          return found
            ? prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
            : [...prev, { slug, qty }];
        }),
      setQty: (slug, qty) =>
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
    }),
    [lines, ready],
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalıdır');
  return ctx;
}
