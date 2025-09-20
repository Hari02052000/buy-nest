"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
class Wishlist {
    constructor(id = "", userId) {
        this._modifiedFields = {};
        this.id = id;
        this.userId = userId;
        this.items = [];
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setItem(items) {
        this.items = items;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.items = true;
        this.modifiedFields.updatedAt = true;
    }
    sanitizeWishlist() {
        const wishlistProp = {};
        wishlistProp.id = this.id;
        wishlistProp.userId = this.userId;
        wishlistProp.items = this.items;
        wishlistProp.createdAt = this.createdAt;
        wishlistProp.updatedAt = this.updatedAt;
        return wishlistProp;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Wishlist = Wishlist;
