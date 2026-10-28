import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "./product.service";
import type {
  ProductListParams,
  CreateProductInput,
  UpdateProductInput,
  ProductImage,
} from "./product.types";

export const productQueryKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) =>
    [...productQueryKeys.all, "list", params] as const,
  detail: (id: string) => [...productQueryKeys.all, "detail", id] as const,
};

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      productApi.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productApi.updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      productApi.uploadProductImages(id, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      image,
    }: { id: string; image: ProductImage }) =>
      productApi.deleteProductImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

export function useToggleProductListStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isListed }: { id: string; isListed: boolean }) =>
      productApi.toggleListStatus(id, isListed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

// Re-export the category parent-options hook so product forms can populate
// the category select from the existing category tree.
export {
  useParentCategories,
  type SelectOption,
} from "@/features/admin/categories/api/category.queries";