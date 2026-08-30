"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLogout, getAdminSession } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/query/keys";

export function useAdminSession() {
  return useQuery({
    queryKey: adminKeys.session(),
    queryFn: () => getAdminSession(),
    retry: false,
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
