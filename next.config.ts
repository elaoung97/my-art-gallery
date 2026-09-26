import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 1. Enable next-gen image compression
    formats: ['image/avif', 'image/webp'],
    
    // 2. Allow remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;