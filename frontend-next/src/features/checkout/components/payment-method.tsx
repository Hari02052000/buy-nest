"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethodType = "cod" | "online";

interface PaymentMethodProps {
  value?: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
  className?: string;
}

export function PaymentMethod({
  value,
  onChange,
  className,
}: PaymentMethodProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as PaymentMethodType)}
      className={cn("space-y-3", className)}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-4 transition-colors",
          value === "cod" && "border-primary bg-primary/5"
        )}
      >
        <RadioGroupItem value="cod" id="payment-cod" />
        <Label htmlFor="payment-cod" className="flex items-center gap-2 cursor-pointer flex-1">
          <Banknote className="h-4 w-4" />
          <div>
            <p className="font-medium">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">
              Pay when you receive your order
            </p>
          </div>
        </Label>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-4 transition-colors",
          value === "online" && "border-primary bg-primary/5"
        )}
      >
        <RadioGroupItem value="online" id="payment-online" />
        <Label htmlFor="payment-online" className="flex items-center gap-2 cursor-pointer flex-1">
          <CreditCard className="h-4 w-4" />
          <div>
            <p className="font-medium">Online Payment</p>
            <p className="text-sm text-muted-foreground">
              Pay securely with card
            </p>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
}