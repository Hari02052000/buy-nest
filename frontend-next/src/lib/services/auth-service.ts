import { adminLogin, adminLogout } from "@/lib/api/endpoints";
import type { AdminUser } from "@/lib/api/types";

export type LoginResult =
  | { success: true; admin: AdminUser }
  | { success: false; error: string };

export type LogoutResult =
  | { success: true }
  | { success: false; error: string };

export async function loginAction(
  credentials: { email: string; password: string },
): Promise<LoginResult> {
  try {
    const session = await adminLogin(credentials);
    return { success: true, admin: session.admin };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<LogoutResult> {
  try {
    await adminLogout();
    return { success: true };
  } catch {
    return { success: false, error: "Logout failed" };
  }
}
