import { AuthorizeError, ValidationError, Wishlist, wishlistProperties } from "@/domain/entities";
import { wishlistServiceInterface } from "@/domain/interfaces/services";
import { wishlistRepositoryInterface,productRepositoryInterface } from "@/domain/interfaces/repository";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";

export class WishlistService implements wishlistServiceInterface {
  constructor(
    private wishlistRepository: wishlistRepositoryInterface,
    private productRepository: productRepositoryInterface,
    private tokenUtils: tokenValidationUtillsInterface
  ) {}

  async addToWishlist(userToken: string, productId: string): Promise<Partial<wishlistProperties>> {
        const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
    const product = await this.productRepository.getSingleProduct(productId);
    if (!product) throw new ValidationError("Product not found");
    let wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    if (!wishlist) {
      const newWishList = new Wishlist("", userId);
      wishlist = await this.wishlistRepository.saveWishlist(newWishList)
    }
    const items = [...wishlist.items]
      const existingItemIndex = items.findIndex(item =>
    typeof item === 'string'
      ? item === productId
      : item.id === productId
  );

  if (existingItemIndex !== -1) throw new ValidationError("item allready in    wishList")
    items.push(productId)
         const normalizedItems = items.map((item)=>typeof item === "string" ? item : item.id!)
    wishlist.setItem(normalizedItems)
    const updatedWishList = await this.wishlistRepository.updateWishlist(wishlist);
    return updatedWishList.sanitizeWishlist()
    }
    throw new AuthorizeError()
  }

  async getWishlist(userToken: string): Promise<Partial<wishlistProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
      const userId = isValidUser.payload.id!;
    let wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    if (!wishlist) {
      const newWishlist = new Wishlist("", userId);
      wishlist = await this.wishlistRepository.saveWishlist(newWishlist)
    }
    return wishlist.sanitizeWishlist()
  }
  throw new AuthorizeError()
  }

  async removeFromWishlist(userToken: string, productId: string): Promise<Partial<wishlistProperties>> {
     const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
     const userId = isValidUser.payload.id!;
     const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    if (!wishlist) throw new ValidationError("Wishlist not found");
    const updatedItems = [...wishlist.items];
      const itemIndex = updatedItems.findIndex((item) =>
        typeof item === "string" ? item === productId : item.id === productId,
      );
      if (itemIndex === -1) throw new ValidationError("Item not found in wishlist");
     updatedItems.splice(itemIndex, 1);
     const normalizedItems = updatedItems.map((item)=>typeof item === "string" ? item : item.id!)
    wishlist.setItem(normalizedItems)
    const updatedlist = await this.wishlistRepository.updateWishlist(wishlist);
     return updatedlist.sanitizeWishlist()
    }
    throw new AuthorizeError()
  }

  async clearWishlist(userToken: string): Promise<Partial<wishlistProperties>> {
    const isValidUser = this.tokenUtils.isValidUserToken(userToken);
    if (isValidUser.isVerified && isValidUser.payload) {
     const userId = isValidUser.payload.id!;
         const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    if (!wishlist) throw new ValidationError("Wishlist not found");

    wishlist.setItem([])
    const savedList = await this.wishlistRepository.updateWishlist(wishlist);
     return savedList.sanitizeWishlist()
    }
   throw new AuthorizeError()
  }
}
