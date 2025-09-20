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
exports.emailUtils = exports.EmailUtils = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const invoice_utils_1 = require("./invoice.utils");
class EmailUtils {
    static initialize(config) {
        this.transporter = nodemailer_1.default.createTransport(config);
    }
    static sendOrderConfirmationEmail(order, customerEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoicePDF = yield invoice_utils_1.invoiceUtils.generateInvoicePDF(order);
                const filename = invoice_utils_1.invoiceUtils.generateInvoiceFilename(order);
                const mailOptions = {
                    from: "orders@l7ecommerce.com",
                    to: customerEmail,
                    subject: `Order Confirmation`,
                    //subject: `Order Confirmation - ${order.orderId}`,
                    html: this.generateOrderConfirmationHTML(order),
                    attachments: [
                        {
                            filename,
                            content: invoicePDF,
                            contentType: "application/pdf",
                        },
                    ],
                };
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Failed to send order confirmation email:", error);
                throw error;
            }
        });
    }
    static generateOrderConfirmationHTML(order) {
        // return `
        //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        //     <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
        //     <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        //       <h2 style="color: #28a745; margin-top: 0;">Thank you for your order!</h2>
        //       <p><strong>Order Number:</strong> ${order.orderId}</p>
        //       <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        //       <p><strong>Total Amount:</strong> $${order.orderSummary.total.toFixed(2)}</p>
        //     </div>
        //     <div style="margin: 20px 0;">
        //       <h3>Shipping Address:</h3>
        //       <p>
        //         ${order.shippingAddress.fullName}<br>
        //         ${order.shippingAddress.addressLine1}<br>
        //         ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        //         Phone: ${order.shippingAddress.phone}
        //       </p>
        //     </div>
        //     <div style="margin: 20px 0;">
        //       <h3>Order Items:</h3>
        //       <table style="width: 100%; border-collapse: collapse;">
        //         <thead>
        //           <tr style="background-color: #f8f9fa;">
        //             <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
        //             <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
        //             <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           ${order.items.map(item => `
        //             <tr>
        //               <td style="padding: 10px; border: 1px solid #ddd;">${item.productName}</td>
        //               <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
        //               <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${(item.quantity * item.price).toFixed(2)}</td>
        //             </tr>
        //           `).join('')}
        //         </tbody>
        //       </table>
        //     </div>
        //     <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        //       <p style="margin: 0; text-align: center; color: #666;">
        //         Your invoice is attached to this email. You can also view your order details and track your shipment by logging into your account.
        //       </p>
        //     </div>
        //     <div style="text-align: center; margin: 30px 0; color: #666; font-size: 14px;">
        //       <p>Thank you for shopping with L7 E-Commerce!</p>
        //       <p>If you have any questions, please contact us at support@l7ecommerce.com</p>
        //     </div>
        //   </div>
        // `;
        return "";
    }
}
exports.EmailUtils = EmailUtils;
exports.emailUtils = EmailUtils;
