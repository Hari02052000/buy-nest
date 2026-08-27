import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { WishlistService } from "./wishlist.service";
import { WISHLIST_TOKENS } from "./wishlist.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class WishlistController {
  constructor(
    @inject(WISHLIST_TOKENS.Service) private wishlistService: WishlistService,
  ) {}

  addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await this.wishlistService.addToWishlist(req.user!.id, req.params.productId);
      res.json(ResponseUtils.success({ wishlist }, "Item added to wishlist"));
    } catch (error) {
      next(error);
    }
  };

  getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await this.wishlistService.getWishlist(req.user!.id);
      res.json(ResponseUtils.success({ wishlist }));
    } catch (error) {
      next(error);
    }
  };

  removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await this.wishlistService.removeFromWishlist(req.user!.id, req.params.productId);
      res.json(ResponseUtils.success({ wishlist }, "Item removed from wishlist"));
    } catch (error) {
      next(error);
    }
  };

  clearWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await this.wishlistService.clearWishlist(req.user!.id);
      res.json(ResponseUtils.success({ wishlist }, "Wishlist cleared"));
    } catch (error) {
      next(error);
    }
  };
}
