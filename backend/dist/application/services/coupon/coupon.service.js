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
exports.CouponService = void 0;
class CouponService {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    validateCoupon(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.couponRepository.getCouponByCode(code);
            // if (!coupon || !coupon.isValid()) {
            //   return null;
            // }
            return coupon;
        });
    }
    applyCoupon(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield this.validateCoupon(code);
            if (!coupon) {
                throw new Error("Invalid or expired coupon code");
            }
            return coupon;
        });
    }
    incrementUsage(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.couponRepository.incrementUsageCount(couponId);
        });
    }
}
exports.CouponService = CouponService;
