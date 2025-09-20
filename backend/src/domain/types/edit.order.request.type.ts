export interface editOrderRequestType {
  orderStatus?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "processing" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentIntentId?: string;
}
