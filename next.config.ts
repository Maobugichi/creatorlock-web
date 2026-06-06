import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['*.outray.app', 'fat-psychology.outray.app'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.outray.app', 'fat-psychology.outray.app'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;