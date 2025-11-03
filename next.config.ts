import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
