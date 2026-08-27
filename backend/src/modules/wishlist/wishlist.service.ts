import { injectable, inject } from "tsyringe";
import { WishlistRepository } from "./wishlist.repository";
import { Wishlist } from "./wishlist.entity";
import { ValidationError } from "@/shared/errors";

// TODO: Inject ProductRepository to verify products exist
@injectable()
export class WishlistService {
  constructor(private wishlistRepo: WishlistRepository) {}

  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    // TODO: Verify product exists using ProductRepository
    let wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist) {
      wishlist = Wishlist.create(userId);
      wishlist = await this.wishlistRepo.save(wishlist);
    }

    if (wishlist.hasItem(productId)) {
      throw new ValidationError("Item already in wishlist");
    }

    wishlist.addItem(productId);
    return this.wishlistRepo.update(wishlist);
  }

  async getWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist) {
      wishlist = Wishlist.create(userId);
      wishlist = await this.wishlistRepo.save(wishlist);
    }
    return wishlist;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist) throw new ValidationError("Wishlist not found");

    if (!wishlist.hasItem(productId)) {
      throw new ValidationError("Item not found in wishlist");
    }

    wishlist.removeItem(productId);
    return this.wishlistRepo.update(wishlist);
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist) throw new ValidationError("Wishlist not found");

    wishlist.clearItems();
    return this.wishlistRepo.update(wishlist);
  }
}
