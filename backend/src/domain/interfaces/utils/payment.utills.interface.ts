export interface createPaymentResponse {
  secret: string;
  amount: number;
  publish_key: string;
  orderId: string;
  userId: string;
}

export interface verifyPaymentResponse {
  isPayed: boolean;
  paymentResponse: unknown;
  orderId: string;
}

export interface paymentUtillsInterface {
  createPayment(amount: number, orderId: string, userId: string): Promise<createPaymentResponse>;
  verifyPayment(paymentId: string): Promise<verifyPaymentResponse>;
}
