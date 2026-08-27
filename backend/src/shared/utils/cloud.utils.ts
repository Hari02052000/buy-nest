import { v2 } from "cloudinary";
import { env } from "../config/environment";
import { APIError } from "../errors";
import logger from "../config/logger";

const cloudinary = v2;
cloudinary.config({
  cloud_name: env.cloud_name,
  api_key: env.api_key,
  api_secret: env.api_secret,
});

export interface CloudUtils {
  uploadMultiFiles(files: Express.Multer.File[]): Promise<{ url: string; id: string }[]>;
  uploadSingleFile(file: Express.Multer.File): Promise<{ url: string; id: string }>;
  deleteImage(id: string): Promise<boolean>;
}

export const cloudUtils: CloudUtils = {
  async uploadMultiFiles(files: Express.Multer.File[]): Promise<{ url: string; id: string }[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const base64String = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64String}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          resource_type: "auto",
          folder: "buy-nest/products",
        });
        return { url: result.secure_url, id: result.public_id };
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      logger.error({ err: error }, "Multi-file upload failed");
      throw new APIError("Image upload failed");
    }
  },

  async uploadSingleFile(file: Express.Multer.File): Promise<{ url: string; id: string }> {
    try {
      const base64String = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64String}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: "auto",
        folder: "buy-nest/category",
      });
      return { url: result.secure_url, id: result.public_id };
    } catch (error) {
      logger.error({ err: error }, "Single file upload failed");
      throw new APIError("Image upload failed");
    }
  },

  async deleteImage(id: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(id);
      return result.result === "ok";
    } catch (error) {
      logger.error({ err: error }, "Image deletion failed");
      throw new APIError("Image deletion failed");
    }
  },
};
