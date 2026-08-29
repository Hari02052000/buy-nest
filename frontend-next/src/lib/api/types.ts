export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  products?: T[];
  orders?: T[];
  categories?: T[];
  total?: number;
  pageSize?: number;
  skip?: number;
}

export interface ProductImage {
  url: string;
  id: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  ancestors: string[];
  isListed: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  images: ProductImage[];
  description: string;
  price: number;
  category: string | ProductCategory;
  brandName: string;
  modelName: string;
  isListed: boolean;
  stock: number;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  parentId?: string;
  ancestors: string[];
  level: number;
  isListed: boolean;
  image: ProductImage;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export type PaymentMethod = "cod" | "online";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  payableAmount: number;
  transactionId?: string;
  paymentIntentId?: string;
}

export interface AdminOrder {
  id: string;
  items: OrderItem[];
  address: string;
  user: string;
  paymentInfo: PaymentInfo;
  orderStatus: OrderStatus;
  appliedCoupon?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  isEmailVerified: boolean;
  profile: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  admin: AdminUser;
}

export interface ProductListParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  isAdmin?: boolean;
}

export interface CategoryListParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  isAdmin?: boolean;
}

export interface OrderListParams {
  limit?: number;
  skip?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: string;
  category: string;
  brandName: string;
  modelName: string;
  stock: string;
  isListed?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
  offer?: string;
  isListed?: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: AdminOrder[];
  ordersByStatus: Record<OrderStatus, number>;
}
