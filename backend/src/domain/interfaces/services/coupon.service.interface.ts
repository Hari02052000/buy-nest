import { Coupon, couponProperties } from "@/domain/entities/coupon";

export interface CouponServiceInterface {
  getCouponById(adminToken:string,id: string): Promise<Partial<couponProperties> | null>;
  getCoupons(adminToken:string,limit:number,page:number):Promise<Partial<couponProperties[]>>
  createCoupon(adminToken:string,reqBody:unknown): Promise<Partial<couponProperties>>;
  updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon | null>;
}
