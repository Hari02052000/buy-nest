import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/product-image";

interface OrderSummaryItem {
  product: {
    name: string;
    images?: { url: string; id: string }[];
  };
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderSummaryItem[];
  totalAmount: number;
  className?: string;
}

export function OrderSummary({
  items,
  totalAmount,
  className,
}: OrderSummaryProps) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      <h2 className="font-semibold text-lg">Order Summary</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity} × <PriceDisplay price={item.price} />
              </p>
            </div>
            <PriceDisplay
              price={item.quantity * item.price}
              className="text-sm"
            />
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <PriceDisplay price={totalAmount} className="text-lg" />
      </div>
    </div>
  );
}