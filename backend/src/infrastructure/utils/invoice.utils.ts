import PDFDocument from "pdfkit";
import { Order } from "@/domain/entities/order";
import fs from "fs";
import path from "path";

export interface InvoiceData {
  order: Order;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

export class InvoiceUtils {
  private static readonly COMPANY_INFO = {
    name: "L7 E-Commerce",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "support@l7ecommerce.com",
    website: "www.l7ecommerce.com",
  };

  /**
   * Generate PDF invoice from order data
   */
  static async generateInvoicePDF(order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        this.addHeader(doc, order);

        // Company and customer info
        doc
          .fontSize(12)
          .text("From:", 50, 120)
          .fontSize(10)
          .text(this.COMPANY_INFO.name, 50, 140)
          .text(this.COMPANY_INFO.address, 50, 155)
          .text(`Phone: ${this.COMPANY_INFO.phone}`, 50, 170)
          .text(`Email: ${this.COMPANY_INFO.email}`, 50, 185)
          .text(`Website: ${this.COMPANY_INFO.website}`, 50, 200);
        this.addCustomerInfo(doc, order);

        // Invoice details
        this.addInvoiceDetails(doc, order);

        // Items table
        // Draw items table header
        doc
          .fontSize(10)
          .text("Item", 50, 300)
          .text("Quantity", 200, 300)
          .text("Price", 300, 300)
          .text("Total", 400, 300);

        // Draw line under header
        doc.moveTo(50, 315).lineTo(550, 315).stroke();

        // Draw items
        let currentY = 330;
        // order.items.forEach(item => {
        //   doc.text(item.productName, 50, currentY)
        //      .text(item.quantity.toString(), 200, currentY)
        //      .text(`$${item.price.toFixed(2)}`, 300, currentY)
        //      .text(`$${(item.quantity * item.price).toFixed(2)}`, 400, currentY);
        //   currentY += 20;
        // });

        // Summary
        this.addSummary(doc, order);

        // Footer
        // Add footer text
        doc.fontSize(8).text("Thank you for your business!", 50, doc.page.height - 50, {
          align: "center",
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate invoice data for frontend display
   */
  static generateInvoiceData(order: Order): any {
    return {
      invoiceNumber: order.id,
      orderDate: order.createdAt,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      companyInfo: this.COMPANY_INFO,
      customerInfo: {
        //name: order.shippingAddress.fullName,
        //email: order.userId, // Assuming userId is email
        //address: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
        //phone: order.shippingAddress.phone
      },
      items: order.items.map((item) => ({
        //name: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      summary: {
        // subtotal: order.orderSummary.subtotal,
        // deliveryFee: order.orderSummary.deliveryFee,
        // serviceFee: order.orderSummary.serviceFee,
        // tax: order.orderSummary.tax,
        // tip: order.orderSummary.tip,
        //discount: order.orderSummary.discountAmount,
        // total: order.orderSummary.total
      },
      paymentInfo: {
        method: order.paymentInfo.method,
        status: order.paymentInfo.paymentStatus,
        transactionId: order.paymentInfo.transactionId,
      },
      orderStatus: order.orderStatus,
    };
  }

  private static addHeader(doc: PDFKit.PDFDocument, order: Order): void {
    // doc.fontSize(20)
    //    .text('INVOICE', 50, 50, { align: 'center' })
    //    .fontSize(12)
    //    .text(`Invoice #${order.orderId}`, 50, 80, { align: 'center' })
    //    .moveDown();
  }

  private static addCustomerInfo(doc: PDFKit.PDFDocument, order: Order): void {
    const startY = 120;
    //const { shippingAddress } = order;

    // doc.fontSize(12)
    //    .text('Bill To:', 350, startY)
    //    .fontSize(10)
    //    .text(shippingAddress.fullName, 350, startY + 20)
    //    .text(shippingAddress.addressLine1, 350, startY + 35)
    //    .text(`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`, 350, startY + 50)
    //    .text(`Phone: ${shippingAddress.phone}`, 350, startY + 65);
  }

  private static addInvoiceDetails(doc: PDFKit.PDFDocument, order: Order): void {
    const startY = 220;

    doc
      .fontSize(10)
      .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, startY)
      .text(`Order Status: ${order.orderStatus}`, 50, startY + 15)
      .text(`Payment Status: ${order.paymentInfo.paymentStatus}`, 50, startY + 30)
      .text(`Payment Method: ${order.paymentInfo.method}`, 50, startY + 45);

    // if (order.trackingNumber) {
    //   doc.text(`Tracking Number: ${order.trackingNumber}`, 50, startY + 60);
    // }
  }

  private static addSummary(doc: PDFKit.PDFDocument, order: Order): void {
    // const { orderSummary } = order;
    let currentY = 450;

    // const summaryItems = [
    //   { label: 'Subtotal:', amount: orderSummary.subtotal },
    //   { label: 'Delivery Fee:', amount: orderSummary.deliveryFee },
    //   { label: 'Service Fee:', amount: orderSummary.serviceFee },
    //   { label: 'Tax:', amount: orderSummary.tax },
    //   { label: 'Tip:', amount: orderSummary.tip },
    //   { label: 'Discount:', amount: -orderSummary.discountAmount },
    // ];

    // summaryItems.forEach(item => {
    //   if (item.amount > 0 || item.label === 'Discount:') {
    //     doc.fontSize(10)
    //        .text(item.label, 400, currentY)
    //        .text(`$${Math.abs(item.amount).toFixed(2)}`, 500, currentY);
    //     currentY += 15;
    //   }
    // });

    // // Total
    // doc.fontSize(12)
    //    .text('Total:', 400, currentY + 10)
    //    .text(`$${orderSummary.total.toFixed(2)}`, 500, currentY + 10);

    // Draw line above total
    doc
      .moveTo(400, currentY + 5)
      .lineTo(550, currentY + 5)
      .stroke();
  }

  /**
   * Generate invoice filename
   */
  static generateInvoiceFilename(order: Order): string {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    return "";
    // return `invoice-${order.orderId}-${date}.pdf`;
  }
}

export const invoiceUtils = InvoiceUtils;
