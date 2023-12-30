/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
    swcMinify: true
  },
};

module.exports = nextConfig;
