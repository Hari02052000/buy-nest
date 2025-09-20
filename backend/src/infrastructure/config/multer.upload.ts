import multer from "multer";
import { ValidationError } from "@/domain/entities";

export const multerUpload = multer({
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image")) callback(null, true);
    else callback(new ValidationError("only images can upload"));
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit per file
  },
  storage: multer.memoryStorage(),
});
