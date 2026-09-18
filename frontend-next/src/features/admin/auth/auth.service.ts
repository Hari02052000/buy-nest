import { apiClient, ApiClientError } from "@/lib/api/client";
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
      "/api/auth/login",
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