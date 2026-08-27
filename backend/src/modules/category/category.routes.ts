import { Router } from "express";
import { container } from "tsyringe";
import { CATEGORY_TOKENS } from "./category.tokens";
import { CategoryController } from "./category.controller";
import { uploadCategory } from "@/shared/middleware/upload.middleware";
import { authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<CategoryController>(CATEGORY_TOKENS.Controller);

// Public routes
router.get("/", controller.getCategory);
router.get("/sub/:id", controller.getSubCategory);
router.get("/:id", controller.getSingleCategory);

// Admin routes
router.post("/", authenticateAdmin, uploadCategory, controller.createCategory);
router.put("/:id", authenticateAdmin, controller.editCategory);
router.patch("/:id/list-status", authenticateAdmin, controller.changeListStatus);
router.put("/:id/image", authenticateAdmin, uploadCategory, controller.uploadCategoryImage);

export default router;
