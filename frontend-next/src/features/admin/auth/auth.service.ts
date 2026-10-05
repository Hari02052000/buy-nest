import { apiClient, ApiClientError } from "@/lib/api/client";
import type { CurrentUser } from "@/types/user";
import type { LoginFormData } from "./login.schema";

export interface LoginResponse {
  success: boolean;
}

export interface AuthError {
  message: string;
  isAuthError: boolean;
}

/**
 * Authenticate admin user credentials.
 *
 * Sends credentials to the backend authentication endpoint.
 * The backend establishes a server-side session via HttpOnly cookie.
 * No tokens are stored in the frontend.
 *
 * @param credentials - Email and password from the login form
 * @returns Login response on success
 * @throws AuthError with user-friendly message on failure
 */
export async function login(
  credentials: LoginFormData
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/admin/login",
      credentials
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // Authentication failure (401/403) - generic message for security
      if (error.isAuthError) {
        throw {
          message: "Invalid email or password.",
          isAuthError: true,
        } satisfies AuthError;
      }

      // Network/server error - generic message
      throw {
        message: "Unable to sign in right now. Please try again.",
        isAuthError: false,
      } satisfies AuthError;
    }

    // Unexpected error
    throw {
      message: "Unable to sign in right now. Please try again.",
      isAuthError: false,
    } satisfies AuthError;
  }
}

/**
 * Fetch the currently authenticated admin from the backend session.
 *
 * Calls `GET /api/auth/me`, which the Next.js rewrite proxies to Express
 * `GET /auth/me`. Express reads the HttpOnly session cookie — sent
 * automatically because the API client uses `credentials: "include"` — and
 * returns the safe current user. The cookie is never read in JavaScript.
 *
 * @returns The current user on 200, or `null` when unauthenticated (401).
 * @throws ApiClientError for any other failure (network/server) so callers
 *   (e.g. a TanStack Query hook) can surface a real error state.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiClient.get<CurrentUser>("/api/auth/me");
  } catch (error) {
    // 401 = no valid session. This is an expected "not signed in" state,
    // not an error, so resolve to null rather than throwing.
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }
    // Preserve every other failure (500, network, etc.) as a real error.
    throw error;
  }
}

export interface LogoutResponse {
  success: boolean;
}

/**
 * Log out the current admin user.
 *
 * Calls `POST /auth/logout` which destroys the server-side session
 * and clears the HttpOnly cookie.
 *
 * @returns Logout response on success
 * @throws AuthError on failure
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    return await apiClient.post<LogoutResponse>("/api/auth/logout");
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw {
        message: "Unable to sign out. Please try again.",
        isAuthError: error.isAuthError,
      } satisfies AuthError;
    }
    throw {
      message: "Unable to sign out. Please try again.",
      isAuthError: false,
    } satisfies AuthError;
  }
}