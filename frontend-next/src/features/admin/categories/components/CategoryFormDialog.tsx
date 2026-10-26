"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogCloseButton } from "@/components/ui/Dialog";
import { FormInput } from "@/components/form/FormInput";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { ApiSelect } from "@/components/ui/ApiSelect";
import { cn } from "@/lib/utils";
import { createCategorySchema, updateCategorySchema, type CreateCategoryInput, type UpdateCategoryInput } from "../schemas/category.schema";
import type { Category } from "../api/category.types";
import { XIcon } from "lucide-react";
import { useParentCategories, useUpdateCategoryImage } from "../api/category.queries";
import { ShakeProvider, useShakeContext } from "@/components/form/ShakeContext";
import { useToast } from "@/components/ui/useToast";
import { useEffect, useMemo } from "react";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  mode: "create" | "edit";
  category?: Category | null;
  isLoading: boolean;
}

function CategoryFormDialogInner({
  isOpen,
  onClose,
  onSubmit,
  mode,
  category,
  isLoading,
}: CategoryFormDialogProps) {
  const { requestShakeFirstInvalid } = useShakeContext();
  const { toast } = useToast();
  
  const schema = mode === "create" ? createCategorySchema : updateCategorySchema;
  
  const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: mode === "create" 
      ? { name: "", parentId: "", image: undefined as File | undefined }
      : { name: category?.name || "", parentId: category?.parentId || "", image: undefined as File | undefined },
    mode: "onChange",
  });

  const { data: parentOptions = [], isLoading: parentLoading } = useParentCategories(
    mode === "edit" ? category?.id : undefined
  );

  const updateImageMutation = useUpdateCategoryImage();

  // Watch parentId for display when selected parent is not in options (e.g., subcategory)
  const selectedParentId = useWatch({ control: form.control, name: "parentId" });
  const selectedParentLabel = useMemo(() => {
    if (!selectedParentId) return undefined;
    const found = parentOptions.find(opt => opt.value === selectedParentId);
    if (found) return found.label;
    // If not in parentOptions (e.g., it's a subcategory), try to get from category prop
    if (category?.parentId === selectedParentId) return "Subcategory";
    return undefined;
  }, [parentOptions, selectedParentId, category?.parentId]);

  useEffect(() => {
    if (mode === "edit" && category) {
      form.reset({ name: category.name, parentId: category.parentId || "", image: undefined });
    } else if (mode === "create") {
      form.reset({ name: "", parentId: "", image: undefined });
    }
  }, [isOpen, mode, category, form]);

  const isSubmitted = form.formState.isSubmitted;
  const errors = form.formState.errors;

  useEffect(() => {
    if (isSubmitted && errors.name) {
      requestShakeFirstInvalid();
    }
    if (isSubmitted && mode === "create" && "image" in errors && errors.image) {
      requestShakeFirstInvalid();
    }
  }, [isSubmitted, errors.name, errors, mode, requestShakeFirstInvalid]);

  const handleImageUpload = async (file: File) => {
    if (!category) return;
    try {
      await updateImageMutation.mutateAsync({ id: category.id, image: file });
      toast({ title: "Success", description: "Category image updated", variant: "success" });
    } catch {
      toast({ title: "Error", description: "Failed to update image", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    await onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg sm:max-w-2xl bg-surface border border-border rounded-lg shadow-xl overflow-hidden",
          "animate-in fade-in-150 zoom-in-95"
        )}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 id="category-form-title" className="text-lg font-semibold text-foreground">
            {mode === "create" ? "Add Category" : "Edit Category"}
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
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="p-6 space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            required
            enableShake
          />

          {mode === "create" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Category Image</label>
              <ImageUpload
                value={null}
                onChange={(file) => form.setValue("image", file as File, { shouldValidate: true })}
                disabled={isLoading}
                error={form.formState.errors.image?.message}
              />
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Category Image</label>
              <ImageUpload
                value={category?.image ? { url: category.image.url, id: category.image.id } : null}
                onChange={(file) => file && handleImageUpload(file)}
                disabled={isLoading || updateImageMutation.isPending}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Parent Category</label>
            <ApiSelect
              options={parentOptions}
              value={selectedParentId ?? ""}
              onChange={(v) => form.setValue("parentId", v)}
              placeholder="Select parent (optional)"
              loading={parentLoading}
              disabled={isLoading}
              searchable={true}
              searchPlaceholder="Search categories..."
              emptyMessage="No parent categories available"
              aria-label="Parent category"
              error={form.formState.errors.parentId?.message}
              selectedLabel={selectedParentLabel}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CategoryFormDialog(props: CategoryFormDialogProps) {
  return (
    <ShakeProvider>
      <CategoryFormDialogInner {...props} />
    </ShakeProvider>
  );
}