/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.snapdeal.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.sdlcdn.com', // Allow all subdomains of sdlcdn.com
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
