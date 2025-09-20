import { APIError } from "@/domain/entities";
import { multerUpload } from "@/infrastructure/config/multer.upload";
import { Request, Response, NextFunction } from "express";

export const uploadCategory = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = multerUpload.single("image");
    result(req, res, (err) => {
      if (err) next(new APIError(`image not uploaded ${err}`));
      else next();
    });
  } catch (error) {
    next(error);
  }
};
export const uploadProduct = (req: Request, res: Response, next: NextFunction) => {
  const result = multerUpload.array("images", 10);
  result(req, res, (err) => {
    if (err) throw new APIError(`image not uploaded ${err}`);
    else {
      next();
    }
  });
};
export const uploadProfile = (req: Request, res: Response, next: NextFunction) => {};
