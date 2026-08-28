"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { PriceDisplay } from "@/components/shared/product-image";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product?: {
    name: string;
    images?: { url: string; id: string }[];
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  orderStatus: string;
  totalAmount?: number;
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  cancelling?: boolean;
  className?: string;
}

export function OrderCard({
  order,
  onViewDetails,
  onCancel,
  cancelling = false,
  className,
}: OrderCardProps) {
  const canCancel = ["pending", "confirmed"].includes(order.orderStatus);
  const total = order.totalAmount || order.items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Order #{order.id.slice(-8)}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(order.createdAt), "MMM dd, yyyy")}
          </p>
        </div>
        <OrderStatusBadge status={order.orderStatus as never} />
      </div>

      <div className="flex gap-3">
        {order.items.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted"
          >
            <Image
              src={item.product?.images?.[0]?.url || IMAGE_PLACEHOLDER}
              alt={item.product?.name || "Product"}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </p>
          <PriceDisplay price={total} className="text-base" />
        </div>
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order.id)}
            >
              View Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onCancel(order.id)}
              disabled={cancelling}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}