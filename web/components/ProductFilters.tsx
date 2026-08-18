'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

/** Arama kutusu ve sıralama seçimi. Durum URL'de tutulur — paylaşılabilir ve geri tuşu çalışır. */
export default function ProductFilters({
  locale,
  query,
  sort,
  category,
}: {
  locale: Locale;
  query: string;
  sort: string;
  category?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  function navigate(next: { q?: string; sirala?: string }) {
    const params = new URLSearchParams();
    if (category) params.set('kategori', category);
    const q = next.q ?? value;
    const s = next.sirala ?? sort;
    if (q.trim()) params.set('q', q.trim());
    if (s && s !== 'featured') params.set('sirala', s);
    const qs = params.toString();
    router.push(`/${locale}/urunler${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="toolbar">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({});
        }}
      >
        <label className="visually-hidden" htmlFor="urun-arama">{t(locale, 'search.label')}</label>
        <input
          id="urun-arama"
          type="search"
          name="q"
          value={value}
          placeholder={t(locale, 'search.placeholder')}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className="btn btn-ghost">{t(locale, 'search.submit')}</button>
      </form>

      <label className="sort">
        <span className="small muted">{t(locale, 'sort.label')}</span>
        <select value={sort} onChange={(event) => navigate({ sirala: event.target.value })}>
          <option value="featured">{t(locale, 'sort.featured')}</option>
          <option value="fiyat-artan">{t(locale, 'sort.priceAsc')}</option>
          <option value="fiyat-azalan">{t(locale, 'sort.priceDesc')}</option>
          <option value="isim">{t(locale, 'sort.name')}</option>
        </select>
      </label>
    </div>
  );
}
