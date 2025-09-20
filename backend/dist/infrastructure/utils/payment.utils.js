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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentUtills = void 0;
const stripe_1 = __importDefault(require("stripe"));
const environment_1 = require("../../infrastructure/config/environment");
const entities_1 = require("../../domain/entities");
if (!environment_1.env.stripe_secret_key || !environment_1.env.stripe_publish_key)
    throw new entities_1.APIError();
const stripe = new stripe_1.default(environment_1.env.stripe_secret_key, {
    apiVersion: "2025-08-27.basil",
});
const createPayment = function (amount, orderId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const metaData = { orderId, userId };
            const paymentIntent = yield stripe.paymentIntents.create({
                amount,
                currency: "inr",
                metadata: metaData,
                description: "Export transaction for order #" + orderId,
            });
            return {
                amount: paymentIntent.amount,
                orderId: orderId,
                publish_key: environment_1.env.stripe_publish_key,
                secret: paymentIntent.client_secret,
                userId,
            };
        }
        catch (error) {
            throw new entities_1.APIError("payment failed");
        }
    });
};
const verifyPayment = function (paymentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let isPayed = false;
            const paymentResponse = yield stripe.paymentIntents.retrieve(paymentId);
            const orderId = paymentResponse.metadata.orderId;
            if (paymentResponse.status === "succeeded")
                isPayed = true;
            return { isPayed, paymentResponse, orderId };
        }
        catch (error) {
            throw new entities_1.APIError();
        }
    });
};
exports.paymentUtills = {
    createPayment,
    verifyPayment,
};
