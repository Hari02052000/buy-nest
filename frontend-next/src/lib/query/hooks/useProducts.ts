"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  uploadProductImages,
  deleteProductImage,
  toggleProductList,
  deleteProduct,
} from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import type { ProductListParams } from "@/lib/api/types";

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: adminKeys.products(params),
    queryFn: () => getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: adminKeys.product(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useEditProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      editProduct(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: adminKeys.product(id) });
    },
  });
}

export function useDeleteProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: { url: string; id: string } }) =>
      deleteProductImage(id, image),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.product(id) });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUploadProductImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadProductImages(id, formData),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.product(id) });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useToggleProductList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isListed }: { id: string; isListed: boolean }) =>
      toggleProductList(id, isListed),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}
