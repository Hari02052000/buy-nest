import { productProperties } from "./product";

export class Wishlist {
  id: string;
  userId: string;
  items: string[] | Partial<productProperties>[];
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;

  constructor(id: string = "", userId: string) {
    this.id = id;
    this.userId = userId;
    this.items = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  setItem(items: string[] | Partial<productProperties>[]) {
    this.items = items;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.items = true;
    this.modifiedFields.updatedAt = true;
  }

  sanitizeWishlist() {
    const wishlistProp = {} as Partial<wishlistProperties>;
    wishlistProp.id = this.id;
    wishlistProp.userId = this.userId;
    wishlistProp.items = this.items;
    wishlistProp.createdAt = this.createdAt;
    wishlistProp.updatedAt = this.updatedAt;
    return wishlistProp;
  }

  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type wishlistProperties = Omit<
  Wishlist,
  "sanitizeWishlist" | "sanitizeWishlist" | "setItem" | "modifiedFields" | "clearModifiedFields"
>;

type modifiedFields = {
  [K in keyof Omit<wishlistProperties, "id">]: boolean;
};
