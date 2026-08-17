import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
