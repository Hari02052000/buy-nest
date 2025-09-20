"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const entities_1 = require("../../domain/entities");
const model_1 = require("../../infrastructure/model");
class CartRepository {
    saveCart(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartData = {
                userId: cart.userId,
                items: cart.items,
                totalAmount: cart.totalAmount,
                itemCount: cart.itemCount,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            };
            const savedCart = yield model_1.CartModel.create(cartData);
            return this.mapToCart(savedCart);
        });
    }
    getCartByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield model_1.CartModel.findOne({ userId });
            return cart ? this.mapToCart(cart) : null;
        });
    }
    updateCart(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCart = yield model_1.CartModel.findOneAndUpdate({ userId: cart.userId }, {
                items: cart.items,
                totalAmount: cart.totalAmount,
                itemCount: cart.itemCount,
                updatedAt: cart.updatedAt,
            }, { new: true });
            if (!updatedCart) {
                throw new Error("Cart not found");
            }
            return this.mapToCart(updatedCart);
        });
    }
    deleteCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield model_1.CartModel.deleteOne({ userId });
            return result.deletedCount > 0;
        });
    }
    mapToCart(cartDb) {
        var _a, _b, _c;
        return new entities_1.Cart(typeof cartDb._id === "string" ? cartDb._id : ((_c = (_b = (_a = cartDb._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : ""), cartDb.userId, cartDb.items, cartDb.totalAmount, cartDb.itemCount);
    }
}
exports.CartRepository = CartRepository;
