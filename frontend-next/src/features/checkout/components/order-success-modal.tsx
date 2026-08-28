"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface OrderSuccessModalProps {
  open: boolean;
  orderId: string;
  onViewOrder?: () => void;
  onContinueShopping?: () => void;
}

export function OrderSuccessModal({
  open,
  orderId,
  onViewOrder,
  onContinueShopping,
}: OrderSuccessModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="text-center">
        <div className="flex flex-col items-center gap-3 py-4">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <DialogHeader>
            <DialogTitle className="text-xl">Order Placed Successfully!</DialogTitle>
            <DialogDescription>
              Your order #{orderId.slice(-8)} has been confirmed. You will
              receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex gap-2 justify-center">
          {onViewOrder && (
            <Button onClick={onViewOrder} variant="outline">
              View Order
            </Button>
          )}
          {onContinueShopping && (
            <Button onClick={onContinueShopping}>Continue Shopping</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}