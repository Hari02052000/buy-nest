"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLogin, adminLogout, getAdminSession } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";

export function useAdminSession() {
  return useQuery({
    queryKey: adminKeys.session(),
    queryFn: () => getAdminSession(),
    retry: false,
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      adminLogin(credentials),
  });
}

export function useAdminLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminLogout(),
    onSuccess: () => {
      qc.clear();
    },
  });
}
