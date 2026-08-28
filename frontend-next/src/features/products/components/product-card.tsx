"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/product-image";
import { ProductImage } from "@/components/shared/product-image";

interface Product {
  id: string;
  name: string;
  price: number | string;
  images?: { url: string; id: string }[];
  stock?: number;
  brandName?: string;
  isListed?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  addingToCart?: boolean;
  addingToWishlist?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  addingToCart = false,
  addingToWishlist = false,
  className,
}: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url;
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <ProductImage
          src={imageUrl}
          alt={product.name}
          className="transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {!product.isListed && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Unavailable
          </Badge>
        )}
        {outOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of stock
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        {product.brandName && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {product.brandName}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <PriceDisplay price={product.price} className="text-base" />
          <div className="flex items-center gap-1">
            {onAddToWishlist && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAddToWishlist(product.id)}
                disabled={addingToWishlist}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isInWishlist && "fill-destructive text-destructive"
                  )}
                />
              </Button>
            )}
            {onAddToCart && (
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAddToCart(product.id)}
                disabled={addingToCart || outOfStock}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}