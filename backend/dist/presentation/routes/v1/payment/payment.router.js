"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { PaymentController } from '../../../../presentation/controller/payment/payment.controller';
// import { StripeService } from '../../../../application/services/payment/stripe.service';
// import { OrderService } from '../../../../application/services/order/order.service';
// import { OrderRepository } from '../../../../infrastructure/repository/order.repository';
// import { CartRepository } from '../../../../infrastructure/repository';
// import { paymentUtills } from '../../../../infrastructure/utils';
// import { authenticateUser } from '../../../../presentation/middleware/auth.middleware';
// import express from 'express';
const router = (0, express_1.Router)();
// Initialize services
// const orderRepository = new OrderRepository();
// const cartRepository = new CartRepository();
// const orderService = new OrderService(orderRepository, cartRepository,paymentUtills);
// const stripeService = new StripeService();
// const paymentController = new PaymentController(stripeService, orderService);
// Payment routes
// router.post('/create-payment-intent', authenticateUser, (req, res, next) =>
//   paymentController.createPaymentIntent(req, res, next)
// );
// router.post('/confirm-payment', authenticateUser, (req, res, next) =>
//   paymentController.confirmPayment(req, res, next)
// );
// Webhook route - no auth middleware, raw body needed
// router.post('/webhook',
//   express.raw({ type: 'application/json' }),
//   (req, res, next) => paymentController.handleWebhook(req, res, next)
// );
// router.post('/create-customer', authenticateUser, (req, res, next) =>
//   paymentController.createCustomer(req, res, next)
// );
exports.default = router;
