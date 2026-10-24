import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name must be 100 characters or less"),
  parentId: z.string().optional(),
  image: z.instanceof(File, { message: "Category image is required" }),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name must be 100 characters or less"),
  parentId: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;