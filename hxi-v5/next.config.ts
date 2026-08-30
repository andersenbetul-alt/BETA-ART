import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — everything is pre-rendered at build time.
  // Suitable for an artist site with no server-side personalisation.
  output: 'export',
  images: {
    // Required for next/image with output: 'export'.
    unoptimized: true
  },
  // Trailing slash so /en/ resolves to /en/index.html on static hosts.
  trailingSlash: true
};

export default nextConfig;
