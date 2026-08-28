"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  isInWishlist?: boolean;
  onToggle?: (productId: string) => void;
  loading?: boolean;
  className?: string;
  variant?: "icon" | "full";
}

export function WishlistButton({
  productId,
  isInWishlist = false,
  onToggle,
  loading = false,
  className,
  variant = "icon",
}: WishlistButtonProps) {
  if (variant === "full") {
    return (
      <Button
        variant={isInWishlist ? "default" : "outline"}
        onClick={() => onToggle?.(productId)}
        disabled={loading}
        className={className}
      >
        <Heart
          className={cn("h-4 w-4 mr-2", isInWishlist && "fill-current")}
        />
        {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggle?.(productId)}
      disabled={loading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={className}
    >
      <Heart
        className={cn("h-4 w-4", isInWishlist && "fill-destructive text-destructive")}
      />
    </Button>
  );
}