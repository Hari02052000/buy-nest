import { Coupon, couponProperties } from "@/domain/entities/coupon";

export interface couponResponseInterface{
  isApplied:boolean
  couponCode:string
  discount:number
}

export interface CouponServiceInterface {
  getCouponById(adminToken:string,id: string): Promise<Partial<couponProperties> | null>;
  getCoupons(adminToken:string,limit:number,page:number):Promise<Partial<couponProperties[]>>
  createCoupon(adminToken:string,reqBody:unknown): Promise<Partial<couponProperties>>;
  updateCoupon(id: string, reqBody:unknown): Promise<Coupon | null>;
  applyCoupon(userToken:string,reqBody:unknown): Promise<couponResponseInterface>
}
