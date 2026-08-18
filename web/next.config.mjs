/**
 * Güvenlik başlıkları. Bunlar sunucu tarafında uygulanır; Vercel/Node
 * dağıtımında otomatik geçerli olur, statik export'ta CDN'de tanımlanmalıdır.
 */
const securityHeaders = [
  // Tarayıcı içerik tipini tahmin etmesin — yanlış tip = XSS vektörü
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Siteyi başka bir sayfanın içine gömerek tıklama hırsızlığı yapılmasın
  { key: 'X-Frame-Options', value: 'DENY' },
  // Dış sitelere yalnızca alan adı sızsın, tam yol değil
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Mağazanın ihtiyacı olmayan cihaz izinleri kapatılır
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // HTTPS'e kilitle (yalnızca HTTPS sunulduğunda anlamlı)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
