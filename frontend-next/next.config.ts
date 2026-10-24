import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL!;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy all /api/* requests to backend /api/v1/*
      // Enables HttpOnly cookie auth for all endpoints (single domain)
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
