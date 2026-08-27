import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { CartService } from "./cart.service";
import { CART_TOKENS } from "./cart.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class CartController {
  constructor(
    @inject(CART_TOKENS.Service) private cartService: CartService,
  ) {}

  addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const { productId, quantity } = req.body;
      if (!productId || !quantity || quantity <= 0) {
        res.status(400).json(ResponseUtils.error("Invalid product ID or quantity"));
        return;
      }

      const cart = await this.cartService.addToCart(userId, productId, quantity);
      res.status(200).json(ResponseUtils.success({ cart }));
    } catch (error) {
      next(error);
    }
  };

  getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const cart = await this.cartService.getCart(userId);
      res.status(200).json(ResponseUtils.success({ cart }));
    } catch (error) {
      next(error);
    }
  };

  updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const { productId, quantity } = req.body;
      if (!productId || quantity === undefined || quantity < 0) {
        res.status(400).json(ResponseUtils.error("Invalid product ID or quantity"));
        return;
      }

      const cart = await this.cartService.updateCartItem(userId, productId, quantity);
      res.status(200).json(ResponseUtils.success({ cart }));
    } catch (error) {
      next(error);
    }
  };

  removeFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const { productId } = req.params;
      if (!productId) {
        res.status(400).json(ResponseUtils.error("Product ID is required"));
        return;
      }

      const cart = await this.cartService.removeFromCart(userId, productId);
      res.status(200).json(ResponseUtils.success({ cart }));
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const cart = await this.cartService.clearCart(userId);
      res.status(200).json(ResponseUtils.success({ cart }));
    } catch (error) {
      next(error);
    }
  };
}
