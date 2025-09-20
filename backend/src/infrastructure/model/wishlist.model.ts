import mongoose, { Document, Schema } from "mongoose";
import { Wishlist,wishlistProperties } from "@/domain/entities";

export interface IWishlist extends Document {
  userId: string;
  items: [];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// const wishlistItemSchema = new Schema<WishlistItem>({
//   productId: { type: String, required: true },
//   product: {
//     id: { type: String, required: true },
//     name: { type: String, required: true },
//     images: [
//       {
//         url: { type: String, required: true },
//         id: { type: String, required: true },
//       },
//     ],
//     price: { type: String, required: true },
//     brandName: { type: String, required: true },
//     modelName: { type: String, required: true },
//     description: { type: String, required: true },
//     stock: { type: Number, required: true },
//   },
//   addedAt: { type: String, default: () => new Date().toISOString() },
// });

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: false,
  },
);

export const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
