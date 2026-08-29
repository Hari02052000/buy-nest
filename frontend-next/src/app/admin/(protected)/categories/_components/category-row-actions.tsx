"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Power, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useToggleCategoryList,
  useDeleteCategory,
} from "@/lib/query/hooks/useCategories";
import { toast } from "sonner";
import type { AdminCategory } from "@/lib/api/types";

export function CategoryRowActions({ category }: { category: AdminCategory }) {
  const toggleList = useToggleCategoryList();
  const deleteCategory = useDeleteCategory();

  const handleToggle = async () => {
    try {
      await toggleList.mutateAsync({
        id: category.id,
        isListed: !category.isListed,
      });
      toast.success(category.isListed ? "Category unlisted" : "Category listed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteCategory.mutateAsync(category.id);
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <Link
        href={`/admin/categories/${category.id}/edit`}
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label="Edit category"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        aria-label={category.isListed ? "Unlist category" : "List category"}
        disabled={toggleList.isPending}
      >
        <Power className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label="Delete category"
        className="text-destructive"
        disabled={deleteCategory.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
