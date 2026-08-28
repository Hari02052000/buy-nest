import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/product-image";

interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
  onCheckout?: () => void;
  className?: string;
}

export function CartSummary({
  totalAmount,
  itemCount,
  onCheckout,
  className,
}: CartSummaryProps) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      <h2 className="font-semibold text-lg">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <PriceDisplay price={totalAmount} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated at checkout</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <PriceDisplay price={totalAmount} className="text-lg" />
      </div>
      {onCheckout && (
        <Button className="w-full" size="lg" onClick={onCheckout}>
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
}