export interface createOrderRequest {
  addressId: string;
  paymentMethod: "cod" | "online";
  coupon: {
    isApplied: boolean;
    couponId?: string;
    discount?: string;
  };
}
