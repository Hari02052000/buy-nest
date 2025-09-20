import { Router } from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  getSubCategory,
  listCategory,
  updateCategory,
  uploadCategoryImage,
} from "@/presentation/controller";
import { uploadCategory } from "@/presentation/middleware/multer.uploader";

const categoryRouter = Router();
categoryRouter.post("/upload-image/:id", uploadCategory, uploadCategoryImage);
categoryRouter.post("/", uploadCategory, createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.patch("/:id", listCategory);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.get("/sub/:id", getSubCategory);
categoryRouter.get("/", getCategory);

export default categoryRouter;
