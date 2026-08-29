import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/lib/api/types";

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-status-pending/15 text-status-pending",
  confirmed: "bg-status-confirmed/15 text-status-confirmed",
  processing: "bg-status-processing/15 text-status-processing",
  shipped: "bg-status-shipped/15 text-status-shipped",
  delivered: "bg-status-delivered/15 text-status-delivered",
  cancelled: "bg-status-cancelled/15 text-status-cancelled",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-payment-pending/15 text-payment-pending",
  processing: "bg-status-processing/15 text-status-processing",
  completed: "bg-payment-completed/15 text-payment-completed",
  failed: "bg-payment-failed/15 text-payment-failed",
  refunded: "bg-payment-refunded/15 text-payment-refunded",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        ORDER_STATUS_STYLES[status],
        className,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PAYMENT_STATUS_STYLES[status],
        className,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function ListedBadge({
  isListed,
  className,
}: {
  isListed: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isListed
          ? "bg-status-delivered/15 text-status-delivered"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isListed ? "Listed" : "Unlisted"}
    </span>
  );
}
