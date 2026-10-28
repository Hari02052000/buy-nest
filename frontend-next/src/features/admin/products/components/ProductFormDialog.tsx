"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/form/FormInput";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { Button } from "@/components/ui/Button";
import { ApiSelect } from "@/components/ui/ApiSelect";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../schemas/product.schema";
import type { Product, ProductImage } from "../api/product.types";
import { useParentCategories } from "../api/product.queries";
import { ShakeProvider, useShakeContext } from "@/components/form/ShakeContext";

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  onAddImages: (files: File[]) => Promise<void>;
  onRemoveImage: (image: ProductImage) => Promise<void>;
  mode: "create" | "edit";
  product?: Product | null;
  isLoading: boolean;
}

function ProductFormDialogInner({
  isOpen,
  onClose,
  onSubmit,
  onAddImages,
  onRemoveImage,
  mode,
  product,
  isLoading,
}: ProductFormDialogProps) {
  const { requestShakeFirstInvalid } = useShakeContext();

  const schema = mode === "create" ? createProductSchema : updateProductSchema;

  const form = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema) as never,
    defaultValues: mode === "create"
      ? { name: "", description: "", price: 0, category: "", brandName: "", modelName: "", stock: 0, images: [] }
      : { name: product?.name || "", description: product?.description || "", price: product?.price ?? 0, brandName: product?.brandName || "", modelName: product?.modelName || "", stock: product?.stock ?? 0 },
    mode: "onChange",
  });

  const { data: parentOptions = [], isLoading: parentLoading } = useParentCategories();

  const currentImages: ProductImage[] = useMemo(() => {
    if (mode === "edit" && product) return product.images;
    return [];
  }, [mode, product]);

  useEffect(() => {
    if (mode === "edit" && product) {
      form.reset({ name: product.name, description: product.description, price: product.price, brandName: product.brandName, modelName: product.modelName, stock: product.stock });
    } else if (mode === "create") {
      form.reset({ name: "", description: "", price: 0, category: "", brandName: "", modelName: "", stock: 0, images: [] });
    }
  }, [isOpen, mode, product, form]);

  const isSubmitted = form.formState.isSubmitted;
  const errors = form.formState.errors as Record<string, { message?: string } | undefined>;

  useEffect(() => {
    if (isSubmitted && errors.name) requestShakeFirstInvalid();
  }, [isSubmitted, errors.name, requestShakeFirstInvalid]);

  const handleSubmit = async (data: CreateProductInput | UpdateProductInput) => {
    await onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg sm:max-w-2xl bg-surface border border-border rounded-lg shadow-xl max-h-[90vh] flex flex-col",
          "animate-in fade-in-150 zoom-in-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <h2 id="product-form-title" className="text-lg font-semibold text-foreground">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-foreground/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <FormInput control={form.control} name="name" label="Product Name" placeholder="Enter product name" required enableShake />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Description</label>
            <textarea
              {...form.register("description")}
              rows={4}
              placeholder="Enter product description"
              disabled={isLoading}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-surface text-foreground placeholder:text-foreground-muted transition-colors duration-150 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-foreground-muted"
            />
            {errors.description && <p className="mt-1 text-sm text-error-foreground" role="alert">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput control={form.control} name="price" label="Price" type="number" step="0.01" required enableShake />
            <FormInput control={form.control} name="stock" label="Stock" type="number" required enableShake />
          </div>
          <FormInput control={form.control} name="brandName" label="Brand Name" placeholder="Enter brand name" required enableShake />
          <FormInput control={form.control} name="modelName" label="Model Name" placeholder="Enter model name" required enableShake />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Category</label>
            <ApiSelect
              options={parentOptions}
              value={(form.getValues("category") as string) ?? ""}
              onChange={(v) => form.setValue("category", v as never, { shouldValidate: true })}
              placeholder="Select category"
              loading={parentLoading}
              searchable={true}
              searchPlaceholder="Search categories..."
              emptyMessage="No categories available"
              aria-label="Category"
              error={(errors.category as { message?: string })?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Images</label>
            <ImageGallery
              images={currentImages}
              onAdd={async (files) => { await onAddImages(files); }}
              onRemove={async (image) => { await onRemoveImage(image); }}
              disabled={isLoading}
              maxImages={mode === "create" ? undefined : 20}
            />
            {mode === "create" && (errors.images as { message?: string })?.message && (
              <p className="mt-1 text-sm text-error-foreground" role="alert">{(errors.images as { message?: string }).message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>{mode === "create" ? "Create" : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProductFormDialog(props: ProductFormDialogProps) {
  return (
    <ShakeProvider>
      <ProductFormDialogInner {...props} />
    </ShakeProvider>
  );
}