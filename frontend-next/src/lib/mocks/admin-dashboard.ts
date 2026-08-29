import type { AdminOrder, DashboardStats, OrderStatus } from "@/lib/api/types";

const recentOrders: AdminOrder[] = [
  {
    id: "64f1a2b3c4d5e6f7a8b9c001",
    items: [{ productId: "p1", quantity: 2, price: 29.99, totalPrice: 59.98 }],
    address: "123 Main St, NYC",
    user: "u1",
    paymentInfo: {
      method: "online",
      paymentStatus: "completed",
      payableAmount: 59.98,
    },
    orderStatus: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "64f1a2b3c4d5e6f7a8b9c002",
    items: [{ productId: "p2", quantity: 1, price: 99.0, totalPrice: 99.0 }],
    address: "456 Oak Ave, LA",
    user: "u2",
    paymentInfo: {
      method: "cod",
      paymentStatus: "pending",
      payableAmount: 99.0,
    },
    orderStatus: "confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "64f1a2b3c4d5e6f7a8b9c003",
    items: [{ productId: "p3", quantity: 3, price: 15.5, totalPrice: 46.5 }],
    address: "789 Pine Rd, Chicago",
    user: "u3",
    paymentInfo: {
      method: "online",
      paymentStatus: "completed",
      payableAmount: 46.5,
    },
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: 1247,
  totalOrders: 3421,
  totalUsers: 5632,
  totalRevenue: 124567.89,
  recentOrders,
  ordersByStatus: {
    pending: 45,
    confirmed: 120,
    processing: 89,
    shipped: 234,
    delivered: 2845,
    cancelled: 88,
  } as Record<OrderStatus, number>,
};
