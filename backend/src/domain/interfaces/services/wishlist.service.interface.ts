import { wishlistProperties } from "@/domain/entities";

export interface wishlistServiceInterface {
  addToWishlist(userToken: string, productId: string): Promise<Partial<wishlistProperties>>;
  getWishlist(userToken: string): Promise<Partial<wishlistProperties>>;
  removeFromWishlist(userToken: string, productId: string): Promise<Partial<wishlistProperties>>;
  clearWishlist(userToken: string): Promise<Partial<wishlistProperties>>;
}
