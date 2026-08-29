import { api } from "./client";
import type {
  AdminProduct,
  AdminCategory,
  AdminOrder,
  ProductListParams,
  CategoryListParams,
  OrderListParams,
  ProductImage,
  AdminSession,
} from "./types";

// ─── Admin Auth ───
export const adminLogin = (body: { email: string; password: string }) =>
  api.post<AdminSession>("admin/login", body);

export const adminLogout = () => api.post<{ isLogout: boolean }>("admin/logout");

export const getAdminSession = () => api.get<AdminSession["admin"]>("admin/me");

// ─── Products ───
export const getProducts = (params: ProductListParams = {}) =>
  api.get<AdminProduct[]>("products", { isAdmin: true, limit: 20, skip: 0, ...params });

export const getProductById = (id: string) =>
  api.get<AdminProduct>(`products/${id}`);

export const createProduct = (formData: FormData) =>
  api.postForm<AdminProduct>("products", formData);

export const editProduct = (id: string, body: Record<string, unknown>) =>
  api.put<AdminProduct>(`products/${id}`, body);

export const uploadProductImages = (id: string, formData: FormData) =>
  api.putForm<AdminProduct>(`products/upload-image/${id}`, formData);

export const deleteProductImage = (id: string, image: ProductImage) =>
  api.delete<AdminProduct>(`products/delete-image/${id}`, { image });

export const toggleProductList = (id: string, isListed: boolean) =>
  api.patch<AdminProduct>(`products/toggle-list/${id}`, { isListed });

export const deleteProduct = (id: string) =>
  api.delete<{ message: string }>(`products/${id}`);

// ─── Categories ───
export const getCategories = (params: CategoryListParams = {}) =>
  api.get<AdminCategory[]>("category", { limit: 50, skip: 0, ...params });

export const getCategoryById = (id: string) =>
  api.get<AdminCategory>(`category/${id}`);

export const createCategory = (formData: FormData) =>
  api.postForm<AdminCategory>("category", formData);

export const editCategory = (id: string, body: Record<string, unknown>) =>
  api.put<AdminCategory>(`category/${id}`, body);

export const uploadCategoryImage = (id: string, formData: FormData) =>
  api.putForm<AdminCategory>(`category/${id}/image`, formData);

export const toggleCategoryList = (id: string, isListed: boolean) =>
  api.patch<AdminCategory>(`category/${id}/list-status`, { isListed });

export const deleteCategory = (id: string) =>
  api.delete<{ message: string }>(`category/${id}`);

// ─── Orders (Admin) ───
export const getAdminOrders = (params: OrderListParams = {}) =>
  api.get<AdminOrder[]>("order/admin/all", { limit: 20, skip: 0, ...params });

export const getAdminOrderById = (id: string) =>
  api.get<AdminOrder>(`order/admin/${id}`);

export const changeOrderStatus = (id: string, orderStatus: string) =>
  api.patch<AdminOrder>(`order/${id}/status`, { orderStatus });

export const changePaymentStatus = (id: string, paymentStatus: string) =>
  api.patch<AdminOrder>(`order/${id}/payment-status`, { paymentStatus });

export const editOrder = (id: string, body: unknown) =>
  api.put<AdminOrder>(`order/${id}`, body);
