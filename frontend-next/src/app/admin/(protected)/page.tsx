import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/shared/stat-card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { PriceDisplay } from "@/components/shared/product-image";
import { mockDashboardStats } from "@/lib/mocks/admin-dashboard";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
          href="/admin/products"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="h-5 w-5" />}
          href="/admin/orders"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Revenue"
          value={<PriceDisplay price={stats.totalRevenue} currency="$" />}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 8, label: "vs last month" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-lg border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 text-sm"
              >
                <div>
                  <p className="font-mono text-xs">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentInfo.paymentStatus} />
                </div>
                <PriceDisplay price={order.paymentInfo.payableAmount} />
              </div>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-foreground">
                  {status}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Analytics charts coming soon</p>
      </div>
    </div>
  );
}
