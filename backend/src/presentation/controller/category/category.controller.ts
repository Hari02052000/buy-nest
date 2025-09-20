import { categoryService } from "@/application/services";
import { categoryRepository } from "@/infrastructure/repository";
import { categoryUtils } from "@/infrastructure/utils/category.utils";
import { cloudUtills } from "@/infrastructure/utils/cloud.utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { Request, Response, NextFunction } from "express";

const categoryRepo = new categoryRepository();
const categoryServ = new categoryService(categoryRepo, cloudUtills, tokenUtils, categoryUtils);

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const category = await categoryServ.createCategory(req.file, req.body, token);
    return res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token_admin;
    const id = req.params.id;
    const category = await categoryServ.editCategory(id, req.body, token);
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
export const listCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const token = req.cookies.access_token_admin;
    let isList;
    req.body.isList === "false" ? (isList = false) : (isList = true);
    const category = await categoryServ.changeListStatus(id, isList, token);
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let limit;
    let page;
    req.query.limit ? (limit = parseInt(req.query.limit as string)) : (limit = 10);
    req.query.page ? (page = parseInt(req.query.page as string)) : (page = 1);
    const token = req.cookies.access_token_admin;
    const categories = await categoryServ.getCategory(limit, page, token);
    return res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const category = await categoryServ.getSingleCategory(id);
    return res.status(200).json({ category });
  } catch (error) {
    next();
  }
};
export const uploadCategoryImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const token = req.cookies.access_token_admin;
    const category = await categoryServ.editCategoryImage(id, req.file, token);
    return res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};
export const getSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const categorys = await categoryServ.getSubCategory(id);
    return res.status(200).json({ categorys });
  } catch (error) {
    next(error);
  }
};
