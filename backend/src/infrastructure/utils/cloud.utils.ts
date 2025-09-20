import { APIError } from "@/domain/entities";
import { cloudUtillsInterface } from "@/domain/interfaces/utils";
import { v2 } from "cloudinary";
import { env } from "@/infrastructure/config/environment";

const cloudinary = v2;
cloudinary.config({
  cloud_name: env.cloud_name,
  api_key: env.api_key,
  api_secret: env.api_secret,
});

const uploadMultiFiles = async (
  imageFiles: Express.Multer.File[],
): Promise<{ url: string; id: string }[]> => {
  try {
    const images: Array<{ url: string; id: string }> = [];

    await Promise.all(
      imageFiles.map(async (image) => {
        const base64String = image.buffer.toString("base64");
        const dataUri = `data:${image.mimetype};base64,${base64String}`;
        await cloudinary.uploader.upload(
          dataUri,
          {
            resource_type: "auto",
            folder: "buy-nest/products",
          },
          (err, url) => {
            if (url) {
              images.push({ url: url.secure_url, id: url.public_id });
            } else throw new APIError("image upload failed");
          },
        );
      }),
    );
    return images;
  } catch (error) {
    console.log(error);
    throw new APIError();
  }
};
const uploadSingleFile = async (imageFile: Express.Multer.File): Promise<{ url: string; id: string }> => {
  try {
    const base64String = imageFile.buffer.toString("base64");
    const dataUri = `data:${imageFile.mimetype};base64,${base64String}`;
    const url = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "buy-nest/category",
    });
    return {
      url: url.secure_url,
      id: url.public_id,
    };
  } catch (error) {
    console.log(error);
    throw new APIError();
  }
};
const deleteImage = async (id: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(id);
    return true;
  } catch (error) {
    throw new APIError();
  }
};

export const cloudUtills: cloudUtillsInterface = {
  uploadMultiFiles,
  uploadSingleFile,
  deleteImage,
};
