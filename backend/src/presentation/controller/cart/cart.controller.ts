import { Request, Response } from "express";
import { CartService } from "@/application/services";
import { CartRepository, productRepository } from "@/infrastructure/repository";
import { CouponRepository } from "@/infrastructure/repository/coupon.repository";
import { CouponService } from "@/application/services/coupon/coupon.service";
import { tokenUtils } from "@/infrastructure/utils";
export class CartController {
  private cartService: CartService;

  constructor() {
    const cartRepository = new CartRepository();
    const productRepo = new productRepository();
    const couponRepository = new CouponRepository();
    const couponService = new CouponService(couponRepository);
    this.cartService = new CartService(cartRepository, productRepo, tokenUtils);
  }

  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }

      const cart = await this.cartService.addToCart(userId, productId, quantity);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add item to cart",
      });
    }
  }

  async getCart(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get cart",
      });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId || quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }

      const cart = await this.cartService.updateCartItem(userId, productId, quantity);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update cart item",
      });
    }
  }

  async removeFromCart(req: Request, res: Response) {
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

      const cart = await this.cartService.removeFromCart(userId, productId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove item from cart",
      });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const cart = await this.cartService.clearCart(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear cart",
      });
    }
  }

  async applyCoupon(req: Request, res: Response) {
     try {
    //   const { couponCode } = req.body;
    //   const user = req.user as any;
    //   const userId = user?.id;

    //   if (!userId) {
    //     return res.status(401).json({ message: "User not authenticated" });
    //   }

    //   if (!couponCode) {
    //     return res.status(400).json({ message: "Coupon code is required" });
    //   }

    //   const cart = await this.cartService.applyCoupon(userId, couponCode);
    //   res.status(200).json({
    //     success: true,
    //     message: "Coupon applied successfully",
    //     data: cart.sanitizeCart(),
    //   });
    } catch (error: any) {
    //   res.status(400).json({
    //     success: false,
    //     message: error.message || "Failed to apply coupon",
    //   });
     }
  }


  async removeCoupon(req: Request, res: Response) {
    try {
      // const user = req.user as any;
      // const userId = user?.id;

      // if (!userId) {
      //   return res.status(401).json({ message: "User not authenticated" });
      // }

      // const cart = await this.cartService.removeCoupon(userId);
      // res.status(200).json({
      //   success: true,
      //   message: "Coupon removed successfully",
      //   data: cart.sanitizeCart(),
      // });
    } catch (error: any) {
    //   res.status(500).json({
    //     success: false,
    //     message: error.message || "Failed to remove coupon",
    //   });
     }
  }
}
