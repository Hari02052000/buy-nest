import nodemailer from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
}

// TODO: Implement when email feature is needed
export class EmailUtils {
  private static transporter: nodemailer.Transporter;

  static initialize(config: EmailConfig): void {
    this.transporter = nodemailer.createTransport(config);
  }

  // TODO: Implement order confirmation email
  static async sendOrderConfirmationEmail(_order: unknown, _customerEmail: string): Promise<void> {
    // Placeholder — not yet implemented
  }
}

export const emailUtils = EmailUtils;
