"use client";

import { useQuery } from "@tanstack/react-query";
import type { CurrentUser } from "@/types/user";
import { getCurrentUser } from "./auth.service";

/**
 * Stable query key for the current authenticated user.
 * Exported so other features (e.g. a future logout) can invalidate it.
 */
export const currentUserQueryKey = ["auth", "me"] as const;

/**
 * Read the currently authenticated admin via the backend session.
 *
 * Wraps `getCurrentUser()` (GET /api/auth/me, cookie sent by the API client)
 * in a TanStack Query:
 *   - authenticated session → `data` is the `CurrentUser`
 *   - no valid session / 401 → `data` is `null` (getCurrentUser maps 401 → null)
 *   - server/network error → normal query error state (`isError` / `error`)
 *
 * Never reads the HttpOnly cookie and stores nothing in browser storage.
 */
export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
}
