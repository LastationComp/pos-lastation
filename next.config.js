/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.IMAGE_PROTOCOL,
        hostname: process.env.IMAGE_HOSTNAME,
        port: process.env.IMAGE_PORT,
        pathname: process.env.IMAGE_PATHNAME,
      },
    ],
  },
};

module.exports = nextConfig;
