/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/timeguessr',
  assetPrefix: '/timeguessr/',
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
};

module.exports = nextConfig;
