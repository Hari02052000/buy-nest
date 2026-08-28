"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PriceDisplay } from "@/components/shared/product-image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AdminOrder {
  id: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  user?: { name: string; email: string };
  itemCount: number;
}

interface AdminOrderTableProps {
  orders: AdminOrder[];
  onView?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: string) => void;
  className?: string;
}

const STATUS_ACTIONS = [
  { label: "Mark Confirmed", status: "confirmed" },
  { label: "Mark Processing", status: "processing" },
  { label: "Mark Shipped", status: "shipped" },
  { label: "Mark Delivered", status: "delivered" },
  { label: "Cancel Order", status: "cancelled" },
];

export function AdminOrderTable({
  orders,
  onView,
  onStatusChange,
  className,
}: AdminOrderTableProps) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No orders found
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">
                #{order.id.slice(-8)}
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium">{order.user?.name || "—"}</div>
                <div className="text-xs text-muted-foreground">{order.user?.email || ""}</div>
              </TableCell>
              <TableCell>{order.itemCount}</TableCell>
              <TableCell>
                <PriceDisplay price={order.totalAmount} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.orderStatus as never} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(order.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onStatusChange && (
                      <>
                        <DropdownMenuSeparator />
                        {STATUS_ACTIONS.map((action) => (
                          <DropdownMenuItem
                            key={action.status}
                            onClick={() => onStatusChange(order.id, action.status)}
                            className={
                              action.status === "cancelled"
                                ? "text-destructive focus:text-destructive"
                                : ""
                            }
                          >
                            {action.status === "cancelled" ? (
                              <XCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}