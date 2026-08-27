import multer from "multer";
import { ValidationError } from "../errors";

export const multerUpload = multer({
  fileFilter(_req, file, callback) {
    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new ValidationError("Only images can be uploaded"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: multer.memoryStorage(),
});
