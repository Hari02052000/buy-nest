import { injectable } from "tsyringe";
import { Wishlist, WishlistDocument } from "./wishlist.entity";
import { APIError } from "@/shared/errors";

// TODO: Implement repository methods with WishlistModel
@injectable()
export class WishlistRepository {
  async save(wishlist: Wishlist): Promise<Wishlist> {
    // TODO: Implement using WishlistModel.create()
    throw new APIError("Not implemented");
  }

  async findByUserId(userId: string): Promise<Wishlist | null> {
    // TODO: Implement using WishlistModel.findOne({ userId })
    throw new APIError("Not implemented");
  }

  async update(wishlist: Wishlist): Promise<Wishlist> {
    // TODO: Implement using WishlistModel.findOneAndUpdate()
    throw new APIError("Not implemented");
  }

  async delete(userId: string): Promise<boolean> {
    // TODO: Implement using WishlistModel.deleteOne({ userId })
    throw new APIError("Not implemented");
  }

  private mapToWishlist(doc: WishlistDocument): Wishlist {
    return Wishlist.fromDocument(doc);
  }
}
