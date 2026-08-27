import { Schema, model } from "mongoose";
import { ProductDocument } from "./product.entity";

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    brandName: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel = model<ProductDocument>("Product", productSchema);
export default ProductModel;
