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
exports.WishlistService = void 0;
const entities_1 = require("../../../domain/entities");
class WishlistService {
    constructor(wishlistRepository, productRepository, tokenUtils) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.tokenUtils = tokenUtils;
    }
    addToWishlist(userToken, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const product = yield this.productRepository.getSingleProduct(productId);
                if (!product)
                    throw new entities_1.ValidationError("Product not found");
                let wishlist = yield this.wishlistRepository.getWishlistByUserId(userId);
                if (!wishlist) {
                    const newWishList = new entities_1.Wishlist("", userId);
                    wishlist = yield this.wishlistRepository.saveWishlist(newWishList);
                }
                const items = [...wishlist.items];
                const existingItemIndex = items.findIndex(item => typeof item === 'string'
                    ? item === productId
                    : item.id === productId);
                if (existingItemIndex !== -1)
                    throw new entities_1.ValidationError("item allready in    wishList");
                items.push(productId);
                const normalizedItems = items.map((item) => typeof item === "string" ? item : item.id);
                wishlist.setItem(normalizedItems);
                const updatedWishList = yield this.wishlistRepository.updateWishlist(wishlist);
                return updatedWishList.sanitizeWishlist();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    getWishlist(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                let wishlist = yield this.wishlistRepository.getWishlistByUserId(userId);
                if (!wishlist) {
                    const newWishlist = new entities_1.Wishlist("", userId);
                    wishlist = yield this.wishlistRepository.saveWishlist(newWishlist);
                }
                return wishlist.sanitizeWishlist();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    removeFromWishlist(userToken, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const wishlist = yield this.wishlistRepository.getWishlistByUserId(userId);
                if (!wishlist)
                    throw new entities_1.ValidationError("Wishlist not found");
                const updatedItems = [...wishlist.items];
                const itemIndex = updatedItems.findIndex((item) => typeof item === "string" ? item === productId : item.id === productId);
                if (itemIndex === -1)
                    throw new entities_1.ValidationError("Item not found in wishlist");
                updatedItems.splice(itemIndex, 1);
                const normalizedItems = updatedItems.map((item) => typeof item === "string" ? item : item.id);
                wishlist.setItem(normalizedItems);
                const updatedlist = yield this.wishlistRepository.updateWishlist(wishlist);
                return updatedlist.sanitizeWishlist();
            }
            throw new entities_1.AuthorizeError();
        });
    }
    clearWishlist(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUser.isVerified && isValidUser.payload) {
                const userId = isValidUser.payload.id;
                const wishlist = yield this.wishlistRepository.getWishlistByUserId(userId);
                if (!wishlist)
                    throw new entities_1.ValidationError("Wishlist not found");
                wishlist.setItem([]);
                const savedList = yield this.wishlistRepository.updateWishlist(wishlist);
                return savedList.sanitizeWishlist();
            }
            throw new entities_1.AuthorizeError();
        });
    }
}
exports.WishlistService = WishlistService;
