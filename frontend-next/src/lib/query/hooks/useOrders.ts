"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrders,
  getAdminOrderById,
  changeOrderStatus,
  changePaymentStatus,
} from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";
import type { OrderListParams, OrderStatus, PaymentStatus } from "@/lib/api/types";

export function useAdminOrders(params: OrderListParams = {}) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => getAdminOrders(params),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: adminKeys.order(id),
    queryFn: () => getAdminOrderById(id),
    enabled: !!id,
  });
}

export function useChangeOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: OrderStatus }) =>
      changeOrderStatus(id, orderStatus),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.order(id) });
    },
  });
}

export function useChangePaymentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) =>
      changePaymentStatus(id, paymentStatus),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.order(id) });
    },
  });
}
