import ky from "ky";
import { ApiError, parseKyError } from "./errors";
import type { ApiResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ApiClientOptions {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

function createInstance(options: ApiClientOptions = {}) {
  return ky.create({
    prefix: API_BASE,
    credentials: options.credentials ?? "include",
    headers: options.headers,
    retry: 0,
    timeout: 30000,
  });
}

// Client-side instance: uses cookies automatically via credentials: 'include'
const apiInstance = createInstance();

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new ApiError(response.status, response.statusText);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if ("success" in body && body.success === false) {
    throw new ApiError(response.status, body.message, body.data);
  }
  return body.data;
}

async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  init?: {
    json?: unknown;
    body?: BodyInit;
    searchParams?: Record<string, unknown>;
    headers?: Record<string, string>;
  },
): Promise<T> {
  try {
    const caller = (
      apiInstance as unknown as Record<
        string,
        (path: string, opts?: Record<string, unknown>) => Promise<Response>
      >
    )[method];

    const response = await caller(path, {
      json: init?.json,
      body: init?.body,
      searchParams: init?.searchParams as Record<string, string | number>,
      headers: init?.headers,
    });
    return await parseResponse<T>(response);
  } catch (error) {
    throw await parseKyError(error);
  }
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>, headers?: Record<string, string>) =>
    request<T>("get", path, { searchParams: params, headers }),
  post: <T>(path: string, json?: unknown, headers?: Record<string, string>) =>
    request<T>("post", path, { json, headers }),
  postForm: <T>(path: string, body: FormData, headers?: Record<string, string>) =>
    request<T>("post", path, { body, headers }),
  put: <T>(path: string, json?: unknown, headers?: Record<string, string>) =>
    request<T>("put", path, { json, headers }),
  putForm: <T>(path: string, body: FormData, headers?: Record<string, string>) =>
    request<T>("put", path, { body, headers }),
  patch: <T>(path: string, json?: unknown, headers?: Record<string, string>) =>
    request<T>("patch", path, { json, headers }),
  delete: <T>(path: string, json?: unknown, headers?: Record<string, string>) =>
    request<T>("delete", path, { json, headers }),
};

// Server-side instance: forwards cookies from RSC context
export function createServerApi(cookieHeader?: string) {
  const instance = createInstance({
    credentials: "include",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  return {
    async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
      try {
        const response = await instance.get(path, {
          searchParams: params as Record<string, string | number>,
        });
        return await parseResponse<T>(response);
      } catch (error) {
        throw await parseKyError(error);
      }
    },
  };
}
