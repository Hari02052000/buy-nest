"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { EditIcon, Trash2Icon, ImagePlusIcon } from "lucide-react";
import type { Product, ProductCategory } from "../api/product.types";

interface ProductColumnsProps {
  onEdit: (product: Product) => void;
  onToggleStatus: (id: string, isListed: boolean) => void;
  onDelete: (id: string) => void;
  onManageImages: (product: Product) => void;
  isLoading?: boolean;
}

function resolveCategory(
  category: Product["category"]
): ProductCategory | null {
  if (typeof category === "string") return null;
  return category;
}

export function createProductColumns({
  onEdit,
  onToggleStatus,
  onDelete,
  onManageImages,
  isLoading,
}: ProductColumnsProps): ColumnDef<any, any, any>[] {
  return [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original as Product;
        const first = product.images?.[0];
        return first ? (
          <img
            src={first.url}
            alt={product.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-surface-subtle flex items-center justify-center text-foreground-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.47-3.47a2 2 0 0 1-2.83 0L21 3" />
            </svg>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original as Product;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {product.name}
            </span>
            <span className="text-xs text-foreground-muted">
              {product.brandName} / {product.modelName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const product = row.original as Product;
        return (
          <span className="font-medium text-foreground">
            ${product.price.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const product = row.original as Product;
        const cat = resolveCategory(product.category);
        return cat ? (
          <span className="text-foreground">
            {"  ".repeat(Math.max(0, (cat.ancestors?.length ?? 1) - 1))}
            {cat.name}
          </span>
        ) : (
          <span className="text-foreground-muted">—</span>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original as Product;
        return (
          <span
            className={
              product.stock === 0 ? "text-error-foreground" : "text-foreground"
            }
          >
            {product.stock}
          </span>
        );
      },
    },
    {
      accessorKey: "isListed",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original as Product;
        return (
          <Switch
            checked={product.isListed}
            onCheckedChange={(checked) =>
              onToggleStatus(product.id, checked)
            }
            disabled={isLoading}
            aria-label={
              product.isListed ? "Unlist product" : "List product"
            }
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original as Product;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onManageImages(product)}
              disabled={isLoading}
              aria-label="Manage product images"
            >
              <ImagePlusIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              disabled={isLoading}
              aria-label="Edit product"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              disabled={isLoading}
              className="text-error-foreground hover:text-error hover:bg-error/10"
              aria-label="Delete product"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}