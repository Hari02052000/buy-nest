import { couponProperties } from "./coupon";
import { productProperties } from "./product";

export class Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  appliedCoupon: string | couponProperties | null;
  discountAmount: number;

  constructor(
    id: string = "",
    userId: string,
    items: CartItem[] = [],
    totalAmount: number = 0,
    itemCount: number = 0,
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.itemCount = itemCount;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.discountAmount = 0;
    this.appliedCoupon = null
  }
  setItem(items: CartItem[]) {
    this.items = items;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.items = true;
    this.modifiedFields.updatedAt = true;
  }
  setTotalAmount(amount: number) {
    this.totalAmount = amount;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.totalAmount = true;
    this.modifiedFields.updatedAt = true;
  }
  setAppliedCoupon(coupon:string|couponProperties){
  this.appliedCoupon = coupon
  this.updatedAt = new Date().toISOString();
  this.modifiedFields.appliedCoupon =true;
  this.modifiedFields.updatedAt = true;
  }
  setDiscountAmount(amount:number){
  this.discountAmount = amount
  this.updatedAt = new Date().toISOString();
  this.modifiedFields.discountAmount =true;
  this.modifiedFields.updatedAt = true;
  }

  sanitizeCart() {
    const cart = {} as Partial<cartProperties>;
    cart.id = this.id;
    cart.userId = this.userId;
    cart.items = this.items;
    cart.totalAmount = this.totalAmount;
    cart.itemCount = this.itemCount;
    cart.appliedCoupon = this.appliedCoupon;
    cart.discountAmount = this.discountAmount;
    cart.createdAt = this.createdAt;
    cart.updatedAt = this.updatedAt;
    return cart;
  }

  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export interface CartItem {
  product: Partial<productProperties> | string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type cartProperties = Omit<
  Cart,
  "sanitizeCart" |
  "modifiedFields" | 
  "setItem" | 
  "setTotalAmount" |
  "setAppliedCoupon" |
  "setDiscountAmount" |
  "clearModifiedFields"
>;

type modifiedFields = {
  [K in keyof Omit<cartProperties, "id">]: boolean;
};
