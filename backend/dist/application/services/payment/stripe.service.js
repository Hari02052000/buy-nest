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
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const errors_1 = require("../../../domain/entities/errors");
const status_code_1 = require("../../../domain/entities/status.code");
class StripeService {
    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is required");
        }
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    }
    createPaymentIntent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.create({
                    amount: Math.round(data.amount * 100), // Convert to cents
                    currency: data.currency || "usd",
                    customer: data.customerId,
                    metadata: Object.assign({ orderId: data.orderId }, data.metadata),
                    automatic_payment_methods: {
                        enabled: true,
                    },
                });
                return {
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                };
            }
            catch (error) {
                throw new errors_1.CustomError("Payment intent creation failed", status_code_1.STATUS_CODES.INTERNAL_ERROR, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    confirmPayment(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(paymentIntentId);
                return paymentIntent;
            }
            catch (error) {
                throw new errors_1.CustomError("Payment confirmation failed", status_code_1.STATUS_CODES.INTERNAL_ERROR, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    handleWebhook(payload, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
                if (!webhookSecret) {
                    throw new Error("STRIPE_WEBHOOK_SECRET is required");
                }
                const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
                return event;
            }
            catch (error) {
                throw new errors_1.CustomError("Webhook verification failed", status_code_1.STATUS_CODES.BAD_REQUEST, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    createCustomer(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield this.stripe.customers.create({
                    email,
                    name,
                });
                return customer;
            }
            catch (error) {
                throw new errors_1.CustomError("Customer creation failed", status_code_1.STATUS_CODES.INTERNAL_ERROR, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    refundPayment(paymentIntentId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refund = yield this.stripe.refunds.create({
                    payment_intent: paymentIntentId,
                    amount: amount ? Math.round(amount * 100) : undefined,
                });
                return refund;
            }
            catch (error) {
                throw new errors_1.CustomError("Refund failed", status_code_1.STATUS_CODES.INTERNAL_ERROR, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
}
exports.StripeService = StripeService;
