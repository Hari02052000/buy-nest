import { Router } from "express";
import { container } from "tsyringe";
import { PRODUCT_TOKENS } from "./product.tokens";
import { ProductController } from "./product.controller";
import { uploadProduct } from "@/shared/middleware/upload.middleware";
import { authenticateUser, authenticateAdmin } from "@/shared/middleware/auth.middleware";

const router = Router();
const controller = container.resolve<ProductController>(PRODUCT_TOKENS.Controller);

// Public routes
router.get("/search", controller.searchProducts);
router.get("/:id", controller.getProductById);
router.get("/", controller.getProducts);

// Admin routes
router.post("/", authenticateAdmin, uploadProduct, controller.createProduct);
router.put("/upload-image/:id", authenticateAdmin, uploadProduct, controller.uploadProductImages);
router.put("/:id", authenticateAdmin, controller.editProduct);
router.delete("/delete-image/:id", authenticateAdmin, controller.deleteProductImage);
router.patch("/toggle-list/:id", authenticateAdmin, controller.changeListStatus);

export default router;
