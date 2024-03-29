/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  output: 'export',
  images: { unoptimized: true },
};

module.exports = nextConfig;
