"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../../presentation/controller");
const multer_uploader_1 = require("../../../../presentation/middleware/multer.uploader");
const productRouter = (0, express_1.Router)();
productRouter.post("/", multer_uploader_1.uploadProduct, controller_1.createProduct);
productRouter.put("/upload-image/:id", multer_uploader_1.uploadProduct, controller_1.uploadProductImages);
productRouter.put("/:id", controller_1.editProduct);
productRouter.get("/search", controller_1.searchProducts); // Add search route before /:id
productRouter.get("/:id", controller_1.getProductById);
productRouter.get("/", controller_1.getProducts);
productRouter.delete("/delete-image/:id", controller_1.deleteProductImage);
exports.default = productRouter;
