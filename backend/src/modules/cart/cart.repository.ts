import { injectable } from "tsyringe";
import CartModel from "./cart.model";
import { Cart } from "./cart.entity";
import { APIError, ValidationError } from "@/shared/errors";

@injectable()
export class CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    try {
      const doc = await CartModel.findOne({ userId });
      if (!doc) return null;
      return Cart.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find cart by user id");
    }
  }

  async findById(id: string): Promise<Cart | null> {
    try {
      const doc = await CartModel.findById(id);
      if (!doc) return null;
      return Cart.fromDocument(doc);
    } catch (error) {
      throw new APIError("Failed to find cart");
    }
  }

  async save(cart: Cart): Promise<Cart> {
    try {
      const doc = new CartModel({
        userId: cart.userId,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount,
        appliedCoupon: cart.appliedCoupon,
        discountAmount: cart.discountAmount,
      });
      const saved = await doc.save();
      return Cart.fromDocument(saved);
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ValidationError("Cart already exists for this user");
      }
      throw new APIError("Failed to save cart");
    }
  }

  async update(cart: Cart): Promise<Cart> {
    try {
      const doc = await CartModel.findByIdAndUpdate(
        cart.id,
        {
          $set: {
            items: cart.items,
            totalAmount: cart.totalAmount,
            itemCount: cart.itemCount,
            appliedCoupon: cart.appliedCoupon,
            discountAmount: cart.discountAmount,
            updatedAt: new Date(),
          },
        },
        { new: true },
      );
      if (!doc) throw new ValidationError("Cart not found after update");
      return Cart.fromDocument(doc);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new APIError("Failed to update cart");
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await CartModel.findOneAndDelete({ userId });
    } catch (error) {
      throw new APIError("Failed to delete cart");
    }
  }
}
