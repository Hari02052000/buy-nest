"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ListedBadge } from "@/components/shared/status-badge";
import { getCategories } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import {
  useToggleCategoryList,
  useDeleteCategory,
} from "@/lib/query/hooks/useCategories";
import { CategoryRowActions } from "./category-row-actions";
import { Trash2, Eye, EyeOff } from "lucide-react";
import type { AdminCategory } from "@/lib/api/types";
import type { BulkAction, DataTableParams } from "@/components/shared/data-table";

export function CategoryListClient({
  initialData,
}: {
  initialData?: AdminCategory[];
}) {
  const toggleList = useToggleCategoryList();
  const deleteCategory = useDeleteCategory();

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
      confirmMessage: "Delete {count} categories? This cannot be undone.",
      onClick: async (ids) => {
        await Promise.all(ids.map((id) => deleteCategory.mutateAsync(id)));
      },
    },
  ];

  const columns: DataTableColumn<AdminCategory>[] = [
    {
      accessorKey: "image",
      header: "Image",
      className: "w-16",
      cell: (row) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
          {row.image?.url && (
            <Image
              src={row.image.url}
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
        <Link
          href={`/admin/categories/${row.id}/edit`}
          className="font-medium hover:underline"
        >
          {row.name}
        </Link>
      ),
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
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const queryFn = async (params: DataTableParams) => {
    const { page, limit, search, sortBy, sortOrder } = params;
    return getCategories({
      limit,
      skip: (page - 1) * limit,
      search: search || undefined,
      sortBy: (sortBy as "name" | "createdAt") || undefined,
      sortOrder,
    });
  };

  return (
    <DataTable<AdminCategory>
      columns={columns}
      queryKey={adminKeys.categories({})}
      queryFn={queryFn}
      initialData={initialData}
      getId={(row) => row.id}
      rowActions={(row) => <CategoryRowActions category={row} />}
      bulkActions={bulkActions}
      searchPlaceholder="Search categories..."
      exportFilename="categories"
      pageSize={20}
    />
  );
}
