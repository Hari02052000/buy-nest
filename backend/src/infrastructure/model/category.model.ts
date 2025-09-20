import { Schema, Document, model } from "mongoose";
import { categoryProperties } from "@/domain/entities";

type categoryWithoutParentId = Omit<categoryProperties, "parentId" | "ancestors">;
type categoryDb = categoryWithoutParentId & {
  parentId: Schema.Types.ObjectId;
  ancestors: Schema.Types.ObjectId[];
};
export type Icategory = categoryDb & Document;

const categorySchema: Schema<Icategory> = new Schema(
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

const CategoryModel = model<Icategory>("Category", categorySchema);

export default CategoryModel;
