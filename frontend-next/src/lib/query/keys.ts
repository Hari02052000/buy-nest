import type {
  ProductListParams,
  CategoryListParams,
  OrderListParams,
} from "@/lib/api/types";

export const adminKeys = {
  session: () => ["admin", "session"] as const,
  products: (params: ProductListParams) =>
    ["admin", "products", params] as const,
  product: (id: string) => ["admin", "product", id] as const,
  categories: (params: CategoryListParams) =>
    ["admin", "categories", params] as const,
  category: (id: string) => ["admin", "category", id] as const,
  orders: (params: OrderListParams) => ["admin", "orders", params] as const,
  order: (id: string) => ["admin", "order", id] as const,
  dashboard: () => ["admin", "dashboard"] as const,
};
