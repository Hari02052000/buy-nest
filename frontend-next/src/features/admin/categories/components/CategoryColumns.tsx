"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { EditIcon, Trash2Icon, ChevronDownIcon } from "lucide-react";
import type { Category } from "../api/category.types";

interface CategoryColumnsProps {
  onEdit: (category: Category) => void;
  onToggleStatus: (id: string, isListed: boolean) => void;
  onDelete: (id: string) => void;
  onViewSubCategories: (category: Category) => void;
  isLoading?: boolean;
}

export function createCategoryColumns({
  onEdit,
  onToggleStatus,
  onDelete,
  onViewSubCategories,
  isLoading,
}: CategoryColumnsProps): ColumnDef<any, any, any>[] {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const category = row.original as Category;
        return (
          <img
            src={category.image?.url}
            alt={category.name}
            className="w-12 h-12 object-cover rounded"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const category = row.original as Category;
        const indent = "  ".repeat(category.level);
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{indent}{category.name}</span>
            {category.level > 0 && (
              <Badge variant="secondary" className="text-xs ml-1">
                Level {category.level}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isListed",
      header: "Status",
      cell: ({ row }) => {
        const category = row.original as Category;
        return (
          <Switch
            checked={category.isListed}
            onCheckedChange={(checked) => onToggleStatus(category.id, checked)}
            disabled={isLoading}
            aria-label={category.isListed ? "Unlist category" : "List category"}
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original as Category;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              disabled={isLoading}
              aria-label="Edit category"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewSubCategories(category)}
              disabled={isLoading}
              aria-label="View subcategories"
            >
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category.id)}
              disabled={isLoading}
              className="text-error-foreground hover:text-error hover:bg-error/10"
              aria-label="Delete category"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}