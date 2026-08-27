import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[FATAL] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),

  DB_URL: requireEnv("DB_URL"),
  APP_SECRET: requireEnv("APP_SCERET"),

  cloud_name: process.env.cloudinary_cloud_name || "",
  api_key: process.env.cloudinary_api_key || "",
  api_secret: process.env.cloudinary_api_secret || "",

  google_client_id: process.env.google_client_id || "",
  google_client_secret: process.env.google_client_secret || "",
  google_callback_url:
    process.env.google_callback_url ||
    "http://localhost:5000/api/v1/auth/google/callback",

  stripe_publish_key: process.env.STRIPE_PUBLISHABLE_KEY || "",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY || "",

  frontend_url: process.env.frontend_url || "http://localhost:5174",
  frontend_url_home: process.env.frontend_url_home || "http://localhost:5174",
} as const;
