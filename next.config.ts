import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // optional; Vercel can optimize image
  },
};

export default nextConfig;
