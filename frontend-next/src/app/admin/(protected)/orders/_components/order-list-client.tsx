"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { PriceDisplay } from "@/components/shared/product-image";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminOrders } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import { useChangeOrderStatus } from "@/lib/query/hooks/useOrders";
import { toast } from "sonner";
import type {
  AdminOrder,
  OrderStatus,
} from "@/lib/api/types";
import type { DataTableParams } from "@/components/shared/data-table";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function itemCount(order: AdminOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function OrderListClient({ initialData }: { initialData?: AdminOrder[] }) {
  const changeStatus = useChangeOrderStatus();
  const [status, setStatus] = React.useState<string>("all");

  const handleStatusChange = async (order: AdminOrder, status: OrderStatus) => {
    try {
      await changeStatus.mutateAsync({ id: order.id, orderStatus: status });
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const columns: DataTableColumn<AdminOrder>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: (row) => (
        <span className="font-mono text-xs">#{row.id.slice(-8)}</span>
      ),
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.user.slice(-8)}
        </span>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: (row) => itemCount(row),
    },
    {
      accessorKey: "paymentInfo.payableAmount",
      header: "Total",
      enableSorting: true,
      cell: (row) => (
        <PriceDisplay price={row.paymentInfo.payableAmount} />
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: (row) => <OrderStatusBadge status={row.orderStatus} />,
    },
    {
      accessorKey: "paymentInfo.paymentStatus",
      header: "Payment",
      cell: (row) => (
        <PaymentStatusBadge status={row.paymentInfo.paymentStatus} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      enableSorting: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const queryFn = async (params: DataTableParams) => {
    const { page, limit, search, sortOrder, status } = params as DataTableParams & {
      status?: OrderStatus;
    };
    return getAdminOrders({
      limit,
      skip: (page - 1) * limit,
      search: search || undefined,
      sortOrder,
      status,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v ?? "all")}
          >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<AdminOrder>
        key={status}
        columns={columns}
        queryKey={adminKeys.orders({})}
        queryFn={queryFn}
        initialData={status === "all" ? initialData : undefined}
        initialParams={status === "all" ? {} : { status }}
        getId={(row) => row.id}
        rowActions={(row) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/orders/${row.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="View order"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(row, status)}
                  className={
                    row.orderStatus === status
                      ? "bg-muted font-medium"
                      : ""
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      searchPlaceholder="Search orders..."
      exportFilename="orders"
      pageSize={20}
    />
    </div>
  );
}
