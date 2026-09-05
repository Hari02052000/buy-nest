import { withSecurityHeaders } from './src/lib/next-security-headers.mjs';

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'buynest-backend-service' },
      { protocol: 'http', hostname: 'buynest-backend-service' },
    ],
  },
};

export default withSecurityHeaders(nextConfig);
