import { Wishlist } from "@/domain/entities";

export interface wishlistRepositoryInterface {
  saveWishlist(wishlist: Wishlist): Promise<Wishlist>;
  getWishlistByUserId(userId: string): Promise<Wishlist | null>;
  updateWishlist(wishlist: Wishlist): Promise<Wishlist>;
  deleteWishlist(userId: string): Promise<boolean>;
  mapToWishlist(wishlistDb: unknown): Wishlist;
}
