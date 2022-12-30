/** @type {import('next').NextConfig} */
// add cloudinary to next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
        port: '*',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
        port: '*',
      },
    ],
    domains: ['res.cloudinary.com', 'pbs.twimg.com'],
  },
};

module.exports = nextConfig;
