import { serverApiClient } from "@/lib/api/server-client";
import type { CurrentUser } from "@/types/user";
import { ApiClientError } from "@/lib/api/client";

export async function getServerCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await serverApiClient.get<CurrentUser>("/admin/me");
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }
    throw error;
  }
}