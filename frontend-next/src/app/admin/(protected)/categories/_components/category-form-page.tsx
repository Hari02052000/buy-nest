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
import { FileUpload } from "@/components/forms/file-upload";
import {
  useCategory,
  useCategories,
  useCreateCategory,
  useEditCategory,
  useUploadCategoryImage,
  useToggleCategoryList,
} from "@/lib/query/hooks/useCategories";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.string().optional(),
  isListed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function CategoryFormPage({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: category, isLoading: loadingCategory } = useCategory(id ?? "");
  const { data: categories = [] } = useCategories({ limit: 100 });
  const createMutation = useCreateCategory();
  const editMutation = useEditCategory();
  const uploadImage = useUploadCategoryImage();
  const toggleList = useToggleCategoryList();

  const [newImage, setNewImage] = React.useState<File[]>([]);
  const [existingImage, setExistingImage] = React.useState<string | undefined>();
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
    defaultValues: { name: "", parentId: "", isListed: true },
  });

  React.useEffect(() => {
    if (isEdit && category) {
      reset({
        name: category.name,
        parentId: category.parentId ?? "",
        isListed: category.isListed,
      });
      setExistingImage(category.image?.url);
      setIsListedOriginal(category.isListed);
    }
  }, [isEdit, category, reset]);

  const isListed = watch("isListed");

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isEdit) {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.parentId) formData.append("parentId", values.parentId);
        if (newImage[0]) formData.append("image", newImage[0]);

        const created = await createMutation.mutateAsync(formData);
        if (!values.isListed) {
          await toggleList.mutateAsync({
            id: created.id,
            isListed: false,
          });
        }
        toast.success("Category created");
        router.push("/admin/categories");
      } else if (id) {
        await editMutation.mutateAsync({ id, body: { name: values.name } });

        if (newImage[0]) {
          const imgForm = new FormData();
          imgForm.append("image", newImage[0]);
          await uploadImage.mutateAsync({ id, formData: imgForm });
        }

        if (values.isListed !== isListedOriginal) {
          await toggleList.mutateAsync({ id, isListed: values.isListed });
        }

        toast.success("Category updated");
        router.push("/admin/categories");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  };

  if (isEdit && loadingCategory) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  const parentOptions = categories.filter((c) => c.id !== id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Category" : "Add Category"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isEdit ? "Update category details" : "Create a new product category"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Category Name"
          placeholder="Category name"
          required
          register={register}
          name="name"
          error={errors.name?.message}
        />

        <FormSelect
          label="Parent Category"
          name="parentId"
          control={control}
          placeholder="None (top-level)"
          options={[
            { value: "", label: "None (top-level)" },
            ...parentOptions.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
        />

        <FormField label="Category Image" error={undefined}>
          <FileUpload
            value={newImage}
            previewUrls={existingImage ? [existingImage] : []}
            onChange={setNewImage}
            label="Upload image"
          />
        </FormField>

        <div className="flex items-center gap-2">
          <Switch
            id="isListed"
            checked={isListed}
            onCheckedChange={(checked) => setValue("isListed", checked === true)}
          />
          <Label htmlFor="isListed">List category (visible to customers)</Label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={createMutation.isPending || editMutation.isPending}>
            {createMutation.isPending || editMutation.isPending
              ? "Saving..."
              : isEdit
                ? "Update Category"
                : "Create Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
