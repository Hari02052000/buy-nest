import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/shared/state";

interface Product {
  id: string;
  name: string;
  price: number | string;
  images?: { url: string; id: string }[];
  stock?: number;
  brandName?: string;
  isListed?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: (productId: string) => boolean;
  addingToCart?: string | null;
  addingToWishlist?: string | null;
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  addingToCart,
  addingToWishlist,
  className,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist?.(product.id) ?? false}
          addingToCart={addingToCart === product.id}
          addingToWishlist={addingToWishlist === product.id}
        />
      ))}
    </div>
  );
}