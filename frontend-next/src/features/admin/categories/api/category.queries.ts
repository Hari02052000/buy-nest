import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "./category.service";
import type { Category, CategoryTreeItem, CategoryListParams, CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: (params: CategoryListParams) => [...categoryQueryKeys.all, "list", params] as const,
  parentOptions: (excludeId?: string) => [...categoryQueryKeys.all, "parent-options", excludeId] as const,
  detail: (id: string) => [...categoryQueryKeys.all, "detail", id] as const,
  subCategories: (parentId: string) => [...categoryQueryKeys.all, "sub-categories", parentId] as const,
};

export function useCategories(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
}

export function useSubCategories(parentId: string) {
  return useQuery({
    queryKey: categoryQueryKeys.subCategories(parentId),
    queryFn: () => categoryApi.getSubCategories(parentId),
    enabled: !!parentId,
  });
}

export function useParentCategories(excludeId?: string) {
  return useQuery({
    queryKey: categoryQueryKeys.parentOptions(excludeId),
    queryFn: () => categoryApi.getCategories({ isAdmin: true, limit: 1000 }),
    select: (data) => {
      const flat = flattenCategoryTree(data);
      return flat
        .filter((c) => c.id !== excludeId)
        .map((c) => ({
          value: c.id,
          label: "  ".repeat(Math.max(0, c.level)) + c.name,
        }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryApi.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}

export function useToggleListStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isListed }: { id: string; isListed: boolean }) =>
      categoryApi.toggleListStatus(id, isListed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}

export function useUpdateCategoryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) =>
      categoryApi.updateCategoryImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}

export function flattenCategoryTree(categories: CategoryTreeItem[]): Category[] {
  const result: Category[] = [];

  function flatten(cats: CategoryTreeItem[], parentLevel = 0) {
    for (const cat of cats) {
      result.push({ ...cat, level: parentLevel });
      if (cat.children?.length) {
        flatten(cat.children, parentLevel + 1);
      }
    }
  }

  flatten(categories);
  return result;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}