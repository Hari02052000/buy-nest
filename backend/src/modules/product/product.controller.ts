import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ProductService, ProductSearchFilters } from "./product.service";
import { PRODUCT_TOKENS } from "./product.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class ProductController {
  constructor(
    @inject(PRODUCT_TOKENS.Service) private productService: ProductService,
  ) {}

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const product = await this.productService.createProduct(
        req.files as Express.Multer.File[],
        req.body,
        token,
      );
      res.status(201).json(ResponseUtils.success({ product }));
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;
      const category = (req.query.category as string) || undefined;
      const search = (req.query.search as string) || undefined;
      const brand = (req.query.brand as string) || undefined;
      const model = (req.query.model as string) || undefined;
      const minPrice = typeof req.query.minPrice === "string" ? parseFloat(req.query.minPrice) : undefined;
      const maxPrice = typeof req.query.maxPrice === "string" ? parseFloat(req.query.maxPrice) : undefined;
      const token = req.cookies.access_token_admin || undefined;

      const products = await this.productService.getProducts(
        limit, skip, category, search, token, brand, model, minPrice, maxPrice,
      );
      res.status(200).json(ResponseUtils.success({ products }));
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: ProductSearchFilters = {
        query: req.query.query as string,
        category: req.query.category as string,
        brand: req.query.brand as string,
        model: req.query.model as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        sortBy: req.query.sortBy as "name" | "price" | "createdAt",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        limit: parseInt(req.query.limit as string) || 20,
        skip: parseInt(req.query.skip as string) || 0,
      };

      const result = await this.productService.searchProducts(filters);
      res.status(200).json(ResponseUtils.success(result, "Products searched successfully"));
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.getSingleProduct(req.params.id);
      res.status(200).json(ResponseUtils.success(product, "Product fetched successfully"));
    } catch (error) {
      next(error);
    }
  };

  editProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const product = await this.productService.editProduct(req.params.id, req.body, token);
      res.status(200).json(ResponseUtils.success({ product }));
    } catch (error) {
      next(error);
    }
  };

  uploadProductImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const product = await this.productService.uploadImages(
        req.params.id,
        req.files as Express.Multer.File[],
        token,
      );
      res.status(200).json(ResponseUtils.success({ product }));
    } catch (error) {
      next(error);
    }
  };

  deleteProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const image = req.body.image;
      const product = await this.productService.deleteImage(req.params.id, image, token);
      res.status(200).json(ResponseUtils.success({ product }));
    } catch (error) {
      next(error);
    }
  };

  changeListStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const { isListed } = req.body;
      const product = await this.productService.changeListStatus(req.params.id, isListed, token);
      res.status(200).json(ResponseUtils.success({ product }));
    } catch (error) {
      next(error);
    }
  };
}
