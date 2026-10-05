/**
 * API Client for Buy Nest backend communication.
 *
 * Configured for session-based authentication using HttpOnly cookies.
 * The frontend does NOT store tokens in localStorage/sessionStorage.
 * The backend establishes the authenticated session via secure cookies.
 */

export interface ApiError {
  message: string;
  status: number;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly isAuthError: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.isAuthError = status === 401 || status === 403;
  }
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL!;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "An unexpected error occurred";
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new ApiClientError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
      ...options,
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
      ...options,
    });
    return handleResponse<T>(response);
  },
};