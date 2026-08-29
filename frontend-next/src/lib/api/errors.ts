import { HTTPError } from "ky";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

export async function parseKyError(error: unknown): Promise<ApiError> {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    try {
      const body = (await error.response.json()) as ErrorResponse;
      return new ApiError(status, body.message || "Request failed", body.data);
    } catch {
      return new ApiError(status, error.message);
    }
  }
  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }
  return new ApiError(0, "Unknown error");
}
