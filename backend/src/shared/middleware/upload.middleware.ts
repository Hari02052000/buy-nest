import { Request, Response, NextFunction } from "express";
import { multerUpload } from "../config/multer";
import { APIError } from "../errors";

export const uploadCategory = (req: Request, res: Response, next: NextFunction): void => {
  multerUpload.single("image")(req, res, (err) => {
    if (err) {
      next(new APIError(err.message));
      return;
    }
    next();
  });
};

export const uploadProduct = (req: Request, res: Response, next: NextFunction): void => {
  multerUpload.array("images", 10)(req, res, (err) => {
    if (err) {
      next(new APIError(err.message));
      return;
    }
    next();
  });
};
