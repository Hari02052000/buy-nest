import { cookies } from "next/headers";
import { createServerApi } from "@/lib/api/client";
import type { AdminUser } from "@/lib/api/types";

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token_admin")?.value;

  if (!token) return null;

  try {
    const serverApi = createServerApi(`access_token_admin=${token}`);
    const admin = await serverApi.get<AdminUser>("admin/me");
    return admin;
  } catch {
    return null;
  }
}
