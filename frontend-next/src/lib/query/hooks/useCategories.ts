"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  editCategory,
  uploadCategoryImage,
  toggleCategoryList,
  deleteCategory,
} from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import type { CategoryListParams } from "@/lib/api/types";

export function useCategories(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: adminKeys.categories(params),
    queryFn: () => getCategories(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: adminKeys.category(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useEditCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      editCategory(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useUploadCategoryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadCategoryImage(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useToggleCategoryList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isListed }: { id: string; isListed: boolean }) =>
      toggleCategoryList(id, isListed),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}
