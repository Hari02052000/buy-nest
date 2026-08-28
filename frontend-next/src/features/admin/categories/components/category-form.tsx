"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/form-field";

export interface CategoryFormValues {
  name: string;
  offer: string;
  isActive: boolean;
}

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function CategoryForm({
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = "Save Category",
}: CategoryFormProps) {
  const [values, setValues] = React.useState<CategoryFormValues>({
    name: initialValues?.name ?? "",
    offer: initialValues?.offer ?? "",
    isActive: initialValues?.isActive ?? true,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof CategoryFormValues, string>>>({});

  const update = (field: keyof CategoryFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value as never }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof CategoryFormValues, string>> = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (values.offer && (isNaN(Number(values.offer)) || Number(values.offer) < 0 || Number(values.offer) > 100))
      newErrors.offer = "Offer must be 0-100";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <FormField label="Category Name" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Electronics"
        />
      </FormField>

      <FormField label="Offer % (optional)" htmlFor="offer" error={errors.offer}>
        <Input
          id="offer"
          type="number"
          value={values.offer}
          onChange={(e) => update("offer", e.target.value)}
          placeholder="0"
        />
      </FormField>

      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          checked={values.isActive}
          onCheckedChange={(checked) => update("isActive", checked)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}