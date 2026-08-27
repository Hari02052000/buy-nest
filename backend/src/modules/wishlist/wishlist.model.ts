import { Schema, model } from "mongoose";
import { WishlistDocument } from "./wishlist.entity";

const wishlistSchema = new Schema<WishlistDocument>(
  {
    userId: { type: String, required: true, unique: true },
    items: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false },
);

const WishlistModel = model<WishlistDocument>("Wishlist", wishlistSchema);
export default WishlistModel;
