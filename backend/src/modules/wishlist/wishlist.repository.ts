import { injectable } from "tsyringe";
import WishlistModel from "./wishlist.model";
import { Wishlist, WishlistDocument } from "./wishlist.entity";
import { APIError } from "@/shared/errors";

@injectable()
export class WishlistRepository {
  async save(wishlist: Wishlist): Promise<Wishlist> {
    try {
      const doc = new WishlistModel({
        userId: wishlist.userId,
        items: wishlist.items,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      });
      const saved = await doc.save();
      return Wishlist.fromDocument(saved);
    } catch (error) {
      throw new APIError("Failed to save wishlist");
    }
  }

  async findByUserId(userId: string): Promise<Wishlist | null> {
    try {
      const doc = await WishlistModel.findOne({ userId });
      if (!doc) return null;
      return Wishlist.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find wishlist");
    }
  }

  async update(wishlist: Wishlist): Promise<Wishlist> {
    try {
      const doc = await WishlistModel.findOneAndUpdate(
        { userId: wishlist.userId },
        { $set: { items: wishlist.items, updatedAt: new Date().toISOString() } },
        { new: true },
      );
      if (!doc) throw new APIError("Wishlist not found");
      return Wishlist.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to update wishlist");
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const result = await WishlistModel.deleteOne({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      throw new APIError("Failed to delete wishlist");
    }
  }
}
