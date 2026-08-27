import { Request, Response, NextFunction } from "express";
import { multerUpload } from "../config/multer";
import { APIError, ValidationError } from "../errors";

export const uploadCategory = (req: Request, res: Response, next: NextFunction): void => {
  multerUpload.single("image")(req, res, (err) => {
    if (err) {
      if (err.message === "Only images can be uploaded") {
        next(new ValidationError(err.message));
      } else {
        next(new APIError(err.message));
      }
      return;
    }
    next();
  });
};

export const uploadProduct = (req: Request, res: Response, next: NextFunction): void => {
  multerUpload.array("images", 10)(req, res, (err) => {
    if (err) {
      if (err.message === "Only images can be uploaded") {
        next(new ValidationError(err.message));
      } else {
        next(new APIError(err.message));
      }
      return;
    }
    next();
  });
};
