import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['subtarsal-kathyrn-untreated.ngrok-free.dev'],
  async rewrites() {
    return [
      {
        source: '/api/inspire/:path*',
        destination: 'http://localhost:5000/api/inspire/:path*',
      },
    ];
  },
};

export default nextConfig;
