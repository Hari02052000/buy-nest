import { Router } from "express";
import { container } from "tsyringe";
import { CATEGORY_TOKENS } from "./category.tokens";
import { CategoryController } from "./category.controller";
import { uploadCategory } from "@/shared/middleware/upload.middleware";

const router = Router();
const controller = container.resolve<CategoryController>(CATEGORY_TOKENS.Controller);

router.post("/", uploadCategory, controller.createCategory);
router.get("/", controller.getCategory);
router.get("/sub/:id", controller.getSubCategory);
router.get("/:id", controller.getSingleCategory);
router.put("/:id", controller.editCategory);
router.patch("/:id/list-status", controller.changeListStatus);
router.put("/:id/image", uploadCategory, controller.uploadCategoryImage);

export default router;
