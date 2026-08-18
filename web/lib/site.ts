/**
 * Mutlak adres üreten her yer (sitemap, robots, canonical, JSON-LD) buradan okur.
 * Boş string de geçersiz sayılır — `??` tek başına onu yakalamaz.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cobban.com').replace(/\/+$/, '');
