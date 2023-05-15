/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    scrollRestoration: true,
  },
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
