// TODO: Implement when invoice PDF feature is needed
export interface InvoiceData {
  orderId: string;
  items: unknown[];
  total: number;
}

// Placeholder — PDF generation not yet implemented
export const invoiceUtils = {
  async generateInvoicePDF(_order: unknown): Promise<Buffer> {
    return Buffer.alloc(0);
  },
  generateInvoiceFilename(_order: unknown): string {
    return "invoice.pdf";
  },
};
