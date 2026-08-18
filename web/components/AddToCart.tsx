'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';
import { useCart } from './CartContext';

export default function AddToCart({
  slug,
  locale,
  disabled,
}: {
  slug: string;
  locale: Locale;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button className="btn" disabled>
        {t(locale, 'product.outOfStock')}
      </button>
    );
  }

  return (
    <button
      className="btn"
      onClick={() => {
        add(slug);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? '✓ ' : ''}
      {t(locale, 'product.addToCart')}
    </button>
  );
}
