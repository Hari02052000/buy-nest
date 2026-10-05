import { cookies } from "next/headers";
import { ApiClientError } from "./client";

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

export const serverApiClient = {
  async get<T>(path: string): Promise<T> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });
    return handleResponse<T>(response);
  },
};