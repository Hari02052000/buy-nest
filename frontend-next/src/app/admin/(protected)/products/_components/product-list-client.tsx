"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ListedBadge } from "@/components/shared/status-badge";
import { PriceDisplay } from "@/components/shared/product-image";
import { getProducts } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import { ProductRowActions } from "./product-row-actions";
import {
  useToggleProductList,
  useDeleteProduct,
} from "@/lib/query/hooks/useProducts";
import { Trash2, Eye, EyeOff } from "lucide-react";
import type { AdminProduct } from "@/lib/api/types";
import type { BulkAction, DataTableParams } from "@/components/shared/data-table";

export function ProductListClient({
  initialData,
}: {
  initialData?: AdminProduct[];
}) {
  const toggleList = useToggleProductList();
  const deleteProduct = useDeleteProduct();

  const bulkActions: BulkAction[] = [
    {
      label: "List",
      icon: <Eye className="h-4 w-4" />,
      onClick: async (ids) => {
        await Promise.all(
          ids.map((id) => toggleList.mutateAsync({ id, isListed: true })),
        );
      },
    },
    {
      label: "Unlist",
      icon: <EyeOff className="h-4 w-4" />,
      onClick: async (ids) => {
        await Promise.all(
          ids.map((id) => toggleList.mutateAsync({ id, isListed: false })),
        );
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      confirmMessage: "Delete {count} products? This cannot be undone.",
      onClick: async (ids) => {
        await Promise.all(ids.map((id) => deleteProduct.mutateAsync(id)));
      },
    },
  ];

  const columns: DataTableColumn<AdminProduct>[] = [
    {
      accessorKey: "images",
      header: "Image",
      className: "w-16",
      cell: (row) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
          {row.images?.[0]?.url && (
            <Image
              src={row.images[0].url}
              alt={row.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: (row) => (
        <div>
          <Link
            href={`/admin/products/${row.id}/edit`}
            className="font-medium hover:underline"
          >
            {row.name}
          </Link>
          <p className="text-xs text-muted-foreground">{row.brandName}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (row) =>
        typeof row.category === "object" && row.category
          ? row.category.name
          : String(row.category || "—"),
    },
    {
      accessorKey: "price",
      header: "Price",
      enableSorting: true,
      cell: (row) => <PriceDisplay price={row.price} />,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      enableSorting: true,
    },
    {
      accessorKey: "isListed",
      header: "Status",
      cell: (row) => <ListedBadge isListed={row.isListed} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      enableSorting: true,
      cell: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const queryFn = async (params: DataTableParams) => {
    const { page, limit, search, sortBy, sortOrder } = params;
    return getProducts({
      limit,
      skip: (page - 1) * limit,
      search: search || undefined,
      sortBy: (sortBy as "name" | "price" | "createdAt") || undefined,
      sortOrder,
      isAdmin: true,
    });
  };

  return (
    <DataTable<AdminProduct>
      columns={columns}
      queryKey={adminKeys.products({})}
      queryFn={queryFn}
      initialData={initialData}
      getId={(row) => row.id}
      rowActions={(row) => <ProductRowActions product={row} />}
      bulkActions={bulkActions}
      searchPlaceholder="Search products..."
      exportFilename="products"
      pageSize={20}
    />
  );
}
