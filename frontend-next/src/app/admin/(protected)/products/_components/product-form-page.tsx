"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/forms/form-field";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { ImageGallery } from "@/components/shared/image-gallery";
import { useProduct } from "@/lib/query/hooks/useProducts";
import {
  useCreateProduct,
  useEditProduct,
  useUploadProductImages,
  useDeleteProductImage,
  useToggleProductList,
} from "@/lib/query/hooks/useProducts";
import { useCategories } from "@/lib/query/hooks/useCategories";
import { toast } from "sonner";
import type { ProductImage } from "@/lib/api/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Invalid price"),
  category: z.string().min(1, "Category is required"),
  brandName: z.string().min(1, "Brand is required"),
  modelName: z.string().min(1, "Model is required"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Invalid stock"),
  isListed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function ProductFormPage({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: product, isLoading: loadingProduct } = useProduct(id ?? "");
  const { data: categories = [] } = useCategories({ limit: 100 });
  const createMutation = useCreateProduct();
  const editMutation = useEditProduct();
  const uploadImages = useUploadProductImages();
  const deleteImage = useDeleteProductImage();
  const toggleList = useToggleProductList();

  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState<ProductImage[]>([]);
  const [removedImages, setRemovedImages] = React.useState<ProductImage[]>([]);
  const [isListedOriginal, setIsListedOriginal] = React.useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      brandName: "",
      modelName: "",
      stock: "",
      isListed: true,
    },
  });

  React.useEffect(() => {
    if (isEdit && product) {
      reset({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category:
          typeof product.category === "object" && product.category
            ? product.category.id
            : String(product.category || ""),
        brandName: product.brandName,
        modelName: product.modelName,
        stock: String(product.stock),
        isListed: product.isListed,
      });
      setExistingImages(product.images ?? []);
      setIsListedOriginal(product.isListed);
    }
  }, [isEdit, product, reset]);

  const isListed = watch("isListed");

  const handleDeleteExisting = (image: ProductImage) => {
    setExistingImages((prev) => prev.filter((i) => i.id !== image.id));
    setRemovedImages((prev) => [...prev, image]);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isEdit) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("brandName", values.brandName);
        formData.append("modelName", values.modelName);
        formData.append("stock", values.stock);
        newFiles.forEach((f) => formData.append("images", f));

        const created = await createMutation.mutateAsync(formData);
        if (!values.isListed) {
          await toggleList.mutateAsync({
            id: created.id,
            isListed: false,
          });
        }
        toast.success("Product created");
        router.push("/admin/products");
      } else if (id) {
        await editMutation.mutateAsync({
          id,
          body: {
            name: values.name,
            description: values.description,
            price: Number(values.price),
            brandName: values.brandName,
            modelName: values.modelName,
            stock: Number(values.stock),
          },
        });

        if (values.isListed !== isListedOriginal) {
          await toggleList.mutateAsync({ id, isListed: values.isListed });
        }

        if (newFiles.length > 0) {
          const imgForm = new FormData();
          newFiles.forEach((f) => imgForm.append("images", f));
          await uploadImages.mutateAsync({ id, formData: imgForm });
        }

        for (const img of removedImages) {
          await deleteImage.mutateAsync({ id, image: img });
        }

        toast.success("Product updated");
        router.push("/admin/products");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  };

  if (isEdit && loadingProduct) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isEdit
            ? "Update product details"
            : "Create a new product in your catalog"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Product Name"
          placeholder="Product name"
          required
          register={register}
          name="name"
          error={errors.name?.message}
        />

        <FormInput
          label="Description"
          type="textarea"
          placeholder="Product description"
          required
          register={register}
          name="description"
          error={errors.description?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Price"
            type="number"
            step={0.01}
            placeholder="0.00"
            required
            register={register}
            name="price"
            error={errors.price?.message}
          />

          <FormInput
            label="Stock"
            type="number"
            placeholder="0"
            required
            register={register}
            name="stock"
            error={errors.stock?.message}
          />

          <FormSelect
            label="Category"
            required
            name="category"
            control={control}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
            placeholder="Select category"
            error={errors.category?.message}
          />

          <FormInput
            label="Brand"
            placeholder="Brand name"
            required
            register={register}
            name="brandName"
            error={errors.brandName?.message}
          />

          <FormInput
            label="Model"
            placeholder="Model name"
            required
            register={register}
            name="modelName"
            error={errors.modelName?.message}
          />
        </div>

        <FormField label="Product Images" error={undefined}>
          <ImageGallery
            existingImages={existingImages}
            newFiles={newFiles}
            onNewFilesChange={setNewFiles}
            onDeleteExisting={handleDeleteExisting}
          />
        </FormField>

        <div className="flex items-center gap-2">
          <Switch
            id="isListed"
            checked={isListed}
            onCheckedChange={(checked) => setValue("isListed", checked === true)}
          />
          <Label htmlFor="isListed">List product (visible to customers)</Label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={createMutation.isPending || editMutation.isPending}>
            {createMutation.isPending || editMutation.isPending
              ? "Saving..."
              : isEdit
                ? "Update Product"
                : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
