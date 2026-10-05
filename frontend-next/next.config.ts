import type { NextConfig } from "next";

// Base URL of the separate Express backend. Same fallback as src/lib/api/client.ts.
const backendUrl = process.env.NEXT_PUBLIC_API_URL!;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy browser auth requests (same-origin /api/auth/*) to the Express
      // backend's /auth/* endpoints so the HttpOnly session cookie is set on
      // this origin. Keeps auth on Express — no Next.js API route handlers.
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
