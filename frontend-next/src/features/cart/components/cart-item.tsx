"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/product-image";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CartItemType {
  product: {
    id: string;
    name: string;
    price: number;
    images?: { url: string; id: string }[];
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
  updating?: boolean;
  className?: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  updating = false,
  className,
}: CartItemProps) {
  const imageUrl = item.product.images?.[0]?.url || IMAGE_PLACEHOLDER;
  const maxStock = item.product.price > 0 ? item.product.price : 99; // fallback

  return (
    <div className={cn("flex gap-4 py-4 border-b", className)}>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={imageUrl}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
          <PriceDisplay price={item.totalPrice} className="ml-2 shrink-0" />
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity?.(item.product.id, item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity?.(item.product.id, item.quantity + 1)}
              disabled={updating || item.quantity >= maxStock}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onRemove(item.product.id)}
              disabled={updating}
              aria-label="Remove from cart"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}