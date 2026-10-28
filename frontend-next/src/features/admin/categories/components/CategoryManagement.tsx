"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { PlusIcon, SearchIcon, ChevronLeftIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { createCategoryColumns } from "./CategoryColumns";
import { useCategories, useCreateCategory, useUpdateCategory, useToggleListStatus, flattenCategoryTree, useSubCategories } from "../api/category.queries";
import { useToast } from "@/components/ui/useToast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Category } from "../api/category.types";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";

export function CategoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentParent, setCurrentParent] = useState<Category | null>(null);

  const { data: categoryTree, isLoading, refetch } = useCategories({
    limit: pageSize,
    page: currentPage,
    isAdmin: true,
  });

  const { data: subCategories = [], isLoading: subLoading } = useSubCategories(currentParent?.id ?? "");

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const toggleMutation = useToggleListStatus();
  const { toast } = useToast();

  const categories = useMemo(() => {
    if (currentParent) {
      return subCategories;
    }
    return categoryTree ? flattenCategoryTree(categoryTree) : [];
  }, [categoryTree, currentParent, subCategories]);

  const filteredCategories = useMemo(() => categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = useMemo(() => filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  ), [filteredCategories, currentPage, pageSize]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const handleCreate = useCallback(async (data: CreateCategoryInput) => {
    if (createMutation.isPending) return;
    try {
      await createMutation.mutateAsync(data);
      toast({ title: "Success", description: "Category created successfully", variant: "success" });
      setIsDialogOpen(false);
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    }
  }, [createMutation, refetch, toast]);

  const handleUpdate = useCallback(async (data: UpdateCategoryInput) => {
    if (!editCategory || updateMutation.isPending) return;
    try {
      await updateMutation.mutateAsync({ id: editCategory.id, input: data });
      toast({ title: "Success", description: "Category updated successfully", variant: "success" });
      setIsDialogOpen(false);
      setEditCategory(null);
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    }
  }, [editCategory, updateMutation, refetch, toast]);

  const handleToggleStatus = useCallback(async (id: string, isListed: boolean) => {
    if (toggleMutation.isPending) return;
    try {
      await toggleMutation.mutateAsync({ id, isListed });
      toast({ 
        title: "Success", 
        description: `Category ${isListed ? "listed" : "unlisted"} successfully`, 
        variant: "success" 
      });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  }, [toggleMutation, refetch, toast]);

  const handleDeleteConfirm = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    try {
      toast({ title: "Delete", description: "Delete functionality to be implemented", variant: "default" });
      setDeleteConfirmId(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  }, [deleteConfirmId, toast]);

  const handleEdit = useCallback((category: Category) => {
    setEditCategory(category);
    setIsDialogOpen(true);
  }, []);

  const handleViewSubCategories = useCallback((category: Category) => {
    setCurrentParent(category);
    setCurrentPage(1);
    setSearchQuery("");
  }, []);

  const handleBackToParent = useCallback(() => {
    setCurrentParent(null);
    setCurrentPage(1);
    setSearchQuery("");
  }, []);

  const isLoadingMutations = createMutation.isPending || updateMutation.isPending || toggleMutation.isPending;
  const combinedLoading = Boolean(isLoading || (currentParent && subLoading));

  const columns = useMemo(() => createCategoryColumns({
    onEdit: handleEdit,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteConfirm,
    onViewSubCategories: handleViewSubCategories,
    isLoading: isLoadingMutations,
  }), [handleEdit, handleToggleStatus, handleDeleteConfirm, handleViewSubCategories, isLoadingMutations]);

  const handleSubmit = useCallback(async (data: CreateCategoryInput | UpdateCategoryInput) => {
    if (editCategory) {
      await handleUpdate(data as UpdateCategoryInput);
    } else {
      await handleCreate(data as CreateCategoryInput);
    }
  }, [editCategory, handleCreate, handleUpdate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-foreground-muted">Manage product categories and subcategories</p>
        </div>
        <Button onClick={() => { setEditCategory(null); setIsDialogOpen(true); }}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {currentParent && (
        <div className="flex items-center gap-2 text-sm text-foreground-muted mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToParent}
            className="h-8 px-3 gap-1"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to {currentParent.name}
          </Button>
          <span className="text-foreground">/</span>
          <span className="font-medium">Subcategories of {currentParent.name}</span>
        </div>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable<Category>
        columns={columns}
        data={paginatedCategories}
        isLoading={combinedLoading}
        pagination={true}
        pageSize={pageSize}
        pageCount={totalPages}
        onPaginationChange={(pagination) => {
          setCurrentPage(pagination.pageIndex);
          setPageSize(pagination.pageSize);
        }}
        emptyMessage={currentParent ? `No subcategories found for ${currentParent.name}` : "No categories found"}
      />

      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditCategory(null); }}
        onSubmit={handleSubmit}
        mode={editCategory ? "edit" : "create"}
        category={editCategory}
        isLoading={isLoadingMutations}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}