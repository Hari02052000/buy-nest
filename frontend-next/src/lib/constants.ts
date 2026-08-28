export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const IMAGE_PLACEHOLDER =
  "https://via.placeholder.com/400x400?text=No+Image";

export const SITE_NAME = "BuyNest";

export const PRODUCT_IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  card: { width: 400, height: 400 },
  detail: { width: 800, height: 800 },
} as const;