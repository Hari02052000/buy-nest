"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Power, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useToggleProductList,
  useDeleteProduct,
} from "@/lib/query/hooks/useProducts";
import { toast } from "sonner";
import type { AdminProduct } from "@/lib/api/types";

export function ProductRowActions({ product }: { product: AdminProduct }) {
  const toggleList = useToggleProductList();
  const deleteProduct = useDeleteProduct();

  const handleToggle = async () => {
    try {
      await toggleList.mutateAsync({
        id: product.id,
        isListed: !product.isListed,
      });
      toast.success(product.isListed ? "Product unlisted" : "Product listed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <Link
        href={`/admin/products/${product.id}/edit`}
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label="Edit product"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        aria-label={product.isListed ? "Unlist product" : "List product"}
        disabled={toggleList.isPending}
      >
        <Power className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label="Delete product"
        className="text-destructive"
        disabled={deleteProduct.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
