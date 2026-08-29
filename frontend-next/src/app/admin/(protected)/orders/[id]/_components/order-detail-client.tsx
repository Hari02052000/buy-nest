"use client";

import * as React from "react";
import { PriceDisplay } from "@/components/shared/product-image";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  useChangeOrderStatus,
  useChangePaymentStatus,
} from "@/lib/query/hooks/useOrders";
import { toast } from "sonner";
import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "@/lib/api/types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
];

export function OrderDetailClient({ order }: { order: AdminOrder }) {
  const changeOrderStatus = useChangeOrderStatus();
  const changePaymentStatus = useChangePaymentStatus();

  const onOrderStatus = async (status: OrderStatus) => {
    try {
      await changeOrderStatus.mutateAsync({ id: order.id, orderStatus: status });
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const onPaymentStatus = async (status: PaymentStatus) => {
    try {
      await changePaymentStatus.mutateAsync({
        id: order.id,
        paymentStatus: status,
      });
      toast.success(`Payment marked as ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentInfo.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b pb-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    Product #{item.productId.slice(-8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <PriceDisplay price={item.price} />
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × <PriceDisplay price={item.price} />
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <PriceDisplay price={order.paymentInfo.payableAmount} />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Method</span>
                <span className="capitalize">{order.paymentInfo.method}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Order Status</Label>
                <Select
                  value={order.orderStatus}
                  onValueChange={(v) => onOrderStatus(v as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Payment Status</Label>
                <Select
                  value={order.paymentInfo.paymentStatus}
                  onValueChange={(v) => onPaymentStatus(v as PaymentStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
