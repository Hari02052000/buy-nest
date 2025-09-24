import { Router } from "express";
import {
  getProductById,
  editProduct,
  getProducts,
  createProduct,
  deleteProductImage,
  uploadProductImages,
  searchProducts,
} from "@/presentation/controller";
import { uploadProduct } from "@/presentation/middleware/multer.uploader";

const productRouter = Router();

productRouter.post("/", uploadProduct, createProduct);
productRouter.put("/upload-image/:id", uploadProduct, uploadProductImages);
productRouter.put("/:id", editProduct);
productRouter.get("/search", searchProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/", getProducts);
productRouter.delete("/delete-image/:id", deleteProductImage);

export default productRouter;
