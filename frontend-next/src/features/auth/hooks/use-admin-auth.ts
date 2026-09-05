'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentAdmin } from '@/lib/api/auth';
import { queryKeys } from '@/lib/query-keys';

export function useAdminAuth() {
  return useQuery({
    queryKey: queryKeys.admin.profile(),
    queryFn: getCurrentAdmin,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
