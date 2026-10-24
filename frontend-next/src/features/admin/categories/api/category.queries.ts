import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "./category.service";
import type { Category, CategoryTreeItem, CreateCategoryInput, UpdateCategoryInput } from "./category.types";

const CATEGORY_KEYS = {
  all: ["categories"] as const,
  tree: (params: { limit?: number; page?: number; isAdmin?: boolean }) => 
    [...CATEGORY_KEYS.all, "tree", params] as const,
  single: (id: string) => [...CATEGORY_KEYS.all, "single", id] as const,
  subCategories: (parentId: string) => [...CATEGORY_KEYS.all, "sub", parentId] as const,
};

export function useCategories(params: { limit?: number; page?: number; isAdmin?: boolean } = {}) {
  return useQuery({
    queryKey: CATEGORY_KEYS.tree(params),
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.single(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
}

export function useSubCategories(parentId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.subCategories(parentId),
    queryFn: () => categoryApi.getSubCategories(parentId),
    enabled: !!parentId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) => 
      categoryApi.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useToggleListStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isListed }: { id: string; isListed: boolean }) => 
      categoryApi.toggleListStatus(id, isListed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useUpdateCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) => 
      categoryApi.updateCategoryImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
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

export function getParentOptions(categories: CategoryTreeItem[], excludeId?: string): { value: string; label: string; level: number }[] {
  const options: { value: string; label: string; level: number }[] = [
    { value: "", label: "No Parent (Root Category)", level: -1 },
  ];

  function addOptions(cats: CategoryTreeItem[], prefix = "") {
    for (const cat of cats) {
      if (cat.id !== excludeId) {
        options.push({ value: cat.id, label: `${prefix}${cat.name}`, level: cat.level });
      }
      if (cat.children?.length) {
        addOptions(cat.children, `${prefix}  `);
      }
    }
  }

  addOptions(categories);
  return options;
}