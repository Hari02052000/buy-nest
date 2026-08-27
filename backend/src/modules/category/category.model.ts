import { Schema, model } from "mongoose";
import { CategoryDocument } from "./category.entity";

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    ancestors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: {
      type: Number,
      default: 0,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = model<CategoryDocument>("Category", categorySchema);
export default CategoryModel;
