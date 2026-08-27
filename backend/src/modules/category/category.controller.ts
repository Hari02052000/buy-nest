import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { CATEGORY_TOKENS } from "./category.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class CategoryController {
  constructor(
    @inject(CATEGORY_TOKENS.Service) private categoryService: CategoryService,
  ) {}

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const category = await this.categoryService.createCategory(req.file!, req.body, token);
      res.status(201).json(ResponseUtils.success({ category }));
    } catch (error) {
      next(error);
    }
  };

  getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const token = req.cookies.access_token_admin;
      const categories = await this.categoryService.getCategory(limit, page, token);
      res.json(ResponseUtils.success({ categories }));
    } catch (error) {
      next(error);
    }
  };

  getSingleCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.getSingleCategory(req.params.id);
      res.json(ResponseUtils.success({ category }));
    } catch (error) {
      next(error);
    }
  };

  getSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getSubCategory(req.params.id);
      res.json(ResponseUtils.success({ categories }));
    } catch (error) {
      next(error);
    }
  };

  editCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const category = await this.categoryService.editCategory(req.params.id, req.body, token);
      res.json(ResponseUtils.success({ category }));
    } catch (error) {
      next(error);
    }
  };

  changeListStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const isListed = req.body.isList !== "false";
      const category = await this.categoryService.changeListStatus(req.params.id, isListed, token);
      res.json(ResponseUtils.success({ category }));
    } catch (error) {
      next(error);
    }
  };

  uploadCategoryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.access_token_admin;
      const category = await this.categoryService.editCategoryImage(req.params.id, req.file!, token);
      res.json(ResponseUtils.success({ category }));
    } catch (error) {
      next(error);
    }
  };
}
