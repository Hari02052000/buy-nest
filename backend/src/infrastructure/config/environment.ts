import dotenv from "dotenv";

dotenv.config();

export const env = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,
  APP_SCERET: process.env.APP_SCERET,
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  google_client_id: process.env.google_client_id,
  google_client_secret: process.env.google_client_secret,
  google_callback_url: process.env.google_callback_url,
  stripe_publish_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  frontend_url: process.env.frontend_url || 'http://localhost:5174',
  frontend_url_home: process.env.frontend_url_home || 'http://localhost:5174',
};
