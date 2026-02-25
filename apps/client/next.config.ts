import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v0/:path*',
        destination: 'http://localhost:3001/api/v0/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/eatm-hackathon/**",
      },
    ],
  },
};

export default nextConfig;
