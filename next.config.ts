import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.favior.com',
      },
      {
        protocol: 'https',
        hostname: 'www.xelectron.com',
      },
    ],
  },
};

export default nextConfig;
