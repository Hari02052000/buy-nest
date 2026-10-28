import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name must be 200 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  category: z.string().min(1, "Category is required"),
  brandName: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be 100 characters or less"),
  modelName: z
    .string()
    .min(1, "Model name is required")
    .max(100, "Model name must be 100 characters or less"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or greater"),
  images: z
    .array(z.any())
    .min(1, "At least one image is required") as unknown as z.ZodType<File[]>,
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name must be 200 characters or less")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
  price: z.coerce
    .number()
    .min(0, "Price must be 0 or greater")
    .optional(),
  brandName: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be 100 characters or less")
    .optional(),
  modelName: z
    .string()
    .min(1, "Model name is required")
    .max(100, "Model name must be 100 characters or less")
    .optional(),
  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock must be 0 or greater")
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;