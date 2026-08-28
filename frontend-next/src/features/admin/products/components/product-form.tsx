"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/form-field";
import { FileUpload } from "@/components/forms/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  brandName: string;
  isListed: boolean;
  images: File[];
}

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialValues?: Partial<ProductFormValues>;
  imageUrls?: string[];
  onSubmit: (values: ProductFormValues) => void;
  onRemoveImage?: (index: number) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  categories,
  initialValues,
  imageUrls = [],
  onSubmit,
  onRemoveImage,
  loading = false,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [values, setValues] = React.useState<ProductFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    category: initialValues?.category ?? "",
    brandName: initialValues?.brandName ?? "",
    isListed: initialValues?.isListed ?? true,
    images: initialValues?.images ?? [],
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ProductFormValues, string>>>({});

  const update = (field: keyof ProductFormValues, value: string | boolean | File[]) => {
    setValues((prev) => ({ ...prev, [field]: value as never }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof ProductFormValues, string>> = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(values.price)) || Number(values.price) < 0)
      newErrors.price = "Invalid price";
    if (!values.stock.trim()) newErrors.stock = "Stock is required";
    else if (isNaN(Number(values.stock)) || Number(values.stock) < 0)
      newErrors.stock = "Invalid stock";
    if (!values.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Product Name" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Product name"
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Product description"
          rows={4}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Price" htmlFor="price" error={errors.price} required>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0.00"
          />
        </FormField>

        <FormField label="Stock" htmlFor="stock" error={errors.stock} required>
          <Input
            id="stock"
            type="number"
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
            placeholder="0"
          />
        </FormField>

        <FormField label="Category" htmlFor="category" error={errors.category} required>
          <Select value={values.category} onValueChange={(v) => update("category", v ?? "")}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Brand" htmlFor="brandName">
          <Input
            id="brandName"
            value={values.brandName}
            onChange={(e) => update("brandName", e.target.value)}
            placeholder="Brand name"
          />
        </FormField>
      </div>

      <FormField label="Product Images">
        <FileUpload
          value={values.images}
          previewUrls={imageUrls}
          onChange={(files) => update("images", files)}
          onRemove={onRemoveImage}
          label="Upload images"
        />
      </FormField>

      <div className="flex items-center gap-2">
        <Switch
          id="isListed"
          checked={values.isListed}
          onCheckedChange={(checked) => update("isListed", checked)}
        />
        <Label htmlFor="isListed">List product (visible to customers)</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}