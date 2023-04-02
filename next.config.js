/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
