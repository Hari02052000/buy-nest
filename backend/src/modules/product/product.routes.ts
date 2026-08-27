import { Router } from "express";
import { container } from "tsyringe";
import { PRODUCT_TOKENS } from "./product.tokens";
import { ProductController } from "./product.controller";
import { uploadProduct } from "@/shared/middleware/upload.middleware";

const router = Router();
const controller = container.resolve<ProductController>(PRODUCT_TOKENS.Controller);

router.post("/", uploadProduct, controller.createProduct);
router.put("/upload-image/:id", uploadProduct, controller.uploadProductImages);
router.put("/:id", controller.editProduct);
router.get("/search", controller.searchProducts);
router.get("/:id", controller.getProductById);
router.get("/", controller.getProducts);
router.delete("/delete-image/:id", controller.deleteProductImage);
router.patch("/toggle-list/:id", controller.changeListStatus);

export default router;
