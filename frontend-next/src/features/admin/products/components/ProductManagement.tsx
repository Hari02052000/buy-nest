"use client";

import { useState, useCallback, useMemo } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductFormDialog } from "./ProductFormDialog";
import { createProductColumns } from "./ProductColumns";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useUploadProductImage,
  useDeleteProductImage,
  useToggleProductListStatus,
} from "../api/product.queries";
import { useToast } from "@/components/ui/useToast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "../api/product.types";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";

export function ProductManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: products = [], isLoading, refetch } = useProducts({
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
    isAdmin: true,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadImageMutation = useUploadProductImage();
  const deleteImageMutation = useDeleteProductImage();
  const toggleMutation = useToggleProductListStatus();
  const { toast } = useToast();

  const filteredProducts = useMemo(
    () => products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [products, searchQuery]
  );

  const handleCreate = useCallback(
    async (data: CreateProductInput) => {
      if (createMutation.isPending) return;
      try {
        await createMutation.mutateAsync(data);
        toast({ title: "Success", description: "Product created successfully", variant: "success" });
        setIsDialogOpen(false);
        refetch();
      } catch {
        toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
      }
    },
    [createMutation, refetch, toast]
  );

  const handleUpdate = useCallback(
    async (data: UpdateProductInput) => {
      if (!editProduct || updateMutation.isPending) return;
      try {
        await updateMutation.mutateAsync({ id: editProduct.id, input: data });
        toast({ title: "Success", description: "Product updated successfully", variant: "success" });
        setIsDialogOpen(false);
        setEditProduct(null);
        refetch();
      } catch {
        toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
      }
    },
    [editProduct, updateMutation, refetch, toast]
  );

  const handleAddImages = useCallback(
    async (files: File[]) => {
      if (!editProduct) return;
      try {
        await uploadImageMutation.mutateAsync({ id: editProduct.id, files });
        toast({ title: "Success", description: "Images uploaded successfully", variant: "success" });
        refetch();
      } catch {
        toast({ title: "Error", description: "Failed to upload images", variant: "destructive" });
      }
    },
    [editProduct, uploadImageMutation, refetch, toast]
  );

  const handleRemoveImage = useCallback(
    async (image: { url: string; id: string }) => {
      if (!editProduct) return;
      try {
        await deleteImageMutation.mutateAsync({ id: editProduct.id, image });
        toast({ title: "Success", description: "Image removed successfully", variant: "success" });
        refetch();
      } catch {
        toast({ title: "Error", description: "Failed to remove image", variant: "destructive" });
      }
    },
    [editProduct, deleteImageMutation, refetch, toast]
  );

  const handleToggleStatus = useCallback(
    async (id: string, isListed: boolean) => {
      if (toggleMutation.isPending) return;
      try {
        await toggleMutation.mutateAsync({ id, isListed });
        toast({
          title: "Success",
          description: `Product ${isListed ? "listed" : "unlisted"} successfully`,
          variant: "success",
        });
        refetch();
      } catch {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      }
    },
    [toggleMutation, refetch, toast]
  );

  const handleDeleteConfirm = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const handleDelete = useCallback(() => {
    toast({ title: "Delete", description: "Delete functionality to be implemented", variant: "default" });
    setDeleteConfirmId(null);
  }, [toast]);

  const handleEdit = useCallback((product: Product) => {
    setEditProduct(product);
    setIsDialogOpen(true);
  }, []);

  const handleManageImages = useCallback((product: Product) => {
    setEditProduct(product);
    setIsDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateProductInput | UpdateProductInput) => {
      if (editProduct) {
        await handleUpdate(data as UpdateProductInput);
      } else {
        await handleCreate(data as CreateProductInput);
      }
    },
    [editProduct, handleCreate, handleUpdate]
  );

  const isLoadingMutations =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImageMutation.isPending ||
    deleteImageMutation.isPending ||
    toggleMutation.isPending;

  const columns = useMemo(
    () =>
      createProductColumns({
        onEdit: handleEdit,
        onToggleStatus: handleToggleStatus,
        onDelete: handleDeleteConfirm,
        onManageImages: handleManageImages,
        isLoading: isLoadingMutations,
      }),
    [
      handleEdit,
      handleToggleStatus,
      handleDeleteConfirm,
      handleManageImages,
      isLoadingMutations,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-foreground-muted">Manage products and inventory</p>
        </div>
        <Button
          onClick={() => {
            setEditProduct(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable<Product>
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        pagination={true}
        pageSize={pageSize}
        pageCount={Math.ceil(filteredProducts.length / pageSize)}
        onPaginationChange={(pagination) => {
          setCurrentPage(pagination.pageIndex + 1);
          setPageSize(pagination.pageSize);
        }}
        emptyMessage="No products found"
      />

      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditProduct(null);
        }}
        onSubmit={handleSubmit}
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
        mode={editProduct ? "edit" : "create"}
        product={editProduct}
        isLoading={isLoadingMutations}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}