import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/add-location/pick-plan', destination: '/add-location', permanent: false },
      { source: '/add-location/customize', destination: '/add-location', permanent: false },
      { source: '/add-location/checkout', destination: '/add-location', permanent: false },
      { source: '/add-location/thank-you', destination: '/add-location', permanent: false },
    ];
  },
};

export default nextConfig;
