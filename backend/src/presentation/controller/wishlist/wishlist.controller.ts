import { Request, Response } from "express";
import { WishlistService } from "@/application/services";
import { WishlistRepository, productRepository } from "@/infrastructure/repository";
import { tokenUtils } from "@/infrastructure/utils";

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    const wishlistRepository = new WishlistRepository();
    const productRepo = new productRepository();
    this.wishlistService = new WishlistService(wishlistRepository, productRepo,tokenUtils);
  }

  async addToWishlist(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const wishlist = await this.wishlistService.addToWishlist(userId, productId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add item to wishlist",
      });
    }
  }

  async getWishlist(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const wishlist = await this.wishlistService.getWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get wishlist",
      });
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const wishlist = await this.wishlistService.removeFromWishlist(userId, productId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove item from wishlist",
      });
    }
  }

  async clearWishlist(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const wishlist = await this.wishlistService.clearWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear wishlist",
      });
    }
  }
}
